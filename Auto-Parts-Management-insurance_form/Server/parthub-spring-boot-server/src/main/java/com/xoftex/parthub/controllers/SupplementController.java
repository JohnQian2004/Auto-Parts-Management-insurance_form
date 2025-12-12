package com.xoftex.parthub.controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

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
import com.xoftex.parthub.models.Job;
import com.xoftex.parthub.models.SequenceCarrier;
import com.xoftex.parthub.models.Supplement;
import com.xoftex.parthub.models.User;
import com.xoftex.parthub.models.Vehicle;
import com.xoftex.parthub.models.VehicleHistory;
import com.xoftex.parthub.repository.CompanyRepository;
import com.xoftex.parthub.repository.RoleRepository;
import com.xoftex.parthub.repository.SupplementRepository;
import com.xoftex.parthub.repository.UserRepository;
import com.xoftex.parthub.repository.VehicleHistoryRepository;
import com.xoftex.parthub.repository.VehicleRepository;

//for Angular Client (withCredentials)
//@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
// @CrossOrigin(origins = "*", maxAge = 3600)
@CrossOrigin("*")
@RestController
@RequestMapping("/api/supplements")
public class SupplementController {

  @Autowired
  UserRepository userRepository;

  @Autowired
  RoleRepository roleRepository;

  @Autowired
  SupplementRepository supplementRepository;

  @Autowired
  VehicleRepository vehicleRepository;

  @Autowired
  VehicleHistoryRepository vehicleHistoryRepository;

  private static final Logger LOG = LoggerFactory.getLogger(SupplementController.class);

  @PostMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<Supplement> createAndUpdateSupplement(@PathVariable("id") long id,
      @RequestBody Supplement supplementIn) {

    Optional<User> userOptional = this.userRepository.findById(supplementIn.getUserId());
    Optional<Vehicle> vehicleOptional = this.vehicleRepository.findById(id);

    Supplement supplement = new Supplement();
    VehicleHistory vehicleHistory = new VehicleHistory();
    boolean isNew = false;

    if (supplementIn.getToken() == null || supplementIn.getToken().equals("")) {

      String randomCode = UUID.randomUUID().toString();
      supplementIn.setToken(randomCode);
    }

    if (supplementIn.getId() == 0)
      isNew = true;

    if (userOptional.isPresent() && vehicleOptional.isPresent()) {

      supplementIn.setUserId(userOptional.get().getId());
      supplementIn.setVehicle(vehicleOptional.get());

      vehicleHistory.setName("Supplement " + supplementIn.getReason() + " " + supplementIn.getName());

      vehicleHistory.setUserId(userOptional.get().getId());
      vehicleHistory.setVehicleId(id);

      // vehicleHistory.setName("Supplement");

      if (!isNew) {
        vehicleHistory.setObjectKey(supplementIn.getId());
        vehicleHistory.setType(1); // 0) add 1) update 2) delete
      } else {
        vehicleHistory.setObjectKey(supplement.getId());
        vehicleHistory.setType(0); // 0) add 1) update 2) delete
      }
      vehicleHistory.setValue("" + supplementIn.getPrice());

      this.vehicleHistoryRepository.save(vehicleHistory);

      supplement = this.supplementRepository.save(supplementIn);

    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>(supplement, HttpStatus.CREATED);

  }

  @GetMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<Supplement> getSupplement(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<Supplement> supplementOptional = this.supplementRepository.findById(id);
    Supplement supplement = new Supplement();
    if (supplementOptional.isPresent()) {
      supplement = supplementOptional.get();
      return new ResponseEntity<>(supplement, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }

  @GetMapping("/vehicle/{vehicleId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<Supplement>> getComponentSupplement(@PathVariable("vehicleId") long vehicleId) {

    List<Supplement> supplementList = new ArrayList<Supplement>();

    supplementList = this.supplementRepository.findByVehicleId(vehicleId);
    if (supplementList.isEmpty()) {
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    return new ResponseEntity<>(supplementList, HttpStatus.OK);
  }

  @PostMapping("/sequence/{uuid}")
  // @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<Supplement>> updateSequenceNumber(@PathVariable("uuid") String uuid,
      @RequestBody List<SequenceCarrier> sequenceCarriers) {

    Optional<Vehicle> vehicleOptional = this.vehicleRepository.findByToken(uuid);
    List<Supplement> supplements = new ArrayList<Supplement>();

    if (vehicleOptional.isPresent()) {
      supplements = this.supplementRepository.findByVehicleId(vehicleOptional.get().getId());

      for (Supplement supplement : supplements) {

        for (SequenceCarrier sequenceCarrier : sequenceCarriers) {

          if (supplement.getId() == sequenceCarrier.getId()) {
            supplement.setSequenceNumber(sequenceCarrier.getIndex());
            supplement = this.supplementRepository.save(supplement);
          }
        }
      }

    }
    return new ResponseEntity<>(supplements, HttpStatus.OK);

  }

  @PostMapping("/sequence/id/{vehicleId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<Supplement>> updateSequenceNumberWithId(@PathVariable("vehicleId") long vehicleId,
      @RequestBody List<SequenceCarrier> sequenceCarriers) {

    List<Supplement> supplements = new ArrayList<Supplement>();

    supplements = this.supplementRepository.findByVehicleId(vehicleId);

    for (Supplement supplement : supplements) {

      for (SequenceCarrier sequenceCarrier : sequenceCarriers) {

        if (supplement.getId() == sequenceCarrier.getId()) {
          supplement.setSequenceNumber(sequenceCarrier.getIndex());
          supplement = this.supplementRepository.save(supplement);
        }
      }

    }
    return new ResponseEntity<>(supplements, HttpStatus.OK);

  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<?> deleteSupplement(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<Supplement> supplementOptional = this.supplementRepository.findById(id);
    Supplement supplement = new Supplement();
    if (supplementOptional.isPresent()) {
      supplement = supplementOptional.get();
      this.supplementRepository.delete(supplement);

      return new ResponseEntity<>(null, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }
}