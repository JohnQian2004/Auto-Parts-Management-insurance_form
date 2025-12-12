package com.xoftex.parthub.controllers;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Properties;
import java.util.UUID;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Pageable;
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

import com.xoftex.parthub.models.Company;
import com.xoftex.parthub.models.EmailInfo;
import com.xoftex.parthub.models.Employee;
import com.xoftex.parthub.models.Feedback;
import com.xoftex.parthub.models.Job;
import com.xoftex.parthub.models.SearchCarrier;
import com.xoftex.parthub.models.User;
import com.xoftex.parthub.models.Vehicle;
import com.xoftex.parthub.repository.CompanyRepository;
import com.xoftex.parthub.repository.CustomerRepository;
import com.xoftex.parthub.repository.EmailInfoRepository;
import com.xoftex.parthub.repository.EmployeeRepository;
import com.xoftex.parthub.repository.FeedbackRepository;
import com.xoftex.parthub.repository.JobRepository;

import com.xoftex.parthub.repository.UserRepository;

import com.xoftex.parthub.security.jwt.JwtUtils;

//for Angular Client (withCredentials)
//@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
// @CrossOrigin(origins = "*", maxAge = 3600)
@CrossOrigin("*")
@RestController
@RequestMapping("/api/feedbacks")
public class FeedbackController {
  @Autowired
  AuthenticationManager authenticationManager;

  @Autowired
  UserRepository userRepository;

  @Autowired
  CompanyRepository companyRepository;

  @Autowired
  FeedbackRepository feedbackRepository;

  @Autowired
  JwtUtils jwtUtils;

  @Autowired
  EmailInfoRepository emailInfoRepository;

  @Value("${smtp.server.address}")
  String smtpServerAddress = "";

  @Value("${smtp.server.port}")
  String smtpServerPort = "";

  @Value("${smtp.server.username}")
  String smtpServerUsername = "";

  @Value("${smtp.server.password}")
  String smtpServerPassword = "";

  @Value("${frontend.url}")
  String frontendUrl = "";

  @Value("${domain.name}")
  String domainName = "";

  @Value("${image.root.path}")
  // String filePath = "C:\\Projects\\images\\";
  String filePath = "";

  String imageNamePrefix = "test_image_";

  private static final Logger LOG = LoggerFactory.getLogger(FeedbackController.class);

  @PostMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<Feedback> createUpdateFeedback(@PathVariable("id") long id, @RequestBody Feedback feedbackIn) {

    LOG.info(feedbackIn.toString());

    Optional<User> userOptional = this.userRepository.findById(id);
    Feedback feedback = new Feedback();

    if (userOptional.isPresent()) {
      if (feedbackIn.getId() == 0) {
        feedbackIn.setUserId(id);
      }
      String randomCode = UUID.randomUUID().toString();

      if (feedbackIn.getId() == 0) {
        feedbackIn.setToken(randomCode);
        try {
          this.sentFeedbackMail(smtpServerUsername, feedbackIn.getName(), feedbackIn.getComments(), randomCode);
        } catch (Exception ex) {
          LOG.info(ex.getMessage());
        }
      } else {
        if (feedbackIn.reason.equals("reply"))
          feedbackIn.setReplyedAt(new Date());
      }

      feedback = this.feedbackRepository.save(feedbackIn);
      try {
        String subject = "";
        if (feedbackIn.getId() == 0) {
          // this.sentFeedbackMail(smtpServerUsername, feedbackIn.getName(),
          // feedback.getComments(), randomCode);
        } else {
          userOptional = this.userRepository.findById(feedbackIn.getUserId());
          if (userOptional.isPresent()) {
            feedback.setUser(userOptional.get());
          }

          if (feedback.getCompanyId() > 0) {
            Optional<Company> companyOptional = this.companyRepository.findById(feedback.getCompanyId());
            if (companyOptional.isPresent()) {
              feedback.setCompany(companyOptional.get());
            }
          }
        }
      } catch (Exception ex) {

      }

    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>(feedback, HttpStatus.CREATED);

  }

  void sentFeedbackMail(String email, String subject, String content, String uuid) {

   // final String username = this.smtpServerUsername;
    // final String password = this.smtpServerPassword;

    EmailInfo emailInfo = new EmailInfo();
    List<EmailInfo> emailInfos = this.emailInfoRepository.findByCompanyId(0);
    if (!emailInfos.isEmpty()) {
      emailInfo = emailInfos.get(0);
    }

    final String username = emailInfo.getSmtpServerUsername();
    final String password = emailInfo.getSmtpServerPassword();

    Properties prop = new Properties();
    // prop.put("mail.smtp.host", "smtp.gmail.com");
    // prop.put("mail.smtp.port", "587");
    prop.put("mail.smtp.host", emailInfo.getSmtpServerAddress());
    prop.put("mail.smtp.port", emailInfo.getSmtpServerPort());
    prop.put("mail.smtp.auth", "true");
    prop.put("mail.smtp.starttls.enable", "true"); // TLS
    prop.put("mail.smtp.connectiontimeout", "10000");
    prop.put("mail.debug", "true");

    Session session = Session.getInstance(prop,
        new javax.mail.Authenticator() {
          protected PasswordAuthentication getPasswordAuthentication() {
            return new PasswordAuthentication(username, password);
          }
        });

    try {

      Message message = new MimeMessage(session);
      message.setFrom(new InternetAddress(username));
      message.setRecipients(
          Message.RecipientType.TO,
          InternetAddress.parse(email));
      message.setSubject(domainName + " Feedback Notification for [ " + subject + " ]");
      message.setText("Dear User," + "\n\n" + "please click link below to reply to the feedback"
          + "\n\n" + content
          + "\n\n" + this.frontendUrl + "feedback/" + uuid);

      Transport.send(message);

      System.out.println("Done");

    } catch (MessagingException e) {
      e.printStackTrace();
    }

  }

  @PostMapping("/search")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<Feedback>> searchAllVehicles(@RequestBody SearchCarrier searchCarrier) {

    LOG.info(searchCarrier.pageNumber + " " + searchCarrier.pageSize);

    List<Feedback> feedbacks = new ArrayList<Feedback>();
    int searchCount = this.feedbackRepository.countAll();

    feedbacks = this.feedbackRepository
        .findAllByOrderByIdDesc(Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));

    if (feedbacks.size() > 0) {
      for (Feedback feedback : feedbacks) {
        feedback.searchCount = searchCount;
        Optional<User> userOptional = this.userRepository.findById(feedback.getUserId());
        if (userOptional.isPresent()) {
          feedback.setUser(userOptional.get());
        }

        if (feedback.getCompanyId() > 0) {
          Optional<Company> companyOptional = this.companyRepository.findById(feedback.getCompanyId());
          if (companyOptional.isPresent()) {
            feedback.setCompany(companyOptional.get());
          }
        }
      }
    }
    if (feedbacks.isEmpty()) {
      return new ResponseEntity<>(feedbacks, HttpStatus.OK);
    }

    return new ResponseEntity<>(feedbacks, HttpStatus.OK);
  }

  @GetMapping("/company/{companyId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<Feedback>> getComppanyFeedbacks(@PathVariable("companyId") long companyId) {

    List<Feedback> feedbacks = new ArrayList<Feedback>();

    feedbacks = feedbackRepository.findByCompanyIdOrderByNameAsc(companyId);
    if (feedbacks.isEmpty()) {
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    return new ResponseEntity<>(feedbacks, HttpStatus.OK);
  }

  @GetMapping("/user/{user}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<Feedback>> getUserFeedbacks(@PathVariable("user") long userId) {

    List<Feedback> feedbacks = new ArrayList<Feedback>();

    feedbacks = feedbackRepository.findByUserIdAndReplyNotNullOrderByNameAsc(userId);
    if (feedbacks.isEmpty()) {
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    return new ResponseEntity<>(feedbacks, HttpStatus.OK);
  }

  @GetMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<Feedback> getFeedback(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<Feedback> feedbackOptional = this.feedbackRepository.findById(id);
    Feedback feedback = new Feedback();
    if (feedbackOptional.isPresent()) {
      feedback = feedbackOptional.get();
      return new ResponseEntity<>(feedback, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<?> deleteFeedback(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<Feedback> employeeOptional = this.feedbackRepository.findById(id);
    Feedback feedback = new Feedback();
    if (employeeOptional.isPresent()) {
      feedback = employeeOptional.get();

      this.feedbackRepository.delete(feedback);

      return new ResponseEntity<>(null, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }
}