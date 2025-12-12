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

import com.xoftex.parthub.models.PaymentType;

import com.xoftex.parthub.models.User;

import com.xoftex.parthub.repository.PaymentTypeRepository;

import com.xoftex.parthub.repository.RoleRepository;

import com.xoftex.parthub.repository.UserRepository;

//for Angular Client (withCredentials)
//@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
// @CrossOrigin(origins = "*", maxAge = 3600)
@CrossOrigin("*")
@RestController
@RequestMapping("/api/paymenttypes")
public class PaymentTypeController {

  @Autowired
  UserRepository userRepository;

  @Autowired
  RoleRepository roleRepository;

  @Autowired
  PaymentTypeRepository paymentTypeRepository;

  private static final Logger LOG = LoggerFactory.getLogger(UserController.class);

  @PostMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<PaymentType> createAndUpdatePaymentType(@PathVariable("id") long id,
      @RequestBody PaymentType paymentTypeIn) {

    Optional<User> userOptional = this.userRepository.findById(id);
    PaymentType paymentType = new PaymentType();

    if (userOptional.isPresent()) {

      paymentTypeIn.setUserId(id);

      paymentType = this.paymentTypeRepository.save(paymentTypeIn);

    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>(paymentType, HttpStatus.CREATED);

  }

  @GetMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<PaymentType> getPaymentType(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<PaymentType> PaymentStatusOptional = this.paymentTypeRepository.findById(id);
    PaymentType paymentStatus = new PaymentType();
    if (PaymentStatusOptional.isPresent()) {
      paymentStatus = PaymentStatusOptional.get();
      return new ResponseEntity<>(paymentStatus, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }

  @GetMapping("/company/{companyId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<PaymentType>> getComponentPaymentTypes(@PathVariable("companyId") long companyId) {

    List<PaymentType> paymentTypes = new ArrayList<PaymentType>();

    paymentTypes = this.paymentTypeRepository.findByCompanyIdOrderByNameAsc(companyId);
    if (paymentTypes.isEmpty()) {
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    return new ResponseEntity<>(paymentTypes, HttpStatus.OK);
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<?> deletePaymentType(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<PaymentType> paymentTypeOptional = this.paymentTypeRepository.findById(id);
    PaymentType paymentType = new PaymentType();
    if (paymentTypeOptional.isPresent()) {
      paymentType = paymentTypeOptional.get();
      this.paymentTypeRepository.delete(paymentType);

      return new ResponseEntity<>(null, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }
}