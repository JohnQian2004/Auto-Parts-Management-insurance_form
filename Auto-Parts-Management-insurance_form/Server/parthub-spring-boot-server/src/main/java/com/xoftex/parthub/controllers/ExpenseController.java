package com.xoftex.parthub.controllers;

import java.io.File;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.WeekFields;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

import com.xoftex.parthub.models.Expense;
import com.xoftex.parthub.models.ImageModelExpense;
import com.xoftex.parthub.models.ImageModelVehicle;
import com.xoftex.parthub.models.Payment;
import com.xoftex.parthub.models.SearchCarrier;
import com.xoftex.parthub.models.User;
import com.xoftex.parthub.models.Vehicle;
import com.xoftex.parthub.repository.ExpenseRepository;
import com.xoftex.parthub.repository.ImageModelExpenseRepository;

import com.xoftex.parthub.repository.UserRepository;
import com.xoftex.parthub.security.jwt.JwtUtils;

//for Angular Client (withCredentials)
//@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
// @CrossOrigin(origins = "*", maxAge = 3600)
@CrossOrigin("*")
@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

  @Autowired
  UserRepository userRepository;

  @Autowired
  ExpenseRepository expenseRepository;

  @Autowired
  ImageModelExpenseRepository imageModelExpenseRepository;

  @Autowired
  JwtUtils jwtUtils;

  @Value("${image.path.expense}")
  // String filePath = "C:\\Projects\\images\\expense\\test_image_";
  String filePath = "";

  @Value("${image.root.path.expense}")
  // String filePath = "C:\\Projects\\images\\expense\\;
  String fileRootPath = "";

  String imageNamePrefix = "test_expense_image_";

  @Value("${image.resize.expense}")
  String imageResizeDirectory = "";

  private static final Logger LOG = LoggerFactory.getLogger(ExpenseController.class);

  @PostMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<Expense> createAndUpdateExpense(@PathVariable("id") long id,
      @RequestBody Expense expenseIn) {

    Optional<User> userOptional = this.userRepository.findById(id);
    Expense expense = new Expense();

    if (userOptional.isPresent()) {

      expenseIn.setUserId(id);

      expenseIn.setSubtotal(expenseIn.getAmount() * expenseIn.getQuantity());

      if (expenseIn.getId() == 0) {
        String randomCode = UUID.randomUUID().toString();
        expenseIn.setToken(randomCode);
      } else {
        Optional<Expense> expenseOptional = this.expenseRepository.findById(expenseIn.getId());
        if (expenseOptional.isPresent()) {
          expenseIn.setImageModels(expenseOptional.get().getImageModels());
        }
      }

      expense = this.expenseRepository.save(expenseIn);

    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>(expense, HttpStatus.CREATED);

  }

  @GetMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<Expense> getExpense(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<Expense> expenseOptional = this.expenseRepository.findById(id);
    Expense expense = new Expense();
    if (expenseOptional.isPresent()) {
      expense = expenseOptional.get();
      return new ResponseEntity<>(expense, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }

  @PostMapping("/company/withpage")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<Expense>> getCompanyExpensesWithPage(@RequestBody SearchCarrier searchCarrier) {

    LOG.info(searchCarrier.pageNumber + " " + searchCarrier.pageSize);
    List<Expense> expenses = new ArrayList<Expense>();
    int searchCount = 0;

    if (searchCarrier.type == 0) {
      searchCount = this.expenseRepository.countByCompanyIdOrderByIdDesc(searchCarrier.companyId);

      expenses = this.expenseRepository.findByCompanyIdOrderByIdDesc(searchCarrier.companyId,
          Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));

    } else {

      searchCount = this.expenseRepository.countByCompanyIdAndPaidOrderByIdDesc(searchCarrier.companyId, false);

      expenses = this.expenseRepository.findByCompanyIdAndPaidOrderByIdDesc(searchCarrier.companyId, false,
          Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));

    }

    if (expenses.isEmpty()) {
      return new ResponseEntity<>(expenses, HttpStatus.OK);
    } else {
      for (Expense expense : expenses) {
        expense.searchCount = searchCount;
      }
    }

    return new ResponseEntity<>(expenses, HttpStatus.OK);
  }

  @PostMapping("/search/withpage")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<Expense>> searchExpensesWithPage(@RequestBody SearchCarrier searchCarrier) {

    LOG.info(searchCarrier.pageNumber + " " + searchCarrier.pageSize);
    List<Expense> expenses = new ArrayList<Expense>();
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

      searchCount = this.expenseRepository.coutCommentsIn(
          searchCarrier.companyId,
          searchCarrier.partName);

      expenses = this.expenseRepository.findCommentsIn(searchCarrier.companyId,
          searchCarrier.partName,
          Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));

    } else {

      searchCount = this.expenseRepository.countByCompanyIdAndCommentsIgnoreCaseOrderByIdDesc(
          searchCarrier.companyId,
          searchCarrier.partName);

      expenses = this.expenseRepository.findByCompanyIdAndCommentsIgnoreCaseOrderByIdDesc(searchCarrier.companyId,
          searchCarrier.partName,
          Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
    }
    if (expenses.isEmpty()) {
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    } else {
      for (Expense expense : expenses) {
        expense.searchCount = searchCount;
      }
    }

    return new ResponseEntity<>(expenses, HttpStatus.OK);
  }

  @GetMapping("/company/{companyId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<Expense>> getCompanyExpenses(@PathVariable("companyId") long companyId) {

    List<Expense> expenses = new ArrayList<Expense>();

    expenses = this.expenseRepository.findByCompanyIdOrderByIdDesc(companyId);
    if (expenses.isEmpty()) {
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    return new ResponseEntity<>(expenses, HttpStatus.OK);
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<?> deleteExpense(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<Expense> expenseOptional = this.expenseRepository.findById(id);
    Expense expense = new Expense();
    if (expenseOptional.isPresent()) {
      expense = expenseOptional.get();

      for (ImageModelExpense imageModel : expense.getImageModels()) {

        try {
          // this.imageModelExpenseRepository.delete(imageModel);
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

      this.expenseRepository.delete(expense);

      return new ResponseEntity<>(null, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }

  // Locale.US
  private LocalDate getFirstDayOfWeek(int year, int weekNumber, Locale locale) {
    return LocalDate
        .of(year, 2, 1)
        .with(WeekFields.of(locale).getFirstDayOfWeek())
        .with(WeekFields.of(locale).weekOfWeekBasedYear(), weekNumber);
  }

  private Date asDate(LocalDate localDate) {
    return Date.from(localDate.atStartOfDay().atZone(ZoneId.systemDefault()).toInstant());
  }
}