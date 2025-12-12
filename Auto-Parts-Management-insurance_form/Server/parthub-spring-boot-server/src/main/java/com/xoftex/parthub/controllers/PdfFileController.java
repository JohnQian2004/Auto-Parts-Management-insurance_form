package com.xoftex.parthub.controllers;

import java.io.BufferedOutputStream;
import java.io.File;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.xoftex.parthub.models.PdfFile;
import com.xoftex.parthub.models.Vehicle;
import com.xoftex.parthub.models.VehicleHistory;
import com.xoftex.parthub.repository.AutoPartRepository;
import com.xoftex.parthub.repository.PdfFileRepository;
import com.xoftex.parthub.repository.VehicleHistoryRepository;
import com.xoftex.parthub.repository.VehicleRepository;
import com.xoftex.parthub.security.jwt.JwtUtils;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

//for Angular Client (withCredentials)
//@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
// @CrossOrigin(origins = "*", maxAge = 3600)
@CrossOrigin("*")
@RestController
@RequestMapping("/api/pdf/")
public class PdfFileController {

  @Autowired
  AutoPartRepository autoPartRepository;

  @Autowired
  VehicleRepository vehicleRepository;

  @Autowired
  PdfFileRepository pdfFileRepository;

  @Autowired
  VehicleHistoryRepository vehicleHistoryRepository;

  @Autowired
  private JwtUtils jwtUtils;

  @Value("${pdf.root.path}")
  // String filePath = "C:\\Projects\\images\\vehicle\\pdf\\"
  String fileRootPath = "";

  // String pdfFilePrefix = "test_vehicle_pdf_";

  private static final Logger LOG = LoggerFactory.getLogger(PdfFileController.class);

  @PostMapping("/file/{vehicleId}/{userId}")
  public ResponseEntity<PdfFile> createPdfFile(
      @PathVariable("vehicleId") long vehicleId, @PathVariable("userId") long userId,
      @RequestPart("description") String description,
      @RequestPart("file") MultipartFile file) throws IOException {

    try {

      Optional<Vehicle> vehicleOptional = vehicleRepository.findById(vehicleId);
      PdfFile pdfFile = new PdfFile();

      if (file.getOriginalFilename() != null) {
        pdfFile.setFileName(file.getOriginalFilename());
        LOG.info(pdfFile.getFileName());
      }

      if (vehicleOptional.isPresent()) {

        Vehicle vehicle = vehicleOptional.get();
        pdfFile.setVehicle(vehicle);
        if (description != null && description != "")
          pdfFile.setDescription(description);

        String randomCode = UUID.randomUUID().toString();

        pdfFile.setToken(randomCode);

        PdfFile _pdfFile = this.pdfFileRepository.save(pdfFile);

        // String path = this.fileRootPath + this.imageNamePrefix + _pdfFile.getId() +
        // ".pdf";
        String path = this.fileRootPath + randomCode + ".pdf";

        File fileSaved = new File(path);
        try (OutputStream outputStream = new BufferedOutputStream(new FileOutputStream(fileSaved))) {
          outputStream.write(file.getBytes());
        } catch (IOException e) {
          e.printStackTrace();
        }

        VehicleHistory vehicleHistory = new VehicleHistory();
        vehicleHistory.setName("Vehicle Pdf");

        // vehicleHistory.setUserId(_imageModelSaved.getUserId());
        vehicleHistory.setVehicleId(vehicleId);
        vehicleHistory.setUserId(userId);
        vehicleHistory.setObjectKey(_pdfFile.getId());
        vehicleHistory.setType(0); // 0) add 1) update 2) delete

        vehicleHistory.setValue("" + _pdfFile.getDescription());

        this.vehicleHistoryRepository.save(vehicleHistory);

        return new ResponseEntity<>(_pdfFile, HttpStatus.CREATED);

      } else {
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      }

    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @DeleteMapping("/{vehicleId}/{pdfFileUuid}/{userId}")
  public ResponseEntity<HttpStatus> deletePdfFile(
      @PathVariable("vehicleId") long vehicleId,
      @PathVariable("userId") long userId,
      @PathVariable("pdfFileUuid") String pdfFileUuid

  ) {
    try {

      Optional<Vehicle> vehicleOptional = this.vehicleRepository.findById(vehicleId);

      if (vehicleOptional.isPresent()) {

        if (!pdfFileUuid.equals("") && pdfFileUuid.length() == 36) {

          Optional<PdfFile> pdfFileOptional = this.pdfFileRepository.findByToken(pdfFileUuid);

          if (pdfFileOptional.isPresent()) {

            try {
              // File f = new File(this.fileRootPath + this.imageNamePrefix +
              // pdfFileOptional.get().getId() + ".pdf"); // file
              File f = new File(this.fileRootPath + pdfFileOptional.get().getToken() + ".pdf"); // file
              if (f.delete()) // returns Boolean value
              {
                System.out.println(f.getName() + " deleted"); // getting and printing the file name
              }

            } catch (Exception e) {

            }

            this.pdfFileRepository.deleteById(pdfFileOptional.get().getId());

            VehicleHistory vehicleHistory = new VehicleHistory();
            vehicleHistory.setName("Vehicle Pdf");

            // vehicleHistory.setUserId(_imageModelSaved.getUserId());
            vehicleHistory.setVehicleId(vehicleId);
            vehicleHistory.setUserId(userId);
            vehicleHistory.setObjectKey(pdfFileOptional.get().getId());
            vehicleHistory.setType(2); // 0) add 1) update 2) delete

            vehicleHistory.setValue("");

            this.vehicleHistoryRepository.save(vehicleHistory);

          }
        }

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);

      } else {
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      }

    } catch (

    Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @GetMapping("/{vehicleId}")
  public ResponseEntity<List<PdfFile>> getPdfFile(
      @PathVariable("vehicleId") long vehicleId

  ) {
    try {

      Optional<Vehicle> vehicleOptional = this.vehicleRepository.findById(vehicleId);
      List<PdfFile> pdfFiles = new ArrayList<PdfFile>();

      if (vehicleOptional.isPresent()) {

        pdfFiles = this.pdfFileRepository.findByVehicleId(vehicleId);
      }

      return new ResponseEntity<>(pdfFiles, HttpStatus.OK);

    } catch (

    Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @GetMapping("/getPdf/{uuid}")
  public ResponseEntity<Resource> getPdf(HttpServletResponse response, HttpServletRequest request,
      @PathVariable("uuid") String uuid)
      throws IOException {

    String jwt = parseJwt(request);
    if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
      String email = jwtUtils.getEmailFromJwtToken(jwt);
      System.out.println("--" + email);
    }

    // String filePath = this.fileRootPath + uuid + ".pdf";
    String fileBasePath = this.fileRootPath;
    String filename = uuid + ".pdf";
    try {
      Path file = Paths.get(fileBasePath).resolve(filename);
      if (!file.toFile().exists()) {
        return ResponseEntity.notFound().build();
      }
      Resource resource = new UrlResource(file.toUri());

      return ResponseEntity.ok()
          .contentType(MediaType.APPLICATION_PDF)
          .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
          .body(resource);
    } catch (Exception e) {
      return ResponseEntity.internalServerError().build();
    }
  }

  private String parseJwt(HttpServletRequest request) {
    String jwt = jwtUtils.getJwtFromCookies(request);
    return jwt;
  }

}
