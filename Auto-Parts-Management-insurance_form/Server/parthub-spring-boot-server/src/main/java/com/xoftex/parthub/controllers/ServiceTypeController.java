package com.xoftex.parthub.controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

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

 
import com.xoftex.parthub.models.ServiceType;
import com.xoftex.parthub.models.User;
 
import com.xoftex.parthub.repository.RoleRepository;
import com.xoftex.parthub.repository.ServiceTypeRepository;
import com.xoftex.parthub.repository.UserRepository;

//for Angular Client (withCredentials)
//@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
// @CrossOrigin(origins = "*", maxAge = 3600)
@CrossOrigin("*")
@RestController
@RequestMapping("/api/servicetypes")
public class ServiceTypeController {

  @Autowired
  UserRepository userRepository;

  @Autowired
  RoleRepository roleRepository;

  @Autowired
  ServiceTypeRepository serviceTypeRepository;

  private static final Logger LOG = LoggerFactory.getLogger(ServiceTypeController.class);

  @PostMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<ServiceType> createAndUpdateServiceType(@PathVariable("id") long id,
      @RequestBody ServiceType serviceTypeIn) {

    Optional<User> userOptional = this.userRepository.findById(id);
    ServiceType serviceType = new ServiceType();

    if (userOptional.isPresent()) {

      serviceTypeIn.setUserId(id);

      serviceType = this.serviceTypeRepository.save(serviceTypeIn);

    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>(serviceType, HttpStatus.CREATED);

  }

  @GetMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<ServiceType> getServiceType(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<ServiceType> serviceTypeOptional = this.serviceTypeRepository.findById(id);
    ServiceType serviceType = new ServiceType();
    if (serviceTypeOptional.isPresent()) {
      serviceType = serviceTypeOptional.get();
      return new ResponseEntity<>(serviceType, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }

  @GetMapping("/company/{companyId}")
  // @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<ServiceType>> getAllServiceType(@PathVariable("companyId") long companyId) {

    List<ServiceType> serviceTypes = new ArrayList<ServiceType>();

    serviceTypes = this.serviceTypeRepository.findAllByOrderByNameAsc();
    if (serviceTypes.isEmpty()) {
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    return new ResponseEntity<>(serviceTypes, HttpStatus.OK);
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<?> deleteServiceType(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<ServiceType> serviceTypeOptional = this.serviceTypeRepository.findById(id);
    ServiceType serviceType = new ServiceType();
    if (serviceTypeOptional.isPresent()) {
      serviceType = serviceTypeOptional.get();
      this.serviceTypeRepository.delete(serviceType);

      return new ResponseEntity<>(null, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }
}