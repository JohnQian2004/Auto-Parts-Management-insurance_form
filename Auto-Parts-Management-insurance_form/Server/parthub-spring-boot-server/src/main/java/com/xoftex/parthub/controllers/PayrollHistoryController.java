package com.xoftex.parthub.controllers;

import java.lang.StackWalker.Option;
import java.net.Authenticator.RequestorType;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

import com.xoftex.parthub.models.Employee;
import com.xoftex.parthub.models.Job;
import com.xoftex.parthub.models.JobRequestType;
import com.xoftex.parthub.models.PaymentMethod;
import com.xoftex.parthub.models.PayrollHistory;
import com.xoftex.parthub.models.Status;
import com.xoftex.parthub.models.User;
import com.xoftex.parthub.models.Vehicle;
import com.xoftex.parthub.repository.EmployeeRepository;
import com.xoftex.parthub.repository.JobRepository;
import com.xoftex.parthub.repository.JobRequestTypeRepository;
import com.xoftex.parthub.repository.PaymentMethodRepository;
import com.xoftex.parthub.repository.PayrollHistoryRepository;
import com.xoftex.parthub.repository.RoleRepository;
import com.xoftex.parthub.repository.StatusRepository;
import com.xoftex.parthub.repository.UserRepository;
import com.xoftex.parthub.repository.VehicleRepository;

//for Angular Client (withCredentials)
//@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
// @CrossOrigin(origins = "*", maxAge = 3600)
@CrossOrigin("*")
@RestController
@RequestMapping("/api/payrollhistories")
public class PayrollHistoryController {
  @Autowired
  AuthenticationManager authenticationManager;

  @Autowired
  UserRepository userRepository;

  @Autowired
  RoleRepository roleRepository;

  @Autowired
  PaymentMethodRepository paymentMethodRepository;

  @Autowired
  PayrollHistoryRepository payrollHistoryRepository;

  @Autowired
  EmployeeRepository employeeRepository;

  @Autowired
  JobRepository jobRepository;

  @Autowired
  VehicleRepository vehicleRepository;

  @Autowired
  StatusRepository statusRepository;

  @Autowired
  JobRequestTypeRepository jobRequestTypeRepository;

  private static final Logger LOG = LoggerFactory.getLogger(PayrollHistoryController.class);

  @PostMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<PayrollHistory> createAndUpdatePayrollHistory(@PathVariable("id") long id,
      @RequestBody PayrollHistory payrollHistoryIn) {

    Optional<User> userOptional = this.userRepository.findById(id);
    PayrollHistory payrollHistory = new PayrollHistory();

    Optional<Job> jobsOptional = this.jobRepository.findById(payrollHistory.getJobId());

    if (userOptional.isPresent()) {

      payrollHistoryIn.setUserId(id);

      payrollHistory = this.payrollHistoryRepository.save(payrollHistoryIn);

      if (jobsOptional.isPresent()) {
        Job job = jobsOptional.get();
        job.setPaidWeek(payrollHistory.getWeek());
        job.setPaidDate(new Date());
        this.jobRepository.save(job);
      }

      getAdditionalInfo(payrollHistory);

    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>(payrollHistory, HttpStatus.CREATED);

  }

  @GetMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<PayrollHistory> getPayrollHistory(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<PayrollHistory> PaymentStatusOptional = this.payrollHistoryRepository.findById(id);
    PayrollHistory payrollHistory = new PayrollHistory();
    if (PaymentStatusOptional.isPresent()) {
      payrollHistory = PaymentStatusOptional.get();
      getAdditionalInfo(payrollHistory);
      return new ResponseEntity<>(payrollHistory, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }

  @GetMapping("/search/{jobId}/{companyId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<PayrollHistory> searchPayrollHistory(@PathVariable("jobId") long jobId,
      @PathVariable("companyId") long companyId) {
    LOG.info("" + jobId);

    Optional<PayrollHistory> PaymentStatusOptional = this.payrollHistoryRepository.findByJobIdAndCompanyId(jobId,
        companyId);
    PayrollHistory payrollHistory = new PayrollHistory();
    if (PaymentStatusOptional.isPresent()) {
      payrollHistory = PaymentStatusOptional.get();
      getAdditionalInfo(payrollHistory);
      return new ResponseEntity<>(payrollHistory, HttpStatus.OK);
    } else {

      payrollHistory.setJobId(jobId);
      payrollHistory.setCompanyId(companyId);

      getAdditionalInfo(payrollHistory);

      return new ResponseEntity<>(payrollHistory, HttpStatus.OK);
    }

  }

  @GetMapping("/company/{companyId}/{year}/{weekNumber}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<PayrollHistory>> getComponentPayrollHistories(@PathVariable("companyId") long companyId,
      @PathVariable("year") int year, @PathVariable("weekNumber") int weekNumber) {

    List<PayrollHistory> payrollHistories = new ArrayList<PayrollHistory>();

    payrollHistories = this.payrollHistoryRepository.findByYearAndWeekAndCompanyId(year, weekNumber, companyId);
    if (payrollHistories.isEmpty()) {
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    for (PayrollHistory payrollHistory : payrollHistories) {
      getAdditionalInfo(payrollHistory);
    }

    return new ResponseEntity<>(payrollHistories, HttpStatus.OK);
  }

  @GetMapping("/employee/{uuidEmployee}/{year}/{weekNumber}")
  // @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<PayrollHistory>> getComponentPayrollHistoriesWithUuidEmployee(
      @PathVariable("uuidEmployee") String uuidEmployee,
      @PathVariable("year") int year, @PathVariable("weekNumber") int weekNumber) {

    List<PayrollHistory> payrollHistories = new ArrayList<PayrollHistory>();
    List<PayrollHistory> payrollHistoriesEmployee = new ArrayList<PayrollHistory>();
    Optional<Employee> employeeOptional = this.employeeRepository.findByToken(uuidEmployee);
    List<Status> statuss = this.statusRepository.findByCompanyIdOrderByNameAsc(employeeOptional.get().getCompanyId());

    List<JobRequestType> jobRequestTypes = this.jobRequestTypeRepository
        .findByCompanyIdOrderByNameAsc(employeeOptional.get().getCompanyId());

    if (employeeOptional.isPresent()) {
      payrollHistories = this.payrollHistoryRepository.findByYearAndWeekAndCompanyId(year, weekNumber,
          employeeOptional.get().getCompanyId());
      if (payrollHistories.isEmpty()) {
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
      }

      for (PayrollHistory payrollHistory : payrollHistories) {
        Optional<Job> jobOptional = this.jobRepository.findById(payrollHistory.getJobId());
        if (jobOptional.isPresent()) {
          if (jobOptional.get().getEmployeeId() == employeeOptional.get().getId()) {
            getAdditionalInfoForStatusAndRequestType(payrollHistory, statuss, jobRequestTypes);
            payrollHistoriesEmployee.add(payrollHistory);

          }
        }

      }
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    return new ResponseEntity<>(payrollHistoriesEmployee, HttpStatus.OK);
  }

  private void getAdditionalInfo(PayrollHistory payrollHistory) {
    Optional<Job> jobOptional = this.jobRepository.findById(payrollHistory.getJobId());
    if (jobOptional.isPresent()) {
      payrollHistory.job = jobOptional.get();

      payrollHistory.employeeId = jobOptional.get().getEmployeeId();

      Optional<Vehicle> vehicleOptional = this.vehicleRepository.findById(jobOptional.get().getVehicleId());
      if (vehicleOptional.isPresent()) {
        payrollHistory.vehicle = vehicleOptional.get();

      }
    }
  }

  private void getAdditionalInfoForStatusAndRequestType(PayrollHistory payrollHistory, List<Status> statuss,
      List<JobRequestType> jobRequestTypes) {
    Optional<Job> jobOptional = this.jobRepository.findById(payrollHistory.getJobId());
    if (jobOptional.isPresent()) {
      payrollHistory.job = jobOptional.get();

      payrollHistory.employeeId = jobOptional.get().getEmployeeId();

      Optional<Vehicle> vehicleOptional = this.vehicleRepository.findById(jobOptional.get().getVehicleId());
      if (vehicleOptional.isPresent()) {
        payrollHistory.vehicle = vehicleOptional.get();
        for (Status status : statuss) {
          if (status.getId() == payrollHistory.vehicle.getStatus()) {

            payrollHistory.vehicle.setStatusString(status.getName());
            // vehicle.setSerachString(statusName);
          }
        }

        for (JobRequestType jobRequestType : jobRequestTypes) {
          if (jobRequestType.getId() == payrollHistory.vehicle.getJobRequestType()) {
            payrollHistory.vehicle.setJobReqeustTypeString(jobRequestType.getName());
          }
        }
      }
    }
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<?> deletePayrollHistory(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<PayrollHistory> payRollHistoryptional = this.payrollHistoryRepository.findById(id);
    PayrollHistory paymentMethod = new PayrollHistory();
    if (payRollHistoryptional.isPresent()) {
      paymentMethod = payRollHistoryptional.get();
      this.payrollHistoryRepository.delete(paymentMethod);

      return new ResponseEntity<>(null, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }
}