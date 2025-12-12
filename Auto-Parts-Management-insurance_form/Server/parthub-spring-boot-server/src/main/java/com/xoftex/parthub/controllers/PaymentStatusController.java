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

import com.xoftex.parthub.models.PaymentStatus;

import com.xoftex.parthub.models.User;

import com.xoftex.parthub.repository.PaymentStatusRepository;
import com.xoftex.parthub.repository.RoleRepository;

import com.xoftex.parthub.repository.UserRepository;

//for Angular Client (withCredentials)
//@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
// @CrossOrigin(origins = "*", maxAge = 3600)
@CrossOrigin("*")
@RestController
@RequestMapping("/api/paymentstatuss")
public class PaymentStatusController {

  @Autowired
  UserRepository userRepository;

  @Autowired
  RoleRepository roleRepository;

  @Autowired
  PaymentStatusRepository paymentStatusRepository;

  private static final Logger LOG = LoggerFactory.getLogger(UserController.class);

  @PostMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<PaymentStatus> createAndUpdatePaymentStatus(@PathVariable("id") long id,
      @RequestBody PaymentStatus paymentStatusIn) {

    Optional<User> userOptional = this.userRepository.findById(id);
    PaymentStatus paymentStatus = new PaymentStatus();

    if (userOptional.isPresent()) {

      paymentStatusIn.setUserId(id);

      paymentStatus = this.paymentStatusRepository.save(paymentStatusIn);

    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>(paymentStatus, HttpStatus.CREATED);

  }

  @GetMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<PaymentStatus> getPaymentStatus(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<PaymentStatus> paymentStatusOptional = this.paymentStatusRepository.findById(id);
    PaymentStatus paymentStatus = new PaymentStatus();
    if (paymentStatusOptional.isPresent()) {
      paymentStatus = paymentStatusOptional.get();
      return new ResponseEntity<>(paymentStatus, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }

  @GetMapping("/company/{companyId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<PaymentStatus>> getComponentPaymentStatuss(@PathVariable("companyId") long companyId) {

    List<PaymentStatus> paymentStatus = new ArrayList<PaymentStatus>();

    paymentStatus = this.paymentStatusRepository.findByCompanyIdOrderByNameAsc(companyId);
    if (paymentStatus.isEmpty()) {
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    return new ResponseEntity<>(paymentStatus, HttpStatus.OK);
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<?> deletePaymentStatus(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<PaymentStatus> paymentStatusOptional = this.paymentStatusRepository.findById(id);
    PaymentStatus paymentStatus = new PaymentStatus();
    if (paymentStatusOptional.isPresent()) {
      paymentStatus = paymentStatusOptional.get();
      this.paymentStatusRepository.delete(paymentStatus);

      return new ResponseEntity<>(null, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }
}