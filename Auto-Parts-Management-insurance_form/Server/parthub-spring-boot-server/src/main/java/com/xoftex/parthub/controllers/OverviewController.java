package com.xoftex.parthub.controllers;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.DateTimeException;
import java.time.Duration;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.WeekFields;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.xoftex.parthub.models.Expense;
import com.xoftex.parthub.models.GroupBy;
import com.xoftex.parthub.models.User;
import com.xoftex.parthub.payload.request.DateCarrier;
import com.xoftex.parthub.payload.response.Report;
import com.xoftex.parthub.payload.response.ReportCarrier;
import com.xoftex.parthub.payload.response.SystemSatisticsResponse;
import com.xoftex.parthub.repository.AutoPartRepository;
import com.xoftex.parthub.repository.ClaimRepository;
import com.xoftex.parthub.repository.CompanyRepository;
import com.xoftex.parthub.repository.CustomerRepository;
import com.xoftex.parthub.repository.ExpenseRepository;
import com.xoftex.parthub.repository.ImageModelRepository;
import com.xoftex.parthub.repository.ImageModelVehicleRepository;
import com.xoftex.parthub.repository.JobRepository;
import com.xoftex.parthub.repository.PaymentRepository;
import com.xoftex.parthub.repository.ReceiptRepository;
import com.xoftex.parthub.repository.UserRepository;
import com.xoftex.parthub.repository.VehicleHistoryRepository;
import com.xoftex.parthub.repository.VehicleRepository;

//for Angular Client (withCredentials)
//@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
// @CrossOrigin(origins = "*", maxAge = 3600)
@CrossOrigin("*")
@RestController
@RequestMapping("/api/overviews")
public class OverviewController {

  @Autowired
  UserRepository userRepository;

  @Autowired
  VehicleRepository vehicleRepository;

  @Autowired
  AutoPartRepository autoPartRepository;

  @Autowired
  PaymentRepository paymentRepository;

  @Autowired
  ReceiptRepository receiptRepository;

  @Autowired
  ImageModelRepository imageModelRepository;

  @Autowired
  ImageModelVehicleRepository imageModelVehicleRepository;

  @Autowired
  CompanyRepository companyRepository;

  @Autowired
  CustomerRepository customerRepository;

  @Autowired
  VehicleHistoryRepository vehicleHistoryRepository;

  @Autowired
  JobRepository jobRepository;

  @Autowired
  ClaimRepository claimRepository;

  @Autowired
  ExpenseRepository expenseRepository;

  @Value("${image.root.path}")
  // String filePath = "C:\\Projects\\images\\";
  String filePath = "";

  String imageNamePrefix = "test_image_";

  private static final Logger LOG = LoggerFactory.getLogger(OverviewController.class);

  @GetMapping("/status/{companyId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<GroupBy>> getVehicleOverview(@PathVariable("companyId") long companyId) {

    LOG.info("" + companyId);
    System.out.println("getVehicleOverview " + companyId);
    List<GroupBy> groupBies = new ArrayList<GroupBy>();

    List<Object[]> groupByResult = this.vehicleRepository.reportStatus(companyId);
    try {
      for (Object[] obj : groupByResult) {
        // System.out.println(obj.toString());
        groupBies.add(new GroupBy((long) obj[1], (int) obj[0]));
        // System.out.println("status: " + (int) obj[0] + " count: " + (long) obj[1] +
        // "");

      }
    } catch (Exception ex) {
      System.out.println(ex);
    }

    if (groupBies.isEmpty()) {
      return new ResponseEntity<>(groupBies, HttpStatus.OK);
    }

    return new ResponseEntity<>(groupBies, HttpStatus.OK);

  }

  @GetMapping("/special/{companyId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<GroupBy>> getVehicleOverviewSpecial(@PathVariable("companyId") long companyId) {

    LOG.info("" + companyId);
    System.out.println("getVehicleOverview " + companyId);
    List<GroupBy> groupBies = new ArrayList<GroupBy>();

    List<Object[]> groupByResult = this.vehicleRepository.reportStatusSpecial(companyId);
    try {
      for (Object[] obj : groupByResult) {
        // System.out.println(obj.toString());
        groupBies.add(new GroupBy((long) obj[1], (int) obj[0]));
        // System.out.println("status: " + (int) obj[0] + " count: " + (long) obj[1] +
        // "");

      }
    } catch (Exception ex) {
      System.out.println(ex);
    }

    if (groupBies.isEmpty()) {
      return new ResponseEntity<>(groupBies, HttpStatus.OK);
    }

    return new ResponseEntity<>(groupBies, HttpStatus.OK);

  }

  @GetMapping("/jobrequesttype/{companyId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<GroupBy>> getVehicleJobRequestTypeOverview(@PathVariable("companyId") long companyId) {

    LOG.info("" + companyId);
    System.out.println("getVehicleOverview " + companyId);
    List<GroupBy> groupBies = new ArrayList<GroupBy>();

    List<Object[]> groupByResult = this.vehicleRepository.reportJobRequestType(companyId);
    try {
      for (Object[] obj : groupByResult) {
        // System.out.println(obj.toString());
        groupBies.add(new GroupBy((long) obj[1], (int) obj[0]));
        // System.out.println("status: " + (int) obj[0] + " count: " + (long) obj[1] +
        // "");

      }
    } catch (Exception ex) {
      System.out.println(ex);
    }

    if (groupBies.isEmpty()) {
      return new ResponseEntity<>(groupBies, HttpStatus.OK);
    }

    return new ResponseEntity<>(groupBies, HttpStatus.OK);

  }

  @GetMapping("/jobrequesttype/special/{companyId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<GroupBy>> getVehicleJobRequestTypeOverviewSpecial(
      @PathVariable("companyId") long companyId) {

    LOG.info("" + companyId);
    System.out.println("getVehicleOverview " + companyId);
    List<GroupBy> groupBies = new ArrayList<GroupBy>();

    List<Object[]> groupByResult = this.vehicleRepository.reportJobRequestTypeSpecial(companyId);
    try {
      for (Object[] obj : groupByResult) {
        // System.out.println(obj.toString());
        groupBies.add(new GroupBy((long) obj[1], (int) obj[0]));
        // System.out.println("status: " + (int) obj[0] + " count: " + (long) obj[1] +
        // "");

      }
    } catch (Exception ex) {
      System.out.println(ex);
    }

    if (groupBies.isEmpty()) {
      return new ResponseEntity<>(groupBies, HttpStatus.OK);
    }

    return new ResponseEntity<>(groupBies, HttpStatus.OK);

  }

  @GetMapping("/assignedto/{companyId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<GroupBy>> getVehicleAssignedToOverview(@PathVariable("companyId") long companyId) {

    LOG.info("" + companyId);
    System.out.println("getVehicleAssignedToOverview " + companyId);
    List<GroupBy> groupBies = new ArrayList<GroupBy>();

    List<Object[]> groupByResult = this.vehicleRepository.reportAssignedTo(companyId);
    try {
      for (Object[] obj : groupByResult) {
        // System.out.println(obj.toString());
        groupBies.add(new GroupBy((long) obj[1], (int) obj[0]));
        // System.out.println("status: " + (int) obj[0] + " count: " + (long) obj[1] +
        // "");

      }
    } catch (Exception ex) {
      System.out.println(ex);
    }

    if (groupBies.isEmpty()) {
      return new ResponseEntity<>(groupBies, HttpStatus.OK);
    }

    return new ResponseEntity<>(groupBies, HttpStatus.OK);

  }

  @GetMapping("/history/{companyId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<GroupBy>> getVehicleChangeOverview(@PathVariable("companyId") long companyId) {

    LOG.info("" + companyId);
    System.out.println("getVehicleChangeOverview " + companyId);
    List<GroupBy> groupBies = new ArrayList<GroupBy>();

    List<Object[]> groupByResult = this.vehicleHistoryRepository.reportVehicleChanges(companyId);
    try {
      for (Object[] obj : groupByResult) {
        // System.out.println(obj.toString());
        groupBies.add(new GroupBy((long) obj[1], (int) ((Long) obj[0]).intValue()));
        // System.out.println("status: " + (int) obj[0] + " count: " + (long) obj[1] +
        // "");

      }
    } catch (Exception ex) {
      System.out.println(ex);
    }

    if (groupBies.isEmpty()) {
      return new ResponseEntity<>(groupBies, HttpStatus.OK);
    }

    return new ResponseEntity<>(groupBies, HttpStatus.OK);

  }

  @GetMapping("/user/top100")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<User>> getMakertUserPostingOverview() {

    System.out.println("getMakertUserPostingOverview ");
    List<GroupBy> groupBies = new ArrayList<GroupBy>();
    List<User> users = new ArrayList<User>();

    List<Object[]> groupByResult = this.autoPartRepository.reportUserTop100();
    try {
      for (Object[] obj : groupByResult) {
        // System.out.println(obj.toString());
        Optional<User> userOptional = this.userRepository.findById((long) obj[0]);
        if (userOptional.isPresent()) {
          User user = userOptional.get();
          user.setTotalCountListed(((Long) obj[1]).intValue());
          user.totalCountArchived = this.autoPartRepository.countByUserIdAndStatusAndArchivedAndPublished(
              user.getId(),
              2, true, true);
          users.add(userOptional.get());

        }
        // groupBies.add(new GroupBy((long) obj[1], (int) ((Long) obj[0]).intValue()));
        // System.out.println("status: " + (int) obj[0] + " count: " + (long) obj[1] +
        // "");

      }
    } catch (Exception ex) {
      System.out.println(ex);
    }

    if (groupBies.isEmpty()) {
      return new ResponseEntity<>(users, HttpStatus.OK);
    }

    return new ResponseEntity<>(users, HttpStatus.OK);

  }

  @GetMapping("/user/{companyId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<GroupBy>> getVehicleUserChangeOverview(@PathVariable("companyId") long companyId) {

    LOG.info("" + companyId);
    System.out.println("getVehicleChangeOverview " + companyId);
    List<GroupBy> groupBies = new ArrayList<GroupBy>();

    List<Object[]> groupByResult = this.vehicleHistoryRepository.reportUserChanges(companyId);
    try {
      for (Object[] obj : groupByResult) {
        // System.out.println(obj.toString());
        groupBies.add(new GroupBy((long) obj[1], (int) ((Long) obj[0]).intValue()));
        // System.out.println("status: " + (int) obj[0] + " count: " + (long) obj[1] +
        // "");

      }
    } catch (Exception ex) {
      System.out.println(ex);
    }

    if (groupBies.isEmpty()) {
      return new ResponseEntity<>(groupBies, HttpStatus.OK);
    }

    return new ResponseEntity<>(groupBies, HttpStatus.OK);

  }

  @GetMapping("/system")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<SystemSatisticsResponse> getSystemOverview() {

    LOG.info("getSystemOverview");
    System.out.println("getSystemOverview ");
    SystemSatisticsResponse satisticsResponse = new SystemSatisticsResponse();

    try {

      satisticsResponse.setTotalListedAutoparts((int) this.autoPartRepository.countByStatusAndArchived(2, false));
      satisticsResponse.setTotalArchivededAutoparts((int) this.autoPartRepository.countByStatusAndArchived(2, true));
      satisticsResponse.setTotalImages((int) this.imageModelRepository.countByAutopartIdNot(0));
      satisticsResponse.setTotalMarketOnlyUsers((int) this.userRepository.countByCompanyIdAndArchived(0, false));
      satisticsResponse.setTotalShopUsers((int) this.userRepository.countByArchivedAndCompanyIdNot(false, 0));
      satisticsResponse.setTotalViewCounts((int) this.autoPartRepository.getTotalViewCount());
      satisticsResponse.setTotalCompanies((int) this.companyRepository.countByIdNot(0));
      // satisticsResponse.setTotalActiveUser(userSessionService.getTotalActiveSessions());
      // satisticsResponse.setTotalActiveUser(activeUserService.getActiveUserCount());

    } catch (Exception ex) {
      System.out.println(ex);
    }

    return new ResponseEntity<>(satisticsResponse, HttpStatus.OK);

  }

  @GetMapping("/system/shop")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<SystemSatisticsResponse> getSystemShopOverview() {

    LOG.info("getSystemOverview");
    System.out.println("getSystemOverview ");
    SystemSatisticsResponse satisticsResponse = new SystemSatisticsResponse();

    try {

      satisticsResponse.setTotalListedAutoparts((int) this.autoPartRepository.countByStatusAndArchived(2, false));
      satisticsResponse.setTotalArchivededAutoparts((int) this.autoPartRepository.countByStatusAndArchived(2, true));
      satisticsResponse.setTotalImages((int) this.imageModelRepository.countByAutopartIdNot(0));
      satisticsResponse.setTotalMarketOnlyUsers((int) this.userRepository.countByCompanyIdAndArchived(0, false));

      satisticsResponse.setTotalViewCounts((int) this.autoPartRepository.getTotalViewCount());
      satisticsResponse.setTotalCompanies((int) this.companyRepository.countByIdNot(0));
      // satisticsResponse.setTotalActiveUser(userSessionService.getTotalActiveSessions());
      // satisticsResponse.setTotalActiveUser(activeUserService.getActiveUserCount());

      satisticsResponse.setTotalShopUsers((int) this.userRepository.countByCompanyIdNot(0));
      satisticsResponse.setTotalActiveShopUsers((int) this.userRepository.countByActivatedAndCompanyIdNot(true, 0));
      satisticsResponse.setTotalInActiveShopUsers((int) this.userRepository.countByActivatedAndCompanyIdNot(false, 0));

      satisticsResponse.setTotalVehicles((int) this.vehicleRepository.countByCompanyIdNot(0));
      satisticsResponse.setTotalInShopVehicles((int) this.vehicleRepository.countByArchivedAndCompanyIdNot(false, 0));
      satisticsResponse.setTotalArchivedVehicles((int) this.vehicleRepository.countByArchivedAndCompanyIdNot(true, 0));

      satisticsResponse.setTotalVehicleImages((int) this.imageModelVehicleRepository.countByVehicleIdNot(0));

      satisticsResponse.setTotalShopCustomers((int) this.customerRepository.countByCompanyIdNot(0));

      satisticsResponse.setTotalVehicleAutoparts((int) this.autoPartRepository.countByVehicleIdNot(0));
      satisticsResponse.setTotalVehiclePayments((int) this.paymentRepository.countByVehicleIdNot(0));
      satisticsResponse.setTotalVehicleReceipts((int) this.receiptRepository.countByVehicleIdNot(0));
      satisticsResponse.setTotalVehicleJobs((int) this.jobRepository.countByVehicleIdNot(0));
      satisticsResponse.setTotalVehicleEstimates((int) this.claimRepository.countByVehicleIdNot(0));

      satisticsResponse.setTotalShopExpenses((int) this.expenseRepository.countByCompanyIdNot(0));

    } catch (Exception ex) {
      System.out.println(ex);
    }

    return new ResponseEntity<>(satisticsResponse, HttpStatus.OK);

  }

  @GetMapping("/location/{companyId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<GroupBy>> getVehicleLocationOverview(@PathVariable("companyId") long companyId) {

    System.out.println("getVehicleLocationOverview " + companyId);
    List<GroupBy> groupBies = new ArrayList<GroupBy>();

    List<Object[]> groupByResult = this.vehicleRepository.reportLocation(companyId);
    try {
      for (Object[] obj : groupByResult) {

        groupBies.add(new GroupBy((long) obj[1], (int) obj[0]));
        // System.out.println("status: " + (int) obj[0] + " count: " + (long) obj[1] +
        // "");

      }
    } catch (Exception ex) {
      System.out.println(ex);
    }

    if (groupBies.isEmpty()) {
      return new ResponseEntity<>(groupBies, HttpStatus.OK);
    }

    return new ResponseEntity<>(groupBies, HttpStatus.OK);

  }

  @GetMapping("/autopart")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<GroupBy>> getAutopartTitleOverview() {

    System.out.println("getAutopartTitleOverview ");

    List<GroupBy> groupBies = new ArrayList<GroupBy>();

    List<Object[]> groupByResult = this.autoPartRepository.reportTitle();
    try {
      for (Object[] obj : groupByResult) {
        GroupBy groupBy = new GroupBy();
        groupBy.setCount((long) obj[1]);
        groupBy.setName((String) obj[0]);
        groupBies.add(groupBy);
        // System.out.println("name: " + (String) obj[0] + " count: " + (long) obj[1] +
        // "");

      }
    } catch (Exception ex) {
      System.out.println(ex);
    }

    if (groupBies.isEmpty()) {
      return new ResponseEntity<>(groupBies, HttpStatus.OK);
    }

    return new ResponseEntity<>(groupBies, HttpStatus.OK);

  }

  @GetMapping("/users")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<GroupBy>> getUserLastNameOverview() {

    System.out.println("getUserLastNameOverview ");

    List<GroupBy> groupBies = new ArrayList<GroupBy>();

    List<Object[]> groupByResult = this.userRepository.reportLastNameCounts();
    try {
      for (Object[] obj : groupByResult) {
        GroupBy groupBy = new GroupBy();
        groupBy.setCount((long) obj[1]);
        groupBy.setName("" + (Character) obj[0]);
        groupBies.add(groupBy);
        // System.out.println("name: " + (String) obj[0] + " count: " + (long) obj[1] +
        // "");

      }
    } catch (Exception ex) {
      System.out.println(ex);
    }

    if (groupBies.isEmpty()) {
      return new ResponseEntity<>(groupBies, HttpStatus.OK);
    }

    return new ResponseEntity<>(groupBies, HttpStatus.OK);

  }

  @GetMapping("/shops")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<GroupBy>> getShopNameOverview() {

    System.out.println("getUserLastNameOverview ");

    List<GroupBy> groupBies = new ArrayList<GroupBy>();

    List<Object[]> groupByResult = this.companyRepository.reportNameCounts();
    try {
      for (Object[] obj : groupByResult) {
        GroupBy groupBy = new GroupBy();
        groupBy.setCount((long) obj[1]);
        groupBy.setName("" + (Character) obj[0]);
        groupBies.add(groupBy);
        // System.out.println("name: " + (String) obj[0] + " count: " + (long) obj[1] +
        // "");

      }
    } catch (Exception ex) {
      System.out.println(ex);
    }

    if (groupBies.isEmpty()) {
      return new ResponseEntity<>(groupBies, HttpStatus.OK);
    }

    return new ResponseEntity<>(groupBies, HttpStatus.OK);

  }

  @PostMapping("/user/{companyId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<GroupBy>> getUserPerformance(@PathVariable("companyId") long companyId,
      @RequestBody DateCarrier dateCarrier) {

    System.out.println("getUserPerformance " + companyId);
    List<GroupBy> groupBies = new ArrayList<GroupBy>();

    List<Object[]> groupByResult = this.jobRepository.getEmployeePerformance(companyId, 1, dateCarrier.from,
        dateCarrier.to);
    try {
      for (Object[] obj : groupByResult) {

        Long employeeId = (Long) obj[0];
        groupBies.add(new GroupBy((long) obj[1], employeeId.intValue()));
        // System.out.println("status: " + (long) obj[0] + " count: " + (long) obj[1] +
        // "");

      }
    } catch (Exception ex) {
      System.out.println(ex);
    }

    if (groupBies.isEmpty()) {
      return new ResponseEntity<>(groupBies, HttpStatus.OK);
    }

    return new ResponseEntity<>(groupBies, HttpStatus.OK);

  }

  @PostMapping("/payment/{companyId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<ReportCarrier> getVehiclePaymentReport(@PathVariable("companyId") long companyId,
      @RequestBody DateCarrier dateCarrier) {

    System.out.println("getVehiclePaymentReport " + companyId);

    ReportCarrier reportCarrier = new ReportCarrier();

    int year = dateCarrier.year;
    int week = dateCarrier.week;
    int range = dateCarrier.range;

    for (int i = week - (range - 1); i <= week; i++) {

      Report report = new Report();

      // handle dec-jan transition
      int weekNumber = i;
      int yearNumber = year;

      if (i <= 0) {
        weekNumber = 52 + i;
        yearNumber = yearNumber - 1;
      }

      int yearWeek = yearNumber * 100 + weekNumber;

      try {
        // Date from = this.asDate(this.getFirstDayOfWeek(yearNumber, weekNumber,
        // Locale.US));
        // Date to = this.asDate(this.getFirstDayOfWeek(yearNumber, weekNumber + 1,
        // Locale.US));

        report.data = new ArrayList<GroupBy>();
        report.label = "" + weekNumber;
        long count = this.paymentRepository.findSumByYearWeek(companyId, yearWeek).longValue();
        report.counts = count;

      } catch (Exception e) {
        System.out.println(e);
      }

      reportCarrier.reports.add(report);
    }

    return new ResponseEntity<>(reportCarrier, HttpStatus.OK);

  }

  @PostMapping("/vehicle/{companyId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<ReportCarrier> getVehicleReport(@PathVariable("companyId") long companyId,
      @RequestBody DateCarrier dateCarrier) {

    System.out.println("getVehicleReport " + companyId);

    ReportCarrier reportCarrier = new ReportCarrier();

    int year = dateCarrier.year;
    int week = dateCarrier.week;
    int range = dateCarrier.range;

    for (int i = week - (range - 1); i <= week; i++) {

      Report report = new Report();

      // handle dec-jan transition
      int weekNumber = i;
      int yearNumber = year;
      if (i <= 0) {
        weekNumber = 52 + i;
        yearNumber = yearNumber - 1;
      }
      try {
        LocalDate fromDate = this.getFirstDayOfWeek(yearNumber, weekNumber, Locale.US);
        Date from = this.asDate(fromDate);
        // Add 7 days to get the first day of the next week, avoiding week number
        // overflow
        Date to = this.asDate(fromDate.plusWeeks(1));

        report.data = new ArrayList<GroupBy>();
        report.label = "" + weekNumber;
        long count = this.vehicleRepository.countByCompanyIdAndCreatedAtBetween(companyId, from, to);
        report.counts = count;

      } catch (Exception e) {
        System.out.println(e);
      }

      reportCarrier.reports.add(report);
    }

    return new ResponseEntity<>(reportCarrier, HttpStatus.OK);

  }

  @PostMapping("/market/image/")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<ReportCarrier> getImageReport(
      @RequestBody DateCarrier dateCarrier) {
    System.out.println("getImageReport ");
    ReportCarrier reportCarrier = new ReportCarrier();

    int year = dateCarrier.year;
    int week = dateCarrier.week;
    int range = dateCarrier.range;

    for (int i = week - (range - 1); i <= week; i++) {

      Report report = new Report();

      // handle dec-jan transition
      int weekNumber = i;
      int yearNumber = year;
      if (i <= 0) {
        weekNumber = 52 + i;
        yearNumber = yearNumber - 1;
      }
      try {
        LocalDate fromDate = this.getFirstDayOfWeek(yearNumber, weekNumber, Locale.US);
        Date from = this.asDate(fromDate);
        // Add 7 days to get the first day of the next week, avoiding week number
        // overflow
        Date to = this.asDate(fromDate.plusWeeks(1));

        report.data = new ArrayList<GroupBy>();
        report.label = "" + weekNumber;
        long count = this.imageModelRepository.countByCreatedAtBetween(from, to);
        report.counts = count;

      } catch (Exception e) {
        System.out.println(e);
      }

      reportCarrier.reports.add(report);
    }

    return new ResponseEntity<>(reportCarrier, HttpStatus.OK);

  }

  @PostMapping("/shop/vehicle/image/")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<ReportCarrier> getShopVehicleImageReport(
      @RequestBody DateCarrier dateCarrier) {
    System.out.println("getImageReport ");
    ReportCarrier reportCarrier = new ReportCarrier();

    int year = dateCarrier.year;
    int week = dateCarrier.week;
    int range = dateCarrier.range;

    for (int i = week - (range - 1); i <= week; i++) {

      Report report = new Report();

      // handle dec-jan transition
      int weekNumber = i;
      int yearNumber = year;
      if (i <= 0) {
        weekNumber = 52 + i;
        yearNumber = yearNumber - 1;
      }
      try {
        LocalDate fromDate = this.getFirstDayOfWeek(yearNumber, weekNumber, Locale.US);
        Date from = this.asDate(fromDate);
        // Add 7 days to get the first day of the next week, avoiding week number
        // overflow
        Date to = this.asDate(fromDate.plusWeeks(1));

        report.data = new ArrayList<GroupBy>();
        report.label = "" + weekNumber;
        long count = this.imageModelVehicleRepository.countByCreatedAtBetween(from, to);
        report.counts = count;

      } catch (Exception e) {
        System.out.println(e);
      }

      reportCarrier.reports.add(report);
    }

    return new ResponseEntity<>(reportCarrier, HttpStatus.OK);

  }

  @PostMapping("/market/autopart/")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<ReportCarrier> getAutopartReport(
      @RequestBody DateCarrier dateCarrier) {
    System.out.println("getImageReport ");
    ReportCarrier reportCarrier = new ReportCarrier();

    int year = dateCarrier.year;
    int week = dateCarrier.week;
    int range = dateCarrier.range;

    for (int i = week - (range - 1); i <= week; i++) {

      Report report = new Report();

      // handle dec-jan transition
      int weekNumber = i;
      int yearNumber = year;
      if (i <= 0) {
        weekNumber = 52 + i;
        yearNumber = yearNumber - 1;
      }
      try {
        LocalDate fromDate = this.getFirstDayOfWeek(yearNumber, weekNumber, Locale.US);
        Date from = this.asDate(fromDate);
        // Add 7 days to get the first day of the next week, avoiding week number
        // overflow
        Date to = this.asDate(fromDate.plusWeeks(1));

        report.data = new ArrayList<GroupBy>();
        report.label = "" + weekNumber;
        long count = this.autoPartRepository.countByStatusAndArchivedAndCreatedAtBetween(2, false, from, to);
        report.counts = count;

      } catch (Exception e) {
        System.out.println(e);
      }

      reportCarrier.reports.add(report);
    }

    return new ResponseEntity<>(reportCarrier, HttpStatus.OK);

  }

  @PostMapping("/shop/autopart/")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<ReportCarrier> getShopAutopartReport(
      @RequestBody DateCarrier dateCarrier) {
    System.out.println("getImageReport ");
    ReportCarrier reportCarrier = new ReportCarrier();

    int year = dateCarrier.year;
    int week = dateCarrier.week;
    int range = dateCarrier.range;

    for (int i = week - (range - 1); i <= week; i++) {

      Report report = new Report();

      // handle dec-jan transition
      int weekNumber = i;
      int yearNumber = year;
      if (i <= 0) {
        weekNumber = 52 + i;
        yearNumber = yearNumber - 1;
      }
      try {
        LocalDate fromDate = this.getFirstDayOfWeek(yearNumber, weekNumber, Locale.US);
        Date from = this.asDate(fromDate);
        // Add 7 days to get the first day of the next week, avoiding week number
        // overflow
        Date to = this.asDate(fromDate.plusWeeks(1));

        report.data = new ArrayList<GroupBy>();
        report.label = "" + weekNumber;
        long count = this.autoPartRepository.countByCompanyIdNotAndCreatedAtBetween(0, from, to);
        report.counts = count;

      } catch (Exception e) {
        System.out.println(e);
      }

      reportCarrier.reports.add(report);
    }

    return new ResponseEntity<>(reportCarrier, HttpStatus.OK);

  }

  @PostMapping("/user/market/{companyId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<ReportCarrier> getUserReport(@PathVariable("companyId") long companyId,
      @RequestBody DateCarrier dateCarrier) {
    System.out.println("getUserReport " + companyId);
    ReportCarrier reportCarrier = new ReportCarrier();

    int year = dateCarrier.year;
    int week = dateCarrier.week;
    int range = dateCarrier.range;

    for (int i = week - (range - 1); i <= week; i++) {

      Report report = new Report();

      // handle dec-jan transition
      int weekNumber = i;
      int yearNumber = year;
      if (i <= 0) {
        weekNumber = 52 + i;
        yearNumber = yearNumber - 1;
      }
      try {
        LocalDate fromDate = this.getFirstDayOfWeek(yearNumber, weekNumber, Locale.US);
        Date from = this.asDate(fromDate);
        // Add 7 days to get the first day of the next week, avoiding week number
        // overflow
        Date to = this.asDate(fromDate.plusWeeks(1));

        report.data = new ArrayList<GroupBy>();
        report.label = "" + weekNumber;
        long count = this.userRepository.countByCompanyIdAndActivatedAndCreatedAtBetween(0, true, from, to);
        report.counts = count;

      } catch (Exception e) {
        System.out.println(e);
      }

      reportCarrier.reports.add(report);
    }

    return new ResponseEntity<>(reportCarrier, HttpStatus.OK);

  }

  @PostMapping("/vehicle/shop/{companyId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<ReportCarrier> getVehiclesShopReport(@PathVariable("companyId") long companyId,
      @RequestBody DateCarrier dateCarrier) {
    System.out.println("getUserReport " + companyId);
    ReportCarrier reportCarrier = new ReportCarrier();

    int year = dateCarrier.year;
    int week = dateCarrier.week;
    int range = dateCarrier.range;

    for (int i = week - (range - 1); i <= week; i++) {

      Report report = new Report();

      // handle dec-jan transition
      int weekNumber = i;
      int yearNumber = year;
      if (i <= 0) {
        weekNumber = 52 + i;
        yearNumber = yearNumber - 1;
      }
      try {
        LocalDate fromDate = this.getFirstDayOfWeek(yearNumber, weekNumber, Locale.US);
        Date from = this.asDate(fromDate);
        // Add 7 days to get the first day of the next week, avoiding week number
        // overflow
        Date to = this.asDate(fromDate.plusWeeks(1));

        report.data = new ArrayList<GroupBy>();
        report.label = "" + weekNumber;
        long count = this.vehicleRepository.countByCompanyIdNotAndCreatedAtBetween(0, from, to);
        report.counts = count;

      } catch (Exception e) {
        System.out.println(e);
      }

      reportCarrier.reports.add(report);
    }

    return new ResponseEntity<>(reportCarrier, HttpStatus.OK);

  }

  @PostMapping("/user/shop/{companyId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<ReportCarrier> getUserShopReport(@PathVariable("companyId") long companyId,
      @RequestBody DateCarrier dateCarrier) {
    System.out.println("getUserReport " + companyId);
    ReportCarrier reportCarrier = new ReportCarrier();

    int year = dateCarrier.year;
    int week = dateCarrier.week;
    int range = dateCarrier.range;

    for (int i = week - (range - 1); i <= week; i++) {

      Report report = new Report();

      // handle dec-jan transition
      int weekNumber = i;
      int yearNumber = year;
      if (i <= 0) {
        weekNumber = 52 + i;
        yearNumber = yearNumber - 1;
      }
      try {
        LocalDate fromDate = this.getFirstDayOfWeek(yearNumber, weekNumber, Locale.US);
        Date from = this.asDate(fromDate);
        // Add 7 days to get the first day of the next week, avoiding week number
        // overflow
        Date to = this.asDate(fromDate.plusWeeks(1));

        report.data = new ArrayList<GroupBy>();
        report.label = "" + weekNumber;
        long count = this.userRepository.countByCompanyIdNotAndActivatedAndCreatedAtBetween(0, true, from, to);
        report.counts = count;

      } catch (Exception e) {
        System.out.println(e);
      }

      reportCarrier.reports.add(report);
    }

    return new ResponseEntity<>(reportCarrier, HttpStatus.OK);

  }

  @PostMapping("/customer/shop/{companyId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<ReportCarrier> getCustomersShopReport(@PathVariable("companyId") long companyId,
      @RequestBody DateCarrier dateCarrier) {
    System.out.println("getUserReport " + companyId);
    ReportCarrier reportCarrier = new ReportCarrier();

    int year = dateCarrier.year;
    int week = dateCarrier.week;
    int range = dateCarrier.range;

    for (int i = week - (range - 1); i <= week; i++) {

      Report report = new Report();

      // handle dec-jan transition
      int weekNumber = i;
      int yearNumber = year;
      if (i <= 0) {
        weekNumber = 52 + i;
        yearNumber = yearNumber - 1;
      }
      try {
        LocalDate fromDate = this.getFirstDayOfWeek(yearNumber, weekNumber, Locale.US);
        Date from = this.asDate(fromDate);
        // Add 7 days to get the first day of the next week, avoiding week number
        // overflow
        Date to = this.asDate(fromDate.plusWeeks(1));

        report.data = new ArrayList<GroupBy>();
        report.label = "" + weekNumber;
        long count = this.customerRepository.countByCompanyIdNotAndCreatedAtBetween(0, from, to);
        report.counts = count;

      } catch (Exception e) {
        System.out.println(e);
      }

      reportCarrier.reports.add(report);
    }

    return new ResponseEntity<>(reportCarrier, HttpStatus.OK);

  }

  @PostMapping("/shop/shop/{companyId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<ReportCarrier> getShopShopReport(@PathVariable("companyId") long companyId,
      @RequestBody DateCarrier dateCarrier) {
    System.out.println("getUserReport " + companyId);
    ReportCarrier reportCarrier = new ReportCarrier();

    int year = dateCarrier.year;
    int week = dateCarrier.week;
    int range = dateCarrier.range;

    for (int i = week - (range - 1); i <= week; i++) {

      Report report = new Report();

      // handle dec-jan transition
      int weekNumber = i;
      int yearNumber = year;
      if (i <= 0) {
        weekNumber = 52 + i;
        yearNumber = yearNumber - 1;
      }
      try {
        LocalDate fromDate = this.getFirstDayOfWeek(yearNumber, weekNumber, Locale.US);
        Date from = this.asDate(fromDate);
        // Add 7 days to get the first day of the next week, avoiding week number
        // overflow
        Date to = this.asDate(fromDate.plusWeeks(1));

        report.data = new ArrayList<GroupBy>();
        report.label = "" + weekNumber;
        long count = this.companyRepository.countByIdNotAndCreatedAtBetween(0, from, to);
        report.counts = count;

      } catch (Exception e) {
        System.out.println(e);
      }

      reportCarrier.reports.add(report);
    }

    return new ResponseEntity<>(reportCarrier, HttpStatus.OK);

  }

  @PostMapping("/expense/{companyId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<ReportCarrier> getExpenseReport(@PathVariable("companyId") long companyId,
      @RequestBody DateCarrier dateCarrier) {
    System.out.println("getExpenseReport " + companyId);
    ReportCarrier reportCarrier = new ReportCarrier();

    int year = dateCarrier.year;
    int week = dateCarrier.week;
    int range = dateCarrier.range;

    for (int i = week - (range - 1); i <= week; i++) {

      Report report = new Report();

      // handle dec-jan transition
      int weekNumber = i;
      int yearNumber = year;
      if (i <= 0) {
        weekNumber = 52 + i;
        yearNumber = yearNumber - 1;
      }
      try {
        LocalDate fromDate = this.getFirstDayOfWeek(yearNumber, weekNumber, Locale.US);
        Date from = this.asDate(fromDate);
        // Add 7 days to get the first day of the next week, avoiding week number
        // overflow
        Date to = this.asDate(fromDate.plusWeeks(1));
        List<Expense> expenses = new ArrayList<>();
        report.data = new ArrayList<GroupBy>();
        report.label = "" + weekNumber;
        if (dateCarrier.expenseTypeId == 0 && dateCarrier.vendorId == 0) {
          expenses = this.expenseRepository.findByCompanyIdAndCreatedAtBetween(companyId, from, to);
        } else if (dateCarrier.expenseTypeId > 0 && dateCarrier.vendorId == 0) {
          expenses = this.expenseRepository.findByCompanyIdAndExpenseTypeIdAndCreatedAtBetweenOrderByIdDesc(companyId,
              dateCarrier.expenseTypeId, from, to);
        } else if (dateCarrier.expenseTypeId == 0 && dateCarrier.vendorId > 0) {
          expenses = this.expenseRepository.findByCompanyIdAndVendorIdAndCreatedAtBetweenOrderByIdDesc(companyId,
              dateCarrier.vendorId, from, to);
        }

        int total = 0;
        for (Expense expense : expenses) {
          total += expense.getAmount() * expense.getQuantity();
        }

        report.counts = (long) total;

      } catch (Exception e) {
        System.out.println(e);
      }

      reportCarrier.reports.add(report);
    }

    return new ResponseEntity<>(reportCarrier, HttpStatus.OK);

  }

  @PostMapping("/expense/expensetype/{companyId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<GroupBy>> getExpenseTypeReport(@PathVariable("companyId") long companyId,
      @RequestBody DateCarrier dateCarrier) {
    System.out.println("getExpenseTypeReport " + companyId);

    int year = dateCarrier.year;
    int week = dateCarrier.week;

    int weekNumber = week;
    int yearNumber = year;

    LocalDate fromDate = this.getFirstDayOfWeek(yearNumber, weekNumber, Locale.US);
    Date from = this.asDate(fromDate);
    // Add 7 days to get the first day of the next week, avoiding week number
    // overflow
    Date to = this.asDate(fromDate.plusWeeks(1));

    List<GroupBy> groupBies = new ArrayList<GroupBy>();

    List<Object[]> groupByResult = this.expenseRepository.getExpenseTypeReport(companyId, from, to);

    try {
      for (Object[] obj : groupByResult) {
        long expenseTypeId = Long.valueOf("" + obj[0]).intValue();
        GroupBy groupBy = new GroupBy((Double.valueOf("" + obj[1])).longValue(), Long.valueOf("" + obj[0]).intValue());
        List<Expense> expenses = this.expenseRepository.findByCompanyIdAndExpenseTypeIdAndCreatedAtBetweenOrderByIdDesc(
            companyId,
            expenseTypeId, from, to);
        groupBy.expenses = expenses;

        groupBies.add(groupBy);

      }
    } catch (Exception ex) {
      System.out.println(ex);
    }

    if (groupBies.isEmpty()) {
      return new ResponseEntity<>(groupBies, HttpStatus.OK);
    }

    return new ResponseEntity<>(groupBies, HttpStatus.OK);

  }

  @PostMapping("/expense/vendor/{companyId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<GroupBy>> getVendorReport(@PathVariable("companyId") long companyId,
      @RequestBody DateCarrier dateCarrier) {
    System.out.println("getVendorReport " + companyId);

    int year = dateCarrier.year;
    int week = dateCarrier.week;

    int weekNumber = week;
    int yearNumber = year;

    LocalDate fromDate = this.getFirstDayOfWeek(yearNumber, weekNumber, Locale.US);
    Date from = this.asDate(fromDate);
    // Add 7 days to get the first day of the next week, avoiding week number
    // overflow
    Date to = this.asDate(fromDate.plusWeeks(1));

    List<GroupBy> groupBies = new ArrayList<GroupBy>();

    List<Object[]> groupByResult = this.expenseRepository.getVendorReport(companyId, from, to);

    try {
      for (Object[] obj : groupByResult) {
        long vendorId = Long.valueOf("" + obj[0]).intValue();
        GroupBy groupBy = new GroupBy((Double.valueOf("" + obj[1])).longValue(), Long.valueOf("" + obj[0]).intValue());
        List<Expense> expenses = this.expenseRepository.findByCompanyIdAndVendorIdAndCreatedAtBetweenOrderByIdDesc(
            companyId,
            vendorId, from, to);
        groupBy.expenses = expenses;

        groupBies.add(groupBy);

      }
    } catch (Exception ex) {
      System.out.println(ex);
    }

    if (groupBies.isEmpty()) {
      return new ResponseEntity<>(groupBies, HttpStatus.OK);
    }

    return new ResponseEntity<>(groupBies, HttpStatus.OK);

  }

  @PostMapping("/expense/paymentmethod/{companyId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<GroupBy>> getPaymentMethodReport(@PathVariable("companyId") long companyId,
      @RequestBody DateCarrier dateCarrier) {
    System.out.println("getVendorReport " + companyId);

    int year = dateCarrier.year;
    int week = dateCarrier.week;

    int weekNumber = week;
    int yearNumber = year;

    LocalDate fromDate = this.getFirstDayOfWeek(yearNumber, weekNumber, Locale.US);
    Date from = this.asDate(fromDate);
    // Add 7 days to get the first day of the next week, avoiding week number
    // overflow
    Date to = this.asDate(fromDate.plusWeeks(1));

    List<GroupBy> groupBies = new ArrayList<GroupBy>();

    List<Object[]> groupByResult = this.expenseRepository.getPaymentMethodReport(companyId, from, to);

    try {
      for (Object[] obj : groupByResult) {

        long paymentMethodId = Long.valueOf("" + obj[0]).intValue();
        GroupBy groupBy = new GroupBy((Double.valueOf("" + obj[1])).longValue(), Long.valueOf("" + obj[0]).intValue());
        List<Expense> expenses = this.expenseRepository
            .findByCompanyIdAndPaymentMethodIdAndCreatedAtBetweenOrderByIdDesc(companyId,
                paymentMethodId, from, to);
        groupBy.expenses = expenses;

        groupBies.add(groupBy);

      }
    } catch (Exception ex) {
      System.out.println(ex);
    }

    if (groupBies.isEmpty()) {
      return new ResponseEntity<>(groupBies, HttpStatus.OK);
    }

    return new ResponseEntity<>(groupBies, HttpStatus.OK);

  }

  @PostMapping("/customer/company/{companyId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<ReportCarrier> getCompanyCustomerReport(@PathVariable("companyId") long companyId,
      @RequestBody DateCarrier dateCarrier) {
    System.out.println("getCompanyCustomerReport " + companyId);
    ReportCarrier reportCarrier = new ReportCarrier();

    int year = dateCarrier.year;
    int week = dateCarrier.week;
    int range = dateCarrier.range;

    for (int i = week - (range - 1); i <= week; i++) {

      Report report = new Report();

      // handle dec-jan transition
      int weekNumber = i;
      int yearNumber = year;
      if (i <= 0) {
        weekNumber = 52 + i;
        yearNumber = yearNumber - 1;
      }
      try {
        LocalDate fromDate = this.getFirstDayOfWeek(yearNumber, weekNumber, Locale.US);
        Date from = this.asDate(fromDate);
        // Add 7 days to get the first day of the next week, avoiding week number
        // overflow
        Date to = this.asDate(fromDate.plusWeeks(1));

        report.data = new ArrayList<GroupBy>();
        report.label = "" + weekNumber;
        long count = this.customerRepository.countByCompanyIdAndArchivedAndCreatedAtBetween(companyId, false, from, to);
        report.counts = count;

      } catch (Exception e) {
        System.out.println(e);
      }

      reportCarrier.reports.add(report);
    }

    return new ResponseEntity<>(reportCarrier, HttpStatus.OK);

  }

  @PostMapping("/vehicle/daily/{companyId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<ReportCarrier> getVehicleReportDaily(@PathVariable("companyId") long companyId,
      @RequestBody DateCarrier dateCarrier) {
    System.out.println("getVehicleReportDaily " + companyId);
    ReportCarrier reportCarrier = new ReportCarrier();

    int range = dateCarrier.range;
    Date from = dateCarrier.from;
    Date to = dateCarrier.to;
    try {
      DateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
      from = formatter.parse(formatter.format(dateCarrier.from));
      long timeadj = 24 * 60 * 60 * 1000;
      to = new Date(from.getTime() + timeadj);
    } catch (Exception ex) {
      System.out.println(ex);
    }

    for (int i = 0; i <= range; i++) {

      Report report = new Report();

      try {

        Date from1 = new Date(from.getTime() - Duration.ofDays(i).toMillis());
        Date to1 = new Date(to.getTime() - Duration.ofDays(i).toMillis());

        report.data = new ArrayList<GroupBy>();
        report.label = "" + from1;
        long count = this.vehicleRepository.countByCompanyIdAndArchivedAndCreatedAtBetween(companyId, false, from1,
            to1);
        report.counts = count;

      } catch (Exception e) {
        System.out.println(e);
      }
      if (report.counts > 0)
        reportCarrier.reports.add(report);
    }

    return new ResponseEntity<>(reportCarrier, HttpStatus.OK);

  }

  @PostMapping("/user/month/{companyId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<ReportCarrier> getUserPerformanceMonth(@PathVariable("companyId") long companyId,
      @RequestBody DateCarrier dateCarrier) {
    System.out.println("getUserPerformanceMonth " + companyId);
    ReportCarrier reportCarrier = new ReportCarrier();

    int year = dateCarrier.year;
    int week = dateCarrier.week;
    int range = dateCarrier.range;

    for (int i = week - (range - 1); i <= week; i++) {

      Report report = new Report();

      // handle dec-jan transition
      int weekNumber = i;
      int yearNumber = year;
      if (i <= 0) {
        weekNumber = 52 + i;
        yearNumber = yearNumber - 1;
      }
      try {
        LocalDate fromDate = this.getFirstDayOfWeek(yearNumber, weekNumber, Locale.US);
        Date from = this.asDate(fromDate);
        // Add 7 days to get the first day of the next week, avoiding week number
        // overflow
        Date to = this.asDate(fromDate.plusWeeks(1));

        report.data = new ArrayList<GroupBy>();
        report.label = "" + weekNumber;
        List<GroupBy> groupBies = new ArrayList<GroupBy>();

        List<Object[]> groupByResult = this.jobRepository.getEmployeePerformance(companyId, 1, from,
            to);
        try {
          for (Object[] obj : groupByResult) {

            Long employeeId = (Long) obj[0];
            groupBies.add(new GroupBy((long) obj[1], employeeId.intValue()));
            System.out.println("status: " + (long) obj[0] + " count: " + (long) obj[1] + " week " + weekNumber);

          }
        } catch (Exception ex) {
          System.out.println(ex);
        }
        report.data = groupBies;

      } catch (Exception e) {
        System.out.println(e);
      }

      reportCarrier.reports.add(report);
    }

    return new ResponseEntity<>(reportCarrier, HttpStatus.OK);

  }

  // Locale.US
  private LocalDate getFirstDayOfWeek(int year, int weekNumber, Locale locale) {
    WeekFields weekFields = WeekFields.of(locale);
    int adjustedYear = year;
    int adjustedWeekNumber = weekNumber;

    // Handle invalid week numbers by rolling over to next/previous year
    if (weekNumber <= 0) {
      // Roll back to previous year: week 0 becomes week 52/53 of previous year
      adjustedWeekNumber = 52 + weekNumber;
      adjustedYear = year - 1;
      // Ensure adjusted week is valid
      if (adjustedWeekNumber < 1) {
        adjustedWeekNumber = 1;
      }
    } else {
      // First, try to get the maximum week number for the given year
      try {
        LocalDate lastDayOfYear = LocalDate.of(year, 12, 31);
        int maxWeekForYear = lastDayOfYear.get(weekFields.weekOfWeekBasedYear());

        if (weekNumber > maxWeekForYear) {
          // Roll over to next year: week exceeds max, becomes week 1+ of next year
          int weeksOver = weekNumber - maxWeekForYear;
          adjustedWeekNumber = weeksOver;
          adjustedYear = year + 1;

          // Validate the adjusted week for the next year
          LocalDate lastDayOfNextYear = LocalDate.of(adjustedYear, 12, 31);
          int maxWeekForNextYear = lastDayOfNextYear.get(weekFields.weekOfWeekBasedYear());
          if (adjustedWeekNumber > maxWeekForNextYear) {
            adjustedWeekNumber = maxWeekForNextYear;
          }
        }
      } catch (Exception e) {
        // If we can't determine max week, use simple fallback: clamp to 53
        if (weekNumber > 53) {
          adjustedWeekNumber = weekNumber - 53;
          adjustedYear = year + 1;
          if (adjustedWeekNumber > 53) {
            adjustedWeekNumber = 53;
          }
        }
      }
    }

    // Final validation: ensure week number is at least 1 and within valid range
    if (adjustedWeekNumber < 1) {
      adjustedWeekNumber = 1;
    }

    // Get the actual maximum week number for the adjusted year to ensure validity
    try {
      LocalDate lastDayOfAdjustedYear = LocalDate.of(adjustedYear, 12, 31);
      int maxWeekForAdjustedYear = lastDayOfAdjustedYear.get(weekFields.weekOfWeekBasedYear());
      if (adjustedWeekNumber > maxWeekForAdjustedYear) {
        adjustedWeekNumber = maxWeekForAdjustedYear;
      }
    } catch (Exception e) {
      // If we can't determine max week, clamp to 53 as a safe maximum
      if (adjustedWeekNumber > 53) {
        adjustedWeekNumber = 53;
      }
    }

    // Final absolute safety check: NEVER pass a week number > 53 to .with()
    // Get the actual maximum week for the adjusted year and clamp if necessary
    int finalWeekNumber = adjustedWeekNumber;
    try {
      LocalDate lastDayOfFinalYear = LocalDate.of(adjustedYear, 12, 31);
      int actualMaxWeek = lastDayOfFinalYear.get(weekFields.weekOfWeekBasedYear());
      // Clamp to the actual maximum (which is at most 53)
      finalWeekNumber = Math.min(adjustedWeekNumber, actualMaxWeek);
      // Ensure it's at least 1
      finalWeekNumber = Math.max(1, finalWeekNumber);
    } catch (Exception ex) {
      // If we can't determine max, use absolute maximum of 53
      finalWeekNumber = Math.min(adjustedWeekNumber, 53);
      finalWeekNumber = Math.max(1, finalWeekNumber);
    }

    // One more absolute check - this should NEVER be > 53
    if (finalWeekNumber > 53) {
      finalWeekNumber = 53;
    }

    // Try to create the date, with fallback if it still fails
    try {
      return LocalDate
          .of(adjustedYear, 2, 1)
          .with(weekFields.getFirstDayOfWeek())
          .with(weekFields.weekOfWeekBasedYear(), finalWeekNumber);
    } catch (DateTimeException e) {
      // If it still fails, clamp to a safe value and try again
      try {
        LocalDate lastDayOfYear = LocalDate.of(adjustedYear, 12, 31);
        int maxWeek = lastDayOfYear.get(weekFields.weekOfWeekBasedYear());
        int safeWeek = Math.min(finalWeekNumber, maxWeek);
        safeWeek = Math.max(1, safeWeek);
        // One more absolute check
        if (safeWeek > 53) {
          safeWeek = 53;
        }

        return LocalDate
            .of(adjustedYear, 2, 1)
            .with(weekFields.getFirstDayOfWeek())
            .with(weekFields.weekOfWeekBasedYear(), safeWeek);
      } catch (Exception ex) {
        // Ultimate fallback: use week 1
        return LocalDate
            .of(adjustedYear, 2, 1)
            .with(weekFields.getFirstDayOfWeek())
            .with(weekFields.weekOfWeekBasedYear(), 1);
      }
    }
  }

  private Date asDate(LocalDate localDate) {
    return Date.from(localDate.atStartOfDay().atZone(ZoneId.systemDefault()).toInstant());
  }

}