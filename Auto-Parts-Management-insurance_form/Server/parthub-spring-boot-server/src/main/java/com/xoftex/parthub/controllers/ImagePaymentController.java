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

import com.xoftex.parthub.models.ImageModelPayment;
import com.xoftex.parthub.models.ImageModelVehicle;
import com.xoftex.parthub.models.SequenceCarrier;
import com.xoftex.parthub.models.User;
import com.xoftex.parthub.models.Payment;
import com.xoftex.parthub.models.Note;
import com.xoftex.parthub.models.VehicleHistory;
import com.xoftex.parthub.repository.AutoPartRepository;
import com.xoftex.parthub.repository.CompanyRepository;
import com.xoftex.parthub.repository.EmployeeRepository;
import com.xoftex.parthub.repository.ImageModelRepository;
import com.xoftex.parthub.repository.ImageModelPaymentRepository;
import com.xoftex.parthub.repository.VehicleHistoryRepository;
import com.xoftex.parthub.repository.PaymentRepository;
import com.xoftex.parthub.repository.UserRepository;
import com.xoftex.parthub.security.jwt.JwtUtils;
import com.xoftex.parthub.services.NoteWebSocketHandler;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import net.coobird.thumbnailator.Thumbnails;

//for Angular Client (withCredentials)
//@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
// @CrossOrigin(origins = "*", maxAge = 3600)
@CrossOrigin("*")
@RestController
@RequestMapping("/api/paymentimages")
public class ImagePaymentController {

    @Autowired
    AutoPartRepository autoPartRepository;

    @Autowired
    EmployeeRepository employeeRepository;

    @Autowired
    PaymentRepository paymentRepository;

    @Autowired
    ImageModelRepository imageModelRepository;

    @Autowired
    ImageModelPaymentRepository imageModelPaymentRepository;

    @Autowired
    PaymentRepository vehicleRepository;

    @Autowired
    CompanyRepository companyRepository;

    @Autowired
    VehicleHistoryRepository vehicleHistoryRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    private JwtUtils jwtUtils;

    @Value("${image.path.payment}")
    // String filePath = "C:\\Projects\\images\\payment\\test_image_";
    String filePath = "";

    @Value("${image.root.path.payment}")
    // String filePath = "C:\\Projects\\images\\payment\\;
    String fileRootPath = "";

    String imageNamePrefix = "test_payment_image_";

    @Value("${image.resize.payment}")
    String imageResizeDirectory = "";

    private static final Logger LOG = LoggerFactory.getLogger(ImagePaymentController.class);

    private final NoteWebSocketHandler noteWebSocketHandler;

    public ImagePaymentController(NoteWebSocketHandler noteWebSocketHandler) {
        this.noteWebSocketHandler = noteWebSocketHandler;
    }

    // @PostMapping("/send")
    // public String sendPayment(@RequestBody Note note) {
    //     noteWebSocketHandler.sendPaymentToClients(note);
    //     System.out.print(note);
    //     return "Payment sent to clients";
    // }

    @PostMapping("/images/{paymentId}")
    public ResponseEntity<ImageModelPayment> createImage(@RequestBody ImageModelPayment imageModelIn,
            @PathVariable("paymentId") long paymentId) {
        try {
            LOG.info("" + paymentId);
            Optional<Payment> paymentOptional = paymentRepository.findById(paymentId);

            if (paymentOptional.isPresent()) {
                Payment job = paymentOptional.get();
                imageModelIn.setPayment(job);
                imageModelIn.setSequenceNumber(0);

                ImageModelPayment _imageModelSaved = this.imageModelPaymentRepository.save(imageModelIn);

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
                String pathOut = this.fileRootPath + imageResizeDirectory + this.imageNamePrefix
                        + _imageModelSaved.getId()
                        + ".jpeg";
                // this.createFromImageFile(file, path);
                this.resizeImage(path, pathOut, 500, 500);

                VehicleHistory vehicleHistory = new VehicleHistory();
                vehicleHistory.setName("Payment Image");

                // vehicleHistory.setUserId(_imageModelSaved.getUserId());
                vehicleHistory.setVehicleId(paymentId);

                vehicleHistory.setName("Payment Image");

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

    @PostMapping("/images/external/{paymentId}")
    public ResponseEntity<ImageModelPayment> createImageExternal(@RequestBody String base64Str,
            @PathVariable("paymentId") long paymentId) {
        try {
            LOG.info("" + paymentId);
            Optional<Payment> paymentOptional = paymentRepository.findById(paymentId);
            ImageModelPayment imageModelIn = new ImageModelPayment();

            if (paymentOptional.isPresent()) {
                Payment job = paymentOptional.get();
                imageModelIn.setPayment(job);
                imageModelIn.setSequenceNumber(0);
                imageModelIn.setPicByte(base64Str);

                ImageModelPayment _imageModelSaved = this.imageModelPaymentRepository.save(imageModelIn);

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
                String pathOut = this.fileRootPath + imageResizeDirectory + this.imageNamePrefix
                        + _imageModelSaved.getId()
                        + ".jpeg";
                // this.createFromImageFile(file, path);
                this.resizeImage(path, pathOut, 500, 500);

                VehicleHistory vehicleHistory = new VehicleHistory();
                vehicleHistory.setName("Payment Image");

                // vehicleHistory.setUserId(_imageModelSaved.getUserId());
                vehicleHistory.setVehicleId(paymentId);

                vehicleHistory.setName("Payment Image");

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

    private void getSaveAndResizedJpegFile(MultipartFile file, ImageModelPayment _imageModelSaved) throws IOException {
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

    @PostMapping("/images/file/{paymentId}")
    public ResponseEntity<ImageModelPayment> createImageFromFile(
            @PathVariable("paymentId") long paymentId, @RequestPart("description") String description,
            @RequestPart("file") MultipartFile file) throws IOException {

        LOG.info("createImageFromFile");
        try {

            Optional<Payment> paymentOptional = paymentRepository.findById(paymentId);
            ImageModelPayment imageModelPayment = new ImageModelPayment();

            if (file.getOriginalFilename() != null) {
                imageModelPayment.setFileName(file.getOriginalFilename());
            }

            if (paymentOptional.isPresent()) {

                Payment job = paymentOptional.get();
                imageModelPayment.setPayment(job);
                if (description != null && description != "") {
                    imageModelPayment.setDescription(description);
                }

                ImageModelPayment _imageModelSaved = this.imageModelPaymentRepository.save(imageModelPayment);

                getSaveAndResizedJpegFile(file, _imageModelSaved);

                VehicleHistory vehicleHistory = new VehicleHistory();
                vehicleHistory.setName("Payment Image");

                // vehicleHistory.setUserId(_imageModelSaved.getUserId());
                vehicleHistory.setVehicleId(paymentOptional.get().getVehicleId());

                // vehicleHistory.setName("Payment Image");
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

    @PostMapping("/images/file/employee/{paymentId}/{uuidEmployee}")
    public ResponseEntity<ImageModelPayment> createImageFromFileWithUuidEmployee(
            @PathVariable("paymentId") long paymentId, @PathVariable("uuidEmployee") String uuidEmployee,
            @RequestPart("description") String description,
            @RequestPart("file") MultipartFile file) throws IOException {

        LOG.info("createImageFromFile");
        try {

            Optional<Employee> employeeOptional = this.employeeRepository.findByToken(uuidEmployee);

            if (employeeOptional.isPresent()) {

                Optional<Payment> paymentOptional = paymentRepository.findById(paymentId);
                ImageModelPayment imageModelPayment = new ImageModelPayment();

                if (file.getOriginalFilename() != null) {
                    imageModelPayment.setFileName(file.getOriginalFilename());
                }

                if (paymentOptional.isPresent()) {

                    Payment job = paymentOptional.get();
                    imageModelPayment.setPayment(job);
                    if (description != null && description != "") {
                        imageModelPayment.setDescription(description);
                    }
                    imageModelPayment.setEmployeeId(employeeOptional.get().getId());

                    ImageModelPayment _imageModelSaved = this.imageModelPaymentRepository.save(imageModelPayment);

                    getSaveAndResizedJpegFile(file, _imageModelSaved);

                    VehicleHistory vehicleHistory = new VehicleHistory();
                    vehicleHistory.setName("Payment Image Employee");
                    vehicleHistory.setUserId(0);
                    vehicleHistory.setEmployeeId(employeeOptional.get().getId());

                    vehicleHistory.setVehicleId(paymentOptional.get().getVehicleId());

                    // vehicleHistory.setName("Payment Image");
                    vehicleHistory.setObjectKey(_imageModelSaved.getId());
                    vehicleHistory.setType(0); // 0) add 1) update 2) delete

                    vehicleHistory.setValue("" + _imageModelSaved.getDescription());

                    this.vehicleHistoryRepository.save(vehicleHistory);

                    try {

                        // Note note = new Note();
                        // note.setPaymentId(job.getId());
                        // note.setEmployeeId(employeeOptional.get().getId());
                        // note.setCompanyId(employeeOptional.get().getCompanyId());
                        // note.setUserId(0);
                        // note.setNotes("JOB");
                        // note.setVehicleId(paymentOptional.get().getVehicleId());
                        // System.out.println("Sending .." + note.toString());
                        // noteWebSocketHandler.sendPaymentToClients(note);
                    } catch (Exception ex) {

                    }

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

    @PostMapping("/images/file/{paymentId}/{userId}")
    public ResponseEntity<ImageModelPayment> createImageFromFileWithUserId(
            @PathVariable("paymentId") long paymentId, @PathVariable("userId") long userId,
            @RequestPart("description") String description,
            @RequestPart("file") MultipartFile file) throws IOException {

        LOG.info("createImageFromFile");
        try {
            Optional<User> userOptional = this.userRepository.findById(userId);

            Optional<Payment> paymentOptional = paymentRepository.findById(paymentId);
            ImageModelPayment imageModelPayment = new ImageModelPayment();

            if (file.getOriginalFilename() != null) {
                imageModelPayment.setFileName(file.getOriginalFilename());
            }

            if (paymentOptional.isPresent()) {

                Payment job = paymentOptional.get();
                imageModelPayment.setPayment(job);
                if (description != null && description != "") {
                    imageModelPayment.setDescription(description);
                }
                imageModelPayment.setUserId(userId);
                ImageModelPayment _imageModelSaved = this.imageModelPaymentRepository.save(imageModelPayment);

                getSaveAndResizedJpegFile(file, _imageModelSaved);

                VehicleHistory vehicleHistory = new VehicleHistory();
                vehicleHistory.setName("Payment Image");

                vehicleHistory.setUserId(userId);

                vehicleHistory.setVehicleId(paymentOptional.get().getVehicleId());

                // vehicleHistory.setName("Payment Image");
                vehicleHistory.setObjectKey(_imageModelSaved.getId());
                vehicleHistory.setType(0); // 0) add 1) update 2) delete

                vehicleHistory.setValue("" + _imageModelSaved.getDescription());

                this.vehicleHistoryRepository.save(vehicleHistory);

                try {

                    // Note note = new Note();
                    // note.setPaymentId(job.getId());
                    // // note.setEmployeeId(employeeOptional.get().getId());
                    // note.setCompanyId(userOptional.get().getCompanyId());
                    // note.setUserId(userId);
                    // note.setVehicleId(paymentOptional.get().getVehicleId());
                    // note.setNotes("JOB IMAGE");
                    // System.out.println("Sending .." + note.toString());
                    // noteWebSocketHandler.sendPaymentToClients(note);
                } catch (Exception ex) {

                }

                return new ResponseEntity<>(_imageModelSaved, HttpStatus.CREATED);

            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

        } catch (Exception e) {
            LOG.info(e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/images/sequence/{paymentId}")
    // @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<List<ImageModelPayment>> updateSequenceNumber(@PathVariable("paymentId") long paymentId,
            @RequestBody List<SequenceCarrier> sequenceCarriers) {

        Optional<Payment> paymentOptional = this.paymentRepository.findById(paymentId);
        List<ImageModelPayment> imageModelPayments = new ArrayList<ImageModelPayment>();

        if (paymentOptional.isPresent()) {
            imageModelPayments = this.imageModelPaymentRepository.findByPaymentId(paymentId);
            for (ImageModelPayment imageModelPayment : imageModelPayments) {
                for (SequenceCarrier sequenceCarrier : sequenceCarriers) {

                    if (imageModelPayment.getId() == sequenceCarrier.getId()) {
                        imageModelPayment.setSequenceNumber(sequenceCarrier.getIndex());
                        imageModelPayment = this.imageModelPaymentRepository.save(imageModelPayment);
                    }

                }
            }
        }

        return new ResponseEntity<>(imageModelPayments, HttpStatus.OK);

    }

    @PutMapping("/images/{paymentId}/{imageId}/{docType}")
    public ResponseEntity<HttpStatus> setImageDocType(
            @PathVariable("paymentId") long paymentId,
            @PathVariable("imageId") long imageId,
            @PathVariable("docType") long docTypeIn) {

        LOG.info("" + paymentId + " " + imageId);

        try {

            Optional<Payment> paymentOptional = paymentRepository.findById(paymentId);

            if (paymentOptional.isPresent()) {

                for (ImageModelPayment imageModel : paymentOptional.get().getImageModels()) {

                    imageModel.setShowInSearch(false);
                    if (imageModel.getId() == imageId) {
                        imageModel.setDocType((int) docTypeIn);
                        this.imageModelPaymentRepository.save(imageModel);

                        VehicleHistory vehicleHistory = new VehicleHistory();
                        vehicleHistory.setName("Payment Image Doc Type");

                        // vehicleHistory.setUserId(_imageModelSaved.getUserId());
                        vehicleHistory.setVehicleId(paymentOptional.get().getVehicleId());

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

        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/images/{paymentId}/{imageId}/{docType}/{userId}")
    public ResponseEntity<HttpStatus> setImageDocTypeWithUserId(
            @PathVariable("paymentId") long paymentId,
            @PathVariable("imageId") long imageId,
            @PathVariable("docType") long docTypeIn,
            @PathVariable("userId") long userId) {

        LOG.info("" + paymentId + " " + imageId);

        try {

            Optional<Payment> paymentOptional = paymentRepository.findById(paymentId);

            if (paymentOptional.isPresent()) {

                for (ImageModelPayment imageModel : paymentOptional.get().getImageModels()) {

                    imageModel.setShowInSearch(false);
                    if (imageModel.getId() == imageId) {
                        imageModel.setDocType((int) docTypeIn);
                        this.imageModelPaymentRepository.save(imageModel);

                        VehicleHistory vehicleHistory = new VehicleHistory();
                        vehicleHistory.setName("Payment Image Doc Type");

                        vehicleHistory.setUserId(userId);
                        vehicleHistory.setVehicleId(paymentOptional.get().getVehicleId());

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

        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/images/{paymentId}/{imageId}")
    public ResponseEntity<HttpStatus> setImageForSearch(
            @PathVariable("paymentId") long paymentId,
            @PathVariable("imageId") long imageId) {

        LOG.info("" + paymentId + " " + imageId);

        try {

            Optional<Payment> paymentOptional = paymentRepository.findById(paymentId);

            if (paymentOptional.isPresent()) {

                for (ImageModelPayment imageModel : paymentOptional.get().getImageModels()) {

                    imageModel.setShowInSearch(false);
                    if (imageModel.getId() == imageId) {
                        imageModel.setShowInSearch(true);
                    }
                    this.imageModelPaymentRepository.save(imageModel);
                }
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);

            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/images/{paymentId}/{imageId}/{userId}")
    public ResponseEntity<HttpStatus> deleteImage(
            @PathVariable("paymentId") long paymentId,
            @PathVariable("imageId") long imageId,
            @PathVariable("userId") long userId) {
        try {

            Optional<Payment> paymentOptional = this.paymentRepository.findById(paymentId);
            Optional<User> userOptional = this.userRepository.findById(userId);

            if (paymentOptional.isPresent()) {

                if (imageId > 0) {

                    Optional<ImageModelPayment> imageModelOptional = this.imageModelPaymentRepository.findById(imageId);

                    if (imageModelOptional.isPresent()) {

                        try {
                            File f = new File(this.fileRootPath + this.imageNamePrefix
                                    + imageModelOptional.get().getId() + ".jpeg"); // file
                            if (f.delete()) // returns Boolean value
                            {
                                System.out.println(f.getName() + " deleted"); // getting and printing the file name
                            }

                        } catch (Exception e) {

                        }

                        try {
                            File ff = new File(
                                    this.fileRootPath + imageResizeDirectory + this.imageNamePrefix
                                    + imageModelOptional.get().getId()
                                    + ".jpeg"); // file

                            if (ff.delete()) // returns Boolean value
                            {
                                System.out.println(ff.getName() + " deleted"); // getting and printing the file name
                            }

                        } catch (Exception e) {

                        }
                        this.imageModelPaymentRepository.deleteById(imageId);

                    }
                }
                VehicleHistory vehicleHistory = new VehicleHistory();
                vehicleHistory.setName("Payment Image");

                // vehicleHistory.setUserId(_imageModelSaved.getUserId());
                vehicleHistory.setVehicleId(paymentOptional.get().getVehicleId());

                vehicleHistory.setObjectKey(imageId);
                vehicleHistory.setType(2); // 0) add 1) update 2) delete

                vehicleHistory.setValue("");
                vehicleHistory.setUserId(userId);

                this.vehicleHistoryRepository.save(vehicleHistory);
                try {

                    // Note note = new Note();
                    // note.setPaymentId(paymentId);
                    // // note.setEmployeeId(employeeOptional.get().getId());
                    // note.setCompanyId(userOptional.get().getCompanyId());
                    // note.setUserId(userId);
                    // note.setVehicleId(paymentOptional.get().getVehicleId());
                    // note.setNotes("JOB IMAGE DELETION");
                    // System.out.println("Sending .." + note.toString());
                    // noteWebSocketHandler.sendPaymentToClients(note);
                } catch (Exception ex) {

                }

                return new ResponseEntity<>(HttpStatus.NO_CONTENT);

            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/images/employee/{paymentId}/{imageId}/{uuidEmployee}")
    public ResponseEntity<HttpStatus> deleteImageUuidEmployee(
            @PathVariable("paymentId") long paymentId,
            @PathVariable("imageId") long imageId,
            @PathVariable("uuidEmployee") String uuidEmployee) {
        try {

            Optional<Employee> employeeOptional = this.employeeRepository.findByToken(uuidEmployee);

            if (employeeOptional.isPresent()) {
                Optional<Payment> paymentOptional = this.paymentRepository.findById(paymentId);

                if (paymentOptional.isPresent()) {

                    if (imageId > 0) {

                        Optional<ImageModelPayment> imageModelOptional = this.imageModelPaymentRepository.findById(imageId);

                        if (imageModelOptional.isPresent()) {

                            try {
                                File f = new File(this.fileRootPath + this.imageNamePrefix
                                        + imageModelOptional.get().getId() + ".jpeg"); // file
                                if (f.delete()) // returns Boolean value
                                {
                                    System.out.println(f.getName() + " deleted"); // getting and printing the file name
                                }

                            } catch (Exception e) {

                            }

                            try {
                                File ff = new File(
                                        this.fileRootPath + imageResizeDirectory + this.imageNamePrefix
                                        + imageModelOptional.get().getId()
                                        + ".jpeg"); // file

                                if (ff.delete()) // returns Boolean value
                                {
                                    System.out.println(ff.getName() + " deleted"); // getting and printing the file name
                                }

                            } catch (Exception e) {

                            }
                            this.imageModelPaymentRepository.deleteById(imageId);

                        }
                    }
                    VehicleHistory vehicleHistory = new VehicleHistory();
                    vehicleHistory.setName("Payment Image");

                    // vehicleHistory.setUserId(_imageModelSaved.getUserId());
                    vehicleHistory.setVehicleId(paymentOptional.get().getVehicleId());

                    vehicleHistory.setObjectKey(imageId);
                    vehicleHistory.setType(2); // 0) add 1) update 2) delete
                    vehicleHistory.setUserId(0);
                    vehicleHistory.setValue("");
                    vehicleHistory.setEmployeeId(employeeOptional.get().getId());

                    this.vehicleHistoryRepository.save(vehicleHistory);

                    try {

                        // Note note = new Note();
                        // note.setPaymentId(paymentId);
                        // note.setVehicleId(paymentOptional.get().getVehicleId());
                        // note.setEmployeeId(employeeOptional.get().getId());
                        // note.setCompanyId(employeeOptional.get().getCompanyId());
                        // //note.setUserId(userId);
                        // note.setNotes("JOB IMAGE DELETION");
                        // System.out.println("Sending .." + note.toString());
                        // noteWebSocketHandler.sendPaymentToClients(note);
                    } catch (Exception ex) {

                    }

                    return new ResponseEntity<>(HttpStatus.NO_CONTENT);

                } else {
                    return new ResponseEntity<>(HttpStatus.NOT_FOUND);
                }
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
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
            throw new FileNotFoundException();
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
            throw new FileNotFoundException();
        }
    }

    @GetMapping("/company/jobs/{uuid}")
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
