package com.xoftex.parthub.controllers;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.Properties;
import java.util.UUID;
import java.util.stream.Collectors;

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

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

import com.xoftex.parthub.models.Company;
import com.xoftex.parthub.models.EmailInfo;
import com.xoftex.parthub.models.Company;
import com.xoftex.parthub.models.SearchCarrier;
import com.xoftex.parthub.models.User;
import com.xoftex.parthub.payload.response.CompanyInfoResponse;
import com.xoftex.parthub.payload.response.MessageResponse;
import com.xoftex.parthub.repository.CompanyRepository;
import com.xoftex.parthub.repository.EmailInfoRepository;

import com.xoftex.parthub.repository.UserRepository;
import com.xoftex.parthub.repository.VehicleRepository;
import com.xoftex.parthub.security.jwt.JwtUtils;

//for Angular Client (withCredentials)
//@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
// @CrossOrigin(origins = "*", maxAge = 3600)
@CrossOrigin("*")
@RestController
@RequestMapping("/api/companies")
public class CompanyController {

  @Autowired
  UserRepository userRepository;

  @Autowired
  CompanyRepository companyRepository;

  @Autowired
  VehicleRepository vehicleRepository;

  @Autowired
  JwtUtils jwtUtils;

  @Autowired
  EmailInfoRepository emailInfoRepository;

  @Value("${image.root.path}")
  // String filePath = "C:\\Projects\\images\\";
  String filePath = "";

  String imageNamePrefix = "test_image_";

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

  private static final Logger LOG = LoggerFactory.getLogger(UserController.class);

  @PostMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<Company> createCompany(@PathVariable("id") long id, @RequestBody Company companyIn) {

    Optional<User> userOptional = this.userRepository.findById(id);
    Company company = new Company();

    if (userOptional.isPresent()) {
      companyIn.setType((long) 0);
      companyIn.setUserId(id);

      if (companyIn.iconString != null && !companyIn.iconString.contains("null")) {
        String base64Image = companyIn.iconString.split(",")[1];
        byte[] imageBytes = Base64.getDecoder().decode(base64Image);
        companyIn.setIcon(imageBytes);
      }

      boolean shallSendEmail = false;
      if (companyIn.getId() == 0) {
        String randomCode = UUID.randomUUID().toString();
        companyIn.setToken(randomCode);
        shallSendEmail = true;
      } else {
        Optional<Company> companyOptional = this.companyRepository.findById(companyIn.getId());
        if (companyOptional.isPresent())
          companyIn.setToken(companyOptional.get().getToken());
      }

      company = this.companyRepository.save(companyIn);

      if (shallSendEmail == true) {
        try {
          this.sentAactivtionMail(company.getEmail(), company.getToken(), company.getName());
        } catch (Exception ex) {
          LOG.info(ex.getMessage());
        }
      }
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>(company, HttpStatus.CREATED);

  }

  void sentAactivtionMail(String email, String uuid, String companyName) {

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

      message.setSubject(domainName + " User Registration link");
      message.setText("Dear " + companyName + ""
          + "\n\n" + this.frontendUrl + "registration/" + uuid);

      Transport.send(message);

      System.out.println("Done");

    } catch (MessagingException e) {
      e.printStackTrace();
    }

  }

  @GetMapping("")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<Company>> getAllCompanies() {

    List<Company> companies = new ArrayList<Company>();
    companyRepository.findAll().forEach(companies::add);
    if (companies.isEmpty()) {
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    return new ResponseEntity<>(companies, HttpStatus.OK);
  }

  @PostMapping("/withpage")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<Company>> getCompaniesWithPage(@RequestBody SearchCarrier searchCarrier) {

    LOG.info(searchCarrier.pageNumber + " " + searchCarrier.pageSize);
    int searchCount = this.companyRepository.countByIdNot(0);

    List<Company> companies = this.companyRepository.findByIdNot(0,
        Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
    if (companies.isEmpty()) {
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    } else {
      for (Company company : companies) {
        int vehicleTotalCount = this.vehicleRepository.countByCompanyId(company.getId());
        int vehicleInshopCount = this.vehicleRepository.countByCompanyIdAndArchived(company.getId(), false);
        int vehicleArchivedCount = this.vehicleRepository.countByCompanyIdAndArchived(company.getId(), true);

        company.searchCount = searchCount;
        company.vehicleTotalCount = vehicleTotalCount;
        company.vehicleInshopCount = vehicleInshopCount;
        company.vehicleArchivedCount = vehicleArchivedCount;

      }
    }

    return new ResponseEntity<>(companies, HttpStatus.OK);
  }

  @PostMapping("/search/withpage")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<Company>> searchCompanysWithPage(@RequestBody SearchCarrier searchCarrier) {

    LOG.info(searchCarrier.pageNumber + " " + searchCarrier.pageSize);
    List<Company> companys = new ArrayList<Company>();
    int searchCount = 0;

    String[] partNames = searchCarrier.partName.split(" ");
    if (partNames.length > 1) {

      // '(?=.*HONDA)(?=.*CIVIC)(?=.*2012)'
      List<String> words = Arrays.asList(partNames);
      String queryParam = words.stream()
          .filter(s -> !s.trim().isEmpty()) // Exclude empty or whitespace-only strings
          .map(s -> "(?=.*" + s + ")")
          .collect(Collectors.joining());

      System.out.println(queryParam);

      searchCount = this.companyRepository.coutNamesIn(
          searchCarrier.partName);

      companys = this.companyRepository.findNamesIn(searchCarrier.partName,
          Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));

    } else {

      searchCount = this.companyRepository.countByNameContainingIgnoreCase(
          searchCarrier.partName);

      companys = this.companyRepository.findByNameContainingIgnoreCaseOrderByIdDesc(
          searchCarrier.partName,
          Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
    }
    if (companys.isEmpty()) {
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    } else {
      for (Company company : companys) {
        company.searchCount = searchCount;
        int vehicleTotalCount = this.vehicleRepository.countByCompanyId(company.getId());
        int vehicleInshopCount = this.vehicleRepository.countByCompanyIdAndArchived(company.getId(), false);
        int vehicleArchivedCount = this.vehicleRepository.countByCompanyIdAndArchived(company.getId(), true);

        company.searchCount = searchCount;
        company.vehicleTotalCount = vehicleTotalCount;
        company.vehicleInshopCount = vehicleInshopCount;
        company.vehicleArchivedCount = vehicleArchivedCount;
      }
    }

    return new ResponseEntity<>(companys, HttpStatus.OK);
  }

  @GetMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<Company> getCompany(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<Company> companyOptional = this.companyRepository.findById(id);
    Company company = new Company();
    if (companyOptional.isPresent()) {
      company = companyOptional.get();

      return new ResponseEntity<>(company, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }

  @PutMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<?> resetRegistrationLink(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<Company> companyOptional = this.companyRepository.findById(id);
    Company company = new Company();
    if (companyOptional.isPresent()) {
      company = companyOptional.get();
      try {
        this.sentAactivtionMail(company.getEmail(), company.getToken(), company.getName());
      } catch (Exception ex) {
        LOG.info(ex.getMessage());
      }
      return ResponseEntity.ok(new MessageResponse("Registration link is sent"));
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }

  @GetMapping("/uuid/{uuid}")
  public ResponseEntity<CompanyInfoResponse> getCompanyByToken(@PathVariable("uuid") String uuid) {
    LOG.info("" + uuid);
    Optional<Company> companyOptional = this.companyRepository.findByToken(uuid);
    Company company = new Company();
    if (companyOptional.isPresent()) {
      company = companyOptional.get();

      CompanyInfoResponse companyInfoResponse = new CompanyInfoResponse();
      companyInfoResponse.setId(company.getId());
      companyInfoResponse.setName(company.getName());
      companyInfoResponse.setIcon(company.getIcon());

      return new ResponseEntity<>(companyInfoResponse, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<?> deleteCompany(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<Company> companyOptional = this.companyRepository.findById(id);
    Company company = new Company();
    if (companyOptional.isPresent()) {
      company = companyOptional.get();
      this.companyRepository.delete(company);

      return new ResponseEntity<>(null, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }
}