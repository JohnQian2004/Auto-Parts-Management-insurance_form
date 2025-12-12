package com.xoftex.parthub.controllers;

import java.util.ArrayList;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

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
import com.xoftex.parthub.models.Job;

import com.xoftex.parthub.models.Service;
import com.xoftex.parthub.models.User;
import com.xoftex.parthub.models.Vehicle;
import com.xoftex.parthub.models.VehicleHistory;
import com.xoftex.parthub.repository.CompanyRepository;
import com.xoftex.parthub.repository.JobRepository;
import com.xoftex.parthub.repository.RoleRepository;

import com.xoftex.parthub.repository.ServiceRepository;
import com.xoftex.parthub.repository.UserRepository;
import com.xoftex.parthub.repository.VehicleHistoryRepository;
import com.xoftex.parthub.repository.VehicleRepository;

//for Angular Client (withCredentials)
//@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
// @CrossOrigin(origins = "*", maxAge = 3600)
@CrossOrigin("*")
@RestController
@RequestMapping("/api/services")
public class ServiceController {

  @Autowired
  UserRepository userRepository;

  @Autowired
  RoleRepository roleRepository;

  @Autowired
  VehicleRepository vehicleRepository;

  @Autowired
  ServiceRepository serviceRepository;

  @Autowired
  JobRepository jobRepository;

  @Autowired
  VehicleHistoryRepository vehicleHistoryRepository;

  @Autowired
  CompanyRepository companyRepository;

  @Value("${image.root.path}")
  // String filePath = "C:\\Projects\\images\\";
  String filePath = "";

  String imageNamePrefix = "test_image_";

  private static final Logger LOG = LoggerFactory.getLogger(UserController.class);

  @PostMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<Service> createService(@PathVariable("id") long id, @RequestBody Service serviceIn) {

    Optional<User> userOptional = this.userRepository.findById(id);
    Service service = new Service();

    if (userOptional.isPresent()) {

      serviceIn.setUserId(id);
      service = this.serviceRepository.save(serviceIn);

    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>(service, HttpStatus.CREATED);

  }

  @GetMapping("/company/{companyId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<Service>> getAllServices(@PathVariable("companyId") long compayId) {

    List<Service> services = new ArrayList<Service>();
    this.serviceRepository.findByCompanyIdOrderByNameAsc(compayId).forEach(services::add);

    if (services.isEmpty()) {
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    return new ResponseEntity<>(services, HttpStatus.OK);
  }

  @GetMapping("/company/uuid/{uuid}")

  public ResponseEntity<List<Service>> getAllServicesUuid(@PathVariable("uuid") String uuid) {

    Optional<Company> companyOptional = this.companyRepository.findByToken(uuid);
    List<Service> services = new ArrayList<Service>();

    if (companyOptional.isPresent()) {

      this.serviceRepository.findByCompanyIdOrderByNameAsc(companyOptional.get().getId()).forEach(services::add);

      if (services.isEmpty()) {
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
      }
    }
    return new ResponseEntity<>(services, HttpStatus.OK);
  }

  @GetMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<Service> getService(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<Service> serviceOptional = this.serviceRepository.findById(id);
    Service service = new Service();
    if (serviceOptional.isPresent()) {
      service = serviceOptional.get();
      return new ResponseEntity<>(service, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<?> deleteService(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<Service> serviceOptional = this.serviceRepository.findById(id);
    Service service = new Service();
    if (serviceOptional.isPresent()) {
      service = serviceOptional.get();

      List<Job> jobs = this.jobRepository.findByServiceId(id);

      if (jobs != null && jobs.size() > 0) {
        for (Job job : jobs) {
          this.jobRepository.delete(job);
        }
      }

      for (Vehicle vehicle : service.getVehicles()) {
        for (Service service2 : vehicle.getServices()) {
          if (service2.getId() == id) {
            vehicle.getServices().remove(service2);
            this.vehicleRepository.save(vehicle);
          }
        }
      }
      // Optional<Vehicle> vehicleOptional =
      // this.vehicleRepository.findById(service.get());
      // this.serviceRepository.deleteById(service.getId());
      this.serviceRepository.delete(service);

    }
    return new ResponseEntity<>(null, HttpStatus.OK);
  }

  @PostMapping("/vehicle/{vehicleId}/{serviceId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<?> addVehicleService(@PathVariable("vehicleId") long vehicleId,
      @PathVariable("serviceId") long serviceId) {
    LOG.info(" vehicleId " + vehicleId + " serviceId " + serviceId);

    Optional<Service> serviceOptional = this.serviceRepository.findById(serviceId);
    Service service = new Service();
    if (serviceOptional.isPresent()) {
      service = serviceOptional.get();
      Optional<Vehicle> vehicleOptional = this.vehicleRepository.findById(vehicleId);
      if (vehicleOptional.isPresent()) {
        Vehicle vehicle = vehicleOptional.get();
        vehicle.getServices().add(service);
        this.vehicleRepository.save(vehicle);

        VehicleHistory vehicleHistory = new VehicleHistory();
        vehicleHistory.setName("service");
        vehicleHistory.setType(0); // 0) add 1) update 2) delete
        vehicleHistory.setUserId(0);
        vehicleHistory.setVehicleId(vehicle.getId());
        vehicleHistory.setValue("" + service.getName());
        this.vehicleHistoryRepository.save(vehicleHistory);

      } else {
        return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
      }

    }
    return new ResponseEntity<>(null, HttpStatus.OK);
  }

  // @PostMapping("/vehicle/{vehicleId}/{serviceId}")
  // public ResponseEntity<Job> addVehicleService(@PathVariable("vehicleId") long
  // vehicleId,
  // @PathVariable("serviceId") long serviceId) {
  // LOG.info(" vehicleId " + vehicleId + " serviceId " + serviceId);

  // Optional<Service> serviceOptional =
  // this.serviceRepository.findById(serviceId);
  // Service service = new Service();
  // Job job = new Job();
  // if (serviceOptional.isPresent()) {
  // service = serviceOptional.get();
  // Optional<Vehicle> vehicleOptional =
  // this.vehicleRepository.findById(vehicleId);
  // if (vehicleOptional.isPresent()) {
  // Vehicle vehicle = vehicleOptional.get();
  // vehicle.getServices().add(service);
  // this.vehicleRepository.save(vehicle);

  // job.setName(service.getName());
  // job.setUserId(0);
  // job.setServiceId(service.getId());
  // job.setEmployeeId(0);
  // job.setVehicleId(vehicleId);
  // job.setNotes("Please specify");
  // job = this.jobRepository.save(job);

  // VehicleHistory vehicleHistory = new VehicleHistory();
  // vehicleHistory.setName(service.getName());
  // vehicleHistory.setType(0); // 0) add 1) update 2) delete
  // vehicleHistory.setUserId(0);
  // vehicleHistory.setVehicleId(vehicle.getId());
  // vehicleHistory.setValue("" + service.getName());
  // this.vehicleHistoryRepository.save(vehicleHistory);

  // } else {
  // return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
  // }

  // }
  // return new ResponseEntity<>(job, HttpStatus.OK);
  // }

  @DeleteMapping("/vehicle/{vehicleId}/{serviceId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<?> deleteVehicleService(@PathVariable("vehicleId") long vehicleId,
      @PathVariable("serviceId") long serviceId) {

    LOG.info(" vehicleId " + vehicleId + " serviceId " + serviceId);

    Optional<Service> serviceOptional = this.serviceRepository.findById(serviceId);
    Service service = new Service();
    if (serviceOptional.isPresent()) {
      service = serviceOptional.get();

      List<Job> jobs = this.jobRepository.findByServiceIdAndVehicleId(serviceId, vehicleId);

      if (jobs != null && jobs.size() > 0) {
        for (Job job : jobs) {
          this.jobRepository.delete(job);
        }
      }

      Optional<Vehicle> vehicleOptional = this.vehicleRepository.findById(vehicleId);
      if (vehicleOptional.isPresent()) {
        Vehicle vehicle = vehicleOptional.get();
        Service service3 = null;
        for (Service service2 : vehicle.getServices()) {
          if (service2.getId() == serviceId) {
            service3 = service2;

          }
        }

        if (service3 != null)
          vehicle.getServices().remove(service3);

        this.vehicleRepository.save(vehicle);

        VehicleHistory vehicleHistory = new VehicleHistory();
        vehicleHistory.setName("service");
        vehicleHistory.setType(2); // 0) add 1) update 2) delete
        vehicleHistory.setUserId(0);
        vehicleHistory.setVehicleId(vehicle.getId());
        vehicleHistory.setValue("" + service3.getName());
        this.vehicleHistoryRepository.save(vehicleHistory);

      } else {
        return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
      }

    }
    return new ResponseEntity<>(null, HttpStatus.OK);
  }
}