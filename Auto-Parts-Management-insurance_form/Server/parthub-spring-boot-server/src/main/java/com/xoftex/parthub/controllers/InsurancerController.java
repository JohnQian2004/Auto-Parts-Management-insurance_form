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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

import com.xoftex.parthub.models.Insurancer;

import com.xoftex.parthub.models.User;

import com.xoftex.parthub.services.InsurancerService;

import com.xoftex.parthub.repository.RoleRepository;

import com.xoftex.parthub.repository.UserRepository;
import com.xoftex.parthub.security.jwt.JwtUtils;

//for Angular Client (withCredentials)
//@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
// @CrossOrigin(origins = "*", maxAge = 3600)
@CrossOrigin("*")
@RestController
@RequestMapping("/api/insurancers")
public class InsurancerController {

  @Autowired
  UserRepository userRepository;

  @Autowired
  RoleRepository roleRepository;

  @Autowired
  InsurancerService insurancerService;

  @Autowired
  JwtUtils jwtUtils;

  private static final Logger LOG = LoggerFactory.getLogger(InsurancerController.class);

  @PostMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<Insurancer> createAndUpdateInsurancer(@PathVariable("id") long id,
      @RequestBody Insurancer InsurancerIn) {

    Optional<User> userOptional = this.userRepository.findById(id);
    Insurancer insurancer = new Insurancer();

    if (userOptional.isPresent()) {

      InsurancerIn.setUserId(id);

      insurancer = this.insurancerService.createInsurancer(id, InsurancerIn);

    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>(insurancer, HttpStatus.CREATED);

  }

  @GetMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<Insurancer> getInsurancer(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<Insurancer> insurancerOptional = this.insurancerService.getInsurancer(id);
    Insurancer insurancer = new Insurancer();
    if (insurancerOptional.isPresent()) {
      insurancer = insurancerOptional.get();
      return new ResponseEntity<>(insurancer, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }

  @GetMapping("/company/{companyId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<Insurancer>> getCompanyInsurancers(@PathVariable("companyId") long companyId) {

    List<Insurancer> insurancers = new ArrayList<Insurancer>();

    insurancers = this.insurancerService.getAllCompanyInsurancers(companyId);
    if (insurancers.isEmpty()) {
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    return new ResponseEntity<>(insurancers, HttpStatus.OK);
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<?> deleteInsurancer(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<Insurancer> insurancerOptional = this.insurancerService.getInsurancer(id);
    Insurancer insurancer = new Insurancer();
    if (insurancerOptional.isPresent()) {
      insurancer = insurancerOptional.get();
      this.insurancerService.deleteInsurancer(id);

      return new ResponseEntity<>(null, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }

  // New endpoints for insurance system
  @GetMapping("/token/{token}")
  public ResponseEntity<Insurancer> getInsurancerByToken(@PathVariable("token") String token) {
    LOG.info("Getting insurancer by token: {}", token);
    Optional<Insurancer> insurancerOptional = this.insurancerService.getInsurancerByToken(token);
    if (insurancerOptional.isPresent()) {
      Insurancer insurancer = insurancerOptional.get();
      return new ResponseEntity<>(insurancer, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
  }

  @GetMapping("/name/{name}")
  public ResponseEntity<Insurancer> getInsurancerByName(@PathVariable("name") String name) {
    LOG.info("Getting insurancer by name: {}", name);
    Optional<Insurancer> insurancerOptional = this.insurancerService.getInsurancerByName(name);
    if (insurancerOptional.isPresent()) {
      Insurancer insurancer = insurancerOptional.get();
      return new ResponseEntity<>(insurancer, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
  }

  @PutMapping("/{id}/token")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<Insurancer> updateInsurancerToken(@PathVariable("id") long id, 
                                                         @RequestBody Insurancer tokenUpdate) {
    LOG.info("Updating token for insurancer: {}", id);
    Optional<Insurancer> insurancerOptional = this.insurancerService.getInsurancer(id);
    if (insurancerOptional.isPresent()) {
      Insurancer insurancer = insurancerOptional.get();
      insurancer.setToken(tokenUpdate.getToken());
      Insurancer updatedInsurancer = this.insurancerService.updateInsurancer(id, insurancer);
      return new ResponseEntity<>(updatedInsurancer, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
  }
}