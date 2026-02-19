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
import com.xoftex.parthub.models.Receipt;
import com.xoftex.parthub.models.SequenceCarrier;
import com.xoftex.parthub.models.User;
import com.xoftex.parthub.models.VehicleHistory;
import com.xoftex.parthub.repository.AutoPartRepository;
import com.xoftex.parthub.repository.ClaimRepository;
import com.xoftex.parthub.repository.ReceiptRepository;
import com.xoftex.parthub.repository.RoleRepository;
import com.xoftex.parthub.repository.UserRepository;
import com.xoftex.parthub.repository.VehicleHistoryRepository;

//for Angular Client (withCredentials)
//@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
// @CrossOrigin(origins = "*", maxAge = 3600)
@CrossOrigin("*")
@RestController
@RequestMapping("/api/receipts")
public class ReceiptController {

  @Autowired
  UserRepository userRepository;

  @Autowired
  RoleRepository roleRepository;

  @Autowired
  VehicleHistoryRepository vehicleHistoryRepository;

  @Autowired
  ReceiptRepository receiptRepository;

  @Autowired
  ClaimRepository claimRepository;

  @Autowired
  AutoPartRepository autoPartRepository;

  @Value("${image.root.path}")
  // String filePath = "C:\\Projects\\images\\";
  String filePath = "";

  String imageNamePrefix = "test_image_";

  @Value("${fitment.url}")
  String fitmentUrl = "";

  @Value("${fitment.apikey}")
  // String fitmentApiKey =
  // "?apikey=ZrQEPSkKYmlsbC5kcmFwZXIuYXV0b0BnbWFpbC5jb20=";
  String fitmentApiKey = "";

  private static final Logger LOG = LoggerFactory.getLogger(ReceiptController.class);

  @PostMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<Receipt> createAndUpdateReceipt(@PathVariable("id") long id, @RequestBody Receipt receiptIn) {

    Optional<User> userOptional = this.userRepository.findById(id);
    Receipt receipt = new Receipt();
    boolean isNew = false;
    if (receiptIn.getId() == 0) {
      isNew = true;
      receiptIn.setReason("New");
    }
    VehicleHistory vehicleHistory = new VehicleHistory();

    if (userOptional.isPresent()) {

      receiptIn.setUserId(id);

      if (receiptIn.getToken() == null || receiptIn.getToken().equals("")) {

        String randomCode = UUID.randomUUID().toString();
        receiptIn.setToken(randomCode);
      }

      receipt = this.receiptRepository.save(receiptIn);

      if (receipt.getClaimId() > 0) {
        Optional<Claim> claimOptional = this.claimRepository.findById(receipt.getClaimId());
        if (claimOptional.isPresent()) {
          Claim claim = claimOptional.get();
          claim.setAmount(receipt.getAmount());
          claim.setQuantity(receipt.getQuantity());
          claim.setComments(receipt.getComments());
          claim.setName(receipt.getName());
          claim.setNotes(receipt.getNotes());
          claim.setItemType(receipt.getItemType());
          // claim.setClaimId(claim.getId());
          claim.setUserId(id);
          this.claimRepository.save(claim);
        }
      }

      if (receipt.getAutopartId() > 0) {
        Optional<Autopart> autupartOptional = this.autoPartRepository.findById(receipt.getAutopartId());
        if (autupartOptional.isPresent()) {
          Autopart autupart = autupartOptional.get();
          autupart.setSalePrice(receipt.getAmount() * receipt.getQuantity());
          autupart.setTitle(receipt.getNotes());
          autupart.setUserId(id);
          this.autoPartRepository.save(autupart);
        }
      }

      if (receiptIn.getComments() != null)
        vehicleHistory.setName("Receipt " + receiptIn.getReason() + " " + receiptIn.getComments());
      else
        vehicleHistory.setName("Receipt " + receiptIn.getReason());

      vehicleHistory.setUserId(id);
      vehicleHistory.setVehicleId(receiptIn.getVehicleId());

      // vehicleHistory.setName("Receipt");

      if (!isNew) {
        vehicleHistory.setObjectKey(receiptIn.getId());
        vehicleHistory.setType(1); // 0) add 1) update 2) delete
      } else {
        vehicleHistory.setObjectKey(receipt.getId());
        vehicleHistory.setType(0); // 0) add 1) update 2) delete
      }
      vehicleHistory.setValue("" + receiptIn.getAmount());

      this.vehicleHistoryRepository.save(vehicleHistory);

    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    return new ResponseEntity<>(receipt, HttpStatus.CREATED);

  }

  @PostMapping("/sequence/{vehicleId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<Receipt>> updateSequenceNumber(@PathVariable("vehicleId") long vehicleId,
      @RequestBody List<SequenceCarrier> sequenceCarriers) {

    List<Receipt> receipts = this.receiptRepository.findByVehicleId(vehicleId);

    for (Receipt receipt : receipts) {

      for (SequenceCarrier sequenceCarrier : sequenceCarriers) {

        if (receipt.getId() == sequenceCarrier.getId()) {
          receipt.setSequenceNumber(sequenceCarrier.getIndex());
          receipt = this.receiptRepository.save(receipt);
        }
      }
    }

    return new ResponseEntity<>(receipts, HttpStatus.OK);

  }

  @GetMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<Receipt> getReceipt(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<Receipt> receiptOptional = this.receiptRepository.findById(id);
    Receipt receipt = new Receipt();
    if (receiptOptional.isPresent()) {
      receipt = receiptOptional.get();
      return new ResponseEntity<>(receipt, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
  }

  @GetMapping("/vehicle/{vehicleId}")
  // Authentication removed to allow public access for insurance viewing
  // @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<Receipt>> getVehicleReceipt(@PathVariable("vehicleId") long vehicleId) {
    LOG.info("" + vehicleId);

    List<Receipt> receipts = this.receiptRepository.findByVehicleIdOrderByNameAsc(vehicleId);

    if (!receipts.isEmpty()) {
      return new ResponseEntity<>(receipts, HttpStatus.OK);
    } else {
      // otherwise too much crack on the client side
      return new ResponseEntity<>(HttpStatus.OK);
    }
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<?> deleteReceipt(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<Receipt> receiptOptional = this.receiptRepository.findById(id);
    Receipt receipt = new Receipt();
    if (receiptOptional.isPresent()) {
      receipt = receiptOptional.get();

      VehicleHistory vehicleHistory = new VehicleHistory();
      // vehicleHistory.setName("Receipt");
      vehicleHistory.setName("Receipt " + receiptOptional.get().getNotes());
      vehicleHistory.setType(2); // 0) add 1) update 2) delete
      vehicleHistory.setUserId(0); // fix later
      vehicleHistory.setVehicleId(receipt.getVehicleId());
      vehicleHistory.setValue("" + receipt.getAmount());
      vehicleHistory.setObjectKey(id);
      this.vehicleHistoryRepository.save(vehicleHistory);

      this.receiptRepository.delete(receipt);
      return new ResponseEntity<>(null, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }

  @DeleteMapping("/{userId}/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<?> deleteReceiptWithUserId(@PathVariable("userId") long userId, @PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<Receipt> receiptOptional = this.receiptRepository.findById(id);
    Receipt receipt = new Receipt();
    if (receiptOptional.isPresent()) {
      receipt = receiptOptional.get();

      VehicleHistory vehicleHistory = new VehicleHistory();
      // vehicleHistory.setName("Receipt");
      vehicleHistory.setName("Receipt " + receiptOptional.get().getNotes());
      vehicleHistory.setType(2); // 0) add 1) update 2) delete
      vehicleHistory.setUserId(userId); // fix later
      vehicleHistory.setVehicleId(receipt.getVehicleId());
      vehicleHistory.setValue("" + receipt.getAmount());
      vehicleHistory.setObjectKey(id);
      this.vehicleHistoryRepository.save(vehicleHistory);

      this.receiptRepository.delete(receipt);
      return new ResponseEntity<>(null, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }

  @DeleteMapping("/option/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<?> deleteReceiptWithOption(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<Receipt> receiptOptional = this.receiptRepository.findById(id);
    Receipt receipt = new Receipt();
    if (receiptOptional.isPresent()) {
      receipt = receiptOptional.get();

      VehicleHistory vehicleHistory = new VehicleHistory();
      // vehicleHistory.setName("Receipt");
      vehicleHistory.setName("Receipt " + receiptOptional.get().getNotes());
      vehicleHistory.setType(2); // 0) add 1) update 2) delete
      vehicleHistory.setUserId(0); // fix later
      vehicleHistory.setVehicleId(receipt.getVehicleId());
      vehicleHistory.setValue("" + receipt.getAmount());
      vehicleHistory.setObjectKey(id);
      this.vehicleHistoryRepository.save(vehicleHistory);

      if (receipt.getClaimId() > 0) {
        Optional<Claim> claimOptional = this.claimRepository.findById(receipt.getClaimId());
        if (claimOptional.isPresent()) {
          Claim claim = claimOptional.get();
          this.claimRepository.delete(claim);
        }
      }

      if (receipt.getAutopartId() > 0) {
        Optional<Autopart> autopartOptional = this.autoPartRepository.findById(receipt.getAutopartId());
        if (autopartOptional.isPresent()) {
          Autopart autopart = autopartOptional.get();

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
        }
      }

      this.receiptRepository.delete(receipt);
      return new ResponseEntity<>(null, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }

  @DeleteMapping("/option/{userId}/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<?> deleteReceiptWithOptionWithUserId(@PathVariable("userId") long userId,
      @PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<Receipt> receiptOptional = this.receiptRepository.findById(id);
    Receipt receipt = new Receipt();
    if (receiptOptional.isPresent()) {
      receipt = receiptOptional.get();

      VehicleHistory vehicleHistory = new VehicleHistory();
      // vehicleHistory.setName("Receipt");
      vehicleHistory.setName("Receipt " + receiptOptional.get().getNotes());
      vehicleHistory.setType(2); // 0) add 1) update 2) delete
      vehicleHistory.setUserId(userId); // fix later
      vehicleHistory.setVehicleId(receipt.getVehicleId());
      vehicleHistory.setValue("" + receipt.getAmount());
      vehicleHistory.setObjectKey(id);
      this.vehicleHistoryRepository.save(vehicleHistory);

      if (receipt.getClaimId() > 0) {
        Optional<Claim> claimOptional = this.claimRepository.findById(receipt.getClaimId());
        if (claimOptional.isPresent()) {
          Claim claim = claimOptional.get();
          this.claimRepository.delete(claim);
        }
      }

      if (receipt.getAutopartId() > 0) {
        Optional<Autopart> autopartOptional = this.autoPartRepository.findById(receipt.getAutopartId());
        if (autopartOptional.isPresent()) {
          Autopart autopart = autopartOptional.get();

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
        }
      }

      this.receiptRepository.delete(receipt);
      return new ResponseEntity<>(null, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }
}