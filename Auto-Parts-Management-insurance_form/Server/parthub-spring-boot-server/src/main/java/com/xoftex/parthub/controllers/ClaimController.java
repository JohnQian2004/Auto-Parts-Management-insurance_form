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
import com.xoftex.parthub.models.Claim;
import com.xoftex.parthub.models.ImageModel;
import com.xoftex.parthub.models.Job;
import com.xoftex.parthub.models.PurchaseOrderVehicle;
import com.xoftex.parthub.models.Receipt;
import com.xoftex.parthub.models.SequenceCarrier;

import com.xoftex.parthub.models.User;

import com.xoftex.parthub.models.VehicleHistory;
import com.xoftex.parthub.repository.AutoPartRepository;
import com.xoftex.parthub.repository.ClaimRepository;
import com.xoftex.parthub.repository.JobRepository;
import com.xoftex.parthub.repository.PurchaseOrderVehicleRepository;
import com.xoftex.parthub.repository.ReceiptRepository;
import com.xoftex.parthub.repository.RoleRepository;

import com.xoftex.parthub.repository.UserRepository;
import com.xoftex.parthub.repository.VehicleHistoryRepository;

//for Angular Client (withCredentials)
//@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
// @CrossOrigin(origins = "*", maxAge = 3600)
@CrossOrigin("*")
@RestController
@RequestMapping("/api/claims")
public class ClaimController {

  @Autowired
  UserRepository userRepository;

  @Autowired
  RoleRepository roleRepository;

  @Autowired
  VehicleHistoryRepository vehicleHistoryRepository;

  @Autowired
  PurchaseOrderVehicleRepository purchaseOrderVehicleRepository;

  @Autowired
  ClaimRepository claimRepository;

  @Autowired
  AutoPartRepository autoPartRepository;

  @Autowired
  JobRepository jobRepository;

  @Autowired
  ReceiptRepository receiptRepository;

  @Value("${image.root.path}")
  // String filePath = "C:\\Projects\\images\\";
  String filePath = "";

  String imageNamePrefix = "test_image_";

  private static final Logger LOG = LoggerFactory.getLogger(ClaimController.class);

  @PostMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<Claim> createAndUpdateClaim(@PathVariable("id") long id, @RequestBody Claim claimIn) {

    Optional<User> userOptional = this.userRepository.findById(id);
    Claim claim = new Claim();
    boolean isNew = false;

    if (claimIn.getToken() == null || claimIn.getToken().equals("")) {

      String randomCode = UUID.randomUUID().toString();
      claimIn.setToken(randomCode);
    }

    if (claimIn.getId() == 0) {
      isNew = true;
    }

    VehicleHistory vehicleHistory = new VehicleHistory();

    if (userOptional.isPresent()) {

      claimIn.setUserId(id);

      claim = this.claimRepository.save(claimIn);
      if (isNew) {

        Receipt receipt = new Receipt();
        String randomCode = UUID.randomUUID().toString();
        receipt.setVehicleId(claim.getVehicleId());
        receipt.setToken(randomCode);
        receipt.setAmount(claim.getAmount());

        receipt.setQuantity(claim.getQuantity());
        receipt.setComments(claim.getComments());
        receipt.setName(claim.getName());
        receipt.setNotes(claim.getNotes());
        receipt.setItemType(claim.getItemType());
        receipt.setClaimId(claim.getId());
        receipt.setUserId(id);
        receipt.setReason("New");

        receipt = this.receiptRepository.save(receipt);

        VehicleHistory vehicleHistoryReceipt = new VehicleHistory();
        if (receipt.getComments() != null)
          vehicleHistoryReceipt.setName("Receipt " + receipt.getReason() + " " + receipt.getComments());
        else
          vehicleHistoryReceipt.setName("Receipt " + receipt.getReason());

        vehicleHistoryReceipt.setUserId(id);
        vehicleHistoryReceipt.setVehicleId(receipt.getVehicleId());
        vehicleHistoryReceipt.setObjectKey(receipt.getId());
        vehicleHistoryReceipt.setType(0); // 0) add 1) update 2) delete
        vehicleHistoryReceipt.setValue("" + receipt.getAmount());
        this.vehicleHistoryRepository.save(vehicleHistoryReceipt);

      } else {
        Optional<Receipt> receiptOptional = this.receiptRepository.findByClaimId(claim.getId());
        if (receiptOptional.isPresent()) {
          Receipt receipt = receiptOptional.get();
          receipt.setAmount(claim.getAmount());
          receipt.setQuantity(claim.getQuantity());
          receipt.setComments(claim.getComments());
          receipt.setName(claim.getName());
          receipt.setNotes(claim.getNotes());
          receipt.setItemType(claim.getItemType());
          receipt.setClaimId(claim.getId());
          receipt.setUserId(id);

          VehicleHistory vehicleHistoryReceipt = new VehicleHistory();
          if (receipt.getComments() != null)
            vehicleHistoryReceipt.setName("Receipt " + claimIn.getReason() + " " + receipt.getComments());
          else
            vehicleHistoryReceipt.setName("Receipt " + claimIn.getReason());

          vehicleHistoryReceipt.setUserId(id);
          vehicleHistoryReceipt.setVehicleId(receipt.getVehicleId());
          vehicleHistoryReceipt.setObjectKey(receipt.getId());
          vehicleHistoryReceipt.setType(1); // 0) add 1) update 2) delete
          vehicleHistoryReceipt.setValue("" + receipt.getAmount());
          this.vehicleHistoryRepository.save(vehicleHistoryReceipt);

          this.receiptRepository.save(receipt);
        }

      }
      vehicleHistory.setName("Estimate " + claimIn.getReason() + " " + claimIn.getNotes());

      vehicleHistory.setUserId(id);
      vehicleHistory.setVehicleId(claimIn.getVehicleId());

      // vehicleHistory.setName("Claim");

      if (!isNew) {
        vehicleHistory.setObjectKey(claimIn.getId());
        vehicleHistory.setType(1); // 0) add 1) update 2) delete

        getClaimCollections(claim);

      } else {
        vehicleHistory.setObjectKey(claim.getId());
        vehicleHistory.setType(0); // 0) add 1) update 2) delete
      }

      vehicleHistory.setValue("" + claimIn.getAmount());

      this.vehicleHistoryRepository.save(vehicleHistory);

    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    return new ResponseEntity<>(claim, HttpStatus.CREATED);

  }

  @PostMapping("/sequence/{vehicleId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<Claim>> updateSequenceNumber(@PathVariable("vehicleId") long vehicleId,
      @RequestBody List<SequenceCarrier> sequenceCarriers) {

    List<Claim> claims = this.claimRepository.findByVehicleId(vehicleId);

    for (Claim claim : claims) {

      for (SequenceCarrier sequenceCarrier : sequenceCarriers) {

        if (claim.getId() == sequenceCarrier.getId()) {
          claim.setSequenceNumber(sequenceCarrier.getIndex());
          claim = this.claimRepository.save(claim);
        }
      }
    }

    setCollections(claims);

    return new ResponseEntity<>(claims, HttpStatus.OK);

  }

  @GetMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<Claim> getClaim(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<Claim> claimOptional = this.claimRepository.findById(id);
    Claim claim = new Claim();
    if (claimOptional.isPresent()) {
      claim = claimOptional.get();

      getClaimCollections(claim);

      return new ResponseEntity<>(claim, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
  }

  @GetMapping("/vehicle/{vehicleId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<Claim>> getVehicleClaim(@PathVariable("vehicleId") long vehicleId) {
    LOG.info("" + vehicleId);

    List<Claim> claims = this.claimRepository.findByVehicleIdOrderByNameAsc(vehicleId);

    if (!claims.isEmpty()) {

      setCollections(claims);

      return new ResponseEntity<>(claims, HttpStatus.OK);
    } else {

      return new ResponseEntity<>(HttpStatus.OK);
    }
  }

  private void setCollections(List<Claim> claims) {
    for (Claim claim : claims) {

      getClaimCollections(claim);

    }
  }

  private void getClaimCollections(Claim claim) {
    List<PurchaseOrderVehicle> purchaseOrderVehicles = this.purchaseOrderVehicleRepository
        .findByClaimId(claim.getId());

    if (purchaseOrderVehicles.size() > 0) {
      for (PurchaseOrderVehicle purchaseOrderVehicle : purchaseOrderVehicles) {
        List<Autopart> autoparts = this.autoPartRepository.findByPurchaseOrderId(purchaseOrderVehicle.getId());

        for (Autopart autopart : autoparts) {
          int counter = 0;
          for (ImageModel imageModel : autopart.getImageModels()) {

            // just set one and overide it later
            if (counter == 0)
              autopart.showInSearchImageId = imageModel.getId();

            if (imageModel.isShowInSearch()) {
              autopart.showInSearchImageId = imageModel.getId();
            }
            counter++;
          }
        }
        purchaseOrderVehicle.setAutoparts(autoparts);
      }
    }

    claim.setPurchaseOrders(purchaseOrderVehicles);

    List<Job> jobs = this.jobRepository.findByClaimId(claim.getId());

    claim.setJobs(jobs);
  }

  @DeleteMapping("/{id}/{userId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<?> deleteClaim(@PathVariable("id") long id,
      @PathVariable("userId") long userId) {
    LOG.info("" + id);
    Optional<Claim> claimOptional = this.claimRepository.findById(id);
    Claim claim = new Claim();
    if (claimOptional.isPresent()) {
      claim = claimOptional.get();

      VehicleHistory vehicleHistory = new VehicleHistory();
      vehicleHistory.setName("Estimate " + claim.getNotes());
      vehicleHistory.setType(2); // 0) add 1) update 2) delete
      vehicleHistory.setUserId(userId); // fix later
      vehicleHistory.setVehicleId(claim.getVehicleId());
      vehicleHistory.setValue("" + claim.getAmount());
      vehicleHistory.setObjectKey(id);
      this.vehicleHistoryRepository.save(vehicleHistory);

      Optional<Receipt> receiptOptional = this.receiptRepository.findByClaimId(claim.getId());
      if (receiptOptional.isPresent()) {
        Receipt receipt = receiptOptional.get();
        this.receiptRepository.delete(receipt);
      }

      this.claimRepository.delete(claim);
      return new ResponseEntity<>(null, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }

  @DeleteMapping("/{id}/{userId}/{removeChild}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<?> deleteClaimWithOption(@PathVariable("id") long id,
      @PathVariable("userId") long userId, @PathVariable("removeChild") int removeChild) {
    LOG.info("" + id);
    Optional<Claim> claimOptional = this.claimRepository.findById(id);
    Claim claim = new Claim();
    if (claimOptional.isPresent()) {
      claim = claimOptional.get();

      VehicleHistory vehicleHistory = new VehicleHistory();
      vehicleHistory.setName("Estimate " + claim.getNotes());
      vehicleHistory.setType(2); // 0) add 1) update 2) delete
      vehicleHistory.setUserId(userId); // fix later
      vehicleHistory.setVehicleId(claim.getVehicleId());
      vehicleHistory.setValue("" + claim.getAmount());
      vehicleHistory.setObjectKey(id);
      this.vehicleHistoryRepository.save(vehicleHistory);

      if (removeChild == 1) {

        List<PurchaseOrderVehicle> purchaseOrderVehicles = this.purchaseOrderVehicleRepository.findByClaimId(id);

        for (PurchaseOrderVehicle purchaseOrderVehicle : purchaseOrderVehicles) {
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

              vehicleHistoryAutopart.setObjectKey(autopart.getVehicleId());
              vehicleHistoryAutopart.setType(2); // 0) add 1) update 2) delete
              vehicleHistoryAutopart.setUserId(userId);
              vehicleHistoryAutopart.setValue("");

              this.vehicleHistoryRepository.save(vehicleHistory);
            }

            this.autoPartRepository.delete(
                autopart);
          }
          this.purchaseOrderVehicleRepository.delete(purchaseOrderVehicle);
        }
        List<Job> jobs = this.jobRepository.findByClaimId(claim.getId());

        for (Job job : jobs) {
          VehicleHistory vehicleHistoryJob = new VehicleHistory();
          vehicleHistoryJob.setName("Job removed from estimate");
          vehicleHistoryJob.setType(2); // 0) add 1) update 2) delete
          vehicleHistoryJob.setUserId(userId); // fix later
          vehicleHistoryJob.setVehicleId(job.getVehicleId());
          vehicleHistoryJob.setValue("" + job.getName() + "" + job.getNotes());
          vehicleHistoryJob.setObjectKey(id);
          this.vehicleHistoryRepository.save(vehicleHistory);

          this.jobRepository.delete(job);
        }
      } else {
        List<PurchaseOrderVehicle> purchaseOrderVehicles = this.purchaseOrderVehicleRepository.findByClaimId(id);
        for (PurchaseOrderVehicle purchaseOrderVehicle : purchaseOrderVehicles) {

          List<Autopart> autoparts = this.autoPartRepository.findByPurchaseOrderId(purchaseOrderVehicle.getId());
          for (Autopart autopart : autoparts) {

            autopart.setPurchaseOrderId((long) 0);
            this.autoPartRepository.save(autopart);

            VehicleHistory vehicleHistoryAutopart = new VehicleHistory();
            vehicleHistoryAutopart.setName(
                "Autopart update to disassociate the purchase order id [" + purchaseOrderVehicle.getId() + "]");

            // vehicleHistory.setUserId(_imageModelSaved.getUserId());
            vehicleHistoryAutopart.setVehicleId(autopart.getVehicleId());

            vehicleHistoryAutopart.setObjectKey(autopart.getPurchaseOrderId());
            vehicleHistoryAutopart.setType(1); // 0) add 1) update 2) delete
            vehicleHistoryAutopart.setUserId(userId);
            vehicleHistoryAutopart.setValue("");

            autopart.setClaimId((long) 0);
            autopart.setPurchaseOrderId((long) 0);

            this.autoPartRepository.save(autopart);

            this.vehicleHistoryRepository.save(vehicleHistory);
          }

          purchaseOrderVehicle.setClaimId((long) 0);

          VehicleHistory vehicleHistoryPurchaseOrder = new VehicleHistory();
          vehicleHistoryPurchaseOrder.setName(
              "Purchase Order " + purchaseOrderVehicle.getTitle() + " disassociated with Estimate [" + id + "]");
          vehicleHistoryPurchaseOrder.setType(2); // 0) add 1) update 2) delete
          vehicleHistoryPurchaseOrder.setUserId(userId); // fix later
          vehicleHistoryPurchaseOrder.setVehicleId(purchaseOrderVehicle.getVehicleId());
          vehicleHistoryPurchaseOrder.setValue("" + purchaseOrderVehicle.getPrice());
          vehicleHistoryPurchaseOrder.setObjectKey(purchaseOrderVehicle.getId());
          this.vehicleHistoryRepository.save(vehicleHistory);

          purchaseOrderVehicle.setClaimId((long) 0);

          this.purchaseOrderVehicleRepository.save(purchaseOrderVehicle);
        }
        List<Job> jobs = this.jobRepository.findByClaimId(claim.getId());
        for (Job job : jobs) {

          VehicleHistory vehicleHistoryJob = new VehicleHistory();
          vehicleHistoryJob.setName("Job removed from estimate");
          vehicleHistoryJob.setType(2); // 0) add 1) update 2) delete
          vehicleHistoryJob.setUserId(userId); // fix later
          vehicleHistoryJob.setVehicleId(job.getVehicleId());
          vehicleHistoryJob.setValue("" + job.getName() + "" + job.getNotes());
          vehicleHistoryJob.setObjectKey(job.getId());
          this.vehicleHistoryRepository.save(vehicleHistory);

          job.setClaimId((long) 0);

          this.jobRepository.save(job);

        }

        // this.claimRepository.delete(claim);
      }

      Optional<Receipt> receiptOptional = this.receiptRepository.findByClaimId(claim.getId());
      if (receiptOptional.isPresent()) {
        Receipt receipt = receiptOptional.get();
        this.receiptRepository.delete(receipt);
      }

      this.claimRepository.delete(claim);
      return new ResponseEntity<>(null, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }
}