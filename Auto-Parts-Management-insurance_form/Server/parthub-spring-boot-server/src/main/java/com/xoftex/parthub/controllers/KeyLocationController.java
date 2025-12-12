package com.xoftex.parthub.controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

import com.xoftex.parthub.models.KeyLocation;
import com.xoftex.parthub.models.Location;

import com.xoftex.parthub.models.User;
import com.xoftex.parthub.repository.KeyLocationRepository;
import com.xoftex.parthub.repository.LocationRepository;
import com.xoftex.parthub.repository.UserRepository;

//for Angular Client (withCredentials)
//@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
// @CrossOrigin(origins = "*", maxAge = 3600)
@CrossOrigin("*")
@RestController
@RequestMapping("/api/keylocations")
public class KeyLocationController {

  @Autowired
  UserRepository userRepository;

  @Autowired
  LocationRepository locationRepository;

  @Autowired
  KeyLocationRepository keyLocationRepository;


  private static final Logger LOG = LoggerFactory.getLogger(KeyLocationController.class);

  @PostMapping("/{id}")
  public ResponseEntity<KeyLocation> createAndUpdateKeyLocation(@PathVariable("id") long id,
      @RequestBody KeyLocation keyLocationIn) {

    Optional<User> userOptional = this.userRepository.findById(id);
    KeyLocation location = new KeyLocation();

    if (userOptional.isPresent()) {

      keyLocationIn.setUserId(id);

      location = this.keyLocationRepository.save(keyLocationIn);

    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>(location, HttpStatus.CREATED);

  }

  @GetMapping("/{id}")
  public ResponseEntity<KeyLocation> getKeyLocation(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<KeyLocation> keyLocationOptional = this.keyLocationRepository.findById(id);
    KeyLocation keyLocation = new KeyLocation();
    if (keyLocationOptional.isPresent()) {
      keyLocation = keyLocationOptional.get();
      return new ResponseEntity<>(keyLocation, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }

  @GetMapping("/company/{companyId}")
  public ResponseEntity<List<KeyLocation>> getCompanyKeyLocations(@PathVariable("companyId") long companyId) {

    List<KeyLocation> keyLocations = new ArrayList<KeyLocation>();

    keyLocations = this.keyLocationRepository.findByCompanyIdOrderByNameAsc(companyId);
    if (keyLocations.isEmpty()) {
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    return new ResponseEntity<>(keyLocations, HttpStatus.OK);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteKeyLocation(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<KeyLocation> locationOptional = this.keyLocationRepository.findById(id);
    KeyLocation keyLocation = new KeyLocation();
    if (locationOptional.isPresent()) {
      keyLocation = locationOptional.get();
      this.keyLocationRepository.delete(keyLocation);

      return new ResponseEntity<>(null, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }
}