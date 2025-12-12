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

import com.xoftex.parthub.models.EmailInfo;
import com.xoftex.parthub.models.User;

import com.xoftex.parthub.repository.EmailInfoRepository;
import com.xoftex.parthub.repository.UserRepository;

//for Angular Client (withCredentials)
//@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
// @CrossOrigin(origins = "*", maxAge = 3600)
@CrossOrigin("*")
@RestController
@RequestMapping("/api/emailinfos")
public class EmailInfoController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    EmailInfoRepository emailinfoRepository;

    private static final Logger LOG = LoggerFactory.getLogger(EmailInfoController.class);

    @PostMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<EmailInfo> createAndUpdateEmailInfo(@PathVariable("id") long id,
            @RequestBody EmailInfo emailinfoIn) {

        Optional<User> userOptional = this.userRepository.findById(id);
        EmailInfo emailinfo = new EmailInfo();

        if (userOptional.isPresent()) {

            emailinfoIn.setUserId(id);

            emailinfo = this.emailinfoRepository.save(emailinfoIn);

        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(emailinfo, HttpStatus.CREATED);

    }

    @GetMapping("/company/{companyId}")
    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<List<EmailInfo>> getCompanyEmailInfo(@PathVariable("companyId") long companyId) {

        List<EmailInfo> emailinfoList = new ArrayList<EmailInfo>();

        emailinfoList = this.emailinfoRepository.findByCompanyId(companyId);
        if (emailinfoList.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        return new ResponseEntity<>(emailinfoList, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<?> deleteEmailInfo(@PathVariable("id") long id) {
        LOG.info("" + id);
        Optional<EmailInfo> emailinfoOptional = this.emailinfoRepository.findById(id);
        EmailInfo emailinfo = new EmailInfo();
        if (emailinfoOptional.isPresent()) {
            emailinfo = emailinfoOptional.get();
            this.emailinfoRepository.delete(emailinfo);

            return new ResponseEntity<>(null, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

    }
}
