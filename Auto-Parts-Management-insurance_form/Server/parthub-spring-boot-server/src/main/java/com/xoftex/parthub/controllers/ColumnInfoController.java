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
import com.xoftex.parthub.models.ColumnInfo;
import com.xoftex.parthub.models.User;
import com.xoftex.parthub.repository.CompanyRepository;
import com.xoftex.parthub.repository.RoleRepository;
import com.xoftex.parthub.repository.ColumnInfoRepository;
import com.xoftex.parthub.repository.UserRepository;

//for Angular Client (withCredentials)
//@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
// @CrossOrigin(origins = "*", maxAge = 3600)
@CrossOrigin("*")
@RestController
@RequestMapping("/api/columninfos")
public class ColumnInfoController {

  @Autowired
  UserRepository userRepository;

  @Autowired
  RoleRepository roleRepository;

  @Autowired
  ColumnInfoRepository columnInfoRepository;

  @Autowired
  CompanyRepository companyRepository;


  private static final Logger LOG = LoggerFactory.getLogger(ColumnInfoController.class);

  @PostMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<ColumnInfo> createAndUpdateColumnInfo(@PathVariable("id") long id, @RequestBody ColumnInfo columnInfoIn) {

    Optional<User> userOptional = this.userRepository.findById(id);
    ColumnInfo columnInfo = new ColumnInfo();

    if (userOptional.isPresent()) {

      columnInfo.setUserId(id);

      columnInfo = this.columnInfoRepository.save(columnInfoIn);

    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>(columnInfo, HttpStatus.CREATED);

  }

  @GetMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<ColumnInfo> getColumnInfo(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<ColumnInfo> columnInfoOptional = this.columnInfoRepository.findById(id);
    ColumnInfo columnInfo = new ColumnInfo();
    if (columnInfoOptional.isPresent()) {
      columnInfo = columnInfoOptional.get();
      return new ResponseEntity<>(columnInfo, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }

  @GetMapping("/company/{companyId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<ColumnInfo>> getComponentColumnInfo(@PathVariable("companyId") long companyId) {

    List<ColumnInfo> columnInfoList = new ArrayList<ColumnInfo>();

    columnInfoList = this.columnInfoRepository.findByCompanyIdOrderByNameAsc(companyId);
    if (columnInfoList.isEmpty()) {
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    return new ResponseEntity<>(columnInfoList, HttpStatus.OK);
  }

  @PostMapping("/sequence/{uuid}")
  // @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<ColumnInfo>> updateSequenceNumber(@PathVariable("uuid") String uuid,
      @RequestBody List<SequenceCarrier> sequenceCarriers) {

    Optional<Company> companyOptional = this.companyRepository.findByToken(uuid);
    List<ColumnInfo> columnInfos = new ArrayList<ColumnInfo>();

    if (companyOptional.isPresent()) {
      columnInfos = this.columnInfoRepository.findByCompanyIdOrderByNameAsc(companyOptional.get().getId());

      for (ColumnInfo columnInfo : columnInfos) {

        for (SequenceCarrier sequenceCarrier : sequenceCarriers) {

          if (columnInfo.getId() == sequenceCarrier.getId()) {
            columnInfo.setSequenceNumber(sequenceCarrier.getIndex());
            columnInfo = this.columnInfoRepository.save(columnInfo);
          }
        }
      }

    }
    return new ResponseEntity<>(columnInfos, HttpStatus.OK);

  }

  @PostMapping("/sequence/id/{companyId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<ColumnInfo>> updateSequenceNumberWithId(@PathVariable("companyId") long companyId,
      @RequestBody List<SequenceCarrier> sequenceCarriers) {

    List<ColumnInfo> columnInfos = new ArrayList<ColumnInfo>();

    columnInfos = this.columnInfoRepository.findByCompanyIdOrderByNameAsc(companyId);

    for (ColumnInfo columnInfo : columnInfos) {

      for (SequenceCarrier sequenceCarrier : sequenceCarriers) {

        if (columnInfo.getId() == sequenceCarrier.getId()) {
          columnInfo.setSequenceNumber(sequenceCarrier.getIndex());
          columnInfo = this.columnInfoRepository.save(columnInfo);
        }
      }

    }
    return new ResponseEntity<>(columnInfos, HttpStatus.OK);

  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<?> deleteColumnInfo(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<ColumnInfo> columnInfoOptional = this.columnInfoRepository.findById(id);
    ColumnInfo columnInfo = new ColumnInfo();
    if (columnInfoOptional.isPresent()) {
      columnInfo = columnInfoOptional.get();
      this.columnInfoRepository.delete(columnInfo);

      return new ResponseEntity<>(null, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }
}