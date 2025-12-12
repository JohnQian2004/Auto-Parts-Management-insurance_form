package com.xoftex.parthub.controllers;

import java.io.InputStream;
import java.io.OutputStream;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Properties;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import java.io.InputStream;
import java.util.Base64;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.BufferedOutputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

import javax.imageio.ImageIO;
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
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.xoftex.parthub.models.Address;
import com.xoftex.parthub.models.ApprovalStatus;
import com.xoftex.parthub.models.Autopart;
import com.xoftex.parthub.models.Claim;
import com.xoftex.parthub.models.Company;
import com.xoftex.parthub.models.Customer;
import com.xoftex.parthub.models.Disclaimer;
import com.xoftex.parthub.models.DocType;
import com.xoftex.parthub.models.EAddressType;
import com.xoftex.parthub.models.ERole;
import com.xoftex.parthub.models.EmailInfo;
import com.xoftex.parthub.models.Employee;
import com.xoftex.parthub.models.EmployeeRole;
import com.xoftex.parthub.models.Expense;
import com.xoftex.parthub.models.ExpenseType;
import com.xoftex.parthub.models.ImageModelVehicle;
import com.xoftex.parthub.models.InTakeWay;
import com.xoftex.parthub.models.Insurancer;
import com.xoftex.parthub.models.ItemType;
import com.xoftex.parthub.models.Job;
import com.xoftex.parthub.models.JobRequestType;
import com.xoftex.parthub.models.KeyLocation;
import com.xoftex.parthub.models.Location;
import com.xoftex.parthub.models.Note;
import com.xoftex.parthub.models.Payment;
import com.xoftex.parthub.models.PaymentMethod;
import com.xoftex.parthub.models.PaymentStatus;
import com.xoftex.parthub.models.PaymentType;
import com.xoftex.parthub.models.PurchaseOrder;
import com.xoftex.parthub.models.PurchaseOrderVehicle;
import com.xoftex.parthub.models.Receipt;
import com.xoftex.parthub.models.Rental;
import com.xoftex.parthub.models.Role;
import com.xoftex.parthub.models.Service;
import com.xoftex.parthub.models.Status;
import com.xoftex.parthub.models.User;
import com.xoftex.parthub.models.Vehicle;
import com.xoftex.parthub.models.Vendor;
import com.xoftex.parthub.models.Warranty;
import com.xoftex.parthub.models.ZipCode;
import com.xoftex.parthub.payload.request.LoginRequest;
import com.xoftex.parthub.payload.request.SignupRequest;
import com.xoftex.parthub.payload.response.MessageResponse;
import com.xoftex.parthub.payload.response.UserInfoResponse;
import com.xoftex.parthub.repository.ApprovalStatusRepository;
import com.xoftex.parthub.repository.AutoPartRepository;
import com.xoftex.parthub.repository.ClaimRepository;
import com.xoftex.parthub.repository.CompanyRepository;
import com.xoftex.parthub.repository.CustomerRepository;
import com.xoftex.parthub.repository.DisclaimerRepository;
import com.xoftex.parthub.repository.DocTypeRepository;
import com.xoftex.parthub.repository.EmailInfoRepository;
import com.xoftex.parthub.repository.EmployeeRepository;
import com.xoftex.parthub.repository.EmployeeRoleRepository;
import com.xoftex.parthub.repository.ExpenseRepository;
import com.xoftex.parthub.repository.ExpenseTypeRepository;
import com.xoftex.parthub.repository.ImageModelVehicleRepository;
import com.xoftex.parthub.repository.InTakeWayRepository;
import com.xoftex.parthub.repository.InsurancerRepository;
import com.xoftex.parthub.repository.ItemTypeRepository;
import com.xoftex.parthub.repository.JobRepository;
import com.xoftex.parthub.repository.JobRequestTypeRepository;
import com.xoftex.parthub.repository.KeyLocationRepository;
import com.xoftex.parthub.repository.LocationRepository;
import com.xoftex.parthub.repository.NoteRepository;
import com.xoftex.parthub.repository.PaymentMethodRepository;
import com.xoftex.parthub.repository.PaymentRepository;
import com.xoftex.parthub.repository.PaymentStatusRepository;
import com.xoftex.parthub.repository.PaymentTypeRepository;
import com.xoftex.parthub.repository.PurchaseOrderRepository;
import com.xoftex.parthub.repository.PurchaseOrderVehicleRepository;
import com.xoftex.parthub.repository.ReceiptRepository;
import com.xoftex.parthub.repository.RentalRepository;
import com.xoftex.parthub.repository.RoleRepository;
import com.xoftex.parthub.repository.ServiceRepository;
import com.xoftex.parthub.repository.StatusRepository;
import com.xoftex.parthub.repository.UserRepository;
import com.xoftex.parthub.repository.VehicleRepository;
import com.xoftex.parthub.repository.VendorRepository;
import com.xoftex.parthub.repository.WarrantyRepository;
import com.xoftex.parthub.repository.ZipCodeRepository;
import com.xoftex.parthub.security.jwt.JwtUtils;
import com.xoftex.parthub.security.services.UserDetailsImpl;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

//for Angular Client (withCredentials)
//@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
// @CrossOrigin(origins = "*", maxAge = 3600)
@CrossOrigin("*")
@RestController
@RequestMapping("/api/auth")
public class AuthController {
  @Autowired
  AuthenticationManager authenticationManager;

  @Autowired
  UserRepository userRepository;

  @Autowired
  RoleRepository roleRepository;

  @Autowired
  ZipCodeRepository ZipCodeRepository;

  @Autowired
  CompanyRepository companyRepository;

  @Autowired
  PasswordEncoder encoder;

  @Autowired
  JobRequestTypeRepository jobRequestTypeRepository;

  @Autowired
  ItemTypeRepository itemTypeRepository;

  @Autowired
  StatusRepository statusRepository;

  @Autowired
  PaymentMethodRepository paymentMethodRepository;

  @Autowired
  PaymentStatusRepository paymentStatusRepository;

  @Autowired
  PaymentTypeRepository paymentTypeRepository;

  @Autowired
  ServiceRepository serviceRepository;

  @Autowired
  NoteRepository noteRepository;

  @Autowired
  VendorRepository vendorRepository;

  @Autowired
  ApprovalStatusRepository approvalStatusRepository;

  @Autowired
  InTakeWayRepository inTakeWayRepository;

  @Autowired
  LocationRepository locationRepository;

  @Autowired
  KeyLocationRepository keyLocationRepository;

  @Autowired
  EmployeeRoleRepository employeeRoleRepository;

  @Autowired
  EmployeeRepository employeeRepository;

  @Autowired
  DocTypeRepository docTypeRepository;

  @Autowired
  RentalRepository rentalRepository;

  @Autowired
  ExpenseTypeRepository expenseTypeRepository;

  @Autowired
  ExpenseRepository expenseRepository;

  @Autowired
  DisclaimerRepository disclaimerRepository;

  @Autowired
  WarrantyRepository warrantyRepository;

  @Autowired
  InsurancerRepository insurancerRepository;

  @Autowired
  CustomerRepository customerRepository;

  @Autowired
  VehicleRepository vehicleRepository;

  @Autowired
  ClaimRepository claimRepository;

  @Autowired
  ReceiptRepository receiptRepository;

  @Autowired
  AutoPartRepository autoPartRepository;

  @Autowired
  PurchaseOrderVehicleRepository purchaseOrderVehicleRepository;

  @Autowired
  ImageModelVehicleRepository imageModelVehicleRepository;

  @Autowired
  PaymentRepository paymentRepository;

  @Autowired
  JobRepository jobRepository;

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

  @Value("${image.path.vehicle}")
  // String filePath = "C:\\Projects\\images\\vehicle\\test_image_";
  String filePath = "";

  @Value("${image.root.path.vehicle}")
  // String filePath = "C:\\Projects\\images\\vehicle\\;
  String fileRootPath = "";

  String imageNamePrefix = "test_vehicle_image_";

  @Value("${image.resize.vehicle}")
  String imageResizeDirectory = "";

  private static final Logger LOG = LoggerFactory.getLogger(AuthController.class);

  // private final ActiveUserService activeUserService;

  // public AuthController(ActiveUserService activeUserService) {
  // this.activeUserService = activeUserService;
  // }

  @PostMapping("/signin")
  public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

    LOG.info("authenticateUser/signin: " + loginRequest.getUsername());

    if (!userRepository.existsByEmail(loginRequest.getUsername())) {
      return ResponseEntity.badRequest()
          .body(new MessageResponse("Not a registered user! Please enter a valid email address"));
    } else {
      Optional<User> userOptional = this.userRepository.findByEmail(loginRequest.getUsername());
      if (userOptional.isPresent()) {
        User user = userOptional.get();
        if (!user.isPartMarketOnly()) {
          Optional<Company> compamyOptional = this.companyRepository.findById(user.getCompanyId());
          if (compamyOptional.isPresent()) {
            if (compamyOptional.get().getStatus() == 1) {
              return ResponseEntity.badRequest()
                  .body(new MessageResponse("Your shop is no longer active !"));
            }
          }
        }
      }
    }

    Authentication authentication = authenticationManager
        .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

    SecurityContextHolder.getContext().setAuthentication(authentication);

    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

    // ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(user.getUsername());
    ResponseCookie jwtCookie = jwtUtils.generateJwtCookieEmail(userDetails.getEmail());

    List<String> roles = userDetails.getAuthorities().stream()
        .map(item -> item.getAuthority())
        .collect(Collectors.toList());

    if (!userDetails.isActivated()) {
      jwtCookie = jwtUtils.getCleanJwtCookie();
    }

    System.out.println(jwtCookie.toString());

    // activeUserService.addToken(userDetails.getEmail(), jwtCookie.toString());

    return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
        .body(new UserInfoResponse(userDetails.getId(),
            userDetails.getUsername(),
            userDetails.getEmail(),
            // userDetails.isEnabled(),
            userDetails.isActivated(),
            roles));
  }

  @PostMapping("/signin2")
  public ResponseEntity<?> authenticateUser2(@Valid @RequestBody LoginRequest loginRequest) {

    LOG.info("authenticateUser/signin: " + loginRequest.getUsername());

    if (!userRepository.existsByEmail(loginRequest.getUsername())) {
      return ResponseEntity.badRequest()
          .body(new MessageResponse("Not a registered user! Please enter a valid email address"));
    }

    Authentication authentication = authenticationManager
        .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

    SecurityContextHolder.getContext().setAuthentication(authentication);

    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

    // ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(user.getUsername());
    ResponseCookie jwtCookie = jwtUtils.generateJwtCookieEmail(userDetails.getEmail());

    List<String> roles = userDetails.getAuthorities().stream()
        .map(item -> item.getAuthority())
        .collect(Collectors.toList());

    if (!userDetails.isActivated()) {
      jwtCookie = jwtUtils.getCleanJwtCookie();
    }
    return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
        .body(new UserInfoResponse(userDetails.getId(),
            userDetails.getUsername(),
            userDetails.getEmail(),
            // userDetails.isEnabled(),
            userDetails.isActivated(),
            roles, jwtCookie.toString()));
  }

  @PostMapping("/signin3")
  public ResponseEntity<?> authenticateUser3(@Valid @RequestBody LoginRequest loginRequest) {

    LOG.info("authenticateUser/signin3: " + loginRequest.getUsername());

    if (!userRepository.existsByEmail(loginRequest.getUsername())) {
      return ResponseEntity.badRequest()
          .body(new MessageResponse("Not a registered user! Please enter a valid email address"));
    }

    Authentication authentication = authenticationManager
        .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

    SecurityContextHolder.getContext().setAuthentication(authentication);

    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

    // ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(user.getUsername());
    ResponseCookie jwtCookie = jwtUtils.generateJwtCookieEmail(userDetails.getEmail());

    if (!userDetails.isActivated()) {
      jwtCookie = jwtUtils.getCleanJwtCookie();
    }

    Optional<User> userOptional = this.userRepository.findById(userDetails.getId());
    User user = new User();
    if (userOptional.isPresent()) {
      user = userOptional.get();
      if (user.getCompanyId() > 0) {

        Optional<Company> compamyOptional = this.companyRepository.findById(user.getCompanyId());
        if (compamyOptional.isPresent()) {
          user.setCompanyUuid(compamyOptional.get().getToken());
          user.setCompanyName(compamyOptional.get().getName());
        }
      }

    }
    return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
        .body(user);
  }

  @PostMapping("/resendemail")
  public ResponseEntity<?> resentActivationEmail(@Valid @RequestBody LoginRequest loginRequest) {

    Optional<User> userOptional = this.userRepository.findByUsername(loginRequest.getUsername());
    User user = new User();
    ResponseCookie cookie = jwtUtils.getCleanJwtCookie();
    if (userOptional.isPresent()) {

      user = userOptional.get();
      List<String> roles = user.getRoles().stream()
          .map(item -> item.getName())
          .map(Objects::toString)
          .collect(Collectors.toList());

      try {
        this.sentAactivtionMail(user.getEmail(), user.getVerificationCode());
      } catch (Exception ex) {
        LOG.info(ex.getMessage());
      }

      return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString())
          .body(new UserInfoResponse(user.getId(),
              user.getUsername(),
              user.getEmail(),
              user.isActivated(),
              roles));

    }

    return ResponseEntity.ok(new MessageResponse("Username Not Found !"));

  }

  @PostMapping("/forgetpassword")
  public ResponseEntity<?> forgetPasswordEmail(@Valid @RequestBody LoginRequest loginRequest) {

    Optional<User> userOptional = this.userRepository.findByUsername(loginRequest.getUsername());
    User user = new User();

    if (userOptional.isPresent()) {

      user = userOptional.get();

      String randomCode = UUID.randomUUID().toString();

      user.setVerificationCode(randomCode);

      user = this.userRepository.save(user);

      try {
        this.sentPasswordResetMail(user.getEmail(), user.getVerificationCode());
      } catch (Exception ex) {
        System.out.println(ex.getMessage());
      }

      return ResponseEntity.badRequest().body(new MessageResponse("Please check your email to reset password"));

    }

    return ResponseEntity.badRequest().body(new MessageResponse("Your email is not found, please provide valid email"));

  }

  @GetMapping("/activate/{uuid}")
  public ResponseEntity<?> activateUser(@PathVariable("uuid") String uuid) {

    Optional<User> userOptional = this.userRepository.findByVerificationCode(uuid);
    User user = new User();
    if (userOptional.isPresent()) {

      user = userOptional.get();
      user.setActivated(true);
      this.userRepository.save(user);

      // ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(user.getUsername());
      ResponseCookie jwtCookie = jwtUtils.generateJwtCookieEmail(user.getEmail());

      List<String> roles = user.getRoles().stream()
          .map(item -> item.getName())
          .map(Objects::toString)
          .collect(Collectors.toList());

      return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
          .body(new UserInfoResponse(user.getId(),
              user.getUsername(),
              user.getEmail(),
              // userDetails.isEnabled(),
              user.isActivated(),
              roles));
    }

    return ResponseEntity.ok(new MessageResponse("User Not Found !"));
  }

  @GetMapping("/verification/{uuid}")
  public ResponseEntity<?> verifyUser(@PathVariable("uuid") String uuid) {

    Optional<User> userOptional = this.userRepository.findByVerificationCode(uuid);
    User user = new User();
    if (userOptional.isPresent()) {

      user = userOptional.get();

      // ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(user.getUsername());
      ResponseCookie jwtCookie = jwtUtils.generateJwtCookieEmail(user.getEmail());

      List<String> roles = user.getRoles().stream()
          .map(item -> item.getName())
          .map(Objects::toString)
          .collect(Collectors.toList());

      return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
          .body(new UserInfoResponse(user.getId(),
              user.getUsername(),
              user.getEmail(),
              // userDetails.isEnabled(),
              user.isActivated(),
              roles));
    }

    return ResponseEntity.ok(new MessageResponse("User verification failed !"));
  }

  @PostMapping("/signup")
  public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
    // if (userRepository.existsByUsername(signUpRequest.getUsername())) {
    // return ResponseEntity.badRequest().body(new MessageResponse("Error: Username
    // is already taken!"));
    // }

    if (userRepository.existsByEmail(signUpRequest.getEmail())) {
      return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
    }

    // Create new user's account
    // User user = new User(signUpRequest.getUsername(),
    // signUpRequest.getEmail(),
    // encoder.encode(signUpRequest.getPassword()));

    User user = new User(signUpRequest.getEmail(),
        signUpRequest.getEmail(),
        encoder.encode(signUpRequest.getPassword()));

    Set<String> strRoles = signUpRequest.getRole();
    Set<Role> roles = new HashSet<>();

    if (signUpRequest.getRole() == null) {
      Role userRole = roleRepository.findByName(ERole.ROLE_USER)
          .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
      roles.add(userRole);
    } else {
      strRoles.forEach(role -> {
        switch (role) {
          case "ROLE_ADMIN":
            Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(adminRole);

            break;
          case "ROLE_MODERATOR":
            Role modRole = roleRepository.findByName(ERole.ROLE_MODERATOR)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(modRole);
            break;

          case "ROLE_SHOP":
            Role modShop = roleRepository.findByName(ERole.ROLE_SHOP)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(modShop);
            break;

          case "ROLE_RECYCLER":
            Role modRecycler = roleRepository.findByName(ERole.ROLE_RECYCLER)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(modRecycler);

            break;
          default:
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        }
      });
    }
    String randomCode = UUID.randomUUID().toString();

    Address address = new Address();
    address.setName(EAddressType.ADDRESS_TYPE_DEFAULT);
    address.setCity(signUpRequest.getCity());
    address.setStreet(signUpRequest.getStreet());
    address.setState(signUpRequest.getState());

    Optional<ZipCode> zipCOptional = this.ZipCodeRepository.findByZip(signUpRequest.getZip());

    if (zipCOptional.isPresent()) {

      address.setZip(signUpRequest.getZip());
      address.setLat(zipCOptional.get().getLat());
      address.setLng(zipCOptional.get().getLng());

    } else {
      return ResponseEntity.badRequest()
          .body(new MessageResponse("Error: Zip Code [" + signUpRequest.getZip() + "] is not valid."));

    }

    user.getAddresses().add(address);

    if (signUpRequest.getBussinessname() != null) {
      user.setBussinessname(signUpRequest.getBussinessname());
      address.setName(EAddressType.ADDRESS_TYPE_SHOP);
    }

    if (signUpRequest.getBussinessurl() != null) {
      user.setBussinessUrl(signUpRequest.getBussinessurl());
    }

    if (signUpRequest.getPhone() != null)
      user.setPhone(signUpRequest.getPhone());

    user.setVerificationCode(randomCode);
    user.setActivated(false);

    user.setRoles(roles);

    if (signUpRequest.getFirstName() != null) {
      user.setFirstName(signUpRequest.getFirstName());
    }
    if (signUpRequest.getLastName() != null) {
      user.setLastName(signUpRequest.getLastName());
    }
    if (signUpRequest.getCompanyId() != 0) {
      user.setCompanyId(signUpRequest.getCompanyId());
      List<User> users = this.userRepository.findByCompanyIdOrderByFirstNameAsc(signUpRequest.getCompanyId());

      // first users
      if (users.size() == 0) {
        // grand all privilages
        // user.setAllowAddCompany(true);
        user.setAllowAddEmployee(true);
        user.setAllowAddService(true);
        user.setAllowAddPayment(true);
        user.setAllowVerifyPayment(true);
        user.setAllowAssignUser(true);
        user.setAllowAddExpense(true);
        user.setAllowMainPage(true);
        user.setAllowArchiveVehicle(true);
        user.setShopDisplayUser(false);
        user.setAllowUpdateJobStatus(true);
        user.setAllowUpdateUser(true);
        user.setAllowAddNotes(true);
        user.setAllowAddReceipt(true);
        user.setAllowAddCounterInvoice(true);
        user.setAllowAddUpdateAutopart(true);
        user.setAllowAddAndUpdateVehicle(true);
        user.setAllowUpdateCustomerInfo(true);
        user.setAllowUpdateVehicleStatus(true);
        user.setAllowChangeJobTargetDate(true);
        user.setAllowAddUpdatePurchaseOrder(true);
        user.setAllowApproveRejectPurchaseOrder(true);
        user.setAllowAddUpdateEstimate(true);
        user.setAllowLockEstimate(true);
        user.setAllowUnlockEstimate(true);
        user.setAllowViewReport(true);
        user.setAllowAddAndUpdateReport(true);
      } else {

        // Optional<Role> userRole = roleRepository.findByName(ERole.ROLE_USER);
        // if (userRole.isPresent()) {
        // Set<Role> roles2 = new HashSet<>();
        // roles2.add(userRole.get());
        // user.setRoles(roles2);
        // }
      }
    }

    userRepository.save(user);
    try {
      this.sentAactivtionMail(user.getEmail(), randomCode);
    } catch (Exception ex) {
      System.out.println(ex.getMessage());
    }
    ResponseCookie cookie = jwtUtils.getCleanJwtCookie();

    return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString())
        .body(new MessageResponse("User registered successfully, please check your emial to activate!"));

  }

  @PostMapping("/signup3")
  public ResponseEntity<?> registerUserPublic(@Valid @RequestBody SignupRequest signUpRequest) {
    // if (userRepository.existsByUsername(signUpRequest.getUsername())) {
    // return ResponseEntity.badRequest().body(new MessageResponse("Error: Username
    // is already taken!"));
    // }

    Company company = new Company();
    Company companyNew = null;
    Address address = new Address();

    if (userRepository.existsByEmail(signUpRequest.getEmail())) {
      return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
    }

    // Create new user's account
    // User user = new User(signUpRequest.getUsername(),
    // signUpRequest.getEmail(),
    // encoder.encode(signUpRequest.getPassword()));

    Optional<ZipCode> zipCOptional = this.ZipCodeRepository.findByZip(signUpRequest.getZip());

    if (zipCOptional.isPresent()) {

      address.setZip(signUpRequest.getZip());
      address.setLat(zipCOptional.get().getLat());
      address.setLng(zipCOptional.get().getLng());

    } else {
      return ResponseEntity.badRequest()
          .body(new MessageResponse("Error: Zip Code [" + signUpRequest.getZip() + "] is not valid."));

    }

    User user = new User(signUpRequest.getEmail(),
        signUpRequest.getEmail(),
        encoder.encode(signUpRequest.getPassword()));

    Set<String> strRoles = signUpRequest.getRole();
    Set<Role> roles = new HashSet<>();

    if (signUpRequest.getRole() == null) {
      Role userRole = roleRepository.findByName(ERole.ROLE_USER)
          .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
      roles.add(userRole);
    } else {

      strRoles.forEach(role -> {
        switch (role) {
          case "ROLE_ADMIN":
            Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(adminRole);

            break;
          case "ROLE_MODERATOR":
            Role modRole = roleRepository.findByName(ERole.ROLE_MODERATOR)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(modRole);
            break;

          case "ROLE_SHOP":
            Role modShop = roleRepository.findByName(ERole.ROLE_SHOP)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(modShop);

            break;

          case "ROLE_RECYCLER":
            Role modRecycler = roleRepository.findByName(ERole.ROLE_RECYCLER)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(modRecycler);

            break;
          default:
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);

        }
      });
    }

    for (Role role : roles) {
      if (role.getName() == ERole.ROLE_SHOP) {
        try {
          company.setName(signUpRequest.getBussinessname());
          company.setUrl(signUpRequest.getBussinessurl());
          company.setType((long) 0);
          company.setEmail(signUpRequest.getEmail());
          company.setPhone(signUpRequest.getPhone());
          company.setTaxRate((float) 0.06);
          company.setManagementRate((float) 0.4);
          company.setStreet(signUpRequest.getStreet());
          company.setCity(signUpRequest.getCity());
          company.setState(signUpRequest.getState());
          company.setZip(signUpRequest.getZip());
          company.setSlogan("Change Me");
          company.setNotes("Change Me");
          String randomCode = UUID.randomUUID().toString();
          company.setToken(randomCode);
          companyNew = this.companyRepository.save(company);

          user.setPartMarketOnly(false);

          user.setAllowAddCompany(true);
          user.setAllowAddEmployee(true);
          user.setAllowAddService(true);
          user.setAllowAddPayment(true);
          user.setAllowVerifyPayment(true);
          user.setAllowAssignUser(true);
          user.setAllowAddExpense(true);
          user.setAllowMainPage(true);
          user.setAllowArchiveVehicle(true);
          user.setAllowUpdateJobStatus(true);
          user.setAllowUpdateUser(true);
          user.setAllowAddNotes(true);
          user.setAllowAddReceipt(true);
          user.setAllowAddCounterInvoice(true);
          user.setAllowAddUpdateAutopart(true);
          user.setAllowAddAndUpdateVehicle(true);
          user.setAllowUpdateCustomerInfo(true);
          user.setAllowUpdateVehicleStatus(true);
          user.setAllowChangeJobTargetDate(true);
          user.setAllowAddUpdatePurchaseOrder(true);
          user.setAllowApproveRejectPurchaseOrder(true);
          user.setAllowAddUpdateEstimate(true);
          user.setAllowLockEstimate(true);
          user.setAllowUnlockEstimate(true);
        } catch (Exception ex) {
          LOG.info(ex.getMessage());
        }
      }
      if (role.getName() == ERole.ROLE_RECYCLER || role.getName() == ERole.ROLE_USER) {
        user.setPartMarketOnly(true);
        user.setAllowAddUpdateAutopart(true);
      }
    }

    String randomCode = UUID.randomUUID().toString();

    address.setName(EAddressType.ADDRESS_TYPE_DEFAULT);
    address.setCity(signUpRequest.getCity());
    address.setStreet(signUpRequest.getStreet());
    address.setState(signUpRequest.getState());

    user.getAddresses().add(address);

    if (signUpRequest.getBussinessname() != null) {
      user.setBussinessname(signUpRequest.getBussinessname());
      address.setName(EAddressType.ADDRESS_TYPE_SHOP);
    }

    if (signUpRequest.getBussinessurl() != null) {
      user.setBussinessUrl(signUpRequest.getBussinessurl());
    }

    if (signUpRequest.getPhone() != null)
      user.setPhone(signUpRequest.getPhone());

    user.setVerificationCode(randomCode);
    user.setActivated(false);

    user.setRoles(roles);

    if (signUpRequest.getFirstName() != null) {
      user.setFirstName(signUpRequest.getFirstName());
    }
    if (signUpRequest.getLastName() != null) {
      user.setLastName(signUpRequest.getLastName());
    }
    // if (signUpRequest.getCompanyId() != 0) {
    // user.setCompanyId(signUpRequest.getCompanyId());
    // List<User> users =
    // this.userRepository.findByCompanyIdOrderByFirstNameAsc(signUpRequest.getCompanyId());

    // // first users
    // if (users.size() == 0) {
    // // grand all privilages
    // // user.setAllowAddCompany(true);
    // user.setAllowAddEmployee(true);
    // user.setAllowAddService(true);
    // user.setAllowAddPayment(true);
    // user.setAllowVerifyPayment(true);
    // user.setAllowAssignUser(true);
    // user.setAllowUpdateJobStatus(true);
    // user.setAllowUpdateUser(true);
    // user.setAllowAddNotes(true);
    // user.setAllowAddReceipt(true);
    // user.setAllowAddCounterInvoice(true);
    // user.setAllowAddUpdateAutopart(true);
    // user.setAllowAddAndUpdateVehicle(true);
    // user.setAllowUpdateCustomerInfo(true);
    // user.setAllowUpdateVehicleStatus(true);
    // user.setAllowChangeJobTargetDate(true);
    // user.setAllowAddUpdatePurchaseOrder(true);
    // user.setAllowApproveRejectPurchaseOrder(true);

    // } else {

    // user.setPartMarketOnly(true);
    // Optional<Role> userRole = roleRepository.findByName(ERole.ROLE_USER);
    // if (userRole.isPresent()) {
    // Set<Role> roles2 = new HashSet<>();
    // roles2.add(userRole.get());
    // user.setRoles(roles2);
    // }
    // }
    // }

    if (companyNew != null) {
      user.setCompanyId(companyNew.getId());
    }

    user = userRepository.save(user);

    if (companyNew != null) {
      companyNew.setUserId(user.getId());
      this.companyRepository.save(companyNew);

      // required filed when creating vehicle and working with all shop aspects:
      // jobRequestType, status, itemType, vendor, pre-defined jobs, paymentMethod etc

      String[] jobRequestTypes = { "Mechanical", "Cash", "Insurance", "Others", "Warranty" };
      if (jobRequestTypes.length > 0) {
        for (String jobRequestTypeStr : jobRequestTypes) {
          JobRequestType jobRequestType = new JobRequestType();
          jobRequestType.setName(jobRequestTypeStr);
          jobRequestType.setComments(jobRequestTypeStr);
          jobRequestType.setCompanyId(companyNew.getId());
          jobRequestType.setUserId(user.getId());
          this.jobRequestTypeRepository.save(jobRequestType);
        }
      }

      String[] itemTypesString = { "Agreed", "Labor", "Parts", "Parts & Labor", "Service" };
      if (itemTypesString.length > 0) {
        for (String itemTypeStr : itemTypesString) {
          ItemType itemType = new ItemType();
          itemType.setName(itemTypeStr);
          itemType.setComments(itemTypeStr);
          itemType.setCompanyId(companyNew.getId());
          itemType.setUserId(user.getId());
          if (itemTypeStr.equals("Labor") || itemTypeStr.equals("Service")) {
            itemType.setCreateJobOrder(true);
          }
          if (itemTypeStr.equals("Service")) {
            itemType.setCreateJobOrder(true);
          }
          if (itemTypeStr.equals("Parts")) {
            itemType.setCreatePurchaseOrder(true);
          }
          if (itemTypeStr.equals("Parts & Labor")) {
            itemType.setCreateJobOrder(true);
            itemType.setCreatePurchaseOrder(true);
          }

          this.itemTypeRepository.save(itemType);

        }
      }

      String[] statussString = { "Approved", "Work In Progress", "New Job", "Delivered", "Parts Pending", "Ready",
          "Need Estimate" };
      if (statussString.length > 0) {
        for (String statusStr : statussString) {
          Status status = new Status();
          status.setCompanyId(companyNew.getId());
          status.setUserId(user.getId());
          status.setName(statusStr);
          status.setComments(statusStr);
          this.statusRepository.save(status);
        }
      }

      String[] paymentMethodString = { "Cash", "Debt", "Credit Card", "Check", "Insurance Check",
          "Personal Check", "Cash App", "Zeller" };
      if (paymentMethodString.length > 0) {
        for (String paymentMethodStr : paymentMethodString) {
          PaymentMethod paymentMethod = new PaymentMethod();
          paymentMethod.setCompanyId(companyNew.getId());
          paymentMethod.setUserId(user.getId());
          paymentMethod.setName(paymentMethodStr);
          paymentMethod.setComments(paymentMethodStr);
          this.paymentMethodRepository.save(paymentMethod);
        }
      }

      String[] paymentTypesString = { "Auto Warranty", "Collisions", "Final Payment", "Storage Charges", "Supplement" };
      if (paymentTypesString.length > 0) {
        for (String paymentTypeStr : paymentTypesString) {
          PaymentType paymentType = new PaymentType();
          paymentType.setCompanyId(companyNew.getId());
          paymentType.setUserId(user.getId());
          paymentType.setName(paymentTypeStr);
          paymentType.setComments(paymentTypeStr);
          this.paymentTypeRepository.save(paymentType);
        }
      }

      String[] paymentStatussString = { "Deposit Received", "Paid In Full", "Place on Credit Account", "Unpaid",
          "Verified" };
      if (paymentStatussString.length > 0) {
        for (String paymentStatusStr : paymentStatussString) {
          PaymentStatus paymentStatus = new PaymentStatus();
          paymentStatus.setCompanyId(companyNew.getId());
          paymentStatus.setUserId(user.getId());
          paymentStatus.setName(paymentStatusStr);
          paymentStatus.setComments(paymentStatusStr);
          this.paymentStatusRepository.save(paymentStatus);
        }
      }

      String[] approvalStatussString = { "Approved", "On-Hold", "Pending" };
      if (approvalStatussString.length > 0) {
        for (String approvalStatusStr : approvalStatussString) {
          ApprovalStatus approvalStatus = new ApprovalStatus();
          approvalStatus.setCompanyId(companyNew.getId());
          approvalStatus.setUserId(user.getId());
          approvalStatus.setName(approvalStatusStr);
          approvalStatus.setComments(approvalStatusStr);
          this.approvalStatusRepository.save(approvalStatus);
        }
      }

      String[] inTakeWaysString = { "Drove-in", "Tow-In by Customer", "Tow-In by shop" };
      if (inTakeWaysString.length > 0) {
        for (String inTakeWayStr : inTakeWaysString) {
          InTakeWay inTakeWay = new InTakeWay();
          inTakeWay.setCompanyId(companyNew.getId());
          inTakeWay.setUserId(user.getId());
          inTakeWay.setName(inTakeWayStr);
          inTakeWay.setComments(inTakeWayStr);
          this.inTakeWayRepository.save(inTakeWay);
        }
      }

      String[] locationsString = { "Front Lot", "Side Lot", "Back Lot" };
      if (locationsString.length > 0) {
        for (String locationStr : locationsString) {
          Location location = new Location();
          location.setCompanyId(companyNew.getId());
          location.setUserId(user.getId());
          location.setName(locationStr);
          location.setComments(locationStr);
          this.locationRepository.save(location);
        }
      }

      String[] keyLocationsString = { "Front Office Board", "Shop Board" };
      if (keyLocationsString.length > 0) {
        for (String keyLocationStr : keyLocationsString) {
          KeyLocation keyLocation = new KeyLocation();
          keyLocation.setCompanyId(companyNew.getId());
          keyLocation.setUserId(user.getId());
          keyLocation.setName(keyLocationStr);
          keyLocation.setComments(keyLocationStr);
          this.keyLocationRepository.save(keyLocation);
        }
      }

      String[] docTypesString = { "Prior repairs", "After repairs", "Estimate", "Supplement", "Parts", "Others" };
      if (docTypesString.length > 0) {
        for (String docTypeStr : docTypesString) {
          DocType docType = new DocType();
          docType.setCompanyId(companyNew.getId());
          docType.setUserId(user.getId());
          docType.setName(docTypeStr);
          docType.setComments(docTypeStr);
          this.docTypeRepository.save(docType);
        }
      }

      String[] employeeRolesString = { "Admin", "Service Manager", "Service Writer", "Mechanic", "Cashier",
          "Customer Service", "Parts manager", "Painter", "Detailer", "Body Mechanic" };
      if (employeeRolesString.length > 0) {
        for (String employeeRoleStr : employeeRolesString) {
          EmployeeRole employeeRole = new EmployeeRole();
          employeeRole.setCompanyId(companyNew.getId());
          employeeRole.setUserId(user.getId());
          employeeRole.setName(employeeRoleStr);
          employeeRole.setComments(employeeRoleStr);
          employeeRole.setPrecentage(10);

          this.employeeRoleRepository.save(employeeRole);
        }
      }

      String[] employeesString = { "Employee", "Employee", "Employee", "Employee", "Employee",
          "Employee", "Employee", "Employee", "Employee", "Employee" };
      List<EmployeeRole> employeeRoles = this.employeeRoleRepository.findByCompanyIdOrderByNameAsc(companyNew.getId());

      for (int i = 0; i < employeesString.length; i++) {
        Employee employee = new Employee();
        randomCode = UUID.randomUUID().toString();
        employee.setToken(randomCode);
        employee.setCompanyId(companyNew.getId());
        employee.setUserId(user.getId());
        employee.setRoleId(employeeRoles.get(i).getId());
        employee.setFirstName(employeesString[i]);
        employee.setLastName(" " + (i + 1));
        employee.setPhone("0000000000");
        this.employeeRepository.save(employee);
      }

      String[] servicesString = { "Any", "Axle Replace", "Break Pads", "Engine Oil Change", "Transmission Oil Change",
          "Tune Up", "Alignment", "Diagnostics", "Body Work", "Car Painting" };
      if (servicesString.length > 0) {
        for (String serviceStr : servicesString) {
          Service service = new Service();
          service.setCompanyId(companyNew.getId());
          service.setUserId(user.getId());
          service.setName(serviceStr);
          service.setComments(serviceStr);
          this.serviceRepository.save(service);
        }
      }

      String[] vendorsString = { "Toyota", "Nissan", "ebay", "Amazon", "Dealer", "Others" };
      if (vendorsString.length > 0) {
        for (String vendorStr : vendorsString) {
          Vendor vendor = new Vendor();
          vendor.setCompanyId(companyNew.getId());
          vendor.setUserId(user.getId());
          vendor.setName(vendorStr);
          vendor.setContactFirstName("Change Me");
          vendor.setContactLastName("Change Me");
          vendor.setPhone("0000000000");
          vendor.setUrl("www.google.com");
          vendor.setEmail("test@gmail.com");
          this.vendorRepository.save(vendor);
        }
      }

      String[] insuranersString = { "GEICO", "AllState", "Erie", "Farmers", "Progressive", "Others" };
      if (insuranersString.length > 0) {
        for (String insuranerStr : insuranersString) {
          Insurancer insuraner = new Insurancer();
          insuraner.setCompanyId(companyNew.getId());
          insuraner.setUserId(user.getId());
          insuraner.setName(insuranerStr);
          insuraner.setContactFirstName("Change Me");
          insuraner.setContactLastName("Change Me");
          insuraner.setPhone("0000000000");
          insuraner.setUrl("www.google.com");
          insuraner.setEmail("test@gmail.com");
          this.insurancerRepository.save(insuraner);
        }
      }

      String[] rentalsString = { "Enterprise", "Hertz", "NextCar", "Avis", "Others" };
      if (rentalsString.length > 0) {
        for (String rentalStr : rentalsString) {
          Rental rental = new Rental();
          rental.setCompanyId(companyNew.getId());
          rental.setUserId(user.getId());
          rental.setName(rentalStr);
          rental.setContactFirstName("Change Me");
          rental.setContactLastName("Change Me");
          rental.setPhone("0000000000");
          rental.setUrl("www.google.com");
          rental.setEmail("test@gmail.com");
          this.rentalRepository.save(rental);
        }
      }

      String[] expenseTypesString = { "Mechanic supplies", "Office supplies", "Painting supplies",
          "Body shop supplies", "Others" };
      if (expenseTypesString.length > 0) {
        for (String expenseTypeStr : expenseTypesString) {
          ExpenseType expenseType = new ExpenseType();
          expenseType.setCompanyId(companyNew.getId());
          expenseType.setUserId(user.getId());
          expenseType.setName(expenseTypeStr);
          expenseType.setComments(expenseTypeStr);
          this.expenseTypeRepository.save(expenseType);
        }
      }

      String disclaimerStr = "Please Change Me";
      Disclaimer disclaimer = new Disclaimer();
      disclaimer.setCompanyId(companyNew.getId());
      disclaimer.setUserId(user.getId());
      disclaimer.setText(disclaimerStr);
      disclaimer.setName(disclaimerStr);
      disclaimer.isDefault = true;

      this.disclaimerRepository.save(disclaimer);

      String warrentyStr = "Please Change Me";
      Warranty warrenty = new Warranty();
      warrenty.setCompanyId(companyNew.getId());
      warrenty.setUserId(user.getId());
      warrenty.setText(warrentyStr);
      warrenty.setName(warrentyStr);
      warrenty.isDefault = true;

      this.warrantyRepository.save(warrenty);

      Customer customer = new Customer();
      customer.setCompanyId(companyNew.getId());
      customer.setTitle("Mr");
      customer.setFirstName("Bill");
      customer.setLastName("Smith");
      customer.setPhone("0000000000");

      customer.setStreet("123 Blue Rd");
      customer.setCity("Baltimore");
      customer.setState("MD");
      customer.setZip("21234");
      customer.setNotes("This is a test cutomer");

      customer = this.customerRepository.save(customer);

      Vehicle vehicle = new Vehicle();

      vehicle.setCompanyId(companyNew.getId());
      vehicle.setUserId(user.getId());
      randomCode = UUID.randomUUID().toString();
      vehicle.setToken(randomCode);

      vehicle.setCustomer(customer);

      vehicle.setYear(2019);
      vehicle.setMake("Lamborghini");
      vehicle.setModel("Urus");
      vehicle.setColor("Black");
      vehicle.setVin("ZPBUA1ZL9KLA00848");
      vehicle.setClaimNumber("12345678");
      vehicle.setInsuranceCompany("GEICO");

      List<Insurancer> insurancers = this.insurancerRepository.findByCompanyIdOrderByNameAsc(companyNew.getId());
      if (!insurancers.isEmpty())
        vehicle.setInsuranceCompanyId(insurancers.get(0).getId());

      vehicle.setPrice(1000);
      vehicle.setReason("New");
      vehicle.setComments("4dr SUV AWD (4.0L 8cyl Turbo 8A)");
      vehicle.setDescription("4dr SUV AWD (4.0L 8cyl Turbo 8A)");
      vehicle.setTargetDate(new Date());
      vehicle.setWorkRequest("Body Work");
      vehicle.setPriorDamage("There is no prior damages");

      List<JobRequestType> jobRequestTypess = this.jobRequestTypeRepository
          .findByCompanyIdOrderByNameAsc(companyNew.getId());
      if (!jobRequestTypess.isEmpty())
        vehicle.setJobRequestType((int) jobRequestTypess.get(0).getId());

      List<Status> statuss = this.statusRepository.findByCompanyIdOrderByNameAsc(companyNew.getId());
      if (!statuss.isEmpty())
        vehicle.setStatus((int) statuss.get(0).getId());

      List<Employee> employees = this.employeeRepository.findByCompanyIdOrderByFirstNameAsc(companyNew.getId());
      if (!employees.isEmpty())
        vehicle.setAssignedTo((int) employees.get(0).getId());

      List<KeyLocation> keyLocations = this.keyLocationRepository.findByCompanyIdOrderByNameAsc(companyNew.getId());
      if (!keyLocations.isEmpty())
        vehicle.setKeyLocation((int) keyLocations.get(0).getId());

      vehicle = this.vehicleRepository.save(vehicle);

      Claim claim = new Claim();
      claim.setVehicleId(vehicle.getId());
      claim.setUserId(user.getId());

      randomCode = UUID.randomUUID().toString();
      claim.setToken(randomCode);

      claim.setAmount(100);
      claim.setQuantity(1);
      claim.setName("Change me");
      // claim.setComments("Test Item");
      claim.setNotes("Test Estimate Item");

      List<ItemType> itemTypes = this.itemTypeRepository.findByCompanyIdOrderByNameAsc(companyNew.getId());
      if (!itemTypes.isEmpty())
        claim.setItemType((int) itemTypes.get(1).getId());

      claim = this.claimRepository.save(claim);

      Receipt receipt = new Receipt();
      receipt.setVehicleId(vehicle.getId());
      receipt.setUserId(user.getId());
      receipt.setClaimId(claim.getId());

      randomCode = UUID.randomUUID().toString();
      receipt.setToken(randomCode);

      receipt.setAmount(100);
      receipt.setQuantity(1);
      receipt.setName("Change me");
      // claim.setComments("Test Item");
      receipt.setNotes("Test Receipt Item");

      // List<ItemType> itemTypes =
      // this.itemTypeRepository.findByCompanyIdOrderByNameAsc(companyNew.getId());
      if (!itemTypes.isEmpty())
        receipt.setItemType((int) itemTypes.get(1).getId());

      this.receiptRepository.save(receipt);

      Payment payment = new Payment();

      payment.setVehicleId(vehicle.getId());
      payment.setUserId(user.getId());
      randomCode = UUID.randomUUID().toString();
      payment.setToken(randomCode);
      payment.setAmount(100);
      payment.setComments("Test Payment Item");
      payment.setNotes("Test Payment Item");
      payment.setDate(new Date());
      payment.setName("Test");

      List<PaymentMethod> paymentMethods = this.paymentMethodRepository
          .findByCompanyIdOrderByNameAsc(companyNew.getId());
      if (!paymentMethods.isEmpty())
        payment.setPaymentMethodId(paymentMethods.get(0).getId());

      List<PaymentType> paymentTypes = this.paymentTypeRepository.findByCompanyIdOrderByNameAsc(companyNew.getId());
      if (!paymentTypes.isEmpty())
        payment.setPaymentTypeId(paymentTypes.get(0).getId());

      List<PaymentStatus> paymentStatuss = this.paymentStatusRepository
          .findByCompanyIdOrderByNameAsc(companyNew.getId());
      if (!paymentStatuss.isEmpty())
        payment.setPaymentStatusId(paymentStatuss.get(0).getId());

      this.paymentRepository.save(payment);

      Job job = new Job();
      job.setVehicleId(vehicle.getId());
      job.setUserId(user.getId());
      job.setNotes("Test Job");
      job.setName("Test Job");
      job.setPrice(20);
      job.setStatus(1);

      if (!employees.isEmpty())
        job.setEmployeeId(employees.get(0).getId());

      this.jobRepository.save(job);

      Autopart autopart = new Autopart();
      autopart.setCompanyId(companyNew.getId());

      autopart.setVehicleId(vehicle.getId());
      autopart.setUserId(user.getId());
      autopart.setPartName("Test Auto Parts");
      autopart.setTitle("Test Auto Parts");

      autopart.setPartNumber("1234567");
      autopart.setComments("Test Auto Parts");
      autopart.setDescription("Test Auto Parts");
      autopart.setOrdered(true);
      autopart.setGrade("New");
      autopart.setPrice(100);
      autopart.setSalePrice(100);

      randomCode = UUID.randomUUID().toString();
      autopart.setToken(randomCode);

      List<Vendor> vendors = this.vendorRepository.findByCompanyIdOrderByNameAsc(companyNew.getId());
      if (!vendors.isEmpty())
        autopart.setVendorId(vendors.get(0).getId());

      this.autoPartRepository.save(autopart);

      PurchaseOrderVehicle purchaseOrderVehicle = new PurchaseOrderVehicle();

      purchaseOrderVehicle.setVehicleId(vehicle.getId());
      purchaseOrderVehicle.setUserId(user.getId());
      purchaseOrderVehicle.setTitle("Test Purchase Order");
      purchaseOrderVehicle.setPartName("Test Auto Parts");
      purchaseOrderVehicle.setPartNumber("1234567");
      purchaseOrderVehicle.setComments("Test Auto Parts");
      purchaseOrderVehicle.setDescription("Test Auto Parts");

      purchaseOrderVehicle.setGrade("New");
      purchaseOrderVehicle.setPrice(100);
      randomCode = UUID.randomUUID().toString();
      purchaseOrderVehicle.setToken(randomCode);

      // List<Vendor> vendors =
      // this.vendorRepository.findByCompanyIdOrderByNameAsc(companyNew.getId());
      if (!vendors.isEmpty())
        purchaseOrderVehicle.setVendorId(vendors.get(0).getId());

      this.purchaseOrderVehicleRepository.save(purchaseOrderVehicle);

      List<ExpenseType> expenseTypes = this.expenseTypeRepository.findByCompanyIdOrderByNameAsc(companyNew.getId());
      if (!expenseTypes.isEmpty()) {
        Expense expense = new Expense();
        expense.setCompanyId(companyNew.getId());
        expense.setUserId(user.getId());

        expense.setExpenseTypeId(expenseTypes.get(0).getId());
        expense.setAmount(100);
        expense.setComments("Test Expense");
        expense.setQuantity(1);
        expense.setPaymentMethodId(paymentMethods.get(0).getId());
        expense.setVendorId(vendors.get(0).getId());
        this.expenseRepository.save(expense);
      }

      try {

        String base64Str = this.convertImageToBase64("images/test_image.jpg");
        ImageModelVehicle imageModelVehicle = new ImageModelVehicle();
        imageModelVehicle.setVehicle(vehicle);

        imageModelVehicle.setPicByte(base64Str);

        imageModelVehicle = this.imageModelVehicleRepository.save(imageModelVehicle);

        byte[] imageBytes = Base64.getDecoder().decode(base64Str);

        String path = this.fileRootPath + this.imageNamePrefix + imageModelVehicle.getId() + ".jpeg";

        File file = new File(path);
        try (OutputStream outputStream = new BufferedOutputStream(new FileOutputStream(file))) {
          outputStream.write(imageBytes);
        } catch (IOException e) {
          e.printStackTrace();
        }

        imageModelVehicle.setPicByte("");
        String pathOut = this.fileRootPath + imageResizeDirectory + this.imageNamePrefix + imageModelVehicle.getId()
            + ".jpeg";
        // this.createFromImageFile(file, path);
        this.resizeImage(path, pathOut, 500, 500);

      } catch (Exception ex) {
        LOG.error(ex.getMessage());
      }

      String[] notesString = { "Please use column configurator to chose displaying columns",
          "Please Add Shop Logo in Settings -> Profile",
          "Please Re-Configure All Settings Accordingly", "Please Add Users and Employees Accordingly",
          "Select a vehicle, change [Paid Status] to PAID and then click [Archive This Vehicle] button to remove from listing" };
      if (notesString.length > 0) {
        for (String noteStr : notesString) {
          Note note = new Note();
          note.setCompanyId(companyNew.getId());
          note.setUserId(user.getId());
          note.setNotes(noteStr);
          note.setColor("text-warning");
          this.noteRepository.save(note);
        }
      }
      // String notes = "Please re-configure settings, add users and employees
      // accordingly";
      // Note note = new Note();
      // note.setCompanyId(companyNew.getId());
      // note.setUserId(user.getId());
      // note.setNotes(notes);
      // this.noteRepository.save(note);

    }

    try {
      this.sentAactivtionMail(user.getEmail(), randomCode);
    } catch (Exception ex) {
      LOG.info(ex.getMessage());
    }
    ResponseCookie cookie = jwtUtils.getCleanJwtCookie();

    return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString())
        .body(new MessageResponse("User registered successfully, please check your emial to activate!"));

  }

  private String parseJwt(HttpServletRequest request) {
    String jwt = jwtUtils.getJwtFromCookies(request);
    return jwt;
  }

  public void resizeImage(String inputImagePath,
      String outputImagePath, int scaledWidth, int scaledHeight)
      throws IOException {
    // reads input image
    File inputFile = new File(inputImagePath);
    BufferedImage inputImage = ImageIO.read(inputFile);

    // creates output image
    BufferedImage outputImage = new BufferedImage(scaledWidth,
        scaledHeight, inputImage.getType());

    // scales the input image to the output image
    Graphics2D g2d = outputImage.createGraphics();
    g2d.drawImage(inputImage, 0, 0, scaledWidth, scaledHeight, null);
    g2d.dispose();

    // extracts extension of output file
    String formatName = outputImagePath.substring(outputImagePath
        .lastIndexOf(".") + 1);

    // writes to output file
    ImageIO.write(outputImage, formatName, new File(outputImagePath));
  }

  private String convertImageToBase64(String imagePath) {
    try (InputStream inputStream = this.getClass().getClassLoader().getResourceAsStream(imagePath)) {
      if (inputStream == null) {
        throw new IllegalArgumentException("Image not found in resources: " + imagePath);
      }

      ByteArrayOutputStream buffer = new ByteArrayOutputStream();
      byte[] data = new byte[1024];
      int nRead;
      while ((nRead = inputStream.read(data, 0, data.length)) != -1) {
        buffer.write(data, 0, nRead);
      }

      byte[] imageBytes = buffer.toByteArray();
      return Base64.getEncoder().encodeToString(imageBytes);

    } catch (IOException e) {
      e.printStackTrace();
      return null;
    }
  }

  @PostMapping("/signout")
  public ResponseEntity<?> logoutUser(HttpServletRequest request) {

    String jwt = parseJwt(request);
    if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
      String email = jwtUtils.getEmailFromJwtToken(jwt);
      System.out.println("--" + email);
      try {
        // activeUserService.removeToken(email);
      } catch (Exception ex) {

      }
    }

    ResponseCookie cookie = jwtUtils.getCleanJwtCookie();
    return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString())
        .body(new MessageResponse("You've been signed out!"));
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
      message.setFrom(new InternetAddress(emailInfo.getSmtpServerUsername()));
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
      messageCopy.setSubject("COPY: " + domainName + "  Account Activation for user [ " + email + " ]");
      messageCopy.setText("Dear User," + "\n\n" + "please click link below to activate your account"
          + "\n\n" + this.frontendUrl + "activation/" + uuid);

      Transport.send(messageCopy);

      System.out.println("messageCopy Done");

    } catch (MessagingException e) {

      e.printStackTrace();

      try {

        Message message = new MimeMessage(session);
        message.setFrom(new InternetAddress(username));
        message.setRecipients(
            Message.RecipientType.TO,
            InternetAddress.parse(username));
        message.setSubject("ERROR: " + domainName + " Account Activation for user [ " + email + " ]");
        message.setText("ERROR: " + e.getMessage());
        message.setText("Dear User," + "\n\n" + "please click link below to activate your account"
            + "\n\n" + this.frontendUrl + "activation/" + uuid);

        Transport.send(message);

        System.out.println("Done");

      } catch (MessagingException ee) {

      }

    }

  }

  void sentPasswordResetMail(String email, String uuid) {

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
      message.setFrom(new InternetAddress(emailInfo.getSmtpServerUsername()));
      message.setRecipients(
          Message.RecipientType.TO,
          InternetAddress.parse(email));
      message.setSubject(domainName + " Reset Password");
      message.setText("Dear User," + "\n\n" + "please click link below to reset your password"
          + "\n\n" + this.frontendUrl + "resetpassword/" + uuid);

      Transport.send(message);

      System.out.println("Done");

      Message messageCopy = new MimeMessage(session);
      messageCopy.setFrom(new InternetAddress(emailInfo.getSmtpServerUsername()));
      messageCopy.setRecipients(
          Message.RecipientType.TO,
          InternetAddress.parse(username));
      messageCopy.setSubject("COPY: " + domainName + " Reset Password for user [ " + email + " ]");
      messageCopy.setText("Dear User," + "\n\n" + "please click link below to reset your password"
          + "\n\n" + this.frontendUrl + "resetpassword/" + uuid);

      Transport.send(messageCopy);

      System.out.println("messageCopy Done");

    } catch (MessagingException e) {
      e.printStackTrace();

      Message message = new MimeMessage(session);
      try {

        message.setFrom(new InternetAddress(emailInfo.getSmtpServerUsername()));
        message.setRecipients(
            Message.RecipientType.TO,
            InternetAddress.parse(emailInfo.getSmtpServerUsername()));
        message.setSubject("ERROR: " + domainName + " Reset Password for user [ " + email + " ]");
        message.setText("error: " + e.getMessage());

        message.setText("Dear User," + "\n\n" + "please click link below to reset your password"
            + "\n\n" + this.frontendUrl + "resetpassword/" + uuid);

        Transport.send(message);

        System.out.println("Done");
      } catch (MessagingException ee) {

      }
    }

  }
}
