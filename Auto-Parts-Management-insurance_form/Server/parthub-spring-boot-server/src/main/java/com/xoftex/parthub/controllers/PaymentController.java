package com.xoftex.parthub.controllers;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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

import com.xoftex.parthub.models.DayDataCarrier;
import com.xoftex.parthub.models.ImageModelPayment;
import com.xoftex.parthub.models.Payment;
import com.xoftex.parthub.models.SequenceCarrier;
import com.xoftex.parthub.models.User;
import com.xoftex.parthub.models.Vehicle;
import com.xoftex.parthub.models.VehicleHistory;
import com.xoftex.parthub.payload.request.DateCarrier;
import com.xoftex.parthub.repository.ImageModelPaymentRepository;
import com.xoftex.parthub.repository.PaymentRepository;
import com.xoftex.parthub.repository.RoleRepository;
import com.xoftex.parthub.repository.UserRepository;
import com.xoftex.parthub.repository.VehicleHistoryRepository;
import com.xoftex.parthub.repository.VehicleRepository;

//for Angular Client (withCredentials)
//@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
// @CrossOrigin(origins = "*", maxAge = 3600)
@CrossOrigin("*")
@RestController
@RequestMapping("/api/payments")
public class PaymentController {

  @Autowired
  UserRepository userRepository;

  @Autowired
  RoleRepository roleRepository;

  @Autowired
  VehicleHistoryRepository vehicleHistoryRepository;

  @Autowired
  VehicleRepository vehicleRepository;

  @Autowired
  PaymentRepository paymentRepository;

  @Autowired
  ImageModelPaymentRepository imageModelPaymentRepository;

  @Value("${image.path.payment}")
  // String filePath = "C:\\Projects\\images\\payment\\test_image_";
  String filePath = "";

  @Value("${image.root.path.payment}")
  // String filePath = "C:\\Projects\\images\\payment\\;
  String fileRootPath = "";

  String imageNamePrefix = "test_payment_image_";

  @Value("${image.resize.payment}")
  String imageResizeDirectory = "";

  private static final Logger LOG = LoggerFactory.getLogger(PaymentController.class);

  @PostMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<Payment> createAndUpdatePayment(@PathVariable("id") long id, @RequestBody Payment paymentIn) {

    Optional<User> userOptional = this.userRepository.findById(id);
    Payment payment = new Payment();
    boolean isNew = false;

    if (paymentIn.getToken() == null || paymentIn.getToken().equals("")) {

      String randomCode = UUID.randomUUID().toString();
      paymentIn.setToken(randomCode);
    }

    if (paymentIn.getId() == 0)
      isNew = true;

    VehicleHistory vehicleHistory = new VehicleHistory();

    if (userOptional.isPresent()) {

      paymentIn.setUserId(id);

      if (paymentIn.getId() == 0) {
        isNew = true;
      } else {
        Optional<Payment> paymentOptional = this.paymentRepository.findById(paymentIn.getId());
        if (paymentOptional.isPresent()) {
          paymentIn.setImageModels(paymentOptional.get().getImageModels());
        }
      }

      payment = this.paymentRepository.save(paymentIn);
      if (paymentIn.getReason() == null)
        vehicleHistory.setName("Payment new");

      if (paymentIn.getReason().equals("calendar")) {
        vehicleHistory.setName("Payment " + paymentIn.getReason() + " " + paymentIn.getName());
      } else {
        vehicleHistory.setName("Payment " + paymentIn.getReason() + " " + paymentIn.getName());
      }

      vehicleHistory.setUserId(id);
      vehicleHistory.setVehicleId(paymentIn.getVehicleId());

      // vehicleHistory.setName("Payment");

      if (!isNew) {
        vehicleHistory.setObjectKey(paymentIn.getId());
        vehicleHistory.setType(1); // 0) add 1) update 2) delete
      } else {
        vehicleHistory.setObjectKey(payment.getId());
        vehicleHistory.setType(0); // 0) add 1) update 2) delete
      }
      if (paymentIn.getReason().equals("calender")) {
        vehicleHistory.setValue("" + paymentIn.getDate());
      } else if (paymentIn.getReason().equals("payment method")) {
        vehicleHistory.setValue("" + paymentIn.getPaymentMethodId());
      } else {
        vehicleHistory.setValue("" + paymentIn.getAmount());
      }

      this.vehicleHistoryRepository.save(vehicleHistory);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    return new ResponseEntity<>(payment, HttpStatus.CREATED);

  }

  @PostMapping("/week/{companyId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<DayDataCarrier>> getWeeklyPayments(@PathVariable("companyId") long companyId,
      @RequestBody DateCarrier dateCarrier) {

    System.out.println("getWeeklyPayments " + companyId);

    int year = dateCarrier.year;
    int week = dateCarrier.week;
    int range = dateCarrier.range;
    int yearWeek = year * 100 + week;
    List<Payment> payments = this.paymentRepository.findByYearWeek(companyId, yearWeek);

    // Group entities by day of week
    Map<Integer, List<Payment>> entitiesByDay = payments.stream()
        .collect(Collectors.groupingBy(
            entity -> {
              Calendar cal = Calendar.getInstance();
              cal.setTime(entity.getDate());
              return cal.get(Calendar.DAY_OF_WEEK);
            }));

    // Create a list of all days in the week (Monday to Sunday)
    List<DayDataCarrier> weekData = new ArrayList<>();
    SimpleDateFormat dateFormat = new SimpleDateFormat("MMdd");
    SimpleDateFormat dayNameFormat = new SimpleDateFormat("EEE", Locale.ENGLISH);

    // Get dates for the requested week
    Calendar cal = Calendar.getInstance();
    cal.set(Calendar.YEAR, year);
    cal.set(Calendar.WEEK_OF_YEAR, week);
    cal.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY); // Start with Monday

    for (int i = 0; i < 7; i++) {
      Date currentDate = cal.getTime();

      // Format day name and date
      String dayName = dayNameFormat.format(currentDate);
      String formattedDate = dateFormat.format(currentDate);

      // Get entities for this day (convert Calendar.DAY_OF_WEEK to our map key)
      int dayOfWeek = cal.get(Calendar.DAY_OF_WEEK);
      List<Payment> dayEntities = entitiesByDay.getOrDefault(dayOfWeek, Collections.emptyList());

      for (Payment payment : dayEntities) {
        Optional<Vehicle> vehicleOptional = this.vehicleRepository.findById(payment.getVehicleId());
        if (vehicleOptional.isPresent()) {
          payment.setVehicle(vehicleOptional.get());
        }
      }
      // Create data carrier for this day
      weekData.add(new DayDataCarrier(dayName, formattedDate, dayEntities));

      // Move to next day
      cal.add(Calendar.DAY_OF_WEEK, 1);
    }
    return new ResponseEntity<>(weekData, HttpStatus.OK);

  }

  @PostMapping("/sequence/{vehicleId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<Payment>> updateSequenceNumber(@PathVariable("vehicleId") long vehicleId,
      @RequestBody List<SequenceCarrier> sequenceCarriers) {

    List<Payment> payments = this.paymentRepository.findByVehicleId(vehicleId);

    for (Payment payment : payments) {

      for (SequenceCarrier sequenceCarrier : sequenceCarriers) {

        if (payment.getId() == sequenceCarrier.getId()) {
          payment.setSequenceNumber(sequenceCarrier.getIndex());
          payment = this.paymentRepository.save(payment);
        }
      }
    }

    return new ResponseEntity<>(payments, HttpStatus.OK);

  }

  @GetMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<Payment> getPayment(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<Payment> paymnentOptional = this.paymentRepository.findById(id);
    Payment payment = new Payment();
    if (paymnentOptional.isPresent()) {
      payment = paymnentOptional.get();
      return new ResponseEntity<>(payment, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
  }

  @GetMapping("/vehicle/{vehicleId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<Payment>> getVehiclePayment(@PathVariable("vehicleId") long vehicleId) {
    LOG.info("" + vehicleId);

    List<Payment> payments = this.paymentRepository.findByVehicleIdOrderByNameAsc(vehicleId);

    if (!payments.isEmpty()) {
      return new ResponseEntity<>(payments, HttpStatus.OK);
    } else {
      // otherwise too much crack on the client side
      return new ResponseEntity<>(HttpStatus.OK);
    }
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<?> deletePayment(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<Payment> paymentOptional = this.paymentRepository.findById(id);
    Payment payment = new Payment();
    if (paymentOptional.isPresent()) {
      payment = paymentOptional.get();

      for (ImageModelPayment imageModel : payment.getImageModels()) {

        try {
          // this.imageModelPaymentRepository.delete(imageModel);
        } catch (Exception ex) {

        }

        try { // delete

          File f = new File(this.fileRootPath + this.imageNamePrefix + imageModel.getId() + ".jpeg"); // file

          // to be
          if (f.delete()) // returns Boolean value
          {
            System.out.println(f.getName() + " deleted"); // getting and printing the file name
          }

        } catch (Exception e) {

        }

        try {
          File f = new File(
              this.fileRootPath + "500\\" + this.imageNamePrefix + imageModel.getId() + ".jpeg"); // file
          // to be
          // delete
          if (f.delete()) // returns Boolean value
          {
            System.out.println(f.getName() + " deleted"); // getting and printing the file name
          }

        } catch (Exception e) {

        }

      }

      VehicleHistory vehicleHistory = new VehicleHistory();
      vehicleHistory.setName("Payment " + payment.getName());
      vehicleHistory.setType(2); // 0) add 1) update 2) delete
      vehicleHistory.setUserId(0); // fix later
      vehicleHistory.setVehicleId(payment.getVehicleId());
      vehicleHistory.setValue("" + payment.getAmount());
      vehicleHistory.setObjectKey(id);
      this.vehicleHistoryRepository.save(vehicleHistory);

      this.paymentRepository.delete(payment);
      return new ResponseEntity<>(null, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }
}