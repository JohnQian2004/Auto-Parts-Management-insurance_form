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

import com.xoftex.parthub.models.Rental;

import com.xoftex.parthub.models.User;

import com.xoftex.parthub.repository.RentalRepository;

import com.xoftex.parthub.repository.RoleRepository;

import com.xoftex.parthub.repository.UserRepository;
import com.xoftex.parthub.security.jwt.JwtUtils;

//for Angular Client (withCredentials)
//@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
// @CrossOrigin(origins = "*", maxAge = 3600)
@CrossOrigin("*")
@RestController
@RequestMapping("/api/rentals")
public class RentalController {

  @Autowired
  UserRepository userRepository;

  @Autowired
  RoleRepository roleRepository;

  @Autowired
  RentalRepository rentalRepository;

  @Autowired
  JwtUtils jwtUtils;

  private static final Logger LOG = LoggerFactory.getLogger(RentalController.class);

  @PostMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<Rental> createAndUpdateRental(@PathVariable("id") long id,
      @RequestBody Rental rentalIn) {

    Optional<User> userOptional = this.userRepository.findById(id);
    Rental rental = new Rental();

    if (userOptional.isPresent()) {

      rentalIn.setUserId(id);

      rental = this.rentalRepository.save(rentalIn);

    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>(rental, HttpStatus.CREATED);

  }

  @GetMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<Rental> getRental(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<Rental> rentalOptional = this.rentalRepository.findById(id);
    Rental rental = new Rental();
    if (rentalOptional.isPresent()) {
      rental = rentalOptional.get();
      return new ResponseEntity<>(rental, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }

  @GetMapping("/company/{companyId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<Rental>> getCompanyRentals(@PathVariable("companyId") long companyId) {

    List<Rental> rentals = new ArrayList<Rental>();

    rentals = this.rentalRepository.findByCompanyIdOrderByNameAsc(companyId);
    if (rentals.isEmpty()) {
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    return new ResponseEntity<>(rentals, HttpStatus.OK);
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<?> deleteRental(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<Rental> rentalOptional = this.rentalRepository.findById(id);
    Rental rental = new Rental();
    if (rentalOptional.isPresent()) {
      rental = rentalOptional.get();
      this.rentalRepository.delete(rental);

      return new ResponseEntity<>(null, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }
}