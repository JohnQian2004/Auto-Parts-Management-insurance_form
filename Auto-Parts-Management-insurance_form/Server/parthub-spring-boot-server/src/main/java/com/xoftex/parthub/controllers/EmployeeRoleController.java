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
import com.xoftex.parthub.models.EmployeeRole;

import com.xoftex.parthub.models.User;
import com.xoftex.parthub.repository.CompanyRepository;
import com.xoftex.parthub.repository.EmployeeRoleRepository;

import com.xoftex.parthub.repository.RoleRepository;

import com.xoftex.parthub.repository.UserRepository;

//for Angular Client (withCredentials)
//@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
// @CrossOrigin(origins = "*", maxAge = 3600)
@CrossOrigin("*")
@RestController
@RequestMapping("/api/employeeroles")
public class EmployeeRoleController {

  @Autowired
  UserRepository userRepository;

  @Autowired
  RoleRepository roleRepository;

  @Autowired
  EmployeeRoleRepository EmployeeRoleRepository;

  @Autowired
  CompanyRepository companyRepository;

  private static final Logger LOG = LoggerFactory.getLogger(UserController.class);

  @PostMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<EmployeeRole> createAndUpdateEmployeeRole(@PathVariable("id") long id,
      @RequestBody EmployeeRole employeeRoleIn) {

    Optional<User> userOptional = this.userRepository.findById(id);
    EmployeeRole employeeRole = new EmployeeRole();

    if (userOptional.isPresent()) {

      employeeRoleIn.setUserId(id);

      employeeRole = this.EmployeeRoleRepository.save(employeeRoleIn);

    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>(employeeRole, HttpStatus.CREATED);

  }

  @GetMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<EmployeeRole> getEmployeeRole(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<EmployeeRole> EmployeeRoleOptional = this.EmployeeRoleRepository.findById(id);
    EmployeeRole employeeRole = new EmployeeRole();
    if (EmployeeRoleOptional.isPresent()) {
      employeeRole = EmployeeRoleOptional.get();
      return new ResponseEntity<>(employeeRole, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }

  @GetMapping("/company/{companyId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<EmployeeRole>> getComponentEmployeeRoles(@PathVariable("companyId") long companyId) {

    List<EmployeeRole> employeeRoles = new ArrayList<EmployeeRole>();

    employeeRoles = this.EmployeeRoleRepository.findByCompanyIdOrderByNameAsc(companyId);
    if (employeeRoles.isEmpty()) {
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    return new ResponseEntity<>(employeeRoles, HttpStatus.OK);
  }

  @GetMapping("/company/uuid/{uuid}")
  // @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<EmployeeRole>> getComponentEmployeeRolesWithUuid(@PathVariable("uuid") String uuid) {

    List<EmployeeRole> employeeRoles = new ArrayList<EmployeeRole>();

    Optional<Company> companyOptional = this.companyRepository.findByToken(uuid);

    if (companyOptional.isPresent()) {

      employeeRoles = this.EmployeeRoleRepository.findByCompanyIdOrderByNameAsc(companyOptional.get().getId());
      if (employeeRoles.isEmpty()) {
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
      }
    }

    return new ResponseEntity<>(employeeRoles, HttpStatus.OK);
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<?> deleteEmployeeRole(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<EmployeeRole> employeeRoleOptional = this.EmployeeRoleRepository.findById(id);
    EmployeeRole employeeRole = new EmployeeRole();
    if (employeeRoleOptional.isPresent()) {
      employeeRole = employeeRoleOptional.get();
      this.EmployeeRoleRepository.delete(employeeRole);

      return new ResponseEntity<>(null, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }
}