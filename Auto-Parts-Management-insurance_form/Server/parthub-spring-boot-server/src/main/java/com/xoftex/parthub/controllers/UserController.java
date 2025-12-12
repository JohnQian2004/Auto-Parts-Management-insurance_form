package com.xoftex.parthub.controllers;

import java.io.File;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Properties;
import java.util.Set;
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
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.xoftex.parthub.models.Autopart;
import com.xoftex.parthub.models.ERole;
import com.xoftex.parthub.models.EmailInfo;
import com.xoftex.parthub.models.ImageModel;
import com.xoftex.parthub.models.Role;
import com.xoftex.parthub.models.SavedItem;
import com.xoftex.parthub.models.SearchCarrier;
import com.xoftex.parthub.models.User;
import com.xoftex.parthub.payload.request.ChangePasswordRequest;
import com.xoftex.parthub.payload.response.MessageResponse;
import com.xoftex.parthub.repository.AutoPartRepository;
import com.xoftex.parthub.repository.EmailInfoRepository;
import com.xoftex.parthub.repository.RoleRepository;
import com.xoftex.parthub.repository.SavedItemRepository;
import com.xoftex.parthub.repository.UserRepository;
import com.xoftex.parthub.security.jwt.JwtUtils;

//for Angular Client (withCredentials)
//@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
// @CrossOrigin(origins = "*", maxAge = 3600)
@CrossOrigin("*")
@RestController
@RequestMapping("/api/user")
public class UserController {
  @Autowired
  AuthenticationManager authenticationManager;

  @Autowired
  UserRepository userRepository;

  @Autowired
  RoleRepository roleRepository;

  @Autowired
  AutoPartRepository autoPartRepository;

  @Autowired
  SavedItemRepository savedItemRepository;

  @Autowired
  PasswordEncoder encoder;

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

  @GetMapping("/{username}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<?> getUser(@PathVariable("username") String username) {

    LOG.info(username);
    Optional<User> userOptional = this.userRepository.findByUsername(username);
    User user = new User();
    if (userOptional.isPresent()) {

      user = userOptional.get();

      // ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(user.getUsername());
      ResponseCookie jwtCookie = jwtUtils.generateJwtCookieEmail(user.getEmail());

      return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
          .body(user);
    }

    return ResponseEntity.ok(new MessageResponse("User activation failed !"));
  }

  @GetMapping("/user/{userId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<?> getUser(@PathVariable("userId") long userId) {

    Optional<User> userOptional = this.userRepository.findById(userId);
    User user = new User();
    if (userOptional.isPresent()) {

      user = userOptional.get();

      // ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(user.getUsername());
      ResponseCookie jwtCookie = jwtUtils.generateJwtCookieEmail(user.getEmail());

      return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
          .body(user);
    }

    return ResponseEntity.ok(new MessageResponse("User activation failed !"));
  }

  @GetMapping("/user/uuid/{uuid}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<?> getUserUuid(@PathVariable("uuid") String uuid) {

    Optional<User> userOptional = this.userRepository.findByVerificationCode(uuid);
    User user = new User();
    if (userOptional.isPresent()) {

      user = userOptional.get();
      // user.setToken(user.getVerificationCode());

      // ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(user.getUsername());
      ResponseCookie jwtCookie = jwtUtils.generateJwtCookieEmail(user.getEmail());

      return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
          .body(user);
    }

    return ResponseEntity.ok(new MessageResponse("User activation failed !"));
  }

  @PostMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<?> addNewUser(@PathVariable("id") long id, @RequestBody User userIn) {

    User user = new User();
    if (userIn.getId() == 0 && userIn.getNewPassword() != null) {

      if (!userIn.getEmail().equals(user.getEmail())) {

        if (this.userRepository.existsByEmail(userIn.getEmail())) {
          return ResponseEntity
              .ok(new MessageResponse("Email [" + userIn.getEmail() + "] is taken. User Update failed"));
        }
      }

      user.setUsername(userIn.getEmail());

      if (userIn.getEmployeeRoleId() != 0) {
        user.setEmployeeRoleId(userIn.getEmployeeRoleId());
      }

      // user.setActivated(userIn.isActivated());
      user.setBussinessname(userIn.getBussinessname());
      user.setFirstName(userIn.getFirstName());
      user.setLastName(userIn.getLastName());

      user.setEmail(userIn.getEmail());
      user.setPhone(userIn.getPhone());

      Set<Role> roles = new HashSet<>();

      for (Role role : userIn.getRoles()) {
        Role userRole;
        String roleName = "" + role.getName();

        switch (roleName) {
          case "ROLE_ADMIN":
            userRole = this.roleRepository.findByName(ERole.ROLE_ADMIN).get();
            break;
          case "ROLE_MODERATOR":
            userRole = this.roleRepository.findByName(ERole.ROLE_MODERATOR).get();
            break;
          case "ROLE_SHOP":
            userRole = this.roleRepository.findByName(ERole.ROLE_SHOP).get();
            break;
          case "ROLE_RECYCLER":
            userRole = this.roleRepository.findByName(ERole.ROLE_RECYCLER).get();
            break;
          default:
            userRole = this.roleRepository.findByName(ERole.ROLE_USER).get();
            break;
        }
        roles.add(userRole);
      }

      user.setRoles(roles);

      // user.setRoles(userIn.getRoles());

      user.setAllowAddCompany(userIn.isAllowAddCompany());
      user.setAllowAddUpdateAutopart(userIn.isAllowAddUpdateAutopart());

      user.setAllowAddUpdatePurchaseOrder(userIn.isAllowAddUpdatePurchaseOrder());
      user.setAllowApproveRejectPurchaseOrder(userIn.isAllowApproveRejectPurchaseOrder());

      user.setAllowAddEmployee(userIn.isAllowAddEmployee());
      user.setAllowAddService(userIn.isAllowAddService());
      user.setAllowAssignUser(userIn.isAllowAssignUser());
      user.setAllowAddExpense(userIn.isAllowAddExpense());
      user.setAllowMainPage(userIn.isAllowMainPage());
      user.setAllowArchiveVehicle(userIn.isAllowArchiveVehicle());
      // user.setAllowArchiveVehicle(true);
      user.setShopDisplayUser(userIn.isShopDisplayUser());
      user.setAllowUpdateJobStatus(userIn.isAllowUpdateJobStatus());
      user.setAllowUpdateUser(userIn.isAllowUpdateUser());
      user.setAllowAddNotes(userIn.isAllowAddNotes());
      user.setAllowAddPayment(userIn.isAllowAddPayment());
      user.setAllowVerifyPayment(userIn.isAllowVerifyPayment());

      user.setAllowAddReceipt(userIn.isAllowAddReceipt());
      user.setAllowAddCounterInvoice(userIn.isAllowAddCounterInvoice());
      user.setAllowAddAndUpdateVehicle(userIn.isAllowAddAndUpdateVehicle());
      user.setAllowUpdateCustomerInfo(userIn.isAllowUpdateCustomerInfo());
      user.setAllowUpdateVehicleStatus(userIn.isAllowUpdateVehicleStatus());

      user.setAllowAddUpdateEstimate(userIn.isAllowAddUpdateEstimate());
      user.setAllowLockEstimate(userIn.isAllowLockEstimate());
      user.setAllowUnlockEstimate(userIn.isAllowUnlockEstimate());
      user.setAllowViewReport(userIn.isAllowViewReport());
      user.setAllowAddAndUpdateReport(userIn.isAllowAddAndUpdateReport());

      user.setAllowChangeJobTargetDate(userIn.isAllowChangeJobTargetDate());

      user.setCompanyId(userIn.getCompanyId());

      // Address address = new Address(EAddressType.ADDRESS_TYPE_SHOP);

      user.setAddresses(userIn.getAddresses());

      String randomCode = UUID.randomUUID().toString();

      user.setPassword(encoder.encode(userIn.getNewPassword()));
      user.setVerificationCode(randomCode);
      user.setActivated(false);

      user = this.userRepository.save(user);

      try {
        this.sentAactivtionMail(user.getEmail(), randomCode);
      } catch (Exception ex) {

      }
      // ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(user.getUsername());
      ResponseCookie jwtCookie = jwtUtils.generateJwtCookieEmail(userIn.getEmail());

      return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
          .body(user);
    }

    return ResponseEntity.ok(new MessageResponse("User update failed !"));
  }

  @GetMapping("/search/lastname/{companyId}/{lastName}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<User>> searchCustomersByLastName(
      @PathVariable("companyId") long companyId,
      @PathVariable("lastName") String lastName) {

    LOG.info(lastName);
    List<User> users = new ArrayList<User>();

    users = this.userRepository.findByLastNameAndCompanyIdAndArchived(lastName, companyId, false);

    for (User user : users) {

      try {
        user.totalCountListed = this.autoPartRepository.countByUserIdAndStatusAndArchivedAndPublished(user.getId(),
            2, false, true);
        user.totalCountArchived = this.autoPartRepository.countByUserIdAndStatusAndArchivedAndPublished(
            user.getId(),
            2, true, true);
      } catch (Exception ex) {

      }
      user.serachCount = users.size();
      user.totalCount = users.size();
    }

    return new ResponseEntity<>(users, HttpStatus.OK);

  }

  @PostMapping("/user/lastname/page/{companyId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<User>> getAllUsersStartingWithPage(
      @PathVariable("companyId") long companyId,
      @RequestBody SearchCarrier searchCarrier) {

    LOG.info(searchCarrier.pageNumber + " " + searchCarrier.pageSize);

    int serachCount = 0;
    int totalCount = 0;

    LOG.info("" + companyId);
    List<User> users = new ArrayList<User>();

    if (searchCarrier.pageNumber >= 0 && searchCarrier.pageSize > 1 && !searchCarrier.partName.equals("")) {
      totalCount = this.userRepository.countByCompanyIdAndArchived(companyId, false);

      serachCount = this.userRepository.countByCompanyIdAndArchivedAndLastNameStartingWithIgnoreCase(
          companyId, false, searchCarrier.partName);

      users = this.userRepository.findByCompanyIdAndArchivedAndLastNameStartingWithIgnoreCase(
          companyId, false, searchCarrier.partName,
          Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));

      for (User user : users) {

        try {
          user.totalCountListed = this.autoPartRepository.countByUserIdAndStatusAndArchivedAndPublished(user.getId(),
              2, false, true);
          user.totalCountArchived = this.autoPartRepository.countByUserIdAndStatusAndArchivedAndPublished(
              user.getId(),
              2, true, true);
        } catch (Exception ex) {

        }
        user.serachCount = serachCount;
        user.totalCount = totalCount;
      }
    }
    return new ResponseEntity<>(users, HttpStatus.OK);

  }

  @PutMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<?> updateUser(@PathVariable("id") long id, @RequestBody User userIn) {

    Optional<User> userOptional = this.userRepository.findById(id);
    User user = new User();
    if (userOptional.isPresent()) {

      user = userOptional.get();
      user.setUsername(userIn.getEmail());
      // if (!userIn.getUsername().equals(user.getUsername())) {

      // if (this.userRepository.existsByUsername(userIn.getUsername())) {
      // return ResponseEntity
      // .ok(new MessageResponse("UserName [" + userIn.getUsername() + "] is taken.
      // User Update failed"));
      // }
      // }

      if (!userIn.getEmail().equals(user.getEmail())) {

        if (this.userRepository.existsByEmail(userIn.getEmail())) {
          return ResponseEntity
              .ok(new MessageResponse("Email [" + userIn.getEmail() + "] is taken. User Update failed"));
        }
      }

      user.setActivated(userIn.isActivated());
      // user.setUsername(userIn.getUsername());
      user.setBussinessname(userIn.getBussinessname());
      user.setFirstName(userIn.getFirstName());
      user.setLastName(userIn.getLastName());
      user.setEmployeeRoleId(userIn.getEmployeeRoleId());
      user.setEmail(userIn.getEmail());
      user.setPhone(userIn.getPhone());

      Set<Role> roles = new HashSet<>();

      for (Role role : userIn.getRoles()) {
        Role userRole;
        String roleName = "" + role.getName();

        switch (roleName) {
          case "ROLE_ADMIN":
            userRole = this.roleRepository.findByName(ERole.ROLE_ADMIN).get();
            break;
          case "ROLE_MODERATOR":
            userRole = this.roleRepository.findByName(ERole.ROLE_MODERATOR).get();
            break;
          case "ROLE_SHOP":
            userRole = this.roleRepository.findByName(ERole.ROLE_SHOP).get();
            break;
          case "ROLE_RECYCLER":
            userRole = this.roleRepository.findByName(ERole.ROLE_RECYCLER).get();
            break;
          default:
            userRole = this.roleRepository.findByName(ERole.ROLE_USER).get();
            break;
        }
        roles.add(userRole);
      }

      user.setRoles(roles);

      // user.setRoles(userIn.getRoles());
      user.setAllowAddPayment(userIn.isAllowAddPayment());
      user.setAllowVerifyPayment(userIn.isAllowVerifyPayment());

      user.setAllowAddCompany(userIn.isAllowAddCompany());
      user.setAllowAddEmployee(userIn.isAllowAddEmployee());
      user.setAllowAddService(userIn.isAllowAddService());
      user.setAllowAssignUser(userIn.isAllowAssignUser());
      user.setAllowAddExpense(userIn.isAllowAddExpense());
      user.setAllowMainPage(userIn.isAllowMainPage());
      user.setAllowArchiveVehicle(userIn.isAllowArchiveVehicle());
      user.setShopDisplayUser(userIn.isShopDisplayUser());
      user.setAllowUpdateJobStatus(userIn.isAllowUpdateJobStatus());
      user.setAllowUpdateUser(userIn.isAllowUpdateUser());

      user.setAllowAddUpdateAutopart(userIn.isAllowAddUpdateAutopart());
      user.setAllowAddUpdatePurchaseOrder(userIn.isAllowAddUpdatePurchaseOrder());
      user.setAllowApproveRejectPurchaseOrder(userIn.isAllowApproveRejectPurchaseOrder());

      user.setAllowAddUpdateEstimate(userIn.isAllowAddUpdateEstimate());
      user.setAllowLockEstimate(userIn.isAllowLockEstimate());
      user.setAllowUnlockEstimate(userIn.isAllowUnlockEstimate());
      user.setAllowViewReport(userIn.isAllowViewReport());
      user.setAllowAddAndUpdateReport(userIn.isAllowAddAndUpdateReport());

      user.setAllowAddNotes(userIn.isAllowAddNotes());
      user.setAllowAddReceipt(userIn.isAllowAddReceipt());
      user.setAllowAddCounterInvoice(userIn.isAllowAddCounterInvoice());
      user.setAllowAddAndUpdateVehicle(userIn.isAllowAddAndUpdateVehicle());
      user.setAllowUpdateCustomerInfo(userIn.isAllowUpdateCustomerInfo());
      user.setAllowUpdateVehicleStatus(userIn.isAllowUpdateVehicleStatus());

      user.setAllowChangeJobTargetDate(userIn.isAllowChangeJobTargetDate());

      user.setCompanyId(userIn.getCompanyId());

      // Address address = new Address(EAddressType.ADDRESS_TYPE_SHOP);

      user.setAddresses(userIn.getAddresses());

      user = this.userRepository.save(user);

      // ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(user.getUsername());
      ResponseCookie jwtCookie = jwtUtils.generateJwtCookieEmail(userIn.getEmail());

      return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
          .body(user);
    }

    return ResponseEntity.ok(new MessageResponse("User update failed !"));
  }

  @PutMapping("/activate/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<?> updateUserActivate(@PathVariable("id") long id, @RequestBody User userIn) {

    Optional<User> userOptional = this.userRepository.findById(id);
    User user = new User();
    if (userOptional.isPresent()) {

      user = userOptional.get();

      if (!userIn.getEmail().equals(user.getEmail())) {

        if (this.userRepository.existsByEmail(userIn.getEmail())) {
          return ResponseEntity
              .ok(new MessageResponse("Email [" + userIn.getEmail() + "] is taken. User Update failed"));
        }
      }

      user.setActivated(userIn.isActivated());
      // user.setUsername(userIn.getUsername());
      // user.setBussinessname(userIn.getBussinessname());
      // user.setFirstName(userIn.getFirstName());
      // user.setLastName(userIn.getLastName());
      // user.setEmployeeRoleId(userIn.getEmployeeRoleId());
      // user.setEmail(userIn.getEmail());
      // user.setPhone(userIn.getPhone());

      // Set<Role> roles = new HashSet<>();

      // for (Role role : userIn.getRoles()) {
      // Role userRole;
      // String roleName = "" + role.getName();

      // switch (roleName) {
      // case "ROLE_ADMIN":
      // userRole = this.roleRepository.findByName(ERole.ROLE_ADMIN).get();
      // break;
      // case "ROLE_MODERATOR":
      // userRole = this.roleRepository.findByName(ERole.ROLE_MODERATOR).get();
      // break;
      // case "ROLE_SHOP":
      // userRole = this.roleRepository.findByName(ERole.ROLE_SHOP).get();
      // break;
      // case "ROLE_RECYCLER":
      // userRole = this.roleRepository.findByName(ERole.ROLE_RECYCLER).get();
      // break;
      // default:
      // userRole = this.roleRepository.findByName(ERole.ROLE_USER).get();
      // break;
      // }
      // roles.add(userRole);
      // }

      // user.setRoles(roles);

      // user.setAllowAddPayment(userIn.isAllowAddPayment());
      // user.setAllowVerifyPayment(userIn.isAllowVerifyPayment());

      // user.setAllowAddCompany(userIn.isAllowAddCompany());
      // user.setAllowAddEmployee(userIn.isAllowAddEmployee());
      // user.setAllowAddService(userIn.isAllowAddService());
      // user.setAllowAssignUser(userIn.isAllowAssignUser());
      // user.setAllowMainPage(userIn.isAllowMainPage());
      // user.setAllowUpdateJobStatus(userIn.isAllowUpdateJobStatus());
      // user.setAllowUpdateUser(userIn.isAllowUpdateUser());

      // user.setAllowAddUpdateAutopart(userIn.isAllowAddUpdateAutopart());
      // user.setAllowAddUpdatePurchaseOrder(userIn.isAllowAddUpdatePurchaseOrder());
      // user.setAllowApproveRejectPurchaseOrder(userIn.isAllowApproveRejectPurchaseOrder());

      // user.setAllowAddUpdateEstimate(userIn.isAllowAddUpdateEstimate());
      // user.setAllowLockEstimate(userIn.isAllowLockEstimate());
      // user.setAllowUnlockEstimate(userIn.isAllowUnlockEstimate());

      // user.setAllowAddNotes(userIn.isAllowAddNotes());
      // user.setAllowAddReceipt(userIn.isAllowAddReceipt());
      // user.setAllowAddCounterInvoice(userIn.isAllowAddCounterInvoice());
      // user.setAllowAddAndUpdateVehicle(userIn.isAllowAddAndUpdateVehicle());
      // user.setAllowUpdateCustomerInfo(userIn.isAllowUpdateCustomerInfo());
      // user.setAllowUpdateVehicleStatus(userIn.isAllowUpdateVehicleStatus());

      // user.setAllowChangeJobTargetDate(userIn.isAllowChangeJobTargetDate());

      // user.setCompanyId(userIn.getCompanyId());

      // user.setAddresses(userIn.getAddresses());

      user = this.userRepository.save(user);

      // ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(user.getUsername());
      ResponseCookie jwtCookie = jwtUtils.generateJwtCookieEmail(userIn.getEmail());

      return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
          .body(user);
    }

    return ResponseEntity.ok(new MessageResponse("User update failed !"));
  }

  void sentAactivtionMail(String email, String uuid) {

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
      message.setSubject(domainName + " Account Activation");
      message.setText("Dear User," + "\n\n" + "please click link below to activate your account"
          + "\n\n" + this.frontendUrl + "activation/" + uuid);

      Transport.send(message);

      System.out.println("Done");

      Message messageCopy = new MimeMessage(session);
      messageCopy.setFrom(new InternetAddress(username));
      messageCopy.setRecipients(
          Message.RecipientType.TO,
          InternetAddress.parse(username));
      messageCopy.setSubject("COPY: " + domainName + " Account Activation for user [ " + email + " ]");
      messageCopy.setText("Dear User," + "\n\n" + "please click link below to activate your account"
          + "\n\n" + this.frontendUrl + "activation/" + uuid);

      Transport.send(messageCopy);

      System.out.println("messageCopy Done");

    } catch (MessagingException e) {
      e.printStackTrace();
    }
  }

  @PutMapping("/change/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<?> changePassword(@PathVariable("id") long id,
      @RequestBody ChangePasswordRequest changePasswordRequest) {

    Optional<User> userOptional = this.userRepository.findById(id);
    User user = new User();
    if (userOptional.isPresent()) {

      user = userOptional.get();

      Authentication authentication = authenticationManager
          .authenticate(
              new UsernamePasswordAuthenticationToken(user.getUsername(), changePasswordRequest.getOldPassword()));

      if (authentication.getPrincipal() != null) {
        user.setPassword(encoder.encode(changePasswordRequest.getNewPassword()));

        user = this.userRepository.save(user);

        // ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(user.getUsername());
        ResponseCookie jwtCookie = jwtUtils.generateJwtCookieEmail(user.getEmail());

        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
            .body(new MessageResponse("Password is changed successfully"));
      } else {
        return ResponseEntity
            .ok(new MessageResponse("Wrong old password"));
      }

    }

    return ResponseEntity.ok(new MessageResponse("Change Password failed !"));
  }

  @PutMapping("/reset/{id}")
  public ResponseEntity<?> resetPassword(@PathVariable("id") long id,
      @RequestBody ChangePasswordRequest changePasswordRequest) {

    Optional<User> userOptional = this.userRepository.findById(id);
    User user = new User();
    if (userOptional.isPresent()) {

      user = userOptional.get();

      // see if matches
      if (user.getVerificationCode().equals(changePasswordRequest.getOldPassword())) {

        user.setPassword(encoder.encode(changePasswordRequest.getNewPassword()));

        user = this.userRepository.save(user);

        Authentication authentication = authenticationManager
            .authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), changePasswordRequest.getNewPassword()));

        if (authentication.getPrincipal() != null) {
          // ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(user.getUsername());
          ResponseCookie jwtCookie = jwtUtils.generateJwtCookieEmail(user.getEmail());

          return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
              .body(new MessageResponse("Password is reset successfully"));
        } else {
          return ResponseEntity
              .ok(new MessageResponse("Wrong old password"));
        }

      } else {
        return ResponseEntity.badRequest()
            .body(new MessageResponse("userId does not match with the verification code"));
      }

    }

    return ResponseEntity.ok(new MessageResponse("Change Password failed !"));
  }

  @GetMapping("/all/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<?> getAllUser(@PathVariable("id") long id) {

    Optional<User> userOptional = this.userRepository.findById(id);
    User user = new User();
    if (userOptional.isPresent()) {

      user = userOptional.get();

      // ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(user.getUsername());
      ResponseCookie jwtCookie = jwtUtils.generateJwtCookieEmail(user.getEmail());

      List<User> users = this.userRepository.findAll();

      if (users.size() > 0) {
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
            .body(users);
      }

    }

    return ResponseEntity.ok(new MessageResponse("Load all users failed !"));
  }

  @GetMapping("/company/{companyId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<?> getAllCompanyUser(@PathVariable("companyId") long companyId) {

    List<User> users = this.userRepository.findByCompanyIdOrderByFirstNameAsc(companyId);

    if (users.size() > 0) {
      return new ResponseEntity<>(users, HttpStatus.OK);
    }

    return new ResponseEntity<>(null, HttpStatus.OK);

  }

  @DeleteMapping("/all/{adminId}/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<?> removeUser(@PathVariable("adminId") long adminId, @PathVariable("id") long id) {

    Optional<User> userAdminOptional = this.userRepository.findById(adminId);
    User userAdmin = new User();
    if (userAdminOptional.isPresent()) {

      userAdmin = userAdminOptional.get();

      Optional<User> userOptional = this.userRepository.findById(id);

      if (userOptional.isPresent()) {

        try {

          List<Autopart> autoparts = this.autoPartRepository.findByUserId(userOptional.get().getId());

          for (Autopart autopart : autoparts) {

            for (ImageModel imageModel : autopart.getImageModels()) {

              try {
                File f = new File(this.filePath + this.imageNamePrefix + imageModel.getId() + ".jpeg"); // file
                                                                                                        // to be
                                                                                                        // delete
                if (f.delete()) // returns Boolean value
                {
                  System.out.println(f.getName() + " deleted"); // getting and printing the file name
                }

              } catch (Exception e) {

              }

              try {
                File f = new File(
                    this.filePath + "500\\" + this.imageNamePrefix + imageModel.getId() + ".jpeg"); // file
                                                                                                    // to be
                                                                                                    // delete
                if (f.delete()) // returns Boolean value
                {
                  System.out.println(f.getName() + " deleted"); // getting and printing the file name
                }

              } catch (Exception e) {

              }

            }
            this.autoPartRepository.delete(autopart);

            // saved items
            List<SavedItem> savedItems = this.savedItemRepository.findByAutopartId(id);

            for (SavedItem savedItem : savedItems) {
              this.savedItemRepository.delete(savedItem);
            }
          }

          this.userRepository.delete(userOptional.get());
          return ResponseEntity.ok(new MessageResponse("Remove User [" + id + "] successful "));

        } catch (Exception e) {
          return ResponseEntity.ok(new MessageResponse("Remove User [" + id + "] failed "));
        }
      }

    }

    return ResponseEntity.ok(new MessageResponse("Load all users failed !"));
  }

}
