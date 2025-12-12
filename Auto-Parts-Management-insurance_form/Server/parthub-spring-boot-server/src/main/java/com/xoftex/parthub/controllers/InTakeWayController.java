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
import org.springframework.security.authentication.AuthenticationManager;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

import com.xoftex.parthub.models.InTakeWay;

import com.xoftex.parthub.models.User;

import com.xoftex.parthub.repository.InTakeWayRepository;

import com.xoftex.parthub.repository.RoleRepository;

import com.xoftex.parthub.repository.UserRepository;
import com.xoftex.parthub.repository.VehicleRepository;
import com.xoftex.parthub.security.jwt.JwtUtils;

//for Angular Client (withCredentials)
//@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
// @CrossOrigin(origins = "*", maxAge = 3600)
@CrossOrigin("*")
@RestController
@RequestMapping("/api/intakeways")
public class InTakeWayController {
  @Autowired
  AuthenticationManager authenticationManager;

  @Autowired
  UserRepository userRepository;

  @Autowired
  RoleRepository roleRepository;

  @Autowired
  VehicleRepository vehicleRepository;

  @Autowired
  InTakeWayRepository inTakeWayRepository;

  @Autowired
  JwtUtils jwtUtils;

  private static final Logger LOG = LoggerFactory.getLogger(InTakeWayController.class);

  @PostMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<InTakeWay> createAndUpdateInTakeWay(@PathVariable("id") long id,
      @RequestBody InTakeWay inTakeWayIn) {

    Optional<User> userOptional = this.userRepository.findById(id);
    InTakeWay inTakeWay = new InTakeWay();

    if (userOptional.isPresent()) {

      inTakeWayIn.setUserId(id);

      inTakeWay = this.inTakeWayRepository.save(inTakeWayIn);

    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>(inTakeWay, HttpStatus.CREATED);

  }

  @GetMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<InTakeWay> getInTakeWay(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<InTakeWay> inTakeWayOptional = this.inTakeWayRepository.findById(id);
    InTakeWay inTakeWay = new InTakeWay();
    if (inTakeWayOptional.isPresent()) {
      inTakeWay = inTakeWayOptional.get();
      return new ResponseEntity<>(inTakeWay, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }

  @GetMapping("/company/{companyId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<InTakeWay>> getCompanyInTakeWays(@PathVariable("companyId") long companyId) {

    List<InTakeWay> inTakeWays = new ArrayList<InTakeWay>();

    inTakeWays = this.inTakeWayRepository.findByCompanyIdOrderByNameAsc(companyId);
    if (inTakeWays.isEmpty()) {
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    return new ResponseEntity<>(inTakeWays, HttpStatus.OK);
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<?> deleteInTakeWay(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<InTakeWay> inTakeWayOptional = this.inTakeWayRepository.findById(id);
    InTakeWay inTakeWay = new InTakeWay();
    if (inTakeWayOptional.isPresent()) {
      inTakeWay = inTakeWayOptional.get();
      this.inTakeWayRepository.delete(inTakeWay);

      return new ResponseEntity<>(null, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }
}