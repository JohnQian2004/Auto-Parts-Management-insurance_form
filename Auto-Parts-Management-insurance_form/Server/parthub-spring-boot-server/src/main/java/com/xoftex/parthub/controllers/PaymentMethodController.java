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

import com.xoftex.parthub.models.PaymentMethod;

import com.xoftex.parthub.models.User;

import com.xoftex.parthub.repository.PaymentMethodRepository;

import com.xoftex.parthub.repository.RoleRepository;

import com.xoftex.parthub.repository.UserRepository;

//for Angular Client (withCredentials)
//@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
// @CrossOrigin(origins = "*", maxAge = 3600)
@CrossOrigin("*")
@RestController
@RequestMapping("/api/paymentmethods")
public class PaymentMethodController {
  @Autowired
  AuthenticationManager authenticationManager;

  @Autowired
  UserRepository userRepository;

  @Autowired
  RoleRepository roleRepository;

  @Autowired
  PaymentMethodRepository paymentMethodRepository;

  private static final Logger LOG = LoggerFactory.getLogger(UserController.class);

  @PostMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<PaymentMethod> createAndUpdatePaymentMethod(@PathVariable("id") long id,
      @RequestBody PaymentMethod paymentMethodIn) {

    Optional<User> userOptional = this.userRepository.findById(id);
    PaymentMethod paymentMethod = new PaymentMethod();

    if (userOptional.isPresent()) {

      paymentMethodIn.setUserId(id);

      paymentMethod = this.paymentMethodRepository.save(paymentMethodIn);

    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>(paymentMethod, HttpStatus.CREATED);

  }

  @GetMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<PaymentMethod> getPaymentMethod(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<PaymentMethod> PaymentStatusOptional = this.paymentMethodRepository.findById(id);
    PaymentMethod paymentStatus = new PaymentMethod();
    if (PaymentStatusOptional.isPresent()) {
      paymentStatus = PaymentStatusOptional.get();
      return new ResponseEntity<>(paymentStatus, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }

  @GetMapping("/company/{companyId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<PaymentMethod>> getComponentPaymentMethods(@PathVariable("companyId") long companyId) {

    List<PaymentMethod> paymentMethods = new ArrayList<PaymentMethod>();

    paymentMethods = this.paymentMethodRepository.findByCompanyIdOrderByNameAsc(companyId);
    if (paymentMethods.isEmpty()) {
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    return new ResponseEntity<>(paymentMethods, HttpStatus.OK);
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<?> deletePaymentMethod(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<PaymentMethod> paymentMethodOptional = this.paymentMethodRepository.findById(id);
    PaymentMethod paymentMethod = new PaymentMethod();
    if (paymentMethodOptional.isPresent()) {
      paymentMethod = paymentMethodOptional.get();
      this.paymentMethodRepository.delete(paymentMethod);

      return new ResponseEntity<>(null, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }
}