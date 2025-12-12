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

import com.xoftex.parthub.models.Company;
import com.xoftex.parthub.models.Job;
import com.xoftex.parthub.models.SequenceCarrier;
import com.xoftex.parthub.models.ExpenseType;
import com.xoftex.parthub.models.User;
import com.xoftex.parthub.repository.CompanyRepository;
import com.xoftex.parthub.repository.RoleRepository;
import com.xoftex.parthub.repository.ExpenseTypeRepository;
import com.xoftex.parthub.repository.UserRepository;

//for Angular Client (withCredentials)
//@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
// @CrossOrigin(origins = "*", maxAge = 3600)
@CrossOrigin("*")
@RestController
@RequestMapping("/api/expensetypes")
public class ExpenseTypeController {

  @Autowired
  UserRepository userRepository;

  @Autowired
  RoleRepository roleRepository;

  @Autowired
  ExpenseTypeRepository expenseTypeRepository;

  @Autowired
  CompanyRepository companyRepository;

  private static final Logger LOG = LoggerFactory.getLogger(ExpenseTypeController.class);

  @PostMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<ExpenseType> createAndUpdateExpenseType(@PathVariable("id") long id, @RequestBody ExpenseType expenseTypeIn) {

    Optional<User> userOptional = this.userRepository.findById(id);
    ExpenseType expenseType = new ExpenseType();

    if (userOptional.isPresent()) {

      expenseType.setUserId(id);

      expenseType = this.expenseTypeRepository.save(expenseTypeIn);

    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>(expenseType, HttpStatus.CREATED);

  }

  @GetMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<ExpenseType> getExpenseType(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<ExpenseType> expenseTypeOptional = this.expenseTypeRepository.findById(id);
    ExpenseType expenseType = new ExpenseType();
    if (expenseTypeOptional.isPresent()) {
      expenseType = expenseTypeOptional.get();
      return new ResponseEntity<>(expenseType, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }

  @GetMapping("/company/{companyId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<ExpenseType>> getComponyExpenseType(@PathVariable("companyId") long companyId) {

    List<ExpenseType> expenseTypeList = new ArrayList<ExpenseType>();

    expenseTypeList = this.expenseTypeRepository.findByCompanyIdOrderByNameAsc(companyId);
    if (expenseTypeList.isEmpty()) {
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    return new ResponseEntity<>(expenseTypeList, HttpStatus.OK);
  }

  @PostMapping("/sequence/{uuid}")
  // @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<ExpenseType>> updateSequenceNumber(@PathVariable("uuid") String uuid,
      @RequestBody List<SequenceCarrier> sequenceCarriers) {

    Optional<Company> companyOptional = this.companyRepository.findByToken(uuid);
    List<ExpenseType> expenseTypes = new ArrayList<ExpenseType>();

    if (companyOptional.isPresent()) {
      expenseTypes = this.expenseTypeRepository.findByCompanyIdOrderByNameAsc(companyOptional.get().getId());

      for (ExpenseType expenseType : expenseTypes) {

        for (SequenceCarrier sequenceCarrier : sequenceCarriers) {

          if (expenseType.getId() == sequenceCarrier.getId()) {
            expenseType.setSequenceNumber(sequenceCarrier.getIndex());
            expenseType = this.expenseTypeRepository.save(expenseType);
          }
        }
      }

    }
    return new ResponseEntity<>(expenseTypes, HttpStatus.OK);

  }

  @PostMapping("/sequence/id/{companyId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<ExpenseType>> updateSequenceNumberWithId(@PathVariable("companyId") long companyId,
      @RequestBody List<SequenceCarrier> sequenceCarriers) {

    List<ExpenseType> expenseTypes = new ArrayList<ExpenseType>();

    expenseTypes = this.expenseTypeRepository.findByCompanyIdOrderByNameAsc(companyId);

    for (ExpenseType expenseType : expenseTypes) {

      for (SequenceCarrier sequenceCarrier : sequenceCarriers) {

        if (expenseType.getId() == sequenceCarrier.getId()) {
          expenseType.setSequenceNumber(sequenceCarrier.getIndex());
          expenseType = this.expenseTypeRepository.save(expenseType);
        }
      }

    }
    return new ResponseEntity<>(expenseTypes, HttpStatus.OK);

  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<?> deleteExpenseType(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<ExpenseType> expenseTypeOptional = this.expenseTypeRepository.findById(id);
    ExpenseType expenseType = new ExpenseType();
    if (expenseTypeOptional.isPresent()) {
      expenseType = expenseTypeOptional.get();
      this.expenseTypeRepository.delete(expenseType);

      return new ResponseEntity<>(null, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }
}