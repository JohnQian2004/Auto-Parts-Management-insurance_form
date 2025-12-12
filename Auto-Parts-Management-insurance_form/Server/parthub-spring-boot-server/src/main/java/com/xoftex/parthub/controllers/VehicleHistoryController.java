package com.xoftex.parthub.controllers;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.xoftex.parthub.models.VehicleHistory;
import com.xoftex.parthub.repository.VehicleHistoryRepository;

import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Vehicle History ", description = "Vehicle History APIs")
// for Angular Client (withCredentials)
// @CrossOrigin(origins = "http://localhost:4200", maxAge = 3600,
// allowCredentials = "true")
// @CrossOrigin(origins = "*", maxAge = 3600)
@CrossOrigin("*")
@RestController
@RequestMapping("/api/histories")
public class VehicleHistoryController {

  @Autowired
  VehicleHistoryRepository vehicleHistoryRepository;

  private static final Logger LOG = LoggerFactory.getLogger(VehicleHistoryController.class);

  @GetMapping("/{vehicleId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<VehicleHistory>> getVehicleHistory(@PathVariable("vehicleId") long vehicleId) {

    LOG.info("" + vehicleId);
    List<VehicleHistory> vehicleHistories = new ArrayList<>();

    vehicleHistories = this.vehicleHistoryRepository.findByVehicleId(vehicleId);
    for (VehicleHistory vehicleHistory : vehicleHistories) {
      vehicleHistory.setObjectName(this.getFirstWord(vehicleHistory.getName()));

      String iconClassName = this.transferInfoToIconClass(vehicleHistory, vehicleHistory.getName());

      if (iconClassName != null && iconClassName.contains("fa-solid")) {
        // System.out.println("Icon Name: 3 " + iconClassName);

        vehicleHistory.setIconName(iconClassName);
      } else {
        vehicleHistory.setIconName("fa-solid fa-question");
      }
    }
    return new ResponseEntity<>(vehicleHistories, HttpStatus.OK);

  }

  private String getFirstWord(String text) {
    int index = text.indexOf(' ');
    if (index > -1) { // Check if there is more than one word.
      return text.substring(0, index).trim(); // Extract first word.
    } else {
      return text; // Text is the first word itself.
    }
  }

  public String transferInfoToIconClass(VehicleHistory vehicle, String vehicleLastHistoryName) {
    if (vehicle == null || vehicleLastHistoryName == null || vehicleLastHistoryName.isEmpty()) {
      return ""; // return an empty string if the vehicle or name is null or empty
    }

    // System.out.println(vehicleLastHistoryName);
    // Check the lastVehicleHistory name first (equivalent to
    // vehicle.lastVehicleHistory?.name in Angular)
    if ("Approval".equals(vehicleLastHistoryName)) {
      return "fa-solid fa-check"; // red car icon
    } else if ("Vehicle new".equals(vehicleLastHistoryName)) {
      return "fa-solid fa-car text-danger fw-700"; // red car icon
    } else if ("Vehicle paid".equals(vehicleLastHistoryName)) {
      return "fa-solid fa-dollar-sign"; // dollar sign icon
    } else if ("special".equals(vehicleLastHistoryName)) {
      return "fa-solid fa-alarm-clock"; // dollar sign icon
    } else if ("assign To".equals(vehicleLastHistoryName)) {
      return "fa-solid fa-dollar-sign"; // dollar sign icon
    } else if ("Vehicle Image".equals(vehicleLastHistoryName)) {
      return "fa-solid fa-image"; // image icon
    } else if ("Vehicle Image Employee".equals(vehicleLastHistoryName)) {
      return "fa-solid fa-image"; // image icon
    } else if ("Vehicle key location".equals(vehicleLastHistoryName)) {
      return "fa-solid fa-key"; // image icon
    } else if ("key Location".equals(vehicleLastHistoryName)) {
      return "fa-solid fa-key"; // image icon
    } else if ("Vehicle Pdf".equals(vehicleLastHistoryName)) {
      return "fa-solid fa-file-pdf"; // pdf icon
    } else if ("Vehicle status".equals(vehicleLastHistoryName)) {
      return "fa-solid  fa-running"; // running person icon
    } else if ("Vehicle update".equals(vehicleLastHistoryName) ||
        "Vehicle Vehicle update".equals(vehicleLastHistoryName)) {
      return "fa-solid fa-car"; // car icon
    } else if ("Vehicle assigned To".equals(vehicleLastHistoryName)) {
      return "fa-solid fa-user"; // user icon
    } else if ("assigned To".equals(vehicleLastHistoryName)) {
      return "fa-solid fa-user"; // user icon
    } else if ("Vehicle Image Doc Type".equals(vehicleLastHistoryName)) {
      return "fa-solid fa-image"; // image icon
    } else if ("Note".equals(vehicleLastHistoryName)) {
      return "fa-solid fa-note"; // image icon
    }

    // If none of the above names match, check the lastUpdateObjectName for other
    // patterns
    String lastUpdateObjectName = vehicle.getObjectName(); // assuming the getter is available

    if (lastUpdateObjectName != null) {
      if (lastUpdateObjectName.contains("Payment")) {
        return "fa-solid fa-dollar-sign"; // dollar sign icon
      } else if (lastUpdateObjectName.contains("Receipt")) {
        return "fa-solid fa-receipt"; // receipt icon
      } else if (lastUpdateObjectName.contains("Estimate")) {
        return "fa-solid fa-calculator"; // calculator icon
      } else if (lastUpdateObjectName.contains("Purchase")) {
        return "fa-solid fa-cart-shopping"; // shopping cart icon
      } else if (lastUpdateObjectName.contains("Image")) {
        return "fa-solid fa-image"; // image icon
      } else if (lastUpdateObjectName.contains("Vehicle")) {
        return "fa-solid fa-save"; // save icon
      } else if (lastUpdateObjectName.contains("job") || lastUpdateObjectName.contains("Job")) {
        return "fa-solid fa-tasks"; // tasks icon
      } else if (lastUpdateObjectName.contains("archive")) {
        return "fa-solid fa-archive"; // save icon
      } else if (lastUpdateObjectName.contains("save")) {
        return "fa-solid fa-save"; // save icon
      } else if (lastUpdateObjectName.contains("Autopart")) {
        return "fa-solid fa-cart-shopping"; // shopping cart icon
      } else if (lastUpdateObjectName.contains("Supplement")) {
        return "fa-solid fa-dollar-sign"; // dollar sign icon
      } else if (lastUpdateObjectName.contains("update")) {
        return "fa-solid fa-save"; // dollar sign icon
      } else if (lastUpdateObjectName.contains("status")) {
        return "fa-solid fa-save"; // dollar sign icon
      } else if (lastUpdateObjectName.contains("notification")) {
        return "fa-solid fa-bell"; // dollar sign icon
      }
    }

    // If no condition matched, return the name itself (like Angular template
    // fallback behavior)
    return lastUpdateObjectName != null ? lastUpdateObjectName : "";
  }
}
