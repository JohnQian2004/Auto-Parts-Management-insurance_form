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
import com.xoftex.parthub.models.Employee;
import com.xoftex.parthub.models.Job;
import com.xoftex.parthub.models.SequenceCarrier;
import com.xoftex.parthub.models.Status;
import com.xoftex.parthub.models.User;
import com.xoftex.parthub.repository.CompanyRepository;
import com.xoftex.parthub.repository.EmployeeRepository;
import com.xoftex.parthub.repository.RoleRepository;
import com.xoftex.parthub.repository.StatusRepository;
import com.xoftex.parthub.repository.UserRepository;

//for Angular Client (withCredentials)
//@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
// @CrossOrigin(origins = "*", maxAge = 3600)
@CrossOrigin("*")
@RestController
@RequestMapping("/api/statuss")
public class StatusController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    StatusRepository statusRepository;

    @Autowired
    CompanyRepository companyRepository;
    @Autowired
    EmployeeRepository employeeRepository;

    private static final Logger LOG = LoggerFactory.getLogger(StatusController.class);

    @PostMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<Status> createAndUpdateStatus(@PathVariable("id") long id, @RequestBody Status statusIn) {

        Optional<User> userOptional = this.userRepository.findById(id);
        Status status = new Status();

        if (userOptional.isPresent()) {

            status.setUserId(id);

            status = this.statusRepository.save(statusIn);

        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(status, HttpStatus.CREATED);

    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<Status> getStatus(@PathVariable("id") long id) {
        LOG.info("" + id);
        Optional<Status> statusOptional = this.statusRepository.findById(id);
        Status status = new Status();
        if (statusOptional.isPresent()) {
            status = statusOptional.get();
            return new ResponseEntity<>(status, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

    }

    @GetMapping("/company/{companyId}")
    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<List<Status>> getComponentStatus(@PathVariable("companyId") long companyId) {

        List<Status> statusList = new ArrayList<Status>();

        statusList = this.statusRepository.findByCompanyIdOrderByNameAsc(companyId);
        if (statusList.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        return new ResponseEntity<>(statusList, HttpStatus.OK);
    }

    @GetMapping("/company/uuid/{uuid}")
    // @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<List<Status>> getComponentStatusUuid(@PathVariable("uuid") String uuid) {

        List<Status> statusList = new ArrayList<>();

        Optional<Employee> employeeOptional = this.employeeRepository.findByToken(uuid);

        if (employeeOptional.isPresent()) {
            statusList = this.statusRepository.findByCompanyIdOrderByNameAsc(employeeOptional.get().getId());
            if (statusList.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
        }
        return new ResponseEntity<>(statusList, HttpStatus.OK);
    }

    @PostMapping("/sequence/{uuid}")
    // @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<List<Status>> updateSequenceNumber(@PathVariable("uuid") String uuid,
            @RequestBody List<SequenceCarrier> sequenceCarriers) {

        Optional<Company> companyOptional = this.companyRepository.findByToken(uuid);
        List<Status> statuss = new ArrayList<Status>();

        if (companyOptional.isPresent()) {
            statuss = this.statusRepository.findByCompanyIdOrderByNameAsc(companyOptional.get().getId());

            for (Status status : statuss) {

                for (SequenceCarrier sequenceCarrier : sequenceCarriers) {

                    if (status.getId() == sequenceCarrier.getId()) {
                        status.setSequenceNumber(sequenceCarrier.getIndex());
                        status = this.statusRepository.save(status);
                    }
                }
            }

        }
        return new ResponseEntity<>(statuss, HttpStatus.OK);

    }

    @PostMapping("/sequence/id/{companyId}")
    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<List<Status>> updateSequenceNumberWithId(@PathVariable("companyId") long companyId,
            @RequestBody List<SequenceCarrier> sequenceCarriers) {

        List<Status> statuss = new ArrayList<Status>();

        statuss = this.statusRepository.findByCompanyIdOrderByNameAsc(companyId);

        for (Status status : statuss) {

            for (SequenceCarrier sequenceCarrier : sequenceCarriers) {

                if (status.getId() == sequenceCarrier.getId()) {
                    status.setSequenceNumber(sequenceCarrier.getIndex());
                    status = this.statusRepository.save(status);
                }
            }

        }
        return new ResponseEntity<>(statuss, HttpStatus.OK);

    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<?> deleteStatus(@PathVariable("id") long id) {
        LOG.info("" + id);
        Optional<Status> statusOptional = this.statusRepository.findById(id);
        Status status = new Status();
        if (statusOptional.isPresent()) {
            status = statusOptional.get();
            this.statusRepository.delete(status);

            return new ResponseEntity<>(null, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

    }
}
