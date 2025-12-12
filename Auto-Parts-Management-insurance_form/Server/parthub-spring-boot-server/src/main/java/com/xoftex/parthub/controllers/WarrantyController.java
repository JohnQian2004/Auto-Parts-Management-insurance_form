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

import com.xoftex.parthub.models.Warranty;

import com.xoftex.parthub.models.User;

import com.xoftex.parthub.repository.RoleRepository;

import com.xoftex.parthub.repository.UserRepository;
import com.xoftex.parthub.repository.WarrantyRepository;
import com.xoftex.parthub.security.jwt.JwtUtils;

//for Angular Client (withCredentials)
//@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
// @CrossOrigin(origins = "*", maxAge = 3600)
@CrossOrigin("*")
@RestController
@RequestMapping("/api/warranties")
public class WarrantyController {
  @Autowired
  AuthenticationManager authenticationManager;

  @Autowired
  UserRepository userRepository;

  @Autowired
  RoleRepository roleRepository;

  @Autowired
  WarrantyRepository warrantyRepository;

  @Autowired
  JwtUtils jwtUtils;

  private static final Logger LOG = LoggerFactory.getLogger(WarrantyController.class);

  @PostMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<Warranty> createAndUpdateWarranty(@PathVariable("id") long id,
      @RequestBody Warranty warrantyIn) {

    Optional<User> userOptional = this.userRepository.findById(id);
    Warranty warranty = new Warranty();

    if (userOptional.isPresent()) {

      warrantyIn.setUserId(id);

      warranty = this.warrantyRepository.save(warrantyIn);

      // make sure only one is set as default
      if (warranty.isDefault == true) {
        List<Warranty> warrantys = this.warrantyRepository
            .findByCompanyIdOrderByNameAsc(warranty.getCompanyId());

        for (Warranty warranty2 : warrantys) {
          if (warranty2.isDefault == true && warranty2.getId() != warranty.getId()) {
            warranty2.isDefault = false;
            this.warrantyRepository.save(warranty2);
          }

        }
      }

    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>(warranty, HttpStatus.CREATED);

  }

  @GetMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<Warranty> getWarranty(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<Warranty> warrantyOptional = this.warrantyRepository.findById(id);
    Warranty warranty = new Warranty();
    if (warrantyOptional.isPresent()) {
      warranty = warrantyOptional.get();
      return new ResponseEntity<>(warranty, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }

  @GetMapping("/company/{companyId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<Warranty>> getCompanyWarranties(@PathVariable("companyId") long companyId) {

    List<Warranty> warranties = new ArrayList<Warranty>();

    warranties = this.warrantyRepository.findByCompanyIdOrderByNameAsc(companyId);
    if (warranties.isEmpty()) {
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    return new ResponseEntity<>(warranties, HttpStatus.OK);
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<?> deleteWarranty(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<Warranty> warrantyOptional = this.warrantyRepository.findById(id);
    Warranty warranty = new Warranty();
    if (warrantyOptional.isPresent()) {
      warranty = warrantyOptional.get();
      this.warrantyRepository.delete(warranty);

      return new ResponseEntity<>(null, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }
}