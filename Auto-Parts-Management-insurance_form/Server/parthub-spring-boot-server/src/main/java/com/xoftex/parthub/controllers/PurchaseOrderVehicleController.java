package com.xoftex.parthub.controllers;

import java.io.File;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

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

import com.xoftex.parthub.models.Autopart;
import com.xoftex.parthub.models.ImageModel;
import com.xoftex.parthub.models.PurchaseOrderVehicle;

import com.xoftex.parthub.models.SequenceCarrier;

import com.xoftex.parthub.models.User;

import com.xoftex.parthub.models.VehicleHistory;
import com.xoftex.parthub.repository.AutoPartRepository;
import com.xoftex.parthub.repository.PurchaseOrderVehicleRepository;
import com.xoftex.parthub.repository.RoleRepository;

import com.xoftex.parthub.repository.UserRepository;
import com.xoftex.parthub.repository.VehicleHistoryRepository;

//for Angular Client (withCredentials)
//@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
// @CrossOrigin(origins = "*", maxAge = 3600)
@CrossOrigin("*")
@RestController
@RequestMapping("/api/purchaseordervehicles")
public class PurchaseOrderVehicleController {

  @Autowired
  UserRepository userRepository;

  @Autowired
  AutoPartRepository autoPartRepository;

  @Autowired
  RoleRepository roleRepository;

  @Autowired
  VehicleHistoryRepository vehicleHistoryRepository;

  @Autowired
  PurchaseOrderVehicleRepository purchaseOrderVehicleRepository;

  @Value("${image.root.path}")
  // String filePath = "C:\\Projects\\images\\";
  String filePath = "";

  String imageNamePrefix = "test_image_";

  private static final Logger LOG = LoggerFactory.getLogger(PurchaseOrderVehicleController.class);

  @PostMapping("/{userId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<PurchaseOrderVehicle> createAndUpdatePurchaseOrderVehicle(@PathVariable("userId") long userId,
      @RequestBody PurchaseOrderVehicle purchaseOrderVehicleIn) {

    Optional<User> userOptional = this.userRepository.findById(userId);
    PurchaseOrderVehicle purchaseOrderVehicle = new PurchaseOrderVehicle();
    boolean isNew = false;

    if (purchaseOrderVehicleIn.getToken() == null || purchaseOrderVehicleIn.getToken().equals("")) {

      String randomCode = UUID.randomUUID().toString();
      purchaseOrderVehicleIn.setToken(randomCode);
    }

    if (purchaseOrderVehicleIn.getId() == 0) 
      isNew = true;
 

    VehicleHistory vehicleHistory = new VehicleHistory();

    if (userOptional.isPresent()) {

      purchaseOrderVehicleIn.setUserId(userId);

      purchaseOrderVehicle = this.purchaseOrderVehicleRepository.save(purchaseOrderVehicleIn);

      vehicleHistory.setName(
          "Purchase Order " + purchaseOrderVehicleIn.getReason() + " " + purchaseOrderVehicleIn.getTitle());

      vehicleHistory.setUserId(userId);
      vehicleHistory.setVehicleId(purchaseOrderVehicleIn.getVehicleId());

      // vehicleHistory.setName("PurchaseOrderVehicle");

      if (!isNew) {
        vehicleHistory.setObjectKey(purchaseOrderVehicleIn.getId());
        vehicleHistory.setType(1); // 0) add 1) update 2) delete
      } else {
        vehicleHistory.setObjectKey(purchaseOrderVehicle.getId());
        vehicleHistory.setType(0); // 0) add 1) update 2) delete
      }

      vehicleHistory.setValue("" + purchaseOrderVehicleIn.getPrice());

      this.vehicleHistoryRepository.save(vehicleHistory);

    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    return new ResponseEntity<>(purchaseOrderVehicle, HttpStatus.CREATED);

  }

  @PostMapping("/sequence/{vehicleId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<PurchaseOrderVehicle>> updateSequenceNumber(@PathVariable("vehicleId") long vehicleId,
      @RequestBody List<SequenceCarrier> sequenceCarriers) {

    List<PurchaseOrderVehicle> purchaseOrderVehicles = this.purchaseOrderVehicleRepository.findByVehicleId(vehicleId);

    for (PurchaseOrderVehicle purchaseOrderVehicle : purchaseOrderVehicles) {

      for (SequenceCarrier sequenceCarrier : sequenceCarriers) {

        if (purchaseOrderVehicle.getId() == sequenceCarrier.getId()) {
          purchaseOrderVehicle.setSequenceNumber(sequenceCarrier.getIndex());
          purchaseOrderVehicle = this.purchaseOrderVehicleRepository.save(purchaseOrderVehicle);
        }
      }
    }

    return new ResponseEntity<>(purchaseOrderVehicles, HttpStatus.OK);

  }

  @PostMapping("/sequence/claim/{claimId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<PurchaseOrderVehicle>> updateClaimSequenceNumber(@PathVariable("claimId") long claimId,
      @RequestBody List<SequenceCarrier> sequenceCarriers) {

    List<PurchaseOrderVehicle> purchaseOrderVehicles = this.purchaseOrderVehicleRepository.findByClaimId(claimId);

    for (PurchaseOrderVehicle purchaseOrderVehicle : purchaseOrderVehicles) {

      for (SequenceCarrier sequenceCarrier : sequenceCarriers) {

        if (purchaseOrderVehicle.getId() == sequenceCarrier.getId()) {
          purchaseOrderVehicle.setSequenceNumber(sequenceCarrier.getIndex());
          purchaseOrderVehicle = this.purchaseOrderVehicleRepository.save(purchaseOrderVehicle);
        }
      }
    }

    return new ResponseEntity<>(purchaseOrderVehicles, HttpStatus.OK);

  }

  @GetMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<PurchaseOrderVehicle> getPurchaseOrderVehicle(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<PurchaseOrderVehicle> purchaseOrderVehicleOptional = this.purchaseOrderVehicleRepository.findById(id);
    PurchaseOrderVehicle purchaseOrderVehicle = new PurchaseOrderVehicle();
    if (purchaseOrderVehicleOptional.isPresent()) {
      purchaseOrderVehicle = purchaseOrderVehicleOptional.get();
      return new ResponseEntity<>(purchaseOrderVehicle, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
  }

  @GetMapping("/vehicle/{vehicleId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<PurchaseOrderVehicle>> getVehiclePurchaseOrderVehicles(
      @PathVariable("vehicleId") long vehicleId) {
    LOG.info("" + vehicleId);

    List<PurchaseOrderVehicle> purchaseOrderVehicles = this.purchaseOrderVehicleRepository
        .findByVehicleIdOrderByPartNameAsc(vehicleId);

    if (!purchaseOrderVehicles.isEmpty()) {
      return new ResponseEntity<>(purchaseOrderVehicles, HttpStatus.OK);
    } else {
      // otherwise too much crack on the client side
      return new ResponseEntity<>(HttpStatus.OK);
    }
  }

  @DeleteMapping("/{id}/{userId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<?> deletePurchaseOrderVehicle(@PathVariable("id") long id,
      @PathVariable("userId") long userId) {
    LOG.info("" + id);
    Optional<PurchaseOrderVehicle> purchaseOrderVehicleOptional = this.purchaseOrderVehicleRepository.findById(id);
    PurchaseOrderVehicle purchaseOrderVehicle = new PurchaseOrderVehicle();
    if (purchaseOrderVehicleOptional.isPresent()) {
      purchaseOrderVehicle = purchaseOrderVehicleOptional.get();

      VehicleHistory vehicleHistory = new VehicleHistory();
      vehicleHistory.setName("Estimate " + purchaseOrderVehicle.getTitle());
      vehicleHistory.setType(2); // 0) add 1) update 2) delete
      vehicleHistory.setUserId(userId); // fix later
      vehicleHistory.setVehicleId(purchaseOrderVehicle.getVehicleId());
      vehicleHistory.setValue("" + purchaseOrderVehicle.getPrice());
      vehicleHistory.setObjectKey(id);
      this.vehicleHistoryRepository.save(vehicleHistory);

      this.purchaseOrderVehicleRepository.delete(purchaseOrderVehicle);
      return new ResponseEntity<>(null, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }

  @DeleteMapping("/{id}/{userId}/{opitionId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<?> deletePurchaseOrderVehicleWithOption(@PathVariable("opitionId") long opitionId,
      @PathVariable("id") long id, @PathVariable("userId") long userId) {
    LOG.info("" + id);
    Optional<PurchaseOrderVehicle> purchaseOrderVehicleOptional = this.purchaseOrderVehicleRepository.findById(id);
    PurchaseOrderVehicle purchaseOrderVehicle = new PurchaseOrderVehicle();
    if (purchaseOrderVehicleOptional.isPresent()) {
      purchaseOrderVehicle = purchaseOrderVehicleOptional.get();

      VehicleHistory vehicleHistory = new VehicleHistory();
      vehicleHistory.setName("Estimate " + purchaseOrderVehicle.getTitle());
      vehicleHistory.setType(2); // 0) add 1) update 2) delete
      vehicleHistory.setUserId(userId); // fix later
      vehicleHistory.setVehicleId(purchaseOrderVehicle.getVehicleId());
      vehicleHistory.setValue("" + purchaseOrderVehicle.getPrice());
      vehicleHistory.setObjectKey(id);
      this.vehicleHistoryRepository.save(vehicleHistory);

      if (opitionId == 1) {
        List<Autopart> autoparts = this.autoPartRepository.findByPurchaseOrderId(purchaseOrderVehicle.getId());
        for (Autopart autopart : autoparts) {
          for (ImageModel imageModel : autopart.getImageModels()) {
            try {
              File f = new File(this.filePath + this.imageNamePrefix + imageModel.getId() + ".jpeg"); // file
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

          if (autopart.getVehicleId() > 0) {
            VehicleHistory vehicleHistoryAutopart = new VehicleHistory();
            vehicleHistoryAutopart.setName("Autopart Image");

            // vehicleHistory.setUserId(_imageModelSaved.getUserId());
            vehicleHistoryAutopart.setVehicleId(autopart.getVehicleId());

            vehicleHistoryAutopart.setObjectKey(autopart.getPurchaseOrderId());
            vehicleHistoryAutopart.setType(2); // 0) add 1) update 2) delete
            vehicleHistoryAutopart.setUserId(userId);
            vehicleHistoryAutopart.setValue("");

            this.vehicleHistoryRepository.save(vehicleHistory);
          }

          this.autoPartRepository.delete(autopart);

        }
      } else {
        List<Autopart> autoparts = this.autoPartRepository.findByPurchaseOrderId(purchaseOrderVehicle.getId());
        for (Autopart autopart : autoparts) {

          autopart.setPurchaseOrderId((long) 0);
          this.autoPartRepository.save(autopart);

          VehicleHistory vehicleHistoryAutopart = new VehicleHistory();
          vehicleHistoryAutopart.setName(
              "Autopart update to disassociate with purchase order with id [" + purchaseOrderVehicle.getId() + "]");

          // vehicleHistory.setUserId(_imageModelSaved.getUserId());
          vehicleHistoryAutopart.setVehicleId(autopart.getVehicleId());

          vehicleHistoryAutopart.setObjectKey(autopart.getPurchaseOrderId());
          vehicleHistoryAutopart.setType(1); // 0) add 1) update 2) delete
          vehicleHistoryAutopart.setUserId(userId);
          vehicleHistoryAutopart.setValue("");

          this.vehicleHistoryRepository.save(vehicleHistory);
        }
      }
      this.purchaseOrderVehicleRepository.delete(purchaseOrderVehicle);
      return new ResponseEntity<>(null, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }
}
