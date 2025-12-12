package com.xoftex.parthub.controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

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

import com.xoftex.parthub.models.CounterInvoice;
import com.xoftex.parthub.models.CounterInvoiceItem;
import com.xoftex.parthub.models.SearchCarrier;
import com.xoftex.parthub.models.SequenceCarrier;

import com.xoftex.parthub.models.User;

import com.xoftex.parthub.repository.CounterInvoiceItemRepository;
import com.xoftex.parthub.repository.CounterInvoiceRepository;
import com.xoftex.parthub.repository.CustomerRepository;
import com.xoftex.parthub.repository.RoleRepository;

import com.xoftex.parthub.repository.UserRepository;
import com.xoftex.parthub.repository.VehicleHistoryRepository;

//for Angular Client (withCredentials)
//@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
// @CrossOrigin(origins = "*", maxAge = 3600)
@CrossOrigin("*")
@RestController
@RequestMapping("/api/counterinvoices")
public class CounterInvoiceController {

  @Autowired
  UserRepository userRepository;

  @Autowired
  RoleRepository roleRepository;

  @Autowired
  VehicleHistoryRepository vehicleHistoryRepository;

  @Autowired
  CounterInvoiceRepository counterInvoiceRepository;

  @Autowired
  CounterInvoiceItemRepository counterInvoiceItemRepository;

  @Autowired
  CustomerRepository customerRepository;

  private static final Logger LOG = LoggerFactory.getLogger(CounterInvoiceController.class);

  @PostMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<CounterInvoice> createAndUpdateCounterInvoice(@PathVariable("id") long id,
      @RequestBody CounterInvoice counterInvoiceIn) {

    Optional<User> userOptional = this.userRepository.findById(id);
    CounterInvoice counterInvoice = new CounterInvoice();

    if (counterInvoiceIn.getToken() == null || counterInvoiceIn.getToken().equals("")) {

      String randomCode = UUID.randomUUID().toString();
      counterInvoiceIn.setToken(randomCode);
    }

    if (userOptional.isPresent()) {

      counterInvoiceIn.setUserId(id);
      counterInvoice = this.counterInvoiceRepository.save(counterInvoiceIn);
      try {
        counterInvoice.setCustomer(this.customerRepository.findById(counterInvoice.getCustomerId()).get());
      } catch (Exception ex) {

      }
      List<CounterInvoiceItem> counterInvoiceItems = this.counterInvoiceItemRepository
          .findByCounterInvoiceId(counterInvoice.getId());
      if (!counterInvoiceItems.isEmpty()) {
        counterInvoice.setCounterInvoiceItems(counterInvoiceItems);
        counterInvoice.setItemCounts(counterInvoiceItems.size());
        counterInvoice = this.counterInvoiceRepository.save(counterInvoice);
      }

    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    return new ResponseEntity<>(counterInvoice, HttpStatus.CREATED);

  }

  @PostMapping("/counterinvoiceitem/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<CounterInvoiceItem> createAndUpdateCounterInvoiceItem(@PathVariable("id") long id,
      @RequestBody CounterInvoiceItem counterInvoiceItemIn) {

    Optional<User> userOptional = this.userRepository.findById(id);
    CounterInvoiceItem counterInvoiceItem = new CounterInvoiceItem();

    if (userOptional.isPresent()) {

      counterInvoiceItemIn.setUserId(id);
      counterInvoiceItem = this.counterInvoiceItemRepository.save(counterInvoiceItemIn);

    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    return new ResponseEntity<>(counterInvoiceItem, HttpStatus.CREATED);

  }

  @PostMapping("/sequence/{counterInvoiceId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<CounterInvoiceItem>> updateSequenceNumber(
      @PathVariable("counterInvoiceId") long counterInvoiceId,
      @RequestBody List<SequenceCarrier> sequenceCarriers) {

    List<CounterInvoiceItem> counterInvoiceItems = this.counterInvoiceItemRepository
        .findByCounterInvoiceId(counterInvoiceId);

    for (CounterInvoiceItem counterInvoiceItem : counterInvoiceItems) {

      for (SequenceCarrier sequenceCarrier : sequenceCarriers) {

        if (counterInvoiceItem.getId() == sequenceCarrier.getId()) {
          counterInvoiceItem.setSequenceNumber(sequenceCarrier.getIndex());
          counterInvoiceItem = this.counterInvoiceItemRepository.save(counterInvoiceItem);
        }
      }
    }

    return new ResponseEntity<>(counterInvoiceItems, HttpStatus.OK);

  }

  @GetMapping("/counterinvoiceitem/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<CounterInvoiceItem>> getCounterInvoiceItem(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<CounterInvoice> counterInvoiceOptional = this.counterInvoiceRepository.findById(id);
    CounterInvoice counterInvoice = new CounterInvoice();
    List<CounterInvoiceItem> counterInvoiceItems = new ArrayList<CounterInvoiceItem>();

    if (counterInvoiceOptional.isPresent()) {
      counterInvoice = counterInvoiceOptional.get();
      counterInvoiceItems = this.counterInvoiceItemRepository
          .findByCounterInvoiceId(counterInvoice.getId());

      if (!counterInvoiceItems.isEmpty())
        return new ResponseEntity<>(counterInvoiceItems, HttpStatus.OK);

    } else {
      // otherwise ...

    }

    return new ResponseEntity<>(counterInvoiceItems, HttpStatus.OK);
  }

  @GetMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<CounterInvoice> getCounterInvoice(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<CounterInvoice> counterInvoiceOptional = this.counterInvoiceRepository.findById(id);
    CounterInvoice counterInvoice = new CounterInvoice();
    if (counterInvoiceOptional.isPresent()) {
      counterInvoice = counterInvoiceOptional.get();
      List<CounterInvoiceItem> counterInvoiceItems = this.counterInvoiceItemRepository
          .findByCounterInvoiceId(counterInvoice.getId());

      if (!counterInvoiceItems.isEmpty())
        counterInvoice.setCounterInvoiceItems(counterInvoiceItems);
      try {
        counterInvoice.setCustomer(this.customerRepository.findById(counterInvoice.getCustomerId()).get());
      } catch (Exception ex) {

      }
      return new ResponseEntity<>(counterInvoice, HttpStatus.OK);
    } else {
      // otherwise ...
      return new ResponseEntity<>(HttpStatus.OK);
    }
  }

  @GetMapping("/customer/{cutomerId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<CounterInvoice>> getCustomerCounterInvoice(@PathVariable("cutomerId") long cutomerId) {
    LOG.info("" + cutomerId);

    List<CounterInvoice> counterInvoices = this.counterInvoiceRepository
        .findFirst20ByCustomerIdOrderByIdDesc(cutomerId);

    if (!counterInvoices.isEmpty()) {
      for (CounterInvoice counterInvoice : counterInvoices) {
        // in case
        try {
          counterInvoice.setCustomer(this.customerRepository.findById(counterInvoice.getCustomerId()).get());
        } catch (Exception ex) {

        }
      }
      return new ResponseEntity<>(counterInvoices, HttpStatus.OK);
    } else {
      // otherwise too much crack on the client side
      return new ResponseEntity<>(HttpStatus.OK);
    }
  }

  @GetMapping("/search/{companyId}/{invoiceNumber}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<CounterInvoice>> getCounterInvoiceWithInvoiceNumber(
      @PathVariable("companyId") long companyId,
      @PathVariable("invoiceNumber") String invoiceNumber) {
    LOG.info("" + invoiceNumber);

    List<CounterInvoice> counterInvoices = this.counterInvoiceRepository
        .findByCompanyIdAndInvoiceNumber(companyId, invoiceNumber);

    for (CounterInvoice counterInvoice : counterInvoices) {
      // in case
      try {
        counterInvoice.setCustomer(this.customerRepository.findById(counterInvoice.getCustomerId()).get());
      } catch (Exception ex) {

      }
    }

    if (!counterInvoices.isEmpty()) {
      return new ResponseEntity<>(counterInvoices, HttpStatus.OK);
    } else {
      // otherwise too much crack on the client side
      return new ResponseEntity<>(HttpStatus.OK);
    }
  }

  @PostMapping("/search/{companyId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<CounterInvoice>> getCounterInvoiceWithPage(
      @PathVariable("companyId") long companyId, @RequestBody SearchCarrier searchCarrier) {

    LOG.info(searchCarrier.pageNumber + " " + searchCarrier.pageSize);

    int totalCount = this.counterInvoiceRepository.countByCompanyId(companyId);

    List<CounterInvoice> counterInvoices = this.counterInvoiceRepository
        .findByCompanyIdOrderByIdDesc(companyId,
            Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));

    for (CounterInvoice counterInvoice : counterInvoices) {
      // in case
      try {
        counterInvoice.setCustomer(this.customerRepository.findById(counterInvoice.getCustomerId()).get());
        counterInvoice.totalCount = totalCount;
        counterInvoice.searchCount = counterInvoices.size();
      } catch (Exception ex) {

      }
    }

    if (!counterInvoices.isEmpty()) {
      return new ResponseEntity<>(counterInvoices, HttpStatus.OK);
    } else {
      // otherwise too much crack on the client side
      return new ResponseEntity<>(HttpStatus.OK);
    }
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<?> deleteCounterInvoice(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<CounterInvoice> counterInvoiceOptional = this.counterInvoiceRepository.findById(id);
    CounterInvoice counterInvoice = new CounterInvoice();
    if (counterInvoiceOptional.isPresent()) {
      counterInvoice = counterInvoiceOptional.get();
      // remove all items
      List<CounterInvoiceItem> counterInvoiceItems = this.counterInvoiceItemRepository
          .findByCounterInvoiceId(counterInvoice.getId());

      for (CounterInvoiceItem counterInvoiceItem : counterInvoiceItems) {
        this.counterInvoiceItemRepository.delete(counterInvoiceItem);
      }
      this.counterInvoiceRepository.delete(counterInvoice);
      return new ResponseEntity<>(null, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }

  @DeleteMapping("/counterinvoiceitem/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<?> deleteCounterInvoiceItem(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<CounterInvoiceItem> counterInvoiceItemOptional = this.counterInvoiceItemRepository.findById(id);
    CounterInvoiceItem counterInvoice = new CounterInvoiceItem();
    if (counterInvoiceItemOptional.isPresent()) {
      counterInvoice = counterInvoiceItemOptional.get();

      this.counterInvoiceItemRepository.delete(counterInvoice);
      return new ResponseEntity<>(null, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }
}