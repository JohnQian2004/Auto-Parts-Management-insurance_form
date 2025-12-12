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

import com.xoftex.parthub.models.Employee;
import com.xoftex.parthub.models.Vendor;

import com.xoftex.parthub.models.User;
import com.xoftex.parthub.repository.EmployeeRepository;

import com.xoftex.parthub.repository.VendorRepository;

import com.xoftex.parthub.repository.RoleRepository;

import com.xoftex.parthub.repository.UserRepository;
import com.xoftex.parthub.security.jwt.JwtUtils;

//for Angular Client (withCredentials)
//@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
// @CrossOrigin(origins = "*", maxAge = 3600)
@CrossOrigin("*")
@RestController
@RequestMapping("/api/vendors")
public class VendorController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    VendorRepository vendorRepository;

    @Autowired
    EmployeeRepository employeeRepository;

    @Autowired
    JwtUtils jwtUtils;

    private static final Logger LOG = LoggerFactory.getLogger(VendorController.class);

    @PostMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<Vendor> createAndUpdateVendor(@PathVariable("id") long id,
            @RequestBody Vendor VendorIn) {

        Optional<User> userOptional = this.userRepository.findById(id);
        Vendor vendor = new Vendor();

        if (userOptional.isPresent()) {

            VendorIn.setUserId(id);

            vendor = this.vendorRepository.save(VendorIn);

        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(vendor, HttpStatus.CREATED);

    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<Vendor> getVendor(@PathVariable("id") long id) {
        LOG.info("" + id);
        Optional<Vendor> vendorOptional = this.vendorRepository.findById(id);
        Vendor vendor = new Vendor();
        if (vendorOptional.isPresent()) {
            vendor = vendorOptional.get();
            return new ResponseEntity<>(vendor, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

    }

    @GetMapping("/company/{companyId}")
    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<List<Vendor>> getCompanyVendors(@PathVariable("companyId") long companyId) {

        List<Vendor> vendors = new ArrayList<Vendor>();

        vendors = this.vendorRepository.findByCompanyIdOrderByNameAsc(companyId);
        if (vendors.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        return new ResponseEntity<>(vendors, HttpStatus.OK);
    }

    @GetMapping("/company/uuid/{uuid}")
    //@PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<List<Vendor>> getCompanyVendorsUuid(@PathVariable("uuid") String uuid) {

        List<Vendor> vendors = new ArrayList<>();

        Optional<Employee> employeeOptional = this.employeeRepository.findByToken(uuid);
        if (employeeOptional.isPresent()) {
            vendors = this.vendorRepository.findByCompanyIdOrderByNameAsc(employeeOptional.get().getCompanyId());
            if (vendors.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
        }
        return new ResponseEntity<>(vendors, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<?> deleteVendor(@PathVariable("id") long id) {
        LOG.info("" + id);
        Optional<Vendor> vendorOptional = this.vendorRepository.findById(id);
        Vendor vendor = new Vendor();
        if (vendorOptional.isPresent()) {
            vendor = vendorOptional.get();
            this.vendorRepository.delete(vendor);

            return new ResponseEntity<>(null, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

    }
}
