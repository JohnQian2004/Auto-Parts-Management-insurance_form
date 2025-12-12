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
import com.xoftex.parthub.models.DocType;
import com.xoftex.parthub.models.User;
import com.xoftex.parthub.repository.CompanyRepository;
import com.xoftex.parthub.repository.RoleRepository;
import com.xoftex.parthub.repository.DocTypeRepository;
import com.xoftex.parthub.repository.UserRepository;

//for Angular Client (withCredentials)
//@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
// @CrossOrigin(origins = "*", maxAge = 3600)
@CrossOrigin("*")
@RestController
@RequestMapping("/api/doctypes")
public class DocTypeController {

  @Autowired
  UserRepository userRepository;

  @Autowired
  RoleRepository roleRepository;

  @Autowired
  DocTypeRepository docTypeRepository;

  @Autowired
  CompanyRepository companyRepository;

  private static final Logger LOG = LoggerFactory.getLogger(DocTypeController.class);

  @PostMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<DocType> createAndUpdateDocType(@PathVariable("id") long id, @RequestBody DocType docTypeIn) {

    Optional<User> userOptional = this.userRepository.findById(id);
    DocType docType = new DocType();

    if (userOptional.isPresent()) {

      docType.setUserId(id);

      docType = this.docTypeRepository.save(docTypeIn);

    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>(docType, HttpStatus.CREATED);

  }

  @GetMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<DocType> getDocType(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<DocType> docTypeOptional = this.docTypeRepository.findById(id);
    DocType docType = new DocType();
    if (docTypeOptional.isPresent()) {
      docType = docTypeOptional.get();
      return new ResponseEntity<>(docType, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }

  @GetMapping("/company/{companyId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<DocType>> getComponyDocType(@PathVariable("companyId") long companyId) {

    List<DocType> docTypeList = new ArrayList<DocType>();

    docTypeList = this.docTypeRepository.findByCompanyIdOrderByNameAsc(companyId);
    if (docTypeList.isEmpty()) {
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    return new ResponseEntity<>(docTypeList, HttpStatus.OK);
  }

  @PostMapping("/sequence/{uuid}")
  // @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<DocType>> updateSequenceNumber(@PathVariable("uuid") String uuid,
      @RequestBody List<SequenceCarrier> sequenceCarriers) {

    Optional<Company> companyOptional = this.companyRepository.findByToken(uuid);
    List<DocType> docTypes = new ArrayList<DocType>();

    if (companyOptional.isPresent()) {
      docTypes = this.docTypeRepository.findByCompanyIdOrderByNameAsc(companyOptional.get().getId());

      for (DocType docType : docTypes) {

        for (SequenceCarrier sequenceCarrier : sequenceCarriers) {

          if (docType.getId() == sequenceCarrier.getId()) {
            docType.setSequenceNumber(sequenceCarrier.getIndex());
            docType = this.docTypeRepository.save(docType);
          }
        }
      }

    }
    return new ResponseEntity<>(docTypes, HttpStatus.OK);

  }

  @PostMapping("/sequence/id/{companyId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<DocType>> updateSequenceNumberWithId(@PathVariable("companyId") long companyId,
      @RequestBody List<SequenceCarrier> sequenceCarriers) {

    List<DocType> docTypes = new ArrayList<DocType>();

    docTypes = this.docTypeRepository.findByCompanyIdOrderByNameAsc(companyId);

    for (DocType docType : docTypes) {

      for (SequenceCarrier sequenceCarrier : sequenceCarriers) {

        if (docType.getId() == sequenceCarrier.getId()) {
          docType.setSequenceNumber(sequenceCarrier.getIndex());
          docType = this.docTypeRepository.save(docType);
        }
      }

    }
    return new ResponseEntity<>(docTypes, HttpStatus.OK);

  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<?> deleteDocType(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<DocType> docTypeOptional = this.docTypeRepository.findById(id);
    DocType docType = new DocType();
    if (docTypeOptional.isPresent()) {
      docType = docTypeOptional.get();
      this.docTypeRepository.delete(docType);

      return new ResponseEntity<>(null, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }
}