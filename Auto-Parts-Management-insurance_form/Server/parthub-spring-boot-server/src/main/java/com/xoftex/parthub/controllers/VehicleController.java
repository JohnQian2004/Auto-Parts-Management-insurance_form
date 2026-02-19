package com.xoftex.parthub.controllers;

import java.io.File;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.temporal.WeekFields;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

import com.xoftex.parthub.models.Company;
import com.xoftex.parthub.models.Customer;
import com.xoftex.parthub.models.Employee;
import com.xoftex.parthub.models.ImageModelJob;
import com.xoftex.parthub.models.ImageModelVehicle;
import com.xoftex.parthub.models.Insurancer;
import com.xoftex.parthub.models.Job;
import com.xoftex.parthub.models.JobRequestType;
import com.xoftex.parthub.models.SearchCarrier;
import com.xoftex.parthub.models.SequenceCarrier;
import com.xoftex.parthub.models.Status;
import com.xoftex.parthub.models.User;
import com.xoftex.parthub.models.Vehicle;
import com.xoftex.parthub.models.VehicleHistory;
import com.xoftex.parthub.payload.request.DateCarrier;
import com.xoftex.parthub.repository.CompanyRepository;
import com.xoftex.parthub.repository.CustomerRepository;
import com.xoftex.parthub.repository.EmployeeRepository;
import com.xoftex.parthub.repository.ImageModelVehicleRepository;
import com.xoftex.parthub.repository.InsurancerRepository;
import com.xoftex.parthub.repository.JobRepository;
import com.xoftex.parthub.repository.JobRequestTypeRepository;
import com.xoftex.parthub.repository.RoleRepository;
import com.xoftex.parthub.repository.StatusRepository;
import com.xoftex.parthub.repository.UserRepository;
import com.xoftex.parthub.repository.VehicleHistoryRepository;
import com.xoftex.parthub.repository.VehicleRepository;

//for Angular Client (withCredentials)
//@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
// @CrossOrigin(origins = "*", maxAge = 3600)
@CrossOrigin("*")
@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

  @Autowired
  UserRepository userRepository;

  @Autowired
  RoleRepository roleRepository;

  @Autowired
  VehicleRepository vehicleRepository;

  @Autowired
  CustomerRepository customerRepository;

  @Autowired
  ImageModelVehicleRepository imageModelVehicleRepository;

  @Autowired
  JobRepository jobRepository;

  @Autowired
  StatusRepository statusRepository;

  @Autowired
  CompanyRepository companyRepository;

  @Autowired
  EmployeeRepository employeeRepository;

  @Autowired
  VehicleHistoryRepository vehicleHistoryRepository;

  @Autowired
  JobRequestTypeRepository jobRequestTypeRepository;

  @Autowired
  InsurancerRepository insurancerRepository;

  @Value("${image.root.path.vehicle}")
  // String filePath = "C:\\Projects\\images\\vehicle\\";
  String filePath = "";

  String imageNamePrefix = "test_vehicle_image_";

  String imageResizeDirectory = "500\\";

  private static final Logger LOG = LoggerFactory.getLogger(VehicleController.class);

  @PostMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<Vehicle> createVehicle(@PathVariable("id") long id, @RequestBody Vehicle vehicleIn) {

    Optional<User> userOptional = this.userRepository.findById(id);
    Vehicle vehicle = new Vehicle();
    Customer customer = new Customer();

    User user = new User();
    if (userOptional.isPresent()) {

      user = userOptional.get();

      if (vehicleIn.getInsuranceCompanyId() == null) {
        vehicleIn.setInsuranceCompanyId((long) 0);
        boolean foundIt = false;
        List<Insurancer> insurancers = this.insurancerRepository
            .findByCompanyIdOrderByNameAsc(vehicleIn.getCompanyId());
        for (Insurancer insurancer : insurancers) {
          if (insurancer.getName().equals(vehicleIn.getInsuranceCompany())) {
            foundIt = true;
            vehicleIn.setInsuranceCompanyId(insurancer.getId());
          }
        }
        if (!foundIt) {
          vehicleIn.setInsuranceCompanyId((long) 0);
        }
      } else {

        if (vehicleIn.getInsuranceCompany() != null && !vehicleIn.getInsuranceCompany().equals("")) {
          boolean foundIt = false;
          List<Insurancer> insurancers = this.insurancerRepository
              .findByCompanyIdOrderByNameAsc(vehicleIn.getCompanyId());
          for (Insurancer insurancer : insurancers) {
            if (insurancer.getName().equals(vehicleIn.getInsuranceCompany())) {
              foundIt = true;
              vehicleIn.setInsuranceCompanyId(insurancer.getId());
            }
          }
        }

      }

      vehicleIn.setUserId(id);

      if (vehicleIn.getCustomer() != null) {

        customer = this.customerRepository.save(vehicleIn.getCustomer());
        vehicleIn.setCustomer(customer);

      } else {
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      }
      if (vehicleIn.getImageModels() != null) {
        for (ImageModelVehicle imageModelVehicle : vehicleIn.getImageModels()) {

          imageModelVehicle.setVehicle(vehicle);
        }
      }

      if (!vehicleIn.getReason().equals("")) {
        if (vehicleIn.getReason().equals("archive")) {
          vehicle.setUpdatedAt(new Date());
        }
      }

      String randomCode = UUID.randomUUID().toString();
      if (vehicleIn.getId() == 0) {
        vehicleIn.setToken(randomCode);
      }

      vehicle = this.vehicleRepository.save(vehicleIn);
      this.setShowInSearchImageId(vehicle);
      if (!vehicleIn.getReason().equals("")) {
        VehicleHistory vehicleHistory = new VehicleHistory();
        vehicleHistory.setType(1); // 0) add 1) update 2) delete
        vehicleHistory.setName("Vehicle " + vehicleIn.getReason());
        vehicleHistory.setUserId(id);
        vehicleHistory.setVehicleId(vehicle.getId());

        if (vehicleIn.getReason().equals("status")) {
          vehicleHistory.setValue("" + vehicleIn.getStatus());
        } else if (vehicleIn.getReason().equals("location")) {
          vehicleHistory.setValue("" + vehicleIn.getLocation());
        } else if (vehicleIn.getReason().equals("assigned To")) {
          vehicleHistory.setValue("" + vehicleIn.getAssignedTo());
        } else if (vehicleIn.getReason().equals("key location")) {
          vehicleHistory.setValue("" + vehicleIn.getKeyLocation());
        } else if (vehicleIn.getReason().equals("job request type")) {
          vehicleHistory.setValue("" + vehicleIn.getJobRequestType());
        } else if (vehicleIn.getReason().equals("approval status")) {
          vehicleHistory.setValue("" + vehicleIn.getApprovalStatus());
        } else if (vehicleIn.getReason().equals("service manager")) {
          vehicleHistory.setValue("" + vehicleIn.getServiceManager());
        } else if (vehicleIn.getReason().equals("insurancer")) {
          vehicleHistory.setValue("" + vehicleIn.getInsuranceCompanyId());
        }

        if (vehicleIn.getReason().equals("archive")) {

          // archiving all running jobs
          List<Job> jobs = this.jobRepository.findByVehicleId(vehicleIn.getId());
          if (jobs.size() > 0) {
            for (Job job : jobs) {
              job.setArchived(true);
              this.jobRepository.save(job);
            }
          }
          vehicleHistory.setValue("" + vehicleIn.isArchived());
        }

        if (vehicleIn.getReason().contains("paid")) {
          vehicleHistory.setValue("" + vehicle.isPaid());
        }
        this.vehicleHistoryRepository.save(vehicleHistory);
      }

      if (vehicle.getDamages() != null) {
        vehicle.setDamageStrings(vehicle.getDamages().split(","));

      }

      vehicle.setDaysInShop((int) this.getDifferenceDays(vehicle.getCreatedAt(), new Date()));
      if (vehicle.getRentalDate() != null)
        vehicle.setRentalCountDown((int) this.getDifferenceDaysRental(new Date(), vehicle.getRentalDate()));

      if (vehicle.getTargetDate() != null)
        vehicle.setTargetDateCountDown((int) this.getDifferenceDaysRental(new Date(), vehicle.getTargetDate()));

    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    LOG.info("id:" + vehicle.getId() + " " + vehicle.getYear() + " " + vehicle.getMake() + " " + vehicle.getModel()
        + " " + vehicle.getColor());

    return new ResponseEntity<>(vehicle, HttpStatus.CREATED);

  }

  @PostMapping("/external/{id}")
  // @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<Vehicle> createVehicleExternal(@PathVariable("id") long id, @RequestBody Vehicle vehicleIn) {

    Optional<User> userOptional = this.userRepository.findById(id);
    Vehicle vehicle = new Vehicle();
    Customer customer = new Customer();

    User user = new User();
    if (userOptional.isPresent()) {

      user = userOptional.get();

      vehicleIn.setUserId(id);

      if (vehicleIn.getCustomer() != null) {

        customer = this.customerRepository.save(vehicleIn.getCustomer());
        vehicleIn.setCustomer(customer);

      } else {
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      }
      if (vehicleIn.getImageModels() != null) {
        for (ImageModelVehicle imageModelVehicle : vehicleIn.getImageModels()) {

          imageModelVehicle.setVehicle(vehicle);
        }
      }

      if (!vehicleIn.getReason().equals("")) {
        if (vehicleIn.getReason().equals("archive")) {
          vehicle.setUpdatedAt(new Date());
        }
      }

      String randomCode = UUID.randomUUID().toString();
      if (vehicleIn.getId() == 0) {
        vehicleIn.setToken(randomCode);
      }

      vehicle = this.vehicleRepository.save(vehicleIn);
      this.setShowInSearchImageId(vehicle);
      if (!vehicleIn.getReason().equals("")) {
        VehicleHistory vehicleHistory = new VehicleHistory();
        vehicleHistory.setType(1); // 0) add 1) update 2) delete
        vehicleHistory.setName("Vehicle " + vehicleIn.getReason());
        vehicleHistory.setUserId(id);
        vehicleHistory.setVehicleId(vehicle.getId());

        if (vehicleIn.getReason().equals("status")) {
          vehicleHistory.setValue("" + vehicleIn.getStatus());
        } else if (vehicleIn.getReason().equals("location")) {
          vehicleHistory.setValue("" + vehicleIn.getLocation());
        } else if (vehicleIn.getReason().equals("assigned To")) {
          vehicleHistory.setValue("" + vehicleIn.getAssignedTo());
        } else if (vehicleIn.getReason().equals("key location")) {
          vehicleHistory.setValue("" + vehicleIn.getKeyLocation());
        } else if (vehicleIn.getReason().equals("job request type")) {
          vehicleHistory.setValue("" + vehicleIn.getJobRequestType());
        } else if (vehicleIn.getReason().equals("approval status")) {
          vehicleHistory.setValue("" + vehicleIn.getApprovalStatus());
        }

        if (vehicleIn.getReason().equals("archive")) {

          // archiving all running jobs
          List<Job> jobs = this.jobRepository.findByVehicleId(vehicleIn.getId());
          if (jobs.size() > 0) {
            for (Job job : jobs) {
              job.setArchived(true);
              this.jobRepository.save(job);
            }
          }
          vehicleHistory.setValue("" + vehicle.isArchived());
        }

        if (vehicleIn.getReason().contains("paid")) {
          vehicleHistory.setValue("" + vehicle.isPaid());
        }
        this.vehicleHistoryRepository.save(vehicleHistory);
      }

      if (vehicle.getDamages() != null) {
        vehicle.setDamageStrings(vehicle.getDamages().split(","));

      }

      vehicle.setDaysInShop((int) this.getDifferenceDays(vehicle.getCreatedAt(), new Date()));
      if (vehicle.getRentalDate() != null)
        vehicle.setRentalCountDown((int) this.getDifferenceDaysRental(new Date(), vehicle.getRentalDate()));

      if (vehicle.getTargetDate() != null)
        vehicle.setTargetDateCountDown((int) this.getDifferenceDaysRental(new Date(), vehicle.getTargetDate()));

      List<Status> statuss = this.statusRepository.findByCompanyIdOrderByNameAsc(vehicle.getCompanyId());
      List<Employee> employees = this.employeeRepository
          .findByCompanyIdOrderByFirstNameAsc(vehicle.getCompanyId());
      List<JobRequestType> jobRequestTypes = this.jobRequestTypeRepository
          .findByCompanyIdOrderByNameAsc(vehicle.getCompanyId());

      String statusName = "No Status";
      String emplyString = "Nobody";

      for (Status status : statuss) {
        if (status.getId() == vehicle.getStatus()) {
          statusName = status.getName();
          vehicle.setStatusString(statusName);
          // vehicle.setSerachString(statusName);
        }
      }

      for (JobRequestType jobRequestType : jobRequestTypes) {
        if (jobRequestType.getId() == vehicle.getJobRequestType()) {
          vehicle.setJobReqeustTypeString(jobRequestType.getName());
        }
      }

      String allTechnicians = "";
      for (Employee employee : employees) {
        allTechnicians = allTechnicians + employee.getFirstName() + " " + employee.getLastName() + ",";
        if (employee.getId() == vehicle.getAssignedTo()) {
          emplyString = employee.getFirstName() + " " + employee.getLastName();
          // allTechnicians = allTechnicians + emplyString + ",";
          vehicle.setEmployeeString(emplyString);
          // vehicle.setSerachString(emplyString);
        }
      }
      if (!allTechnicians.equals(""))
        allTechnicians = "Technicians: " + allTechnicians;

      // vehicle.setVin(allTechnicians);
      vehicle.setReason(allTechnicians);

      vehicle.setDaysInShop((int) this.getDifferenceDays(vehicle.getCreatedAt(), new Date()));
      if (vehicle.getRentalDate() != null)
        vehicle.setRentalCountDown((int) this.getDifferenceDaysRental(new Date(), vehicle.getRentalDate()));
      if (vehicle.getTargetDate() != null)
        vehicle.setTargetDateCountDown((int) this.getDifferenceDaysRental(new Date(), vehicle.getTargetDate()));

      vehicle.setDaysInShopPrecentage(vehicle.getDaysInShop() * 100 / 14);

      String phoneNumber = "" + vehicle.getCustomer().getPhone();

      try {
        phoneNumber = vehicle.getCustomer().getPhone().replaceFirst("(\\d{3})(\\d{3})(\\d+)", "$1-$2-$3"); // 123-456-7890
      } catch (Exception e) {

      }

      String returnStr = "Vehicle: " + vehicle.getYear() + " " + vehicle.getMake() + " " + vehicle.getModel() + " "
          + vehicle.getColor() + "" +
          " Status: " + statusName + " " +
          " Customer: " + vehicle.getCustomer().getTitle() + " " + vehicle.getCustomer().getFirstName() + " "
          + vehicle.getCustomer().getLastName() + " ( " + phoneNumber + " ),";

      String additionalInfo = "";

      if (vehicle.getAssignedTo() > 0) {
        additionalInfo = additionalInfo + " Technician: " + emplyString + ", ";
      }

      SimpleDateFormat outputDateFormat = new SimpleDateFormat("dd/MM/YYYY");
      vehicle.setDaysInShop((int) this.getDifferenceDays(vehicle.getCreatedAt(), new Date()));
      additionalInfo = additionalInfo + " been in shop since " + outputDateFormat.format(vehicle.getCreatedAt())
          + " for "
          + vehicle.getDaysInShop() + " days, ";
      ;

      if (vehicle.getInsuranceCompany() != null && vehicle.getInsuranceCompany() != "") {
        additionalInfo = additionalInfo + " Insurance Provider: " + vehicle.getInsuranceCompany().toUpperCase()
            + ",";
      }

      if (vehicle.getLoanerCarName() != null && vehicle.getLoanerCarName() != ""
          && vehicle.getRentalDate() != null) {
        vehicle.setRentalCountDown((int) this.getDifferenceDaysRental(new Date(), vehicle.getRentalDate()));
        if (vehicle.getRentalCountDown() >= 0) {
          additionalInfo = additionalInfo + " Rental Company: " + vehicle.getLoanerCarName().toUpperCase() + ""
              + " will be expired in "
              + vehicle.getRentalCountDown() + " days,";
        } else {
          additionalInfo = additionalInfo + " Rental Company: " + vehicle.getLoanerCarName().toUpperCase() + ""
              + " expired for "
              + (0 - vehicle.getRentalCountDown()) + " days,";
        }
      }

      if (vehicle.getTargetDate() != null) {
        vehicle.setTargetDateCountDown((int) this.getDifferenceDaysRental(new Date(), vehicle.getTargetDate()));

        if (vehicle.getTargetDateCountDown() >= 0)
          additionalInfo = additionalInfo + "  and delivery due in "
              + vehicle.getTargetDateCountDown() + " days";
        else {
          additionalInfo = additionalInfo + "  and delivery overdue for "
              + (0 - vehicle.getTargetDateCountDown()) + " days";
        }
      }

      returnStr = returnStr + additionalInfo + "";
      // this.setShowInSearchImageId(vehicle);
      vehicle.setSerachString(returnStr);

    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    LOG.info("id:" + vehicle.getId() + " " + vehicle.getYear() + " " + vehicle.getMake() + " " + vehicle.getModel()
        + " " + vehicle.getColor());

    return new ResponseEntity<>(vehicle, HttpStatus.CREATED);

  }

  @PostMapping("/sequence/{companyId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<Vehicle>> updateSequenceNumber(@PathVariable("companyId") long companyId,
      @RequestBody List<SequenceCarrier> sequenceCarriers) {

    int pageNumber = 0;
    int pageSize = 0;
    for (SequenceCarrier sequenceCarrier : sequenceCarriers) {
      pageNumber = sequenceCarrier.pageNumber;
      pageSize = sequenceCarrier.pageSize;
    }

    int searchCount = this.vehicleRepository.countByCompanyIdAndArchived(companyId, false);

    List<Vehicle> vehicles = this.vehicleRepository.findByCompanyIdAndArchived(companyId, false,
        Pageable.ofSize(pageSize).withPage(pageNumber));

    for (Vehicle vehicle : vehicles) {

      vehicle.searchCount = searchCount;

      for (SequenceCarrier sequenceCarrier : sequenceCarriers) {

        if (vehicle.getId() == sequenceCarrier.getId()) {
          vehicle.setSequenceNumber(sequenceCarrier.getIndex());
          vehicle = this.vehicleRepository.save(vehicle);
          this.setShowInSearchImageId(vehicle);
          vehicle.setJobs(this.jobRepository.findByVehicleIdOrderBySequenceNumberAsc(vehicle.getId()));
          vehicle.setDaysInShop((int) this.getDifferenceDays(vehicle.getCreatedAt(), new Date()));
          if (vehicle.getRentalDate() != null)
            vehicle.setRentalCountDown((int) this.getDifferenceDaysRental(new Date(), vehicle.getRentalDate()));

          if (vehicle.getTargetDate() != null)
            vehicle.setTargetDateCountDown((int) this.getDifferenceDaysRental(new Date(), vehicle.getTargetDate()));
        }
      }

      Optional<VehicleHistory> vehicleHistoryOptional = vehicleHistoryRepository
          .findTopByVehicleIdOrderByCreatedAtDesc(vehicle.getId());
      if (vehicleHistoryOptional.isPresent()) {
        vehicle.setLastVehicleHistory(vehicleHistoryOptional.get());
        vehicle.setUpdatedAt(vehicleHistoryOptional.get().getCreatedAt());
        vehicle.setLastUpdateObjectName(this.getFirstWord(vehicleHistoryOptional.get().getName()));
      } else {
        vehicle.setLastUpdateObjectName("");
      }
    }

    return new ResponseEntity<>(vehicles, HttpStatus.OK);

  }

  public void setShowInSearchImageId(Vehicle vehicle) {

    // set showInSearchImageId
    int counter = 0;
    for (ImageModelVehicle imageModel : vehicle.getImageModels()) {

      // just set first one only
      if (counter == 0)
        vehicle.showInSearchImageId = imageModel.getId();

      if (imageModel.isShowInSearch()) {
        vehicle.showInSearchImageId = imageModel.getId();
      }
      counter++;
    }

  }

  @GetMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<Vehicle> getVehicle(@PathVariable("id") long id) {

    Optional<Vehicle> vehicleOptional = this.vehicleRepository.findById(id);
    Vehicle vehicle = new Vehicle();
    if (vehicleOptional.isPresent()) {
      vehicle = vehicleOptional.get();
      if (vehicle.getDamages() != null) {
        vehicle.setDamageStrings(vehicle.getDamages().split(","));

      }
      this.setShowInSearchImageId(vehicle);
      return new ResponseEntity<>(vehicle, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }

  public long getDifferenceDays(Date d1, Date d2) {
    long diff = d2.getTime() - d1.getTime();
    return TimeUnit.DAYS.convert(diff, TimeUnit.MILLISECONDS) + 1;
  }

  public long getDifferenceDaysRental(Date d1, Date d2) {
    long diff = d2.getTime() - d1.getTime();
    if (diff > 0) {
      return TimeUnit.DAYS.convert(diff, TimeUnit.MILLISECONDS) + 1;
    } else {
      return 0 - (TimeUnit.DAYS.convert(0 - diff, TimeUnit.MILLISECONDS) + 1);
    }
  }

  @GetMapping("/customer/phone/{companyId}/{phone}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<Vehicle>> getVehicleByCustomerPhone(@PathVariable("companyId") long companyId,
      @PathVariable("phone") String phone) {

    List<Vehicle> vehicles = new ArrayList<Vehicle>();

    List<Customer> customers = this.customerRepository.findByPhoneAndCompanyId(phone, companyId);

    if (customers.size() > 0) {
      for (Customer customer : customers) {
        List<Vehicle> vehiclesList = this.vehicleRepository.findByCustomerId(customer.getId());

        for (Vehicle vehicle : vehiclesList) {
          if (vehicle.getDamages() != null) {
            vehicle.setDamageStrings(vehicle.getDamages().split(","));

          }
          vehicle.setDaysInShop((int) this.getDifferenceDays(vehicle.getCreatedAt(), new Date()));
          if (vehicle.getRentalDate() != null)
            vehicle.setRentalCountDown((int) this.getDifferenceDaysRental(new Date(), vehicle.getRentalDate()));

          if (vehicle.getTargetDate() != null)
            vehicle.setTargetDateCountDown((int) this.getDifferenceDaysRental(new Date(), vehicle.getTargetDate()));
          vehicle.setDaysInShopPrecentage(vehicle.getDaysInShop() * 100 / 14);

          this.setShowInSearchImageId(vehicle);
          vehicles.add(vehicle);
        }
      }
      return new ResponseEntity<>(vehicles, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
  }

  @GetMapping("/status/{companyId}/{status}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<Vehicle>> getVehicleByStatus(@PathVariable("companyId") long companyId,
      @PathVariable("status") Long status) {

    List<Vehicle> vehicles = new ArrayList<Vehicle>();

    List<Vehicle> vehiclesList = this.vehicleRepository.findByCompanyIdAndArchivedAndStatus(companyId, false, status);

    if (vehiclesList.size() > 0) {

      for (Vehicle vehicle : vehiclesList) {
        if (vehicle.getDamages() != null) {
          vehicle.setDamageStrings(vehicle.getDamages().split(","));

        }
        vehicle.setDaysInShop((int) this.getDifferenceDays(vehicle.getCreatedAt(), new Date()));
        if (vehicle.getRentalDate() != null)
          vehicle.setRentalCountDown((int) this.getDifferenceDaysRental(new Date(), vehicle.getRentalDate()));

        if (vehicle.getTargetDate() != null)
          vehicle.setTargetDateCountDown((int) this.getDifferenceDaysRental(new Date(), vehicle.getTargetDate()));
        vehicle.setDaysInShopPrecentage(vehicle.getDaysInShop() * 100 / 14);

        this.setShowInSearchImageId(vehicle);
        vehicles.add(vehicle);
      }

      return new ResponseEntity<>(vehicles, HttpStatus.OK);

    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
  }

  @GetMapping("/customer/lastname/{companyId}/{lastName}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<Vehicle>> getVehicleByCustomerLastName(@PathVariable("companyId") long companyId,
      @PathVariable("lastName") String lastName) {

    List<Vehicle> vehicles = new ArrayList<Vehicle>();

    List<Customer> customers = this.customerRepository.findByLastNameAndCompanyId(lastName, companyId);

    if (customers.size() > 0) {
      for (Customer customer : customers) {
        List<Vehicle> vehiclesList = this.vehicleRepository.findByCustomerId(customer.getId());

        for (Vehicle vehicle : vehiclesList) {
          if (vehicle.getDamages() != null) {
            vehicle.setDamageStrings(vehicle.getDamages().split(","));

          }
          vehicle.setDaysInShop((int) this.getDifferenceDays(vehicle.getCreatedAt(), new Date()));
          if (vehicle.getRentalDate() != null)
            vehicle.setRentalCountDown((int) this.getDifferenceDaysRental(new Date(), vehicle.getRentalDate()));

          if (vehicle.getTargetDate() != null)
            vehicle.setTargetDateCountDown((int) this.getDifferenceDaysRental(new Date(), vehicle.getTargetDate()));

          vehicle.setDaysInShopPrecentage(vehicle.getDaysInShop() * 100 / 14);
          this.setShowInSearchImageId(vehicle);
          vehicles.add(vehicle);
        }
      }
      return new ResponseEntity<>(vehicles, HttpStatus.OK);
    } else {
      // otherwise too much crap
      return new ResponseEntity<>(HttpStatus.OK);
    }
  }

  @GetMapping("/vin/{companyId}/{vin6}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<Vehicle>> getVehicleByVin6(@PathVariable("companyId") long companyId,
      @PathVariable("vin6") String vin6) {

    List<Vehicle> vehicles = new ArrayList<Vehicle>();

    List<Vehicle> vehiclesList = this.vehicleRepository.findByCompanyIdAndVinEndingWithIgnoreCase(companyId, vin6);

    if (vehiclesList.size() > 0) {

      for (Vehicle vehicle : vehiclesList) {
        if (vehicle.getDamages() != null) {
          vehicle.setDamageStrings(vehicle.getDamages().split(","));

        }
        vehicle.setDaysInShop((int) this.getDifferenceDays(vehicle.getCreatedAt(), new Date()));
        if (vehicle.getRentalDate() != null)
          vehicle.setRentalCountDown((int) this.getDifferenceDaysRental(new Date(), vehicle.getRentalDate()));

        if (vehicle.getTargetDate() != null)
          vehicle.setTargetDateCountDown((int) this.getDifferenceDaysRental(new Date(), vehicle.getTargetDate()));

        vehicle.setDaysInShopPrecentage(vehicle.getDaysInShop() * 100 / 14);
        this.setShowInSearchImageId(vehicle);
        vehicles.add(vehicle);
      }

      return new ResponseEntity<>(vehicles, HttpStatus.OK);

    } else

    {
      // otherwise too much crap
      return new ResponseEntity<>(HttpStatus.OK);
    }
  }

  @PostMapping("/date/{companyId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<Vehicle>> getVehicleByDate(@PathVariable("companyId") long companyId,
      @RequestBody DateCarrier dateCarrier) {

    List<Vehicle> vehicles = new ArrayList<Vehicle>();
    Date from = new Date();
    Date to = new Date();

    if (dateCarrier.week > 0) {
      from = this.asDate(this.getFirstDayOfWeek(dateCarrier.year, dateCarrier.week, Locale.US));
      // Date to = this.asDate(this.getFirstDayOfWeek(dateCarrier.year,
      // dateCarrier.week + 1, Locale.US).minus(1, ChronoUnit.DAYS));
      to = this
          .asDate(this.getFirstDayOfWeek(dateCarrier.year, dateCarrier.week + 1, Locale.US));
    } else {
      try {
        DateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
        from = formatter.parse(formatter.format(dateCarrier.from));
        long timeadj = 24 * 60 * 60 * 1000;
        to = new Date(from.getTime() + timeadj);
      } catch (Exception ex) {
        System.out.println(ex);
      }
    }

    List<Vehicle> vehiclesList = this.vehicleRepository.findByCompanyIdAndArchivedAndCreatedAtBetween(companyId, false,
        from, to);

    if (vehiclesList.size() > 0) {

      for (Vehicle vehicle : vehiclesList) {
        if (vehicle.getDamages() != null) {
          vehicle.setDamageStrings(vehicle.getDamages().split(","));

        }
        vehicle.setDaysInShop((int) this.getDifferenceDays(vehicle.getCreatedAt(), new Date()));

        if (vehicle.getRentalDate() != null)
          vehicle.setRentalCountDown((int) this.getDifferenceDaysRental(new Date(), vehicle.getRentalDate()));

        if (vehicle.getTargetDate() != null)
          vehicle.setTargetDateCountDown((int) this.getDifferenceDaysRental(new Date(), vehicle.getTargetDate()));

        vehicle.setDaysInShopPrecentage(vehicle.getDaysInShop() * 100 / 14);
        this.setShowInSearchImageId(vehicle);
        vehicles.add(vehicle);
      }

      return new ResponseEntity<>(vehicles, HttpStatus.OK);

    } else

    {
      // otherwise too much crap
      return new ResponseEntity<>(HttpStatus.OK);
    }
  }

  @PostMapping("/search")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<Vehicle>> searchAllVehicles(@RequestBody SearchCarrier searchCarrier) {

    LOG.info(searchCarrier.year + " " + searchCarrier.make + " " + searchCarrier.model + " " + searchCarrier.color);

    List<Vehicle> vehicles = new ArrayList<Vehicle>();

    if (!searchCarrier.partNumber.equals("")) {

      switch (searchCarrier.type) {

        case 1: {
          vehicles = this.vehicleRepository.findByYearAndMakeAndModelAndColorAndCompanyIdAndArchived(searchCarrier.year,
              searchCarrier.make, searchCarrier.model, searchCarrier.color, searchCarrier.companyId,
              searchCarrier.archived);
        }
          break;
        case 2: {
          vehicles = this.vehicleRepository.findByYearAndMakeAndModelAndCompanyIdAndArchived(searchCarrier.year,
              searchCarrier.make, searchCarrier.model, searchCarrier.companyId, searchCarrier.archived);
        }
          break;
        case 3: {
          vehicles = this.vehicleRepository.findByYearAndMakeAndCompanyIdAndArchived(searchCarrier.year,
              searchCarrier.make, searchCarrier.companyId, searchCarrier.archived);
        }
          break;
        case 4: {
          vehicles = this.vehicleRepository.findByYearAndCompanyIdAndArchived(searchCarrier.year,
              searchCarrier.companyId, searchCarrier.archived);
        }
          break;

        case 5: {

          int searchCount = this.vehicleRepository.countByCompanyIdAndArchived(searchCarrier.companyId,
              searchCarrier.archived);

          vehicles = this.vehicleRepository.findByCompanyIdAndArchivedOrderBySequenceNumberAsc(searchCarrier.companyId,
              searchCarrier.archived,
              Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));

          for (Vehicle vehicle : vehicles) {
            vehicle.searchCount = searchCount;
          }

        }
          break;

        case 6: {

          int searchCount = this.vehicleRepository.countByCustomerLastName(searchCarrier.companyId,
              searchCarrier.archived, searchCarrier.lastName);

          vehicles = this.vehicleRepository.findByCustomerLastName(searchCarrier.companyId, searchCarrier.archived,
              searchCarrier.lastName,
              Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));

          for (Vehicle vehicle : vehicles) {
            vehicle.searchCount = searchCount;
          }

        }
          break;

        case 7: {

          vehicles = this.vehicleRepository.findByCompanyIdAndArchivedOrderBySequenceNumberAsc(searchCarrier.companyId,
              searchCarrier.archived);

          for (Vehicle vehicle : vehicles) {
            // vehicle.setJobs(this.jobRepository.findByVehicleIdOrderBySequenceNumberAsc(vehicle.getId()));
          }

          // int searchCount =
          // this.vehicleRepository.countByCompanyIdAndArchived(searchCarrier.companyId,
          // searchCarrier.archived);

          // vehicles =
          // this.vehicleRepository.findByCompanyIdAndArchived(searchCarrier.companyId,
          // searchCarrier.archived,
          // Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));

          // for (Vehicle vehicle : vehicles) {
          // vehicle.searchCount = searchCount;
          // }

        }
          break;

        case 8: {

          int searchCount = this.vehicleRepository.countByCustomerLastName(searchCarrier.companyId,
              searchCarrier.archived, searchCarrier.lastName);

          vehicles = this.vehicleRepository.findByCustomerLastName(searchCarrier.companyId, searchCarrier.archived,
              searchCarrier.lastName,
              Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));

          for (Vehicle vehicle : vehicles) {
            vehicle.searchCount = searchCount;
          }

        }
          break;
        case 9: {

          System.out.println(searchCarrier);
          int year = 0;

          try {
            year = extractYearFromString(searchCarrier.lastName);
          } catch (Exception ex) {

          }

          if (year > 0) {
            searchCarrier.lastName = searchCarrier.lastName.replace("" + year, "").trim();
          }

          int searchCount = vehicleRepository.countVehicles((long) searchCarrier.companyId, searchCarrier.archived,
              searchCarrier.lastName);

          vehicles = vehicleRepository.searchVehiclesWithPage((long) searchCarrier.companyId, searchCarrier.archived,
              searchCarrier.lastName,
              Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));

          for (Vehicle vehicle : vehicles) {
            vehicle.searchCount = searchCount;
          }

        }
          break;

        case 10: {

          vehicles = this.vehicleRepository.findByCompanyIdAndArchivedAndSpecialOrderBySequenceNumberAsc(
              searchCarrier.companyId,
              searchCarrier.archived, true);

          for (Vehicle vehicle : vehicles) {
            // vehicle.setJobs(this.jobRepository.findByVehicleIdOrderBySequenceNumberAsc(vehicle.getId()));
          }

          // int searchCount =
          // this.vehicleRepository.countByCompanyIdAndArchived(searchCarrier.companyId,
          // searchCarrier.archived);

          // vehicles =
          // this.vehicleRepository.findByCompanyIdAndArchived(searchCarrier.companyId,
          // searchCarrier.archived,
          // Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));

          // for (Vehicle vehicle : vehicles) {
          // vehicle.searchCount = searchCount;
          // }

        }
          break;
        default:
      }

      for (Vehicle vehicle : vehicles) {

        Optional<VehicleHistory> vehicleHistoryOptional = vehicleHistoryRepository
            .findTopByVehicleIdOrderByCreatedAtDesc(vehicle.getId());
        if (vehicleHistoryOptional.isPresent()) {
          VehicleHistory vehicleHistory = vehicleHistoryOptional.get();

          vehicle.setLastVehicleHistory(vehicleHistory);
          vehicle.setUpdatedAt(vehicleHistory.getCreatedAt());
          vehicle.setLastUpdateObjectName(this.getFirstWord(vehicleHistory.getName()));

          // System.out.println("================================");
          // System.out.println("Object Name: 1 " + vehicle.getLastUpdateObjectName());

          // System.out.println("History Name: 2 " + vehicleHistory.getName());

          String iconClassName = this.transferInfoToIconClass(vehicle, vehicleHistory.getName());

          if (iconClassName != null && iconClassName.contains("fa-solid")) {
            // System.out.println("Icon Name: 3 " + iconClassName);

            vehicle.setLastUpdateIconName(iconClassName);
          } else {
            vehicle.setLastUpdateIconName("fa-solid fa-question");
          }

        } else {
          vehicle.setLastUpdateObjectName("");
        }
        // vehicle.setJobs(this.jobRepository.findByVehicleIdOrderBySequenceNumberAsc(vehicle.getId()));

        // if (vehicle.getDamages() != null) {

        // vehicle.setDamageStrings(vehicle.getDamages().split(","));

        // }

        vehicle.setSerachString(
            vehicle.getYear() + " "
                + vehicle.getMake() + " "
                + vehicle.getModel() + " "
                + vehicle.getColor() + " "
                + vehicle.getInsuranceCompany() + " "
                + vehicle.getLoanerCarName() + " "
                + vehicle.getCustomer().getFirstName() + " "
                + vehicle.getCustomer().getLastName() + " "
                + vehicle.getCustomer().getPhone() + " ");

        vehicle.setDaysInShop((int) this.getDifferenceDays(vehicle.getCreatedAt(), new Date()));
        if (vehicle.getRentalDate() != null)
          vehicle.setRentalCountDown((int) this.getDifferenceDaysRental(new Date(), vehicle.getRentalDate()));
        if (vehicle.getTargetDate() != null)
          vehicle.setTargetDateCountDown((int) this.getDifferenceDaysRental(new Date(), vehicle.getTargetDate()));

        vehicle.setDaysInShopPrecentage(vehicle.getDaysInShop() * 100 / 14);
        this.setShowInSearchImageId(vehicle);
      }
    }
    if (vehicles.isEmpty()) {
      return new ResponseEntity<>(vehicles, HttpStatus.OK);
    }
    System.err.println("Search Done [" + vehicles.size() + "] vehicles");
    return new ResponseEntity<>(vehicles, HttpStatus.OK);

  }

  @PostMapping("/search/snapshot")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<Vehicle>> searchAllVehiclesSnapshot(@RequestBody SearchCarrier searchCarrier) {

    LOG.info(searchCarrier.year + " " + searchCarrier.make + " " + searchCarrier.model + " " + searchCarrier.color + " "
        + searchCarrier.date);

    List<Vehicle> vehicles = new ArrayList<Vehicle>();

    if (!searchCarrier.partNumber.equals("")) {

      switch (searchCarrier.type) {

        case 1: {
          vehicles = this.vehicleRepository.findByYearAndMakeAndModelAndColorAndCompanyIdAndArchived(searchCarrier.year,
              searchCarrier.make, searchCarrier.model, searchCarrier.color, searchCarrier.companyId,
              searchCarrier.archived);
        }
          break;
        case 2: {
          vehicles = this.vehicleRepository.findByYearAndMakeAndModelAndCompanyIdAndArchived(searchCarrier.year,
              searchCarrier.make, searchCarrier.model, searchCarrier.companyId, searchCarrier.archived);
        }
          break;
        case 3: {
          vehicles = this.vehicleRepository.findByYearAndMakeAndCompanyIdAndArchived(searchCarrier.year,
              searchCarrier.make, searchCarrier.companyId, searchCarrier.archived);
        }
          break;
        case 4: {
          vehicles = this.vehicleRepository.findByYearAndCompanyIdAndArchived(searchCarrier.year,
              searchCarrier.companyId, searchCarrier.archived);
        }
          break;

        case 5: {

          int searchCount = this.vehicleRepository.countByCompanyIdAndArchived(searchCarrier.companyId,
              searchCarrier.archived);

          vehicles = this.vehicleRepository.findByCompanyIdAndArchivedOrderBySequenceNumberAsc(searchCarrier.companyId,
              searchCarrier.archived,
              Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));

          for (Vehicle vehicle : vehicles) {
            vehicle.searchCount = searchCount;
          }

        }
          break;

        case 6: {

          int searchCount = this.vehicleRepository.countByCustomerLastName(searchCarrier.companyId,
              searchCarrier.archived, searchCarrier.lastName);

          vehicles = this.vehicleRepository.findByCustomerLastName(searchCarrier.companyId, searchCarrier.archived,
              searchCarrier.lastName,
              Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));

          for (Vehicle vehicle : vehicles) {
            vehicle.searchCount = searchCount;
          }

        }
          break;

        case 7: {

          vehicles = this.vehicleRepository.findByCompanyIdAndArchivedOrderBySequenceNumberAsc(searchCarrier.companyId,
              searchCarrier.archived);

          for (Vehicle vehicle : vehicles) {
            // vehicle.setJobs(this.jobRepository.findByVehicleIdOrderBySequenceNumberAsc(vehicle.getId()));
          }

          // int searchCount =
          // this.vehicleRepository.countByCompanyIdAndArchived(searchCarrier.companyId,
          // searchCarrier.archived);

          // vehicles =
          // this.vehicleRepository.findByCompanyIdAndArchived(searchCarrier.companyId,
          // searchCarrier.archived,
          // Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));

          // for (Vehicle vehicle : vehicles) {
          // vehicle.searchCount = searchCount;
          // }

        }
          break;

        case 8: {

          int searchCount = this.vehicleRepository.countByCustomerLastName(searchCarrier.companyId,
              searchCarrier.archived, searchCarrier.lastName);

          vehicles = this.vehicleRepository.findByCustomerLastName(searchCarrier.companyId, searchCarrier.archived,
              searchCarrier.lastName,
              Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));

          for (Vehicle vehicle : vehicles) {
            vehicle.searchCount = searchCount;
          }

        }
          break;
        case 9: {

          System.out.println(searchCarrier);
          int year = 0;

          try {
            year = extractYearFromString(searchCarrier.lastName);
          } catch (Exception ex) {

          }

          if (year > 0) {
            searchCarrier.lastName = searchCarrier.lastName.replace("" + year, "").trim();
          }

          int searchCount = vehicleRepository.countVehicles((long) searchCarrier.companyId, searchCarrier.archived,
              searchCarrier.lastName);

          vehicles = vehicleRepository.searchVehiclesWithPage((long) searchCarrier.companyId, searchCarrier.archived,
              searchCarrier.lastName,
              Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));

          for (Vehicle vehicle : vehicles) {
            vehicle.searchCount = searchCount;
          }

        }
          break;

        case 10: {

          vehicles = this.vehicleRepository.findByCompanyIdAndArchivedAndSpecialOrderBySequenceNumberAsc(
              searchCarrier.companyId,
              searchCarrier.archived, true);

          for (Vehicle vehicle : vehicles) {
            // vehicle.setJobs(this.jobRepository.findByVehicleIdOrderBySequenceNumberAsc(vehicle.getId()));
          }

          // int searchCount =
          // this.vehicleRepository.countByCompanyIdAndArchived(searchCarrier.companyId,
          // searchCarrier.archived);

          // vehicles =
          // this.vehicleRepository.findByCompanyIdAndArchived(searchCarrier.companyId,
          // searchCarrier.archived,
          // Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));

          // for (Vehicle vehicle : vehicles) {
          // vehicle.searchCount = searchCount;
          // }

        }
          break;
        default:
      }

      Instant instant = searchCarrier.date.toInstant();
      ZoneId zoneId = ZoneId.systemDefault();
      LocalDate localDate = instant.atZone(zoneId).toLocalDate();

      LocalDateTime startOfDay = localDate.atStartOfDay(); // 00:00:00
      LocalDateTime endOfDay = localDate.atTime(LocalTime.MAX); // 23:59:59.999999999
      Date start = Date.from(startOfDay.atZone(ZoneId.systemDefault()).toInstant());
      Date end = Date.from(endOfDay.atZone(ZoneId.systemDefault()).toInstant());

      for (Vehicle vehicle : vehicles) {

        List<VehicleHistory> vehicleHistories = this.vehicleHistoryRepository
            .findByVehicleIdAndCreatedAtBetweenOrderByIdDesc(vehicle.getId(), start, end);

        if (!vehicleHistories.isEmpty()) {
          for (VehicleHistory vehicleHistory : vehicleHistories) {

            // vehicle.setLastVehicleHistory(vehicleHistory);
            // vehicle.setUpdatedAt(vehicleHistory.getCreatedAt());
            // vehicle.setLastUpdateObjectName(this.getFirstWord(vehicleHistory.getName()));

            // String iconClassName = this.transferInfoToIconClass(vehicle,
            // vehicleHistory.getName());

            // if (iconClassName != null && iconClassName.contains("fa-solid")) {

            // vehicle.setLastUpdateIconName(iconClassName);
            // } else {
            // vehicle.setLastUpdateIconName("fa-solid fa-question");
            // }

            vehicleHistory.setObjectName(this.getFirstWord(vehicleHistory.getName()));

            String iconClassName = this.transferInfoToIconClass(vehicleHistory, vehicleHistory.getName());

            // vehicleHistory.setName(this.removeFirstWord(vehicleHistory.getName()));

            if (iconClassName != null && iconClassName.contains("fa-solid")) {
              // System.out.println("Icon Name: 3 " + iconClassName);

              vehicleHistory.setIconName(iconClassName);
            } else {
              vehicleHistory.setIconName("fa-solid fa-question");
            }
          }

          vehicle.setVehicleHistories(vehicleHistories);
        } else {
          vehicle.setLastUpdateObjectName("");

          vehicle.setVehicleHistories(new ArrayList());
        }

        // vehicle.setJobs(this.jobRepository.findByVehicleIdOrderBySequenceNumberAsc(vehicle.getId()));

        // if (vehicle.getDamages() != null) {

        // vehicle.setDamageStrings(vehicle.getDamages().split(","));

        // }

        vehicle.setSerachString(
            vehicle.getYear() + " "
                + vehicle.getMake() + " "
                + vehicle.getModel() + " "
                + vehicle.getColor() + " "
                + vehicle.getInsuranceCompany() + " "
                + vehicle.getLoanerCarName() + " "
                + vehicle.getCustomer().getFirstName() + " "
                + vehicle.getCustomer().getLastName() + " "
                + vehicle.getCustomer().getPhone() + " ");

        vehicle.setDaysInShop((int) this.getDifferenceDays(vehicle.getCreatedAt(), new Date()));
        if (vehicle.getRentalDate() != null)
          vehicle.setRentalCountDown((int) this.getDifferenceDaysRental(new Date(), vehicle.getRentalDate()));
        if (vehicle.getTargetDate() != null)
          vehicle.setTargetDateCountDown((int) this.getDifferenceDaysRental(new Date(), vehicle.getTargetDate()));

        vehicle.setDaysInShopPrecentage(vehicle.getDaysInShop() * 100 / 14);
        this.setShowInSearchImageId(vehicle);
      }
    }
    if (vehicles.isEmpty())

    {
      return new ResponseEntity<>(vehicles, HttpStatus.OK);
    }
    System.err.println("Search Done [" + vehicles.size() + "] vehicles");
    return new ResponseEntity<>(vehicles, HttpStatus.OK);

  }

  public String transferInfoToIconClass(VehicleHistory vehicle, String vehicleLastHistoryName) {
    if (vehicle == null || vehicleLastHistoryName == null || vehicleLastHistoryName.isEmpty()) {
      return ""; // return an empty string if the vehicle or name is null or empty
    }

    // System.out.println(vehicleLastHistoryName);
    // Check the lastVehicleHistory name first (equivalent to
    // vehicle.lastVehicleHistory?.name in Angular)
    if ("Approval".equals(vehicleLastHistoryName)) {
      return "fa-solid fa-check"; // red car icon
    } else if ("Vehicle new".equals(vehicleLastHistoryName)) {
      return "fa-solid fa-car text-danger fw-700"; // red car icon
    } else if ("Vehicle paid".equals(vehicleLastHistoryName)) {
      return "fa-solid fa-dollar-sign"; // dollar sign icon
    } else if ("special".equals(vehicleLastHistoryName)) {
      return "fa-solid fa-alarm-clock"; // dollar sign icon
    } else if ("assign To".equals(vehicleLastHistoryName)) {
      return "fa-solid fa-dollar-sign"; // dollar sign icon
    } else if ("Vehicle Image".equals(vehicleLastHistoryName)) {
      return "fa-solid fa-image"; // image icon
    } else if ("Vehicle Image Employee".equals(vehicleLastHistoryName)) {
      return "fa-solid fa-image"; // image icon
    } else if ("Vehicle key location".equals(vehicleLastHistoryName)) {
      return "fa-solid fa-key"; // image icon
    } else if ("key Location".equals(vehicleLastHistoryName)) {
      return "fa-solid fa-key"; // image icon
    } else if ("Vehicle Pdf".equals(vehicleLastHistoryName)) {
      return "fa-solid fa-file-pdf"; // pdf icon
    } else if ("Vehicle status".equals(vehicleLastHistoryName)) {
      return "fa-solid  fa-running"; // running person icon
    } else if ("Vehicle update".equals(vehicleLastHistoryName) ||
        "Vehicle Vehicle update".equals(vehicleLastHistoryName)) {
      return "fa-solid fa-car"; // car icon
    } else if ("Vehicle assigned To".equals(vehicleLastHistoryName)) {
      return "fa-solid fa-user"; // user icon
    } else if ("assigned To".equals(vehicleLastHistoryName)) {
      return "fa-solid fa-user"; // user icon
    } else if ("Vehicle Image Doc Type".equals(vehicleLastHistoryName)) {
      return "fa-solid fa-image"; // image icon
    } else if ("Note".equals(vehicleLastHistoryName)) {
      return "fa-solid fa-note"; // image icon
    }

    // If none of the above names match, check the lastUpdateObjectName for other
    // patterns
    String lastUpdateObjectName = vehicle.getObjectName(); // assuming the getter is available

    if (lastUpdateObjectName != null) {
      if (lastUpdateObjectName.contains("Payment")) {
        return "fa-solid fa-dollar-sign"; // dollar sign icon
      } else if (lastUpdateObjectName.contains("Receipt")) {
        return "fa-solid fa-receipt"; // receipt icon
      } else if (lastUpdateObjectName.contains("Estimate")) {
        return "fa-solid fa-calculator"; // calculator icon
      } else if (lastUpdateObjectName.contains("Purchase")) {
        return "fa-solid fa-cart-shopping"; // shopping cart icon
      } else if (lastUpdateObjectName.contains("Image")) {
        return "fa-solid fa-image"; // image icon
      } else if (lastUpdateObjectName.contains("Vehicle")) {
        return "fa-solid fa-save"; // save icon
      } else if (lastUpdateObjectName.contains("job") || lastUpdateObjectName.contains("Job")) {
        return "fa-solid fa-tasks"; // tasks icon
      } else if (lastUpdateObjectName.contains("archive")) {
        return "fa-solid fa-archive"; // save icon
      } else if (lastUpdateObjectName.contains("save")) {
        return "fa-solid fa-save"; // save icon
      } else if (lastUpdateObjectName.contains("Autopart")) {
        return "fa-solid fa-cart-shopping"; // shopping cart icon
      } else if (lastUpdateObjectName.contains("Supplement")) {
        return "fa-solid fa-dollar-sign"; // dollar sign icon
      } else if (lastUpdateObjectName.contains("update")) {
        return "fa-solid fa-save"; // dollar sign icon
      } else if (lastUpdateObjectName.contains("status")) {
        return "fa-solid fa-save"; // dollar sign icon
      } else if (lastUpdateObjectName.contains("notification")) {
        return "fa-solid fa-bell"; // dollar sign icon
      }
    }

    // If no condition matched, return the name itself (like Angular template
    // fallback behavior)
    return lastUpdateObjectName != null ? lastUpdateObjectName : "";
  }

  private Integer extractYearFromString(String searchString) {
    Pattern pattern = Pattern.compile("\\b(\\d{4})\\b"); // Match a 4-digit year, e.g., 2021
    Matcher matcher = pattern.matcher(searchString);

    if (matcher.find()) {
      // Extract the year
      Integer year = Integer.parseInt(matcher.group(1));

      // Remove the year from the search string
      searchString = searchString.replace(matcher.group(1), "").trim(); // Remove year and trim any extra spaces

      // Update the searchString (pass it down)
      return year;
    }
    return null; // No year found
  }

  public String transferInfoToIconClass(Vehicle vehicle, String vehicleLastHistoryName) {
    if (vehicle == null || vehicleLastHistoryName == null || vehicleLastHistoryName.isEmpty()) {
      return ""; // return an empty string if the vehicle or name is null or empty
    }

    // System.out.println(vehicleLastHistoryName);
    // Check the lastVehicleHistory name first (equivalent to
    // vehicle.lastVehicleHistory?.name in Angular)
    if ("Approval".equals(vehicleLastHistoryName)) {
      return "fa-solid fa-check"; // red car icon
    } else if ("Vehicle new".equals(vehicleLastHistoryName)) {
      return "fa-solid fa-car text-danger fw-700"; // red car icon
    } else if ("Vehicle paid".equals(vehicleLastHistoryName)) {
      return "fa-solid fa-dollar-sign"; // dollar sign icon
    } else if ("special".equals(vehicleLastHistoryName)) {
      return "fa-solid fa-alarm-clock"; // dollar sign icon
    } else if ("assign To".equals(vehicleLastHistoryName)) {
      return "fa-solid fa-dollar-sign"; // dollar sign icon
    } else if ("Vehicle Image".equals(vehicleLastHistoryName)) {
      return "fa-solid fa-image"; // image icon
    } else if ("Vehicle key location".equals(vehicleLastHistoryName)) {
      return "fa-solid fa-key"; // image icon
    } else if ("key Location".equals(vehicleLastHistoryName)) {
      return "fa-solid fa-key"; // image icon
    } else if ("Vehicle Pdf".equals(vehicleLastHistoryName)) {
      return "fa-solid fa-file-pdf"; // pdf icon
    } else if ("Vehicle status".equals(vehicleLastHistoryName)) {
      return "fa-solid  fa-running"; // running person icon
    } else if ("Vehicle update".equals(vehicleLastHistoryName) ||
        "Vehicle Vehicle update".equals(vehicleLastHistoryName)) {
      return "fa-solid fa-car"; // car icon
    } else if ("Vehicle assigned To".equals(vehicleLastHistoryName)) {
      return "fa-solid fa-user"; // user icon
    } else if ("assigned To".equals(vehicleLastHistoryName)) {
      return "fa-solid fa-user"; // user icon
    } else if ("Vehicle Image Doc Type".equals(vehicleLastHistoryName)) {
      return "fa-solid fa-image"; // image icon
    }

    // If none of the above names match, check the lastUpdateObjectName for other
    // patterns
    String lastUpdateObjectName = vehicle.getLastUpdateObjectName(); // assuming the getter is available

    if (lastUpdateObjectName != null) {
      if (lastUpdateObjectName.contains("Payment")) {
        return "fa-solid fa-dollar-sign"; // dollar sign icon
      } else if (lastUpdateObjectName.contains("Receipt")) {
        return "fa-solid fa-receipt"; // receipt icon
      } else if (lastUpdateObjectName.contains("Estimate")) {
        return "fa-solid fa-calculator"; // calculator icon
      } else if (lastUpdateObjectName.contains("Purchase")) {
        return "fa-solid fa-cart-shopping"; // shopping cart icon
      } else if (lastUpdateObjectName.contains("Image")) {
        return "fa-solid fa-image"; // image icon
      } else if (lastUpdateObjectName.contains("Vehicle")) {
        return "fa-solid fa-save"; // save icon
      } else if (lastUpdateObjectName.contains("job") || lastUpdateObjectName.contains("Job")) {
        return "fa-solid fa-tasks"; // tasks icon
      } else if (lastUpdateObjectName.contains("archive")) {
        return "fa-solid fa-archive"; // save icon
      } else if (lastUpdateObjectName.contains("save")) {
        return "fa-solid fa-save"; // save icon
      } else if (lastUpdateObjectName.contains("Autopart")) {
        return "fa-solid fa-cart-shopping"; // shopping cart icon
      } else if (lastUpdateObjectName.contains("Supplement")) {
        return "fa-solid fa-dollar-sign"; // dollar sign icon
      } else if (lastUpdateObjectName.contains("update")) {
        return "fa-solid fa-save"; // dollar sign icon
      } else if (lastUpdateObjectName.contains("status")) {
        return "fa-solid fa-save"; // dollar sign icon
      }
    }

    // If no condition matched, return the name itself (like Angular template
    // fallback behavior)
    return lastUpdateObjectName != null ? lastUpdateObjectName : "";
  }

  private String getFirstWord(String text) {
    int index = text.indexOf(' ');
    if (index > -1) { // Check if there is more than one word.
      return text.substring(0, index).trim(); // Extract first word.
    } else {
      return text; // Text is the first word itself.
    }
  }

  private String removeFirstWord(String text) {
    int index = text.indexOf(' ');
    if (index > -1) { // Check if there is more than one word.
      return text.substring(index, text.length()).trim(); // Extract first word.
    } else {
      return text; // Text is the first word itself.
    }
  }

  @GetMapping("/search/uuid/{uuid}")
  public ResponseEntity<?> searchVehiclesByUUID(@PathVariable("uuid") String uuid) {

    LOG.info(uuid);

    String returnStr = "";

    Optional<Vehicle> vehicleOptional = this.vehicleRepository.findByTokenAndArchived(uuid, false);

    if (!vehicleOptional.isPresent()) {

      returnStr = "Not Found";

    } else {

      Vehicle vehicle = vehicleOptional.get();

      this.setShowInSearchImageId(vehicle);

      List<Status> statuss = this.statusRepository.findByCompanyIdOrderByNameAsc(vehicle.getCompanyId());

      String statusName = "No Status";
      for (Status status : statuss) {
        if (status.getId() == vehicle.getStatus()) {
          statusName = status.getName();
        }
      }

      Optional<Company> companyOptional = this.companyRepository.findById(vehicle.getCompanyId());

      String companyInfo = "";
      if (companyOptional.isPresent()) {
        companyInfo = companyOptional.get().getName();
      }

      returnStr = companyInfo + "|" + vehicle.getCustomer().getTitle() + " "
          + vehicle.getCustomer().getFirstName() + " "
          + vehicle.getCustomer().getLastName() + "|" + " vehicle Info: " + vehicle.getYear() + " "
          + vehicle.getMake()
          + " " + vehicle.getModel() + " "
          + vehicle.getColor() + "'s status is [" + statusName + "]";

      String additionalInfo = "";
      SimpleDateFormat outputDateFormat = new SimpleDateFormat("dd/MM/YYYY");
      vehicle.setDaysInShop((int) this.getDifferenceDays(vehicle.getCreatedAt(), new Date()));
      additionalInfo = " been in shop since " + outputDateFormat.format(vehicle.getCreatedAt()) + " for "
          + vehicle.getDaysInShop() + " days ";
      ;

      if (vehicle.getInsuranceCompany() != null && vehicle.getInsuranceCompany() != "") {
        additionalInfo = additionalInfo + " Insurance Company is " + vehicle.getInsuranceCompany();

      }
      if (vehicle.getLoanerCarName() != null && vehicle.getLoanerCarName() != "" && vehicle.getRentalDate() != null) {
        vehicle.setRentalCountDown((int) this.getDifferenceDaysRental(new Date(), vehicle.getRentalDate()));
        if (vehicle.getRentalCountDown() >= 0) {
          additionalInfo = additionalInfo + " , rental from " + vehicle.getLoanerCarName() + " will be expired in "
              + vehicle.getRentalCountDown() + " days";
        } else {
          additionalInfo = additionalInfo + " , rental from " + vehicle.getLoanerCarName() + " is already over due for "
              + (0 - vehicle.getRentalCountDown()) + " days";
        }
      }
      if (vehicle.getTargetDate() != null) {
        vehicle.setTargetDateCountDown((int) this.getDifferenceDaysRental(new Date(), vehicle.getTargetDate()));

        if (vehicle.getTargetDateCountDown() >= 0)
          additionalInfo = additionalInfo + " , and the delivery of this vehicle is due in "
              + vehicle.getTargetDateCountDown() + " days";
        else {
          additionalInfo = additionalInfo + " , and the delivery of this vehicle is over due for "
              + (0 - vehicle.getTargetDateCountDown()) + " days";
        }
      }

      returnStr = returnStr + additionalInfo + "";

    }

    return new ResponseEntity<>(returnStr, HttpStatus.OK);

  }

  @GetMapping("/search/phone/{phone}")
  public ResponseEntity<?> searchCustomerVehiclesByPhone(@PathVariable("phone") String phone) {

    LOG.info(phone);

    List<Vehicle> vehicles = new ArrayList<Vehicle>();
    String returnStr = "";

    vehicles = this.vehicleRepository.findByCustomerPhone(false, phone);

    if (vehicles.isEmpty()) {
      return new ResponseEntity<>(vehicles, HttpStatus.OK);
    } else {
      Vehicle vehicle = vehicles.get(0);
      this.setShowInSearchImageId(vehicle);
      List<Status> statuss = this.statusRepository.findByCompanyIdOrderByNameAsc(vehicle.getCompanyId());

      String statusName = "No Status";
      for (Status status : statuss) {
        if (status.getId() == vehicle.getStatus()) {
          statusName = status.getName();
        }
      }

      String phoneNumber = "" + phone;

      try {
        phoneNumber = phone.replaceFirst("(\\d{3})(\\d{3})(\\d+)", "$1-$2-$3"); // 123-456-7890
      } catch (Exception e) {

      }

      returnStr = "Customer with phone " + " " + phoneNumber + " is " + vehicle.getCustomer().getTitle() + " "
          + vehicle.getCustomer().getFirstName() + " "
          + vehicle.getCustomer().getLastName() + "'s " + " vehicle Info: " + vehicle.getYear() + " "
          + vehicle.getMake()
          + " " + vehicle.getModel() + " "
          + vehicle.getColor() + "'s status is [" + statusName + "]";

      String additionalInfo = "";
      SimpleDateFormat outputDateFormat = new SimpleDateFormat("dd/MM/YYYY");
      vehicle.setDaysInShop((int) this.getDifferenceDays(vehicle.getCreatedAt(), new Date()));
      additionalInfo = " been in shop since " + outputDateFormat.format(vehicle.getCreatedAt()) + " for "
          + vehicle.getDaysInShop() + " days ";
      ;

      if (vehicle.getInsuranceCompany() != null && vehicle.getInsuranceCompany() != "") {
        additionalInfo = additionalInfo + " Insurance Company is " + vehicle.getInsuranceCompany();

      }
      if (vehicle.getLoanerCarName() != null && vehicle.getLoanerCarName() != "" && vehicle.getRentalDate() != null) {
        vehicle.setRentalCountDown((int) this.getDifferenceDaysRental(new Date(), vehicle.getRentalDate()));
        if (vehicle.getRentalCountDown() >= 0) {
          additionalInfo = additionalInfo + " , rental from " + vehicle.getLoanerCarName() + " will be expired in "
              + vehicle.getRentalCountDown() + " days";
        } else {
          additionalInfo = additionalInfo + " , rental from " + vehicle.getLoanerCarName() + " is already over due for "
              + (0 - vehicle.getRentalCountDown()) + " days";
        }
      }
      if (vehicle.getTargetDate() != null) {
        vehicle.setTargetDateCountDown((int) this.getDifferenceDaysRental(new Date(), vehicle.getTargetDate()));

        if (vehicle.getTargetDateCountDown() >= 0)
          additionalInfo = additionalInfo + " , and the delivery of this vehicle is due in "
              + vehicle.getTargetDateCountDown() + " days";
        else {
          additionalInfo = additionalInfo + " , and the delivery of this vehicle is over due for "
              + (0 - vehicle.getTargetDateCountDown()) + " days";
        }
      }

      returnStr = returnStr + additionalInfo + "";

    }

    return new ResponseEntity<>(returnStr, HttpStatus.OK);

  }

  @GetMapping("/search/company/{uuid}")
  public ResponseEntity<List<Vehicle>> searchCustomerVehiclesByUUID(@PathVariable("uuid") String uuid) {

    LOG.info(uuid);

    List<Vehicle> vehicles = new ArrayList<Vehicle>();
    String returnStr = "";

    Optional<Company> companyOptional = this.companyRepository.findByToken(uuid);

    if (companyOptional.isPresent()) {

      vehicles = this.vehicleRepository.findByCompanyIdAndArchived(companyOptional.get().getId(), false);
      List<Status> statuss = this.statusRepository.findByCompanyIdOrderByNameAsc(companyOptional.get().getId());
      List<Employee> employees = this.employeeRepository
          .findByCompanyIdOrderByFirstNameAsc(companyOptional.get().getId());
      List<JobRequestType> jobRequestTypes = this.jobRequestTypeRepository
          .findByCompanyIdOrderByNameAsc(companyOptional.get().getId());

      if (vehicles.isEmpty()) {
        return new ResponseEntity<>(vehicles, HttpStatus.OK);
      } else {

        for (Vehicle vehicle : vehicles) {

          if (vehicle.getToken() == null || vehicle.getToken().equals("")) {
            String randomCode = UUID.randomUUID().toString();
            vehicle.setToken(randomCode);
            this.vehicleRepository.save(vehicle);
          }

          String statusName = "No Status";
          String emplyString = "Nobody";

          for (Status status : statuss) {
            if (status.getId() == vehicle.getStatus()) {
              statusName = status.getName();
              vehicle.setStatusString(statusName);
              // vehicle.setSerachString(statusName);
            }
          }

          for (JobRequestType jobRequestType : jobRequestTypes) {
            if (jobRequestType.getId() == vehicle.getJobRequestType()) {
              vehicle.setJobReqeustTypeString(jobRequestType.getName());
            }
          }

          String allTechnicians = "";
          for (Employee employee : employees) {
            allTechnicians = allTechnicians + employee.getFirstName() + " " + employee.getLastName() + ",";
            if (employee.getId() == vehicle.getAssignedTo()) {
              emplyString = employee.getFirstName() + " " + employee.getLastName();
              // allTechnicians = allTechnicians + emplyString + ",";
              vehicle.setEmployeeString(emplyString);
              // vehicle.setSerachString(emplyString);
            }
          }
          if (!allTechnicians.equals(""))
            allTechnicians = "Technicians: " + allTechnicians;

          // vehicle.setVin(allTechnicians);
          vehicle.setReason(allTechnicians);

          vehicle.setDaysInShop((int) this.getDifferenceDays(vehicle.getCreatedAt(), new Date()));
          if (vehicle.getRentalDate() != null)
            vehicle.setRentalCountDown((int) this.getDifferenceDaysRental(new Date(), vehicle.getRentalDate()));
          if (vehicle.getTargetDate() != null)
            vehicle.setTargetDateCountDown((int) this.getDifferenceDaysRental(new Date(), vehicle.getTargetDate()));

          vehicle.setDaysInShopPrecentage(vehicle.getDaysInShop() * 100 / 14);

          String phoneNumber = "" + vehicle.getCustomer().getPhone();

          try {
            phoneNumber = vehicle.getCustomer().getPhone().replaceFirst("(\\d{3})(\\d{3})(\\d+)", "$1-$2-$3"); // 123-456-7890
          } catch (Exception e) {

          }

          returnStr = "Vehicle: " + vehicle.getYear() + " " + vehicle.getMake() + " " + vehicle.getModel() + " "
              + vehicle.getColor() + "" +
              " Status: " + statusName + " " +
              " Customer: " + vehicle.getCustomer().getTitle() + " " + vehicle.getCustomer().getFirstName() + " "
              + vehicle.getCustomer().getLastName() + " ( " + phoneNumber + " ),";

          String additionalInfo = "";

          if (vehicle.getAssignedTo() > 0) {
            additionalInfo = additionalInfo + " Technician: " + emplyString + ", ";
          }

          SimpleDateFormat outputDateFormat = new SimpleDateFormat("dd/MM/YYYY");
          vehicle.setDaysInShop((int) this.getDifferenceDays(vehicle.getCreatedAt(), new Date()));
          additionalInfo = additionalInfo + " been in shop since " + outputDateFormat.format(vehicle.getCreatedAt())
              + " for "
              + vehicle.getDaysInShop() + " days, ";
          ;

          if (vehicle.getInsuranceCompany() != null && vehicle.getInsuranceCompany() != "") {
            additionalInfo = additionalInfo + " Insurance Provider: " + vehicle.getInsuranceCompany().toUpperCase()
                + ",";
          }

          if (vehicle.getLoanerCarName() != null && vehicle.getLoanerCarName() != ""
              && vehicle.getRentalDate() != null) {
            vehicle.setRentalCountDown((int) this.getDifferenceDaysRental(new Date(), vehicle.getRentalDate()));
            if (vehicle.getRentalCountDown() >= 0) {
              additionalInfo = additionalInfo + " Rental Company: " + vehicle.getLoanerCarName().toUpperCase() + ""
                  + " will be expired in "
                  + vehicle.getRentalCountDown() + " days,";
            } else {
              additionalInfo = additionalInfo + " Rental Company: " + vehicle.getLoanerCarName().toUpperCase() + ""
                  + " expired for "
                  + (0 - vehicle.getRentalCountDown()) + " days,";
            }
          }

          if (vehicle.getTargetDate() != null) {
            vehicle.setTargetDateCountDown((int) this.getDifferenceDaysRental(new Date(), vehicle.getTargetDate()));

            if (vehicle.getTargetDateCountDown() >= 0)
              additionalInfo = additionalInfo + "  and delivery due in "
                  + vehicle.getTargetDateCountDown() + " days";
            else {
              additionalInfo = additionalInfo + "  and delivery overdue for "
                  + (0 - vehicle.getTargetDateCountDown()) + " days";
            }
          }

          returnStr = returnStr + additionalInfo + "";
          this.setShowInSearchImageId(vehicle);
          vehicle.setSerachString(returnStr);

        }

      }

    }
    // return new ResponseEntity<>(returnStr, HttpStatus.OK);
    return new ResponseEntity<>(vehicles, HttpStatus.OK);

  }

  @GetMapping("/search/vehicle/{uuid}")
  // Authentication removed to allow public access for insurance viewing
  // This endpoint is used by the insurance viewing component to load vehicles by UUID
  public ResponseEntity<Vehicle> searchVehicleByUUID(@PathVariable("uuid") String uuid) {

    LOG.info(uuid);
    Vehicle vehicle = new Vehicle();
    Optional<Vehicle> vehicleOptional = this.vehicleRepository.findByToken(uuid);

    String returnStr = "";

    if (vehicleOptional.isPresent()) {
      vehicle = vehicleOptional.get();

      // vehicles =
      // this.vehicleRepository.findByCompanyIdAndArchived(vehicleOptional.get().getCompanyId(),
      // false);
      List<Status> statuss = this.statusRepository.findByCompanyIdOrderByNameAsc(vehicleOptional.get().getCompanyId());

      vehicle.statuss = statuss;

      List<Employee> employees = this.employeeRepository
          .findByCompanyIdOrderByFirstNameAsc(vehicleOptional.get().getCompanyId());

      vehicle.employees = employees;

      List<JobRequestType> jobRequestTypes = this.jobRequestTypeRepository
          .findByCompanyIdOrderByNameAsc(vehicleOptional.get().getCompanyId());

      List<User> users = this.userRepository.findByCompanyIdOrderByFirstNameAsc(vehicleOptional.get().getCompanyId());

      if (vehicle.getToken() == null || vehicle.getToken().equals("")) {
        String randomCode = UUID.randomUUID().toString();
        vehicle.setToken(randomCode);
        this.vehicleRepository.save(vehicle);
      }

      for (ImageModelVehicle imageModelVehicle : vehicle.getImageModels()) {
        for (User user : users) {
          if (imageModelVehicle.getUserId() == user.getId()) {
            imageModelVehicle.setUserName(user.getFirstName() + " " + user.getLastName());
          }
        }
      }

      String statusName = "No Status";
      String emplyString = "Nobody";

      for (Status status : statuss) {
        if (status.getId() == vehicle.getStatus()) {
          statusName = status.getName();
          vehicle.setStatusString(statusName);
          // vehicle.setSerachString(statusName);
        }
      }

      for (JobRequestType jobRequestType : jobRequestTypes) {
        if (jobRequestType.getId() == vehicle.getJobRequestType()) {
          vehicle.setJobReqeustTypeString(jobRequestType.getName());
        }
      }

      String allTechnicians = "";
      for (Employee employee : employees) {
        allTechnicians = allTechnicians + employee.getFirstName() + " " + employee.getLastName() + ",";
        if (employee.getId() == vehicle.getAssignedTo()) {
          emplyString = employee.getFirstName() + " " + employee.getLastName();
          // allTechnicians = allTechnicians + emplyString + ",";
          vehicle.setEmployeeString(emplyString);
          // vehicle.setSerachString(emplyString);
        }
      }
      if (!allTechnicians.equals(""))
        allTechnicians = "Technicians: " + allTechnicians;

      // vehicle.setVin(allTechnicians);
      vehicle.setReason(allTechnicians);

      vehicle.setDaysInShop((int) this.getDifferenceDays(vehicle.getCreatedAt(), new Date()));
      if (vehicle.getRentalDate() != null)
        vehicle.setRentalCountDown((int) this.getDifferenceDaysRental(new Date(), vehicle.getRentalDate()));
      if (vehicle.getTargetDate() != null)
        vehicle.setTargetDateCountDown((int) this.getDifferenceDaysRental(new Date(), vehicle.getTargetDate()));

      vehicle.setDaysInShopPrecentage(vehicle.getDaysInShop() * 100 / 14);

      String phoneNumber = "" + vehicle.getCustomer().getPhone();

      try {
        phoneNumber = vehicle.getCustomer().getPhone().replaceFirst("(\\d{3})(\\d{3})(\\d+)", "$1-$2-$3"); // 123-456-7890
      } catch (Exception e) {

      }

      returnStr = "Vehicle: " + vehicle.getYear() + " " + vehicle.getMake() + " " + vehicle.getModel() + " "
          + vehicle.getColor() + "" +
          " Status: " + statusName + " " +
          " Customer: " + vehicle.getCustomer().getTitle() + " " + vehicle.getCustomer().getFirstName() + " "
          + vehicle.getCustomer().getLastName() + " ( " + phoneNumber + " ),";

      String additionalInfo = "";

      if (vehicle.getAssignedTo() > 0) {
        additionalInfo = additionalInfo + " Technician: " + emplyString + ", ";
      }

      SimpleDateFormat outputDateFormat = new SimpleDateFormat("dd/MM/YYYY");
      vehicle.setDaysInShop((int) this.getDifferenceDays(vehicle.getCreatedAt(), new Date()));
      additionalInfo = additionalInfo + " been in shop since " + outputDateFormat.format(vehicle.getCreatedAt())
          + " for "
          + vehicle.getDaysInShop() + " days, ";
      ;

      if (vehicle.getInsuranceCompany() != null && vehicle.getInsuranceCompany() != "") {
        additionalInfo = additionalInfo + " Insurance Provider: " + vehicle.getInsuranceCompany().toUpperCase()
            + ",";
      }

      if (vehicle.getLoanerCarName() != null && vehicle.getLoanerCarName() != ""
          && vehicle.getRentalDate() != null) {
        vehicle.setRentalCountDown((int) this.getDifferenceDaysRental(new Date(), vehicle.getRentalDate()));
        if (vehicle.getRentalCountDown() >= 0) {
          additionalInfo = additionalInfo + " Rental Company: " + vehicle.getLoanerCarName().toUpperCase() + ""
              + " will be expired in "
              + vehicle.getRentalCountDown() + " days,";
        } else {
          additionalInfo = additionalInfo + " Rental Company: " + vehicle.getLoanerCarName().toUpperCase() + ""
              + " expired for "
              + (0 - vehicle.getRentalCountDown()) + " days,";
        }
      }

      if (vehicle.getTargetDate() != null) {
        vehicle.setTargetDateCountDown((int) this.getDifferenceDaysRental(new Date(), vehicle.getTargetDate()));

        if (vehicle.getTargetDateCountDown() >= 0)
          additionalInfo = additionalInfo + "  and delivery due in "
              + vehicle.getTargetDateCountDown() + " days";
        else {
          additionalInfo = additionalInfo + "  and delivery overdue for "
              + (0 - vehicle.getTargetDateCountDown()) + " days";
        }
      }

      returnStr = returnStr + additionalInfo + "";
      this.setShowInSearchImageId(vehicle);
      vehicle.setSerachString(returnStr);

    }
    // return new ResponseEntity<>(returnStr, HttpStatus.OK);
    return new ResponseEntity<>(vehicle, HttpStatus.OK);

  }

  @GetMapping("/search/company/job/{uuid}")
  public ResponseEntity<List<Vehicle>> searchCustomerVehiclesByUUIDWithJobs(@PathVariable("uuid") String uuid) {

    LOG.info(uuid);

    List<Vehicle> vehicles = new ArrayList<Vehicle>();
    String returnStr = "";

    Optional<Company> companyOptional = this.companyRepository.findByToken(uuid);

    if (companyOptional.isPresent()) {

      vehicles = this.vehicleRepository.findByCompanyIdAndArchived(companyOptional.get().getId(), false);
      List<Status> statuss = this.statusRepository.findByCompanyIdOrderByNameAsc(companyOptional.get().getId());
      List<Employee> employees = this.employeeRepository
          .findByCompanyIdOrderByFirstNameAsc(companyOptional.get().getId());
      List<JobRequestType> jobRequestTypes = this.jobRequestTypeRepository
          .findByCompanyIdOrderByNameAsc(companyOptional.get().getId());

      if (vehicles.isEmpty()) {
        return new ResponseEntity<>(vehicles, HttpStatus.OK);
      } else {

        for (Vehicle vehicle : vehicles) {

          vehicle.setJobs(this.jobRepository.findByVehicleIdOrderBySequenceNumberAsc(vehicle.getId()));
          if (vehicle.getToken() == null || vehicle.getToken().equals("")) {
            String randomCode = UUID.randomUUID().toString();
            vehicle.setToken(randomCode);
            this.vehicleRepository.save(vehicle);
          }

          String statusName = "No Status";
          String emplyString = "Nobody";

          for (Status status : statuss) {
            if (status.getId() == vehicle.getStatus()) {
              statusName = status.getName();
              vehicle.setStatusString(statusName);
              // vehicle.setSerachString(statusName);
            }
          }

          for (JobRequestType jobRequestType : jobRequestTypes) {
            if (jobRequestType.getId() == vehicle.getJobRequestType()) {
              vehicle.setJobReqeustTypeString(jobRequestType.getName());
            }
          }

          String allTechnicians = "";
          for (Employee employee : employees) {
            allTechnicians = allTechnicians + employee.getFirstName() + " " + employee.getLastName() + ",";
            if (employee.getId() == vehicle.getAssignedTo()) {
              emplyString = employee.getFirstName() + " " + employee.getLastName();
              // allTechnicians = allTechnicians + emplyString + ",";
              vehicle.setEmployeeString(emplyString);
              // vehicle.setSerachString(emplyString);
            }
          }
          if (!allTechnicians.equals(""))
            allTechnicians = "Technicians: " + allTechnicians;

          // vehicle.setVin(allTechnicians);
          vehicle.setReason(allTechnicians);

          vehicle.setDaysInShop((int) this.getDifferenceDays(vehicle.getCreatedAt(), new Date()));
          if (vehicle.getRentalDate() != null)
            vehicle.setRentalCountDown((int) this.getDifferenceDaysRental(new Date(), vehicle.getRentalDate()));
          if (vehicle.getTargetDate() != null)
            vehicle.setTargetDateCountDown((int) this.getDifferenceDaysRental(new Date(), vehicle.getTargetDate()));

          vehicle.setDaysInShopPrecentage(vehicle.getDaysInShop() * 100 / 14);

          String phoneNumber = "" + vehicle.getCustomer().getPhone();

          try {
            phoneNumber = vehicle.getCustomer().getPhone().replaceFirst("(\\d{3})(\\d{3})(\\d+)", "$1-$2-$3"); // 123-456-7890
          } catch (Exception e) {

          }

          returnStr = "Vehicle: " + vehicle.getYear() + " " + vehicle.getMake() + " " + vehicle.getModel() + " "
              + vehicle.getColor() + "" +
              " Status: " + statusName + " " +
              " Customer: " + vehicle.getCustomer().getTitle() + " " + vehicle.getCustomer().getFirstName() + " "
              + vehicle.getCustomer().getLastName() + " ( " + phoneNumber + " ),";

          String additionalInfo = "";

          if (vehicle.getAssignedTo() > 0) {
            additionalInfo = additionalInfo + " Technician: " + emplyString + ", ";
          }

          SimpleDateFormat outputDateFormat = new SimpleDateFormat("dd/MM/YYYY");
          vehicle.setDaysInShop((int) this.getDifferenceDays(vehicle.getCreatedAt(), new Date()));
          additionalInfo = additionalInfo + " been in shop since " + outputDateFormat.format(vehicle.getCreatedAt())
              + " for "
              + vehicle.getDaysInShop() + " days, ";
          ;

          if (vehicle.getInsuranceCompany() != null && vehicle.getInsuranceCompany() != "") {
            additionalInfo = additionalInfo + " Insurance Provider: " + vehicle.getInsuranceCompany().toUpperCase()
                + ",";
          }

          if (vehicle.getLoanerCarName() != null && vehicle.getLoanerCarName() != ""
              && vehicle.getRentalDate() != null) {
            vehicle.setRentalCountDown((int) this.getDifferenceDaysRental(new Date(), vehicle.getRentalDate()));
            if (vehicle.getRentalCountDown() >= 0) {
              additionalInfo = additionalInfo + " Rental Company: " + vehicle.getLoanerCarName().toUpperCase() + ""
                  + " will be expired in "
                  + vehicle.getRentalCountDown() + " days,";
            } else {
              additionalInfo = additionalInfo + " Rental Company: " + vehicle.getLoanerCarName().toUpperCase() + ""
                  + " expired for "
                  + (0 - vehicle.getRentalCountDown()) + " days,";
            }
          }

          if (vehicle.getTargetDate() != null) {
            vehicle.setTargetDateCountDown((int) this.getDifferenceDaysRental(new Date(), vehicle.getTargetDate()));

            if (vehicle.getTargetDateCountDown() >= 0)
              additionalInfo = additionalInfo + "  and delivery due in "
                  + vehicle.getTargetDateCountDown() + " days";
            else {
              additionalInfo = additionalInfo + "  and delivery overdue for "
                  + (0 - vehicle.getTargetDateCountDown()) + " days";
            }
          }

          returnStr = returnStr + additionalInfo + "";
          this.setShowInSearchImageId(vehicle);
          vehicle.setSerachString(returnStr);

        }

      }

    }
    // return new ResponseEntity<>(returnStr, HttpStatus.OK);
    return new ResponseEntity<>(vehicles, HttpStatus.OK);

  }

  @GetMapping("/search/employee/{uuid}")
  public ResponseEntity<List<Vehicle>> searchEmployeeVehiclesByUUID(@PathVariable("uuid") String uuid) {

    LOG.info(uuid);

    List<Vehicle> vehicles = new ArrayList<Vehicle>();
    String returnStr = "";

    Optional<Employee> employeeOptional = this.employeeRepository.findByToken(uuid);

    if (employeeOptional.isPresent()) {

      Employee employee2 = employeeOptional.get();
      vehicles = this.vehicleRepository.findByAssignedToAndCompanyIdAndArchived(employee2.getId(),
          employee2.getCompanyId(), false);

      // vehicles =
      // this.vehicleRepository.findByCompanyIdAndArchived(companyOptional.get().getId(),
      // false);
      List<Status> statuss = this.statusRepository.findByCompanyIdOrderByNameAsc(employee2.getCompanyId());
      List<Employee> employees = this.employeeRepository
          .findByCompanyIdOrderByFirstNameAsc(employee2.getCompanyId());
      List<JobRequestType> jobRequestTypes = this.jobRequestTypeRepository
          .findByCompanyIdOrderByNameAsc(employee2.getCompanyId());

      if (vehicles.isEmpty()) {
        return new ResponseEntity<>(vehicles, HttpStatus.OK);
      } else {

        for (Vehicle vehicle : vehicles) {

          if (vehicle.getToken() == null || vehicle.getToken().equals("")) {
            String randomCode = UUID.randomUUID().toString();
            vehicle.setToken(randomCode);
            this.vehicleRepository.save(vehicle);
          }

          String statusName = "No Status";
          String emplyString = "Nobody";

          for (Status status : statuss) {
            if (status.getId() == vehicle.getStatus()) {
              statusName = status.getName();
              vehicle.setStatusString(statusName);
              // vehicle.setSerachString(statusName);
            }
          }

          for (JobRequestType jobRequestType : jobRequestTypes) {
            if (jobRequestType.getId() == vehicle.getJobRequestType()) {
              vehicle.setJobReqeustTypeString(jobRequestType.getName());
            }
          }

          String allTechnicians = "";
          for (Employee employee : employees) {
            allTechnicians = allTechnicians + employee.getFirstName() + " " + employee.getLastName() + ",";
            if (employee.getId() == vehicle.getAssignedTo()) {
              emplyString = employee.getFirstName() + " " + employee.getLastName();
              // allTechnicians = allTechnicians + emplyString + ",";
              vehicle.setEmployeeString(emplyString);
              // vehicle.setSerachString(emplyString);
            }
          }
          if (!allTechnicians.equals(""))
            allTechnicians = "Technicians: " + allTechnicians;

          // vehicle.setVin(allTechnicians);
          vehicle.setReason(allTechnicians);

          vehicle.setDaysInShop((int) this.getDifferenceDays(vehicle.getCreatedAt(), new Date()));
          if (vehicle.getRentalDate() != null)
            vehicle.setRentalCountDown((int) this.getDifferenceDaysRental(new Date(), vehicle.getRentalDate()));
          if (vehicle.getTargetDate() != null)
            vehicle.setTargetDateCountDown((int) this.getDifferenceDaysRental(new Date(), vehicle.getTargetDate()));

          vehicle.setDaysInShopPrecentage(vehicle.getDaysInShop() * 100 / 14);

          String phoneNumber = "" + vehicle.getCustomer().getPhone();

          try {
            phoneNumber = vehicle.getCustomer().getPhone().replaceFirst("(\\d{3})(\\d{3})(\\d+)", "$1-$2-$3"); // 123-456-7890
          } catch (Exception e) {

          }

          returnStr = "Vehicle: " + vehicle.getYear() + " " + vehicle.getMake() + " " + vehicle.getModel() + " "
              + vehicle.getColor() + "" +
              " Status: " + statusName + " " +
              " Customer: " + vehicle.getCustomer().getTitle() + " " + vehicle.getCustomer().getFirstName() + " "
              + vehicle.getCustomer().getLastName() + " ( " + phoneNumber + " ),";

          String additionalInfo = "";

          if (vehicle.getAssignedTo() > 0) {
            additionalInfo = additionalInfo + " Technician: " + emplyString + ", ";
          }

          SimpleDateFormat outputDateFormat = new SimpleDateFormat("dd/MM/YYYY");
          vehicle.setDaysInShop((int) this.getDifferenceDays(vehicle.getCreatedAt(), new Date()));
          additionalInfo = additionalInfo + " been in shop since " + outputDateFormat.format(vehicle.getCreatedAt())
              + " for "
              + vehicle.getDaysInShop() + " days, ";
          ;

          if (vehicle.getInsuranceCompany() != null && vehicle.getInsuranceCompany() != "") {
            additionalInfo = additionalInfo + " Insurance Provider: " + vehicle.getInsuranceCompany().toUpperCase()
                + ",";
          }

          if (vehicle.getLoanerCarName() != null && vehicle.getLoanerCarName() != ""
              && vehicle.getRentalDate() != null) {
            vehicle.setRentalCountDown((int) this.getDifferenceDaysRental(new Date(), vehicle.getRentalDate()));
            if (vehicle.getRentalCountDown() >= 0) {
              additionalInfo = additionalInfo + " Rental Company: " + vehicle.getLoanerCarName().toUpperCase() + ""
                  + " will be expired in "
                  + vehicle.getRentalCountDown() + " days,";
            } else {
              additionalInfo = additionalInfo + " Rental Company: " + vehicle.getLoanerCarName().toUpperCase() + ""
                  + " expired for "
                  + (0 - vehicle.getRentalCountDown()) + " days,";
            }
          }

          if (vehicle.getTargetDate() != null) {
            vehicle.setTargetDateCountDown((int) this.getDifferenceDaysRental(new Date(), vehicle.getTargetDate()));

            if (vehicle.getTargetDateCountDown() >= 0)
              additionalInfo = additionalInfo + "  and delivery due in "
                  + vehicle.getTargetDateCountDown() + " days";
            else {
              additionalInfo = additionalInfo + "  and delivery overdue for "
                  + (0 - vehicle.getTargetDateCountDown()) + " days";
            }
          }

          returnStr = returnStr + additionalInfo + "";
          this.setShowInSearchImageId(vehicle);
          vehicle.setSerachString(returnStr);

        }

      }

    }
    // return new ResponseEntity<>(returnStr, HttpStatus.OK);
    return new ResponseEntity<>(vehicles, HttpStatus.OK);

  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<?> deleteVehicle(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<Vehicle> vehicleOptoiOptional = this.vehicleRepository.findById(id);
    Vehicle vehicle = new Vehicle();
    if (vehicleOptoiOptional.isPresent()) {
      vehicle = vehicleOptoiOptional.get();

      // first remove all vehicle_services stuff
      try {
        vehicle.setServices(null);
        this.vehicleRepository.save(vehicle);
      } catch (Exception ex) {

      }
      try {
        // remove all job assignment
        List<Job> jobs = this.jobRepository.findByVehicleId(id);

        for (Job job : jobs) {
          this.jobRepository.delete(job);
        }
      } catch (Exception ex) {

      }

      for (ImageModelVehicle imageModel : vehicle.getImageModels()) {
        try {

          try {
            this.imageModelVehicleRepository.delete(imageModel);
          } catch (Exception ex) {

          }
          File f = new File(this.filePath + this.imageNamePrefix + imageModel.getId() + ".jpeg"); // file
                                                                                                  // to be
                                                                                                  // delete
          if (f.delete()) // returns Boolean value
          {
            System.out.println(f.getName() + " deleted"); // getting and printing the file name
          }

        } catch (Exception e) {

        }

      }

      this.vehicleRepository.delete(vehicle);

    }
    return new ResponseEntity<>(null, HttpStatus.OK);
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

}