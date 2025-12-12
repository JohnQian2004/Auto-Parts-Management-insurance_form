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

import com.xoftex.parthub.models.Location;

import com.xoftex.parthub.models.User;

import com.xoftex.parthub.repository.LocationRepository;
import com.xoftex.parthub.repository.UserRepository;

//for Angular Client (withCredentials)
//@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
// @CrossOrigin(origins = "*", maxAge = 3600)
@CrossOrigin("*")
@RestController
@RequestMapping("/api/locations")
public class LocationController {

  @Autowired
  UserRepository userRepository;

  @Autowired
  LocationRepository locationRepository;

  private static final Logger LOG = LoggerFactory.getLogger(UserController.class);

  @PostMapping("/{id}")
  public ResponseEntity<Location> createAndUpdateLocation(@PathVariable("id") long id,
      @RequestBody Location locationIn) {

    Optional<User> userOptional = this.userRepository.findById(id);
    Location location = new Location();

    if (userOptional.isPresent()) {

      locationIn.setUserId(id);

      location = this.locationRepository.save(locationIn);

    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>(location, HttpStatus.CREATED);

  }

  @GetMapping("/{id}")
  public ResponseEntity<Location> getLocation(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<Location> locationOptional = this.locationRepository.findById(id);
    Location location = new Location();
    if (locationOptional.isPresent()) {
      location = locationOptional.get();
      return new ResponseEntity<>(location, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }

  @GetMapping("/company/{companyId}")
  public ResponseEntity<List<Location>> getComponentLocations(@PathVariable("companyId") long companyId) {

    List<Location> locations = new ArrayList<Location>();

    locations = this.locationRepository.findByCompanyIdOrderByNameAsc(companyId);
    if (locations.isEmpty()) {
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    return new ResponseEntity<>(locations, HttpStatus.OK);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteLocation(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<Location> locationOptional = this.locationRepository.findById(id);
    Location location = new Location();
    if (locationOptional.isPresent()) {
      location = locationOptional.get();
      this.locationRepository.delete(location);

      return new ResponseEntity<>(null, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }
}