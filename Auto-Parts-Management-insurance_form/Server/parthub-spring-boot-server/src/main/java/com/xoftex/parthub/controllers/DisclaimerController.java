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

import com.xoftex.parthub.models.Disclaimer;

import com.xoftex.parthub.models.User;
import com.xoftex.parthub.repository.DisclaimerRepository;
 

import com.xoftex.parthub.repository.RoleRepository;

import com.xoftex.parthub.repository.UserRepository;
 
import com.xoftex.parthub.security.jwt.JwtUtils;

//for Angular Client (withCredentials)
//@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
// @CrossOrigin(origins = "*", maxAge = 3600)
@CrossOrigin("*")
@RestController
@RequestMapping("/api/disclaimers")
public class DisclaimerController {
  @Autowired
  AuthenticationManager authenticationManager;

  @Autowired
  UserRepository userRepository;

  @Autowired
  RoleRepository roleRepository;

  @Autowired
  DisclaimerRepository disclaimerRepository;

  @Autowired
  JwtUtils jwtUtils;

  private static final Logger LOG = LoggerFactory.getLogger(DisclaimerController.class);

  @PostMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<Disclaimer> createAndUpdateDisclaimer(@PathVariable("id") long id,
      @RequestBody Disclaimer disclaimerIn) {

    Optional<User> userOptional = this.userRepository.findById(id);
    Disclaimer disclaimer = new Disclaimer();

    if (userOptional.isPresent()) {

      disclaimerIn.setUserId(id);

      disclaimer = this.disclaimerRepository.save(disclaimerIn);

      // make sure only one is set as default
      if (disclaimer.isDefault == true) {
        List<Disclaimer> disclaimers = this.disclaimerRepository
            .findByCompanyIdOrderByNameAsc(disclaimer.getCompanyId());

        for (Disclaimer disclaimer2 : disclaimers) {
          if (disclaimer2.isDefault == true && disclaimer2.getId() != disclaimer.getId()) {
            disclaimer2.isDefault = false;
            this.disclaimerRepository.save(disclaimer2);
          }

        }
      }

    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>(disclaimer, HttpStatus.CREATED);

  }

  @GetMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<Disclaimer> getDisclaimer(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<Disclaimer> disclaimerOptional = this.disclaimerRepository.findById(id);
    Disclaimer disclaimer = new Disclaimer();
    if (disclaimerOptional.isPresent()) {
      disclaimer = disclaimerOptional.get();
      return new ResponseEntity<>(disclaimer, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }

  @GetMapping("/company/{companyId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<Disclaimer>> getCompanyDisclaimers(@PathVariable("companyId") long companyId) {

    List<Disclaimer> disclaimers = new ArrayList<Disclaimer>();

    disclaimers = this.disclaimerRepository.findByCompanyIdOrderByNameAsc(companyId);
    if (disclaimers.isEmpty()) {
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    return new ResponseEntity<>(disclaimers, HttpStatus.OK);
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<?> deleteDisclaimer(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<Disclaimer> disclaimerOptional = this.disclaimerRepository.findById(id);
    Disclaimer disclaimer = new Disclaimer();
    if (disclaimerOptional.isPresent()) {
      disclaimer = disclaimerOptional.get();
      this.disclaimerRepository.delete(disclaimer);

      return new ResponseEntity<>(null, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }
}