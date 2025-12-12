package com.xoftex.parthub.controllers;

import java.time.LocalDate;
import java.time.ZoneId;

import java.time.temporal.WeekFields;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

import com.xoftex.parthub.models.Autopart;
import com.xoftex.parthub.models.Company;
import com.xoftex.parthub.models.Employee;
import com.xoftex.parthub.models.EmployeeRole;
import com.xoftex.parthub.models.ImageModel;
import com.xoftex.parthub.models.ImageModelJob;
import com.xoftex.parthub.models.ImageModelVehicle;
import com.xoftex.parthub.models.Job;
import com.xoftex.parthub.models.JobRequestType;
import com.xoftex.parthub.models.Note;
import com.xoftex.parthub.models.PayrollHistory;
import com.xoftex.parthub.models.SequenceCarrier;
import com.xoftex.parthub.models.Service;
import com.xoftex.parthub.models.Status;
import com.xoftex.parthub.models.Supplement;
import com.xoftex.parthub.models.User;
import com.xoftex.parthub.models.Vehicle;
import com.xoftex.parthub.models.VehicleHistory;
import com.xoftex.parthub.payload.request.DateCarrier;
import com.xoftex.parthub.payload.response.JobCarrier;
import com.xoftex.parthub.repository.AutoPartRepository;
import com.xoftex.parthub.repository.CompanyRepository;
import com.xoftex.parthub.repository.CustomerRepository;
import com.xoftex.parthub.repository.EmployeeRepository;
import com.xoftex.parthub.repository.JobRepository;
import com.xoftex.parthub.repository.JobRequestTypeRepository;
import com.xoftex.parthub.repository.PayrollHistoryRepository;
import com.xoftex.parthub.repository.RoleRepository;
import com.xoftex.parthub.repository.ServiceRepository;
import com.xoftex.parthub.repository.StatusRepository;
import com.xoftex.parthub.repository.SupplementRepository;
import com.xoftex.parthub.repository.UserRepository;
import com.xoftex.parthub.repository.VehicleHistoryRepository;
import com.xoftex.parthub.repository.VehicleRepository;
import com.xoftex.parthub.security.jwt.JwtUtils;
import com.xoftex.parthub.services.NoteWebSocketHandler;

//for Angular Client (withCredentials)
//@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
// @CrossOrigin(origins = "*", maxAge = 3600)
@CrossOrigin("*")
@RestController
@RequestMapping("/api/jobs")
public class JobController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    AutoPartRepository autoPartRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    VehicleRepository vehicleRepository;

    @Autowired
    CustomerRepository customerRepository;

    @Autowired
    CompanyRepository companyRepository;

    @Autowired
    EmployeeRepository employeeRepository;

    @Autowired
    ServiceRepository serviceRepository;

    @Autowired
    JobRepository jobRepository;

    @Autowired
    SupplementRepository supplementRepository;

    @Autowired
    VehicleHistoryRepository vehicleHistoryRepository;

    @Autowired
    PayrollHistoryRepository payrollHistoryRepository;

    @Autowired
    StatusRepository statusRepository;

    @Autowired
    JobRequestTypeRepository jobRequestTypeRepository;

    @Autowired
    JwtUtils jwtUtils;

    @Value("${image.root.path}")
    // String filePath = "C:\\Projects\\images\\";
    String filePath = "";

    String imageNamePrefix = "test_image_";

    private static final Logger LOG = LoggerFactory.getLogger(JobController.class);

    private final NoteWebSocketHandler noteWebSocketHandler;

    public JobController(NoteWebSocketHandler noteWebSocketHandler) {
        this.noteWebSocketHandler = noteWebSocketHandler;
    }

    @PostMapping("/send")
    public String sendJob(@RequestBody Note note) {
        noteWebSocketHandler.sendJobToClients(note);
        System.out.print(note);
        return "Job sent to clients";
    }

    @PostMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<Job> createJob(@PathVariable("id") long id, @RequestBody Job jobIn) {

        Optional<User> userOptional = this.userRepository.findById(id);
        Job job = new Job();
        boolean isNew = false;

        if (jobIn.getToken() == null || jobIn.getToken().equals("")) {

            String randomCode = UUID.randomUUID().toString();
            jobIn.setToken(randomCode);
        }

        if (jobIn.getId() == 0) {
            isNew = true;
        } else {
            Optional<Job> jobOptional = this.jobRepository.findById(jobIn.getId());
            if (jobOptional.isPresent()) {
                jobIn.setImageModels(jobOptional.get().getImageModels());
            }
        }

        if (userOptional.isPresent()) {

            jobIn.setUserId(id);
            if (jobIn.getEmployeeId() == 0) {
                jobIn.setStatus(0);
                jobIn.setTargetDate(null);
            }

            job = this.jobRepository.save(jobIn);

            VehicleHistory vehicleHistory = new VehicleHistory();
            vehicleHistory.setName("Job " + jobIn.getReason() + " " + jobIn.getName());

            vehicleHistory.setUserId(id);
            vehicleHistory.setVehicleId(job.getVehicleId());

            if (jobIn.getEmployeeId() == 0) {

                // this.jobRepository.delete(job);
                vehicleHistory.setType(2); // 0) add 1) update 2) delete
                vehicleHistory.setValue("" + "unassign");

            } else {

                // userOptional = this.userRepository.findById(jobIn.getEmployeeId());
                if (!jobIn.getReason().equals("")) {
                    vehicleHistory.setType(1); // 0) add 1) update 2) delete
                    if (jobIn.getReason().equals("assign")) {
                        if (userOptional.isPresent()) {
                            vehicleHistory.setValue(
                                    userOptional.get().getFirstName() + " " + userOptional.get().getLastName());
                        } else {
                            vehicleHistory.setValue("unassign");
                        }
                    }
                    if (jobIn.getReason().equals("calender")) {
                        if (userOptional.isPresent()) {
                            vehicleHistory
                                    .setValue("Job " + userOptional.get().getFirstName() + " "
                                            + userOptional.get().getLastName() + " "
                                            + jobIn.getTargetDate());
                        } else {
                            vehicleHistory.setValue("unassign");
                        }
                    }

                    if (jobIn.getReason().equals("notes")) {
                        if (userOptional.isPresent()) {
                            vehicleHistory
                                    .setValue("" + jobIn.getNotes());
                        } else {
                            vehicleHistory.setValue("unassign");
                        }
                    }

                } else {
                    vehicleHistory.setName("Job");

                    vehicleHistory.setValue("" + job.getEmployeeId());
                }

            }
            if (!isNew) {
                vehicleHistory.setObjectKey(jobIn.getId());
                vehicleHistory.setType(1); // 0) add 1) update 2) delete
            } else {
                vehicleHistory.setObjectKey(job.getId());
                vehicleHistory.setType(0); // 0) add 1) update 2) delete
            }
            this.vehicleHistoryRepository.save(vehicleHistory);

            try {

                Note note = new Note();
                note.setJobId(job.getId());
                // note.setEmployeeId(employeeOptional.get().getId());
                note.setVehicleId(job.getVehicleId());
                note.setCompanyId(userOptional.get().getCompanyId());
                note.setUserId(id);
                note.setNotes("JOB");
                System.out.println("Sending .." + note.toString());
                noteWebSocketHandler.sendJobToClients(note);
            } catch (Exception ex) {

            }

        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(job, HttpStatus.CREATED);

    }

    // @PostMapping("/employee/uuid/test/{uuidEmployee}")
    @PutMapping("/employee/uuid/{uuidEmployee}")
    // @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<Job> createJobUuidEmployee(
            @PathVariable("uuidEmployee") String uuidEmployee,
            @RequestBody Job jobIn) {

        // Optional<User> userOptional = this.userRepository.findById(id);
        try {
            Optional<Employee> employeeOptional = this.employeeRepository.findByToken(uuidEmployee);
            Job job = new Job();
            if (employeeOptional.isPresent()) {
                jobIn.setUserId(0);
                jobIn.setEmployeeId(employeeOptional.get().getId());

                if (jobIn.getId() > 0) {

                    Optional<Job> jobOptional = this.jobRepository.findById(jobIn.getId());
                    if (jobOptional.isPresent()) {
                        jobIn.setImageModels(jobOptional.get().getImageModels());
                    }
                }

                job = this.jobRepository.save(jobIn);

                VehicleHistory vehicleHistory = new VehicleHistory();
                vehicleHistory.setName("Job " + jobIn.getReason() + " " + jobIn.getName());
                vehicleHistory.setEmployeeId(employeeOptional.get().getId());
                vehicleHistory.setUserId(0);
                vehicleHistory.setObjectKey(job.getId());

                vehicleHistory.setVehicleId(job.getVehicleId());

                if (jobIn.getEmployeeId() == 0) {

                    // this.jobRepository.delete(job);
                    vehicleHistory.setType(2); // 0) add 1) update 2) delete
                    vehicleHistory.setValue("" + "unassign");

                } else {

                    // userOptional = this.userRepository.findById(jobIn.getEmployeeId());
                    if (!jobIn.getReason().equals("")) {
                        vehicleHistory.setType(1); // 0) add 1) update 2) delete
                        if (jobIn.getReason().equals("assign")) {
                            vehicleHistory.setValue("assign/unassign from employee view");
                        }

                        if (jobIn.getReason().equals("calender")) {

                            vehicleHistory.setValue("employee " + jobIn.getTargetDate());

                        }

                        if (jobIn.getReason().equals("notes")) {

                            vehicleHistory
                                    .setValue("emplpoyee " + jobIn.getNotes());

                        }

                        if (jobIn.getReason().equals("comments")) {

                            if (jobIn.getComments() != null) {
                                vehicleHistory
                                        .setValue("employee " + jobIn.getComments());
                            }
                        }

                    } else {
                        vehicleHistory.setName("job");
                        vehicleHistory.setType(0); // 0) add 1) update 2) delete
                        vehicleHistory.setValue("" + job.getEmployeeId());
                    }

                }

                this.vehicleHistoryRepository.save(vehicleHistory);

                try {

                    Note note = new Note();
                    note.setJobId(job.getId());
                    note.setEmployeeId(employeeOptional.get().getId());
                    note.setCompanyId(employeeOptional.get().getCompanyId());
                    note.setUserId(0);
                    note.setVehicleId(job.getVehicleId());
                    note.setNotes("JOB");
                    System.out.println("Sending .." + note.toString());
                    noteWebSocketHandler.sendJobToClients(note);
                } catch (Exception ex) {

                }

                return new ResponseEntity<>(job, HttpStatus.CREATED);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {

        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/uuid")
    // @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<Job> createJobUuid(@RequestBody Job jobIn) {

        // Optional<User> userOptional = this.userRepository.findById(id);
        Job job = new Job();

        jobIn.setUserId(0);
        if (jobIn.getEmployeeId() == 0) {
            jobIn.setStatus(0);
            jobIn.setTargetDate(null);
        }

        if (jobIn.getId() > 0) {

            Optional<Job> jobOptional = this.jobRepository.findById(jobIn.getId());
            if (jobOptional.isPresent()) {
                jobIn.setImageModels(jobOptional.get().getImageModels());
            }
        }

        job = this.jobRepository.save(jobIn);

        VehicleHistory vehicleHistory = new VehicleHistory();
        vehicleHistory.setName("Job " + jobIn.getReason() + " " + jobIn.getName());

        vehicleHistory.setUserId(0);
        vehicleHistory.setVehicleId(job.getVehicleId());

        if (jobIn.getEmployeeId() == 0) {

            // this.jobRepository.delete(job);
            vehicleHistory.setType(2); // 0) add 1) update 2) delete
            vehicleHistory.setValue("" + "unassign");

        } else {

            // userOptional = this.userRepository.findById(jobIn.getEmployeeId());
            if (!jobIn.getReason().equals("")) {
                vehicleHistory.setType(1); // 0) add 1) update 2) delete
                if (jobIn.getReason().equals("assign")) {
                    vehicleHistory.setValue("assign/unassign from employee view");
                }

                if (jobIn.getReason().equals("calender")) {

                    vehicleHistory.setValue(" from employee view " + jobIn.getTargetDate());

                }

                if (jobIn.getReason().equals("notes")) {

                    vehicleHistory
                            .setValue("from employee view " + jobIn.getNotes());

                }

                if (jobIn.getReason().equals("comments")) {

                    vehicleHistory
                            .setValue("from employee view " + jobIn.getNotes());

                }

            } else {
                vehicleHistory.setName("job");
                vehicleHistory.setType(0); // 0) add 1) update 2) delete
                vehicleHistory.setValue("" + job.getEmployeeId());
            }

        }
        this.vehicleHistoryRepository.save(vehicleHistory);

        return new ResponseEntity<>(job, HttpStatus.CREATED);

    }

    @PostMapping("/sequence/claim/{claimId}")
    // @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<List<Job>> updateSequenceNumberClaim(@PathVariable("claimId") long claimId,
            @RequestBody List<SequenceCarrier> sequenceCarriers) {

        List<Job> jobs = this.jobRepository.findByClaimId(claimId);

        for (Job job : jobs) {

            for (SequenceCarrier sequenceCarrier : sequenceCarriers) {

                if (job.getId() == sequenceCarrier.getId()) {
                    job.setSequenceNumber(sequenceCarrier.getIndex());
                    job = this.jobRepository.save(job);
                }
            }
        }

        if (jobs.size() > 0) {
            for (Job job : jobs) {
                Optional<PayrollHistory> payrollHistoryOptional = this.payrollHistoryRepository
                        .findByJobId(job.getId());
                if (payrollHistoryOptional.isPresent()) {
                    job.setPaidYear(payrollHistoryOptional.get().getYear());
                    job.setPaidWeek(payrollHistoryOptional.get().getWeek());
                    job.setPaidDate(payrollHistoryOptional.get().getCreatedAt());
                }
            }
        }

        return new ResponseEntity<>(jobs, HttpStatus.OK);

    }

    @PostMapping("/sequence/{vehicleId}")
    // @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<List<Job>> updateSequenceNumber(@PathVariable("vehicleId") long vehicleId,
            @RequestBody List<SequenceCarrier> sequenceCarriers) {

        List<Job> jobs = this.jobRepository.findByVehicleId(vehicleId);

        for (Job job : jobs) {

            for (SequenceCarrier sequenceCarrier : sequenceCarriers) {

                if (job.getId() == sequenceCarrier.getId()) {
                    job.setSequenceNumber(sequenceCarrier.getIndex());
                    job = this.jobRepository.save(job);
                }
            }
        }

        if (jobs.size() > 0) {
            for (Job job : jobs) {
                Optional<PayrollHistory> payrollHistoryOptional = this.payrollHistoryRepository
                        .findByJobId(job.getId());
                if (payrollHistoryOptional.isPresent()) {
                    job.setPaidYear(payrollHistoryOptional.get().getYear());
                    job.setPaidWeek(payrollHistoryOptional.get().getWeek());
                    job.setPaidDate(payrollHistoryOptional.get().getCreatedAt());
                }
            }
        }

        return new ResponseEntity<>(jobs, HttpStatus.OK);

    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<Job> getJob(@PathVariable("id") long id) {
        LOG.info("" + id);
        Optional<Job> jobOptional = this.jobRepository.findById(id);
        Job job = new Job();
        if (jobOptional.isPresent()) {
            job = jobOptional.get();
            return new ResponseEntity<>(job, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

    }

    @GetMapping("/company/{companyId}")
    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<List<Employee>> findAllCurrentEmplyeeJobs(@PathVariable("companyId") long companyId) {
        LOG.info("" + companyId);
        try {
            List<Job> jobs = this.jobRepository.findAllCurrentEmplyeeJobs(companyId);
            List<Employee> employees = this.employeeRepository.findByCompanyIdOrderByFirstNameAsc(companyId);

            if (!employees.isEmpty()) {
                for (Employee employee : employees) {

                    for (Job job : jobs) {
                        if (job.getEmployeeId() == employee.getId()) {
                            employee.getJobs().add(job);
                        }

                        Optional<PayrollHistory> payrollHistoryOptional = this.payrollHistoryRepository
                                .findByJobId(job.getId());
                        if (payrollHistoryOptional.isPresent()) {
                            job.setPaidYear(payrollHistoryOptional.get().getYear());
                            job.setPaidWeek(payrollHistoryOptional.get().getWeek());
                            job.setPaidDate(payrollHistoryOptional.get().getCreatedAt());
                        }

                    }
                }

                return new ResponseEntity<>(employees, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            System.out.println("Error ");
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/employee/uuid/{employeeUuid}")
    // @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<List<Vehicle>> findAllCurrentEmplyeeJobsWithUuid(
            @PathVariable("employeeUuid") String employeeUuid) {

        LOG.info("" + employeeUuid + " " + employeeUuid);
        System.out.println("" + employeeUuid + " " + employeeUuid);

        Optional<Employee> employeeOptional = this.employeeRepository.findByToken(employeeUuid);

        if (employeeOptional.isPresent()) {
            Optional<Company> companyOptional = this.companyRepository.findById(employeeOptional.get().getCompanyId());
            List<Status> statuss = this.statusRepository.findByCompanyIdOrderByNameAsc(companyOptional.get().getId());
            List<JobRequestType> jobRequestTypes = this.jobRequestTypeRepository
                    .findByCompanyIdOrderByNameAsc(companyOptional.get().getId());
            List<User> users = this.userRepository.findByCompanyIdOrderByFirstNameAsc(companyOptional.get().getId());

            List<Vehicle> vehiclesReturn = new ArrayList<>();

            if (employeeOptional.isPresent()) {

                Company company = companyOptional.get();
                Employee employee = employeeOptional.get();
                LOG.info("" + company.getName() + "-" + employee.getFirstName() + "-" + employee.getLastName());
                System.out
                        .println("" + company.getName() + "-" + employee.getFirstName() + "-" + employee.getLastName());
                List<Job> jobs = this.jobRepository.findAllCurrentEmplyeeJobsWithUuid(company.getId(),
                        employee.getId());
                List<Vehicle> vehicles = this.vehicleRepository
                        .findByCompanyIdAndArchivedOrderBySequenceNumberAsc(company.getId(), false);
                Map<Integer, List<Job>> jobMap = new HashMap<>();

                for (Job job : jobs) {
                    jobMap.putIfAbsent((int) job.getVehicleId(), new ArrayList<>());
                    jobMap.get((int) job.getVehicleId()).add(job);
                    for (User user : users) {
                        if (job.getUserId() == user.getId()) {
                            job.setUserName(user.getFirstName() + " " + user.getLastName());
                        }
                    }
                    for (ImageModelJob imageModelJob : job.getImageModels()) {
                        for (User user : users) {
                            if (imageModelJob.getUserId() == user.getId()) {
                                imageModelJob.setUserName(user.getFirstName() + " " + user.getLastName());
                            }
                        }
                    }
                }

                for (Vehicle vehicle : vehicles) {
                    List<Job> vehicleJobs = jobMap.get((int) vehicle.getId());
                    if (vehicleJobs != null) {
                        vehicle.setJobs2(vehicleJobs);
                        for (Job job : vehicle.getJobs2()) {
                            for (User user : users) {
                                if (job.getUserId() == user.getId()) {
                                    job.setUserName(user.getFirstName() + " " + user.getLastName());
                                }
                            }
                            for (ImageModelJob imageModelJob : job.getImageModels()) {
                                for (User user : users) {
                                    if (imageModelJob.getUserId() == user.getId()) {
                                        imageModelJob.setUserName(user.getFirstName() + " " + user.getLastName());
                                    }
                                }
                            }
                        }
                        List<Job> jobOriginal = this.jobRepository.findByVehicleIdOrderByNameAsc(vehicle.getId());
                        List<Autopart> autoparts = this.autoPartRepository.findByVehicleId(vehicle.getId());
                        // List<Supplement> supplements =
                        // this.supplementRepository.findByVehicleId(vehicle.getId())

                        for (Status status : statuss) {
                            if (status.getId() == vehicle.getStatus()) {

                                vehicle.setStatusString(status.getName());
                                // vehicle.setSerachString(statusName);
                            }
                        }

                        for (JobRequestType jobRequestType : jobRequestTypes) {
                            if (jobRequestType.getId() == vehicle.getJobRequestType()) {
                                vehicle.setJobReqeustTypeString(jobRequestType.getName());
                            }
                        }

                        vehicle.setJobs(jobOriginal);
                        for (Job job : vehicle.getJobs()) {
                            for (User user : users) {
                                if (job.getUserId() == user.getId()) {
                                    job.setUserName(user.getFirstName() + " " + user.getLastName());
                                }
                            }
                        }
                        vehicle.autoparts = autoparts;
                        for (Autopart autopart : vehicle.autoparts) {
                            for (User user : users) {
                                if (autopart.getUserId() == user.getId()) {
                                    autopart.setUserName(user.getFirstName() + " " + user.getLastName());
                                }
                            }
                            for (ImageModel imageModel : autopart.getImageModels()) {
                                for (User user : users) {
                                    if (imageModel.getUserId() == user.getId()) {
                                        imageModel.setUserName(user.getFirstName() + " " + user.getLastName());
                                    }
                                }
                            }
                        }
                        for (ImageModelVehicle imageModelVehicle : vehicle.getImageModels()) {

                            for (User user : users) {
                                if (imageModelVehicle.getUserId() == user.getId()) {
                                    imageModelVehicle.setUserName(user.getFirstName() + " " + user.getLastName());
                                }

                            }
                        }
                        vehiclesReturn.add(vehicle);
                    }
                }

                return new ResponseEntity<>(vehiclesReturn, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}")
    // @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<Job> updateJobStatus(@PathVariable("id") long id) {
        LOG.info("" + id);
        Optional<Job> jobOptional = this.jobRepository.findById(id);
        Job job = new Job();
        if (jobOptional.isPresent()) {

            job = jobOptional.get();
            job.setUpdatedAt(new Date());

            if (job.getStatus() == 0) {

                job.setStatus(1);
            } else {
                job.setStatus(0);
            }

            job = this.jobRepository.save(job);

            VehicleHistory vehicleHistory = new VehicleHistory();
            vehicleHistory.setName("Job " + job.getName());
            vehicleHistory.setType(1); // 0) add 1) update 2) delete
            vehicleHistory.setUserId(0); // fix later
            vehicleHistory.setVehicleId(job.getVehicleId());
            String statusStr = "done";
            if (job.getStatus() == 0) {
                statusStr = "not done";
            }

            Optional<Employee> employeeOptional = this.employeeRepository.findById(job.getEmployeeId());
            if (employeeOptional.isPresent()) {
                vehicleHistory.setValue(
                        "" + employeeOptional.get().getFirstName()
                                + " " + employeeOptional.get().getLastName() + " " + statusStr);
            }
            this.vehicleHistoryRepository.save(vehicleHistory);

            return new ResponseEntity<>(job, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

    }

    @PutMapping("/employee/{uuidEmployee}/{id}")
    // @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<Job> updateJobStatusWithUuidEmplooyee(@PathVariable("uuidEmployee") String uuidEmployee,
            @PathVariable("id") long id) {
        LOG.info("" + id);
        Optional<Employee> employeeOptional = this.employeeRepository.findByToken(uuidEmployee);
        if (employeeOptional.isPresent()) {
            Optional<Job> jobOptional = this.jobRepository.findById(id);
            Job job = new Job();
            if (jobOptional.isPresent()) {

                job = jobOptional.get();
                job.setUpdatedAt(new Date());

                if (job.getStatus() == 0) {

                    job.setStatus(1);
                } else {
                    job.setStatus(0);
                }

                job = this.jobRepository.save(job);

                VehicleHistory vehicleHistory = new VehicleHistory();
                vehicleHistory.setName("Job employee [" + job.getName() + "] ");
                vehicleHistory.setType(1); // 0) add 1) update 2) delete
                vehicleHistory.setUserId(0); // fix later
                vehicleHistory.setEmployeeId(employeeOptional.get().getId());
                vehicleHistory.setVehicleId(job.getVehicleId());
                String statusStr = "done";
                if (job.getStatus() == 0) {
                    statusStr = "not done";
                }

                if (employeeOptional.isPresent()) {
                    vehicleHistory.setValue(
                            "" + employeeOptional.get().getFirstName()
                                    + " " + employeeOptional.get().getLastName() + " " + statusStr);
                }
                this.vehicleHistoryRepository.save(vehicleHistory);

                return new ResponseEntity<>(job, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/vehicle/{vehicleId}")
    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<Set<Service>> getVehicleJobs(@PathVariable("vehicleId") long vehicleId) {
        LOG.info("" + vehicleId);

        List<Job> jobs = this.jobRepository.findByVehicleId(vehicleId);

        Optional<Vehicle> vehicleOptional = this.vehicleRepository.findById(vehicleId);
        // List<Service> services = this.serviceRepository.findAll();
        List<Employee> employees = this.employeeRepository
                .findByCompanyIdOrderByFirstNameAsc(vehicleOptional.get().getCompanyId());
        List<Employee> employeesOriginal = new ArrayList<Employee>(employees);

        Employee firstFakeEmployee = new Employee();
        firstFakeEmployee.setFirstName("Assign/UnAssign");
        firstFakeEmployee.setLastName("");
        firstFakeEmployee.setSelected(true);
        employees.add(0, firstFakeEmployee);
        employeesOriginal.add(0, firstFakeEmployee);

        Vehicle vehicle = new Vehicle();
        if (vehicleOptional.isPresent()) {
            vehicle = vehicleOptional.get();
            for (Service service : vehicle.getServices()) {
                boolean hasJob = false;
                for (Job job : jobs) {
                    if (job.getServiceId() == service.getId()) {
                        hasJob = true;

                        for (Employee employee : employees) {
                            employee.setSelected(false);
                            if (employee.getId() == job.getEmployeeId() && job.getServiceId() == service.getId()) {
                                firstFakeEmployee.setSelected(false);
                                firstFakeEmployee.setFirstName("Assign/UnAssign");
                                employee.setSelected(true);
                            }

                            job.getEmployees().add(employee);
                        }
                        service.setJob(job);
                    }

                }

                if (!hasJob) {
                    firstFakeEmployee.setSelected(true);
                    Job job2 = new Job();

                    job2.setId(0);
                    job2.setVehicleId(vehicleId);
                    job2.setServiceId(service.getId());
                    job2.setEmployeeId(0);

                    for (Employee employee : employeesOriginal) {
                        employee.setSelected(false);
                    }
                    firstFakeEmployee.setFirstName("Assign/UnAssign");
                    firstFakeEmployee.setSelected(true);
                    job2.getEmployees().addAll(employeesOriginal);

                    service.setJob(job2);
                }
            }
        }
        if (!vehicle.getServices().isEmpty()) {
            return new ResponseEntity<>(vehicle.getServices(), HttpStatus.OK);
        } else {
            // otherwise too much crack on the client side
            return new ResponseEntity<>(null, HttpStatus.OK);
        }
    }

    @GetMapping("/vehicle2/{vehicleId}")
    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<List<Job>> getVehicleJobs2(@PathVariable("vehicleId") long vehicleId) {
        LOG.info("" + vehicleId);

        List<Job> jobs = this.jobRepository.findByVehicleIdOrderByNameAsc(vehicleId);

        if (!jobs.isEmpty()) {
            if (jobs.size() > 0) {
                for (Job job : jobs) {
                    Optional<PayrollHistory> payrollHistoryOptional = this.payrollHistoryRepository
                            .findByJobId(job.getId());
                    if (payrollHistoryOptional.isPresent()) {
                        job.setPaidYear(payrollHistoryOptional.get().getYear());
                        job.setPaidWeek(payrollHistoryOptional.get().getWeek());
                        job.setPaidDate(payrollHistoryOptional.get().getCreatedAt());
                    }
                }
            }
            return new ResponseEntity<>(jobs, HttpStatus.OK);
        } else {
            // otherwise too much crack on the client side
            return new ResponseEntity<>(HttpStatus.OK);
        }
    }

    @GetMapping("/vehicle2/uuid/{uuid}")
    // @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<List<Job>> getVehicleJobs2Uuid(@PathVariable("uuid") String uuid) {
        LOG.info("" + uuid);
        List<Job> jobs = new ArrayList<Job>();

        Optional<Vehicle> vehicleOptional = this.vehicleRepository.findByToken(uuid);
        if (vehicleOptional.isPresent()) {
            jobs = this.jobRepository.findByVehicleIdOrderByNameAsc(vehicleOptional.get().getId());

        }

        if (!jobs.isEmpty()) {
            return new ResponseEntity<>(jobs, HttpStatus.OK);
        } else {
            // otherwise too much crack on the client side
            return new ResponseEntity<>(HttpStatus.OK);
        }
    }

    @GetMapping("/user/{employeeId}")
    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<List<Vehicle>> getJobsForUser(@PathVariable("employeeId") long employeeId) {
        LOG.info("" + employeeId);

        List<Vehicle> vehicles = new ArrayList<Vehicle>();

        List<Job> jobs = this.jobRepository.findByEmployeeIdAndArchived(employeeId, false);

        Set<Long> vehicleIds = new HashSet<Long>();

        if (jobs.size() > 0) {
            for (Job job : jobs) {
                Optional<PayrollHistory> payrollHistoryOptional = this.payrollHistoryRepository
                        .findByJobId(job.getId());
                if (payrollHistoryOptional.isPresent()) {
                    job.setPaidYear(payrollHistoryOptional.get().getYear());
                    job.setPaidWeek(payrollHistoryOptional.get().getWeek());
                    job.setPaidDate(payrollHistoryOptional.get().getCreatedAt());
                }
                vehicleIds.add(job.getVehicleId());
            }

            for (Long vehicleId : vehicleIds) {
                Optional<Vehicle> vehicleOptional = this.vehicleRepository.findById(vehicleId);
                if (vehicleOptional.isPresent()) {
                    Vehicle vehicle = vehicleOptional.get();
                    for (Job job : jobs) {
                        if (job.getVehicleId() == vehicleOptional.get().getId()) {
                            vehicle.getJobs().add(0, job);
                        }
                    }
                    vehicle.setDaysInShop((int) this.getDifferenceDays(vehicle.getCreatedAt(), new Date()));
                    vehicles.add(vehicle);
                }
            }
        }
        if (!vehicles.isEmpty()) {
            return new ResponseEntity<>(vehicles, HttpStatus.OK);
        } else {
            // otherwise too much crack on the client side
            return new ResponseEntity<>(HttpStatus.OK);
        }
    }

    @PostMapping("/user2/user/{userId}")
    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<List<JobCarrier>> getJobsForUserUsers(@PathVariable("userId") long userId,
            @RequestBody DateCarrier dateCarrier) {
        LOG.info("" + userId);

        List<JobCarrier> jobCarriers = new ArrayList<>();

        if (dateCarrier.ids.size() > 0) {
            for (long id : dateCarrier.ids) {
                JobCarrier jobCarrier = new JobCarrier();
                jobCarrier.employeeId = id;

                Date from = this.asDate(this.getFirstDayOfWeek(dateCarrier.year, dateCarrier.week, Locale.US));
                Date to = this.asDate(
                        this.getFirstDayOfWeek(dateCarrier.year, dateCarrier.week + 1, Locale.US));

                List<Job> jobs = this.jobRepository.findByEmployeeIdAndArchivedAndStatusAndUpdatedAtBetween(id, false,
                        1, from,
                        to);
                Set<Long> vehicleIds = new HashSet<Long>();
                List<Vehicle> vehicles = new ArrayList<Vehicle>();
                if (jobs.size() > 0) {
                    for (Job job : jobs) {
                        vehicleIds.add(job.getVehicleId());
                    }

                    for (Long vehicleId : vehicleIds) {
                        Optional<Vehicle> vehicleOptional = this.vehicleRepository.findById(vehicleId);
                        if (vehicleOptional.isPresent()) {
                            Vehicle vehicle = vehicleOptional.get();
                            for (Job job : jobs) {
                                if (job.getVehicleId() == vehicleOptional.get().getId()) {
                                    vehicle.getJobs().add(0, job);
                                }
                            }
                            vehicle.setDaysInShop((int) this.getDifferenceDays(vehicle.getCreatedAt(), new Date()));
                            vehicles.add(vehicle);
                        }
                    }

                    jobCarrier.vehicles = vehicles;
                    jobCarriers.add(jobCarrier);
                }
            }

        }

        if (!jobCarriers.isEmpty()) {
            return new ResponseEntity<>(jobCarriers, HttpStatus.OK);
        } else {
            // otherwise too much crack on the client side
            return new ResponseEntity<>(HttpStatus.OK);
        }
    }

    // Locale.US
    private LocalDate getFirstDayOfWeek(int year, int weekNumber, Locale locale) {
        return LocalDate
                .of(year, 2, 1)
                .with(WeekFields.of(locale).getFirstDayOfWeek())
                .with(WeekFields.of(locale).weekOfWeekBasedYear(), weekNumber);
    }

    private Date asDate(LocalDate localDate) {
        return Date.from(localDate.atStartOfDay().atZone(ZoneId.systemDefault()).toInstant());
    }

    @PostMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<List<Vehicle>> getJobsForUserBeteeenDates(@PathVariable("userId") long userId,
            @RequestBody DateCarrier dateCarrier) {

        LOG.info("" + userId);

        List<Vehicle> vehicles = new ArrayList<Vehicle>();

        List<Job> jobs = this.jobRepository.findByEmployeeIdAndStatusAndUpdatedAtBetween(userId, 1, dateCarrier.from,
                dateCarrier.to);

        Set<Long> vehicleIds = new HashSet<Long>();

        if (jobs.size() > 0) {
            for (Job job : jobs) {
                vehicleIds.add(job.getVehicleId());
            }

            for (Long vehicleId : vehicleIds) {
                Optional<Vehicle> vehicleOptional = this.vehicleRepository.findById(vehicleId);
                if (vehicleOptional.isPresent()) {
                    Vehicle vehicle = vehicleOptional.get();
                    for (Job job : jobs) {
                        if (job.getVehicleId() == vehicleOptional.get().getId()) {
                            vehicle.getJobs().add(0, job);
                        }
                    }
                    vehicle.setDaysInShop((int) this.getDifferenceDays(vehicle.getCreatedAt(), new Date()));
                    vehicles.add(vehicle);
                }
            }
        }
        if (!vehicles.isEmpty()) {
            return new ResponseEntity<>(vehicles, HttpStatus.OK);
        } else {
            // otherwise too much crack on the client side
            return new ResponseEntity<>(HttpStatus.OK);
        }
    }

    public long getDifferenceDays(Date d1, Date d2) {
        long diff = d2.getTime() - d1.getTime();
        return TimeUnit.DAYS.convert(diff, TimeUnit.MILLISECONDS) + 1;
    }

    @DeleteMapping("/{id}/{userId}")
    // @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<?> deleteJob(@PathVariable("id") long id,
            @PathVariable("userId") long userId) {
        LOG.info("" + id);
        Optional<Job> jobOptional = this.jobRepository.findById(id);
        Job job = new Job();
        if (jobOptional.isPresent()) {
            job = jobOptional.get();

            VehicleHistory vehicleHistory = new VehicleHistory();
            vehicleHistory.setName("Job");
            vehicleHistory.setType(2); // 0) add 1) update 2) delete
            vehicleHistory.setUserId(userId); // fix later
            vehicleHistory.setVehicleId(job.getVehicleId());
            vehicleHistory.setValue("" + job.getName() + "" + job.getNotes());
            vehicleHistory.setObjectKey(id);
            this.vehicleHistoryRepository.save(vehicleHistory);

            this.jobRepository.delete(job);
            return new ResponseEntity<>(null, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

    }

    @DeleteMapping("/{id}/{userId}/{option}")
    // @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<?> deleteJobWithOption(@PathVariable("id") long id, @PathVariable("option") long option,
            @PathVariable("userId") long userId) {
        LOG.info("" + id);
        Optional<Job> jobOptional = this.jobRepository.findById(id);
        Job job = new Job();
        if (jobOptional.isPresent()) {
            job = jobOptional.get();

            VehicleHistory vehicleHistory = new VehicleHistory();
            vehicleHistory.setName("Job");
            vehicleHistory.setType(2); // 0) add 1) update 2) delete
            vehicleHistory.setUserId(userId); // fix later
            vehicleHistory.setVehicleId(job.getVehicleId());
            vehicleHistory.setValue("" + job.getName() + "" + job.getNotes());
            vehicleHistory.setObjectKey(id);
            this.vehicleHistoryRepository.save(vehicleHistory);

            // if (option == 1) {
            // // keep the job
            // VehicleHistory vehicleHistoryJob = new VehicleHistory();
            // vehicleHistoryJob.setName("Job removed from estimate with id [" +
            // job.getClaimId() + "]");
            // vehicleHistoryJob.setType(2); // 0) add 1) update 2) delete
            // vehicleHistoryJob.setUserId(userId); // fix later
            // vehicleHistoryJob.setVehicleId(job.getVehicleId());
            // vehicleHistoryJob.setValue("" + job.getName() + "" + job.getNotes());
            // vehicleHistoryJob.setObjectKey(job.getId());
            // this.vehicleHistoryRepository.save(vehicleHistory);
            // job.setClaimId((long) 0);
            // this.jobRepository.save(job);
            // } else {
            // }
            this.jobRepository.delete(job);
            return new ResponseEntity<>(null, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

    }
}
