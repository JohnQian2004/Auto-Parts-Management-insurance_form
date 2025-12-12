package com.xoftex.parthub.controllers;

import java.util.ArrayList;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;
import com.xoftex.parthub.models.ApprovalStatus;
import com.xoftex.parthub.models.User;
import com.xoftex.parthub.repository.ApprovalStatusRepository;
import com.xoftex.parthub.repository.RoleRepository;

import com.xoftex.parthub.repository.UserRepository;
import com.xoftex.parthub.security.jwt.JwtUtils;

//for Angular Client (withCredentials)
//@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
// @CrossOrigin(origins = "*", maxAge = 3600)
@CrossOrigin("*")
@RestController
@RequestMapping("/api/approvalstatuss")
public class ApprovalStatusController {
  @Autowired
  AuthenticationManager authenticationManager;

  @Autowired
  UserRepository userRepository;

  @Autowired
  RoleRepository roleRepository;

  @Autowired
  ApprovalStatusRepository approvalStatusRepository;

  @Autowired
  JwtUtils jwtUtils;

  private static final Logger LOG = LoggerFactory.getLogger(UserController.class);

  @PostMapping("/{id}")
  public ResponseEntity<ApprovalStatus> createAndUpdateApprovalStatus(@PathVariable("id") long id,
      @RequestBody ApprovalStatus ApprovalStatusIn) {

    Optional<User> userOptional = this.userRepository.findById(id);
    ApprovalStatus ApprovalStatus = new ApprovalStatus();

    if (userOptional.isPresent()) {

      ApprovalStatusIn.setUserId(id);

      ApprovalStatus = this.approvalStatusRepository.save(ApprovalStatusIn);

    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>(ApprovalStatus, HttpStatus.CREATED);

  }

  @GetMapping("/{id}")
  public ResponseEntity<ApprovalStatus> getApprovalStatus(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<ApprovalStatus> approvalStatusOptional = this.approvalStatusRepository.findById(id);
    ApprovalStatus approvalStatus = new ApprovalStatus();
    if (approvalStatusOptional.isPresent()) {
      approvalStatus = approvalStatusOptional.get();
      return new ResponseEntity<>(approvalStatus, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }

  @GetMapping("/company/{companyId}")
  public ResponseEntity<List<ApprovalStatus>> getComponentApprovalStatuss(@PathVariable("companyId") long companyId) {

    List<ApprovalStatus> approvalStatuss = new ArrayList<ApprovalStatus>();

    approvalStatuss = this.approvalStatusRepository.findByCompanyIdOrderByNameAsc(companyId);
    if (approvalStatuss.isEmpty()) {
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    return new ResponseEntity<>(approvalStatuss, HttpStatus.OK);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteApprovalStatus(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<ApprovalStatus> approvalStatusOptional = this.approvalStatusRepository.findById(id);
    ApprovalStatus approvalStatus = new ApprovalStatus();
    if (approvalStatusOptional.isPresent()) {
      approvalStatus = approvalStatusOptional.get();
      this.approvalStatusRepository.delete(approvalStatus);

      return new ResponseEntity<>(null, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }
}