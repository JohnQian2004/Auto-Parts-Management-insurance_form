package com.xoftex.parthub.controllers;

import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Base64;

import java.util.List;
import java.util.Optional;

import javax.imageio.ImageIO;

import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.xoftex.parthub.models.Company;
import com.xoftex.parthub.models.Employee;
import com.xoftex.parthub.models.ImageModel;
import com.xoftex.parthub.models.ImageModelVehicle;
import com.xoftex.parthub.models.SequenceCarrier;
import com.xoftex.parthub.models.Vehicle;
import com.xoftex.parthub.models.VehicleHistory;
import com.xoftex.parthub.repository.AutoPartRepository;
import com.xoftex.parthub.repository.CompanyRepository;
import com.xoftex.parthub.repository.EmployeeRepository;
import com.xoftex.parthub.repository.ImageModelRepository;
import com.xoftex.parthub.repository.ImageModelVehicleRepository;
import com.xoftex.parthub.repository.VehicleHistoryRepository;
import com.xoftex.parthub.repository.VehicleRepository;
import com.xoftex.parthub.security.jwt.JwtUtils;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import net.coobird.thumbnailator.Thumbnails;

//for Angular Client (withCredentials)
//@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
// @CrossOrigin(origins = "*", maxAge = 3600)
@CrossOrigin("*")
@RestController
@RequestMapping("/api/vehicle/")
public class ImageVehicleController {

  @Autowired
  AutoPartRepository autoPartRepository;

  @Autowired
  ImageModelRepository imageModelRepository;

  @Autowired
  ImageModelVehicleRepository imageModelVehicleRepository;

  @Autowired
  VehicleRepository vehicleRepository;

  @Autowired
  CompanyRepository companyRepository;

  @Autowired
  VehicleHistoryRepository vehicleHistoryRepository;

  @Autowired
  EmployeeRepository employeeRepository;

  @Autowired
  private JwtUtils jwtUtils;

  @Value("${image.path.vehicle}")
  // String filePath = "C:\\Projects\\images\\vehicle\\test_image_";
  String filePath = "";

  @Value("${image.root.path.vehicle}")
  // String filePath = "C:\\Projects\\images\\vehicle\\;
  String fileRootPath = "";

  String imageNamePrefix = "test_vehicle_image_";

  @Value("${image.resize.vehicle}")
  String imageResizeDirectory = "";

  private static final Logger LOG = LoggerFactory.getLogger(ImageVehicleController.class);

  @PostMapping("/images/{vehicleId}")
  public ResponseEntity<ImageModelVehicle> createImage(@RequestBody ImageModelVehicle imageModelIn,
      @PathVariable("vehicleId") long vehicleId) {
    try {
      LOG.info("" + vehicleId);
      Optional<Vehicle> vehicleOptional = vehicleRepository.findById(vehicleId);

      if (vehicleOptional.isPresent()) {
        Vehicle vehicle = vehicleOptional.get();
        imageModelIn.setVehicle(vehicle);
        imageModelIn.setSequenceNumber(0);

        ImageModelVehicle _imageModelSaved = this.imageModelVehicleRepository.save(imageModelIn);

        String base64Image = imageModelIn.getPicByte().split(",")[1];
        byte[] imageBytes = Base64.getDecoder().decode(base64Image);

        String path = this.fileRootPath + this.imageNamePrefix + _imageModelSaved.getId() + ".jpeg";

        File file = new File(path);
        try (OutputStream outputStream = new BufferedOutputStream(new FileOutputStream(file))) {
          outputStream.write(imageBytes);
        } catch (IOException e) {
          e.printStackTrace();
        }
        _imageModelSaved.setPicByte("");
        String pathOut = this.fileRootPath + imageResizeDirectory + this.imageNamePrefix + _imageModelSaved.getId()
            + ".jpeg";
        // this.createFromImageFile(file, path);
        this.resizeImage(path, pathOut, 500, 500);

        VehicleHistory vehicleHistory = new VehicleHistory();
        vehicleHistory.setName("Vehicle Image");

        // vehicleHistory.setUserId(_imageModelSaved.getUserId());
        vehicleHistory.setVehicleId(vehicleId);

        vehicleHistory.setName("Vehicle Image");

        vehicleHistory.setObjectKey(_imageModelSaved.getId());
        vehicleHistory.setType(0); // 0) add 1) update 2) delete

        vehicleHistory.setValue("" + _imageModelSaved.getDescription());

        this.vehicleHistoryRepository.save(vehicleHistory);

        return new ResponseEntity<>(_imageModelSaved, HttpStatus.CREATED);

      } else {
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      }

    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PostMapping("/images/external/{vehicleId}")
  public ResponseEntity<ImageModelVehicle> createImageExternal(@RequestBody String base64Str,
      @PathVariable("vehicleId") long vehicleId) {
    try {
      LOG.info("" + vehicleId);
      Optional<Vehicle> vehicleOptional = vehicleRepository.findById(vehicleId);
      ImageModelVehicle imageModelIn = new ImageModelVehicle();

      if (vehicleOptional.isPresent()) {
        Vehicle vehicle = vehicleOptional.get();
        imageModelIn.setVehicle(vehicle);
        imageModelIn.setSequenceNumber(0);
        imageModelIn.setPicByte(base64Str);

        ImageModelVehicle _imageModelSaved = this.imageModelVehicleRepository.save(imageModelIn);

        String base64Image = imageModelIn.getPicByte().split(",")[1];
        byte[] imageBytes = Base64.getDecoder().decode(base64Image);

        String path = this.fileRootPath + this.imageNamePrefix + _imageModelSaved.getId() + ".jpeg";

        File file = new File(path);
        try (OutputStream outputStream = new BufferedOutputStream(new FileOutputStream(file))) {
          outputStream.write(imageBytes);
        } catch (IOException e) {
          e.printStackTrace();
        }
        _imageModelSaved.setPicByte("");
        String pathOut = this.fileRootPath + imageResizeDirectory + this.imageNamePrefix + _imageModelSaved.getId()
            + ".jpeg";
        // this.createFromImageFile(file, path);
        this.resizeImage(path, pathOut, 500, 500);

        VehicleHistory vehicleHistory = new VehicleHistory();
        vehicleHistory.setName("Vehicle Image");

        // vehicleHistory.setUserId(_imageModelSaved.getUserId());
        vehicleHistory.setVehicleId(vehicleId);

        vehicleHistory.setName("Vehicle Image");

        vehicleHistory.setObjectKey(_imageModelSaved.getId());
        vehicleHistory.setType(0); // 0) add 1) update 2) delete

        vehicleHistory.setValue("" + _imageModelSaved.getDescription());

        this.vehicleHistoryRepository.save(vehicleHistory);

        return new ResponseEntity<>(_imageModelSaved, HttpStatus.CREATED);

      } else {
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      }

    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private String getFileExtension(String filename) {
    if (filename != null && filename.contains(".")) {
      return filename.substring(filename.lastIndexOf("."));
    }
    return null; // Invalid file extension
  }

  private void getSaveAndResizedJpegFile(MultipartFile file, ImageModelVehicle _imageModelSaved) throws IOException {
    String originalFilename = file.getOriginalFilename();
    String extension = getFileExtension(originalFilename);

    String pathJpeg = this.fileRootPath + this.imageNamePrefix + _imageModelSaved.getId()
        + ".jpeg";

    System.out.println(extension);
    System.out.println(pathJpeg);

    File originalJpegFile = new File(pathJpeg);

    Thumbnails.of(file.getInputStream())
        .outputFormat("jpg") // Convert to JPEG format
        .scale(1)
        .toFile(originalJpegFile); // Save the file

    String pathOut = this.fileRootPath + imageResizeDirectory + this.imageNamePrefix
        + _imageModelSaved.getId()
        + ".jpeg";

    File resizedJpegFile = new File(pathOut);
    System.out.println(resizedJpegFile);
    Thumbnails.of(originalJpegFile)
        .size(500, 500) // Resize to 500x500
        .outputFormat("jpg") // Output as JPEG
        .toFile(resizedJpegFile); // Save the resized image
  }

  @PostMapping("/images/file/{vehicleId}")
  public ResponseEntity<ImageModelVehicle> createImageFromFile(
      @PathVariable("vehicleId") long vehicleId, @RequestPart("description") String description,
      @RequestPart("file") MultipartFile file) throws IOException {

    LOG.info("createImageFromFile");
    try {

      Optional<Vehicle> vehicleOptional = vehicleRepository.findById(vehicleId);
      ImageModelVehicle imageModelVechicle = new ImageModelVehicle();

      if (file.getOriginalFilename() != null) {
        imageModelVechicle.setFileName(file.getOriginalFilename());
      }

      if (vehicleOptional.isPresent()) {

        Vehicle vehicle = vehicleOptional.get();
        imageModelVechicle.setVehicle(vehicle);
        if (description != null && description != "")
          imageModelVechicle.setDescription(description);

        ImageModelVehicle _imageModelSaved = this.imageModelVehicleRepository.save(imageModelVechicle);

        getSaveAndResizedJpegFile(file, _imageModelSaved);

        VehicleHistory vehicleHistory = new VehicleHistory();
        vehicleHistory.setName("Vehicle Image");

        // vehicleHistory.setUserId(_imageModelSaved.getUserId());
        vehicleHistory.setVehicleId(vehicleId);

        // vehicleHistory.setName("Vehicle Image");

        vehicleHistory.setObjectKey(_imageModelSaved.getId());
        vehicleHistory.setType(0); // 0) add 1) update 2) delete

        vehicleHistory.setValue("" + _imageModelSaved.getDescription());

        this.vehicleHistoryRepository.save(vehicleHistory);

        return new ResponseEntity<>(_imageModelSaved, HttpStatus.CREATED);

      } else {
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      }

    } catch (Exception e) {
      LOG.info(e.getMessage());
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PostMapping("/images/file/{vehicleId}/{userId}")
  public ResponseEntity<ImageModelVehicle> createImageFromFileWithUserId(
      @PathVariable("vehicleId") long vehicleId, @PathVariable("userId") long userId,
      @RequestPart("description") String description,
      @RequestPart("file") MultipartFile file) throws IOException {

    LOG.info("createImageFromFile");
    try {

      Optional<Vehicle> vehicleOptional = vehicleRepository.findById(vehicleId);
      ImageModelVehicle imageModelVechicle = new ImageModelVehicle();

      if (file.getOriginalFilename() != null) {
        imageModelVechicle.setFileName(file.getOriginalFilename());
      }

      if (vehicleOptional.isPresent()) {

        Vehicle vehicle = vehicleOptional.get();
        imageModelVechicle.setVehicle(vehicle);
        if (description != null && description != "")
          imageModelVechicle.setDescription(description);
        imageModelVechicle.setUserId(userId);
        ImageModelVehicle _imageModelSaved = this.imageModelVehicleRepository.save(imageModelVechicle);

        getSaveAndResizedJpegFile(file, _imageModelSaved);

        VehicleHistory vehicleHistory = new VehicleHistory();
        vehicleHistory.setName("Vehicle Image");

        vehicleHistory.setUserId(userId);

        vehicleHistory.setVehicleId(vehicleId);

        // vehicleHistory.setName("Vehicle Image");

        vehicleHistory.setObjectKey(_imageModelSaved.getId());
        vehicleHistory.setType(0); // 0) add 1) update 2) delete

        vehicleHistory.setValue("" + _imageModelSaved.getDescription());

        this.vehicleHistoryRepository.save(vehicleHistory);

        return new ResponseEntity<>(_imageModelSaved, HttpStatus.CREATED);

      } else {
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      }

    } catch (Exception e) {
      LOG.info(e.getMessage());
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PostMapping("/images/file/employee/{vehicleId}/{uuidEmployee}")
  public ResponseEntity<ImageModelVehicle> createImageFromFileWithUuidEmployee(
      @PathVariable("vehicleId") long vehicleId, @PathVariable("uuidEmployee") String uuidEmployee,
      @RequestPart("description") String description,
      @RequestPart("file") MultipartFile file) throws IOException {

    LOG.info("createImageFromFileWithUuidEmployee");
    try {

      Optional<Employee> employeeOptional = this.employeeRepository.findByToken(uuidEmployee);

      if (employeeOptional.isPresent()) {
        Employee employee = employeeOptional.get();

        Optional<Vehicle> vehicleOptional = vehicleRepository.findById(vehicleId);
        ImageModelVehicle imageModelVechicle = new ImageModelVehicle();

        if (file.getOriginalFilename() != null) {
          imageModelVechicle.setFileName(file.getOriginalFilename());
        }

        if (vehicleOptional.isPresent()) {

          Vehicle vehicle = vehicleOptional.get();
          imageModelVechicle.setVehicle(vehicle);
          if (description != null && description != "")
            imageModelVechicle.setDescription(description);
          imageModelVechicle.setEmployeeId(employee.getId());

          ImageModelVehicle _imageModelSaved = this.imageModelVehicleRepository.save(imageModelVechicle);

          getSaveAndResizedJpegFile(file, _imageModelSaved);

          VehicleHistory vehicleHistory = new VehicleHistory();
          vehicleHistory.setName("Vehicle Image Employee");

          vehicleHistory.setUserId(0);
          vehicleHistory.setEmployeeId(employee.getId());

          vehicleHistory.setVehicleId(vehicleId);

          // vehicleHistory.setName("Vehicle Image");

          vehicleHistory.setObjectKey(_imageModelSaved.getId());
          vehicleHistory.setType(0); // 0) add 1) update 2) delete

          vehicleHistory.setValue("" + _imageModelSaved.getDescription());

          this.vehicleHistoryRepository.save(vehicleHistory);

          return new ResponseEntity<>(_imageModelSaved, HttpStatus.CREATED);

        } else {
          return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
      } else {
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      }

    } catch (Exception e) {
      LOG.info(e.getMessage());
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PostMapping("/images/sequence/{vehicleId}")
  // @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<ImageModelVehicle>> updateSequenceNumber(@PathVariable("vehicleId") long vehicleId,
      @RequestBody List<SequenceCarrier> sequenceCarriers) {

    Optional<Vehicle> vehicleOptional = this.vehicleRepository.findById(vehicleId);
    List<ImageModelVehicle> imageModelVehicles = new ArrayList<ImageModelVehicle>();

    if (vehicleOptional.isPresent()) {
      imageModelVehicles = this.imageModelVehicleRepository.findByVehicleId(vehicleId);
      for (ImageModelVehicle imageModelVehicle : imageModelVehicles) {
        for (SequenceCarrier sequenceCarrier : sequenceCarriers) {

          if (imageModelVehicle.getId() == sequenceCarrier.getId()) {
            imageModelVehicle.setSequenceNumber(sequenceCarrier.getIndex());
            imageModelVehicle = this.imageModelVehicleRepository.save(imageModelVehicle);
          }

        }
      }
    }

    return new ResponseEntity<>(imageModelVehicles, HttpStatus.OK);

  }

  @PutMapping("/images/{vehicleId}/{imageId}/{docType}")
  public ResponseEntity<HttpStatus> setImageDocType(
      @PathVariable("vehicleId") long vehicleId,
      @PathVariable("imageId") long imageId,
      @PathVariable("docType") long docTypeIn

  ) {

    LOG.info("" + vehicleId + " " + imageId);

    try {

      Optional<Vehicle> vehicleOptional = vehicleRepository.findById(vehicleId);

      if (vehicleOptional.isPresent()) {

        for (ImageModelVehicle imageModel : vehicleOptional.get().getImageModels()) {

          imageModel.setShowInSearch(false);
          if (imageModel.getId() == imageId) {
            imageModel.setDocType((int) docTypeIn);
            this.imageModelVehicleRepository.save(imageModel);

            VehicleHistory vehicleHistory = new VehicleHistory();
            vehicleHistory.setName("Vehicle Image Doc Type");

            // vehicleHistory.setUserId(_imageModelSaved.getUserId());
            vehicleHistory.setVehicleId(vehicleId);

            vehicleHistory.setObjectKey(imageId);

            vehicleHistory.setType(1); // 0) add 1) update 2) delete

            vehicleHistory.setValue("" + docTypeIn);

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

  @PutMapping("/images/{vehicleId}/{imageId}/{docType}/{userId}")
  public ResponseEntity<HttpStatus> setImageDocTypeWithUserId(
      @PathVariable("vehicleId") long vehicleId,
      @PathVariable("imageId") long imageId,
      @PathVariable("docType") long docTypeIn,
      @PathVariable("userId") long userId

  ) {

    LOG.info("" + vehicleId + " " + imageId);

    try {

      Optional<Vehicle> vehicleOptional = vehicleRepository.findById(vehicleId);

      if (vehicleOptional.isPresent()) {

        for (ImageModelVehicle imageModel : vehicleOptional.get().getImageModels()) {

          imageModel.setShowInSearch(false);
          if (imageModel.getId() == imageId) {
            imageModel.setDocType((int) docTypeIn);
            this.imageModelVehicleRepository.save(imageModel);

            VehicleHistory vehicleHistory = new VehicleHistory();
            vehicleHistory.setName("Vehicle Image Doc Type");

            vehicleHistory.setUserId(userId);
            vehicleHistory.setVehicleId(vehicleId);

            vehicleHistory.setObjectKey(imageId);

            vehicleHistory.setType(1); // 0) add 1) update 2) delete

            vehicleHistory.setValue("" + docTypeIn);

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

  @PutMapping("/images/{vehicleId}/{imageId}")
  public ResponseEntity<HttpStatus> setImageForSearch(
      @PathVariable("vehicleId") long vehicleId,
      @PathVariable("imageId") long imageId

  ) {

    LOG.info("" + vehicleId + " " + imageId);

    try {

      Optional<Vehicle> vehicleOptional = vehicleRepository.findById(vehicleId);

      if (vehicleOptional.isPresent()) {

        for (ImageModelVehicle imageModel : vehicleOptional.get().getImageModels()) {

          imageModel.setShowInSearch(false);
          if (imageModel.getId() == imageId) {
            imageModel.setShowInSearch(true);
          }
          this.imageModelVehicleRepository.save(imageModel);
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

  @DeleteMapping("/images/{vehicleId}/{imageId}/{userId}")
  public ResponseEntity<HttpStatus> deleteImage(
      @PathVariable("vehicleId") long vehicleId,
      @PathVariable("imageId") long imageId,
      @PathVariable("userId") long userId

  ) {
    try {

      Optional<Vehicle> vehicleOptional = this.vehicleRepository.findById(vehicleId);

      if (vehicleOptional.isPresent()) {

        if (imageId > 0) {

          Optional<ImageModelVehicle> imageModelOptional = this.imageModelVehicleRepository.findById(imageId);

          if (imageModelOptional.isPresent()) {

            try {
              File f = new File(this.fileRootPath + this.imageNamePrefix + imageModelOptional.get().getId() + ".jpeg"); // file
              if (f.delete()) // returns Boolean value
              {
                System.out.println(f.getName() + " deleted"); // getting and printing the file name
              }

            } catch (Exception e) {

            }

            try {
              File ff = new File(
                  this.fileRootPath + imageResizeDirectory + this.imageNamePrefix + imageModelOptional.get().getId()
                      + ".jpeg"); // file

              if (ff.delete()) // returns Boolean value
              {
                System.out.println(ff.getName() + " deleted"); // getting and printing the file name
              }

            } catch (Exception e) {

            }
            this.imageModelVehicleRepository.deleteById(imageId);

          }
        }
        VehicleHistory vehicleHistory = new VehicleHistory();
        vehicleHistory.setName("Autopart Image");

        // vehicleHistory.setUserId(_imageModelSaved.getUserId());
        vehicleHistory.setVehicleId(vehicleId);

        vehicleHistory.setObjectKey(imageId);
        vehicleHistory.setType(2); // 0) add 1) update 2) delete

        vehicleHistory.setValue("");
        vehicleHistory.setUserId(userId);

        this.vehicleHistoryRepository.save(vehicleHistory);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);

      } else {
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      }

    } catch (

    Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public void resizeImage(String inputImagePath,
      String outputImagePath, int scaledWidth, int scaledHeight)
      throws IOException {
    // reads input image
    File inputFile = new File(inputImagePath);
    BufferedImage inputImage = ImageIO.read(inputFile);

    // creates output image
    BufferedImage outputImage = new BufferedImage(scaledWidth,
        scaledHeight, inputImage.getType());

    // scales the input image to the output image
    Graphics2D g2d = outputImage.createGraphics();
    g2d.drawImage(inputImage, 0, 0, scaledWidth, scaledHeight, null);
    g2d.dispose();

    // extracts extension of output file
    String formatName = outputImagePath.substring(outputImagePath
        .lastIndexOf(".") + 1);

    // writes to output file
    ImageIO.write(outputImage, formatName, new File(outputImagePath));
  }

  @GetMapping("/getImage/{id}")
  public void getImage(HttpServletResponse response, HttpServletRequest request,
      @PathVariable("id") long id)
      throws IOException {

    String jwt = parseJwt(request);
    if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
      String email = jwtUtils.getEmailFromJwtToken(jwt);
      System.out.println("--" + email);
    }

    String filePath = this.fileRootPath + this.imageNamePrefix + id + ".jpeg";

    File file = new File(filePath);
    if (file.exists()) {
      String contentType = "application/octet-stream";
      response.setContentType(contentType);
      OutputStream out = response.getOutputStream();
      FileInputStream in = new FileInputStream(file);
      // copy from in to out
      IOUtils.copy(in, out);
      out.close();
      in.close();
    } else {
      System.out.println("NOT FOUND " + filePath);
      // throw new FileNotFoundException();
    }
  }

  @GetMapping("/getResize/{id}")
  public void getResizeImage(HttpServletResponse response, HttpServletRequest request,
      @PathVariable("id") long id)
      throws IOException {

    String jwt = parseJwt(request);
    if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
      String email = jwtUtils.getEmailFromJwtToken(jwt);
      System.out.println("--" + email);
    }

    String filePath = this.fileRootPath + this.imageNamePrefix + id + ".jpeg";

    // String filePath = this.filePath + id + ".jpeg";

    filePath = this.fileRootPath + imageResizeDirectory + this.imageNamePrefix + id + ".jpeg";

    // filePath = this.filePath + id + ".jpeg";

    File file = new File(filePath);
    if (file.exists()) {
      String contentType = "application/octet-stream";
      response.setContentType(contentType);
      OutputStream out = response.getOutputStream();
      FileInputStream in = new FileInputStream(file);
      // copy from in to out
      IOUtils.copy(in, out);
      out.close();
      in.close();
    } else {
      System.out.println("NOT FOUND " + filePath);
      // throw new FileNotFoundException();
    }
  }

  @GetMapping("/company/{uuid}")
  public void getCompanyResizeImage(HttpServletResponse response, HttpServletRequest request,
      @PathVariable("uuid") String uuid)
      throws IOException {
    try {
      String jwt = parseJwt(request);
      if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
        String email = jwtUtils.getEmailFromJwtToken(jwt);
        System.out.println("--" + email);
      }

      Optional<Company> companyOptional = this.companyRepository.findByToken(uuid);

      if (companyOptional.isPresent()) {
        Company company = companyOptional.get();
        byte[] imageBytes = company.getIcon();
        File file = new File("./output.jpg");

        // File file = new File("path/to/your/file");
        FileOutputStream fos = new FileOutputStream(file);
        fos.write(imageBytes);
        fos.close();
        // File file = new File(filePath);

        if (file.exists()) {
          String contentType = "application/octet-stream";
          response.setContentType(contentType);
          OutputStream out = response.getOutputStream();
          FileInputStream in = new FileInputStream(file);
          // copy from in to out
          IOUtils.copy(in, out);
          out.close();
          in.close();
        } else {
          throw new FileNotFoundException();
        }
      }
    } catch (Exception ex) {
      System.out.println(ex.getMessage());
    }

  }

  private String parseJwt(HttpServletRequest request) {
    String jwt = jwtUtils.getJwtFromCookies(request);
    return jwt;
  }

}
