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

import com.xoftex.parthub.models.ImageModelJob;
import com.xoftex.parthub.models.ImageModelVehicle;
import com.xoftex.parthub.models.SequenceCarrier;
import com.xoftex.parthub.models.User;
import com.xoftex.parthub.models.Job;
import com.xoftex.parthub.models.Note;
import com.xoftex.parthub.models.VehicleHistory;
import com.xoftex.parthub.repository.AutoPartRepository;
import com.xoftex.parthub.repository.CompanyRepository;
import com.xoftex.parthub.repository.EmployeeRepository;
import com.xoftex.parthub.repository.ImageModelRepository;
import com.xoftex.parthub.repository.ImageModelJobRepository;
import com.xoftex.parthub.repository.VehicleHistoryRepository;
import com.xoftex.parthub.repository.JobRepository;
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
@RequestMapping("/api/jobimages/")
public class ImageJobController {

    @Autowired
    AutoPartRepository autoPartRepository;

    @Autowired
    EmployeeRepository employeeRepository;

    @Autowired
    JobRepository jobRepository;

    @Autowired
    ImageModelRepository imageModelRepository;

    @Autowired
    ImageModelJobRepository imageModelJobRepository;

    @Autowired
    JobRepository vehicleRepository;

    @Autowired
    CompanyRepository companyRepository;

    @Autowired
    VehicleHistoryRepository vehicleHistoryRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    private JwtUtils jwtUtils;

    @Value("${image.path.job}")
    // String filePath = "C:\\Projects\\images\\job\\test_image_";
    String filePath = "";

    @Value("${image.root.path.job}")
    // String filePath = "C:\\Projects\\images\\job\\;
    String fileRootPath = "";

    String imageNamePrefix = "test_job_image_";

    @Value("${image.resize.job}")
    String imageResizeDirectory = "";

    private static final Logger LOG = LoggerFactory.getLogger(ImageJobController.class);

    private final NoteWebSocketHandler noteWebSocketHandler;

    public ImageJobController(NoteWebSocketHandler noteWebSocketHandler) {
        this.noteWebSocketHandler = noteWebSocketHandler;
    }

    @PostMapping("/send")
    public String sendJob(@RequestBody Note note) {
        noteWebSocketHandler.sendJobToClients(note);
        System.out.print(note);
        return "Job sent to clients";
    }

    @PostMapping("/images/{jobId}")
    public ResponseEntity<ImageModelJob> createImage(@RequestBody ImageModelJob imageModelIn,
            @PathVariable("jobId") long jobId) {
        try {
            LOG.info("" + jobId);
            Optional<Job> jobOptional = jobRepository.findById(jobId);

            if (jobOptional.isPresent()) {
                Job job = jobOptional.get();
                imageModelIn.setJob(job);
                imageModelIn.setSequenceNumber(0);

                ImageModelJob _imageModelSaved = this.imageModelJobRepository.save(imageModelIn);

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
                vehicleHistory.setName("Job Image");

                // vehicleHistory.setUserId(_imageModelSaved.getUserId());
                vehicleHistory.setVehicleId(jobId);

                vehicleHistory.setName("Job Image");

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

    @PostMapping("/images/external/{jobId}")
    public ResponseEntity<ImageModelJob> createImageExternal(@RequestBody String base64Str,
            @PathVariable("jobId") long jobId) {
        try {
            LOG.info("" + jobId);
            Optional<Job> jobOptional = jobRepository.findById(jobId);
            ImageModelJob imageModelIn = new ImageModelJob();

            if (jobOptional.isPresent()) {
                Job job = jobOptional.get();
                imageModelIn.setJob(job);
                imageModelIn.setSequenceNumber(0);
                imageModelIn.setPicByte(base64Str);

                ImageModelJob _imageModelSaved = this.imageModelJobRepository.save(imageModelIn);

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
                vehicleHistory.setName("Job Image");

                // vehicleHistory.setUserId(_imageModelSaved.getUserId());
                vehicleHistory.setVehicleId(jobId);

                vehicleHistory.setName("Job Image");

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

    private void getSaveAndResizedJpegFile(MultipartFile file, ImageModelJob _imageModelSaved) throws IOException {
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

    @PostMapping("/images/file/{jobId}")
    public ResponseEntity<ImageModelJob> createImageFromFile(
            @PathVariable("jobId") long jobId, @RequestPart("description") String description,
            @RequestPart("file") MultipartFile file) throws IOException {

        LOG.info("createImageFromFile");
        try {

            Optional<Job> jobOptional = jobRepository.findById(jobId);
            ImageModelJob imageModelJob = new ImageModelJob();

            if (file.getOriginalFilename() != null) {
                imageModelJob.setFileName(file.getOriginalFilename());
            }

            if (jobOptional.isPresent()) {

                Job job = jobOptional.get();
                imageModelJob.setJob(job);
                if (description != null && description != "") {
                    imageModelJob.setDescription(description);
                }

                ImageModelJob _imageModelSaved = this.imageModelJobRepository.save(imageModelJob);

                getSaveAndResizedJpegFile(file, _imageModelSaved);

                VehicleHistory vehicleHistory = new VehicleHistory();
                vehicleHistory.setName("Job Image");

                // vehicleHistory.setUserId(_imageModelSaved.getUserId());
                vehicleHistory.setVehicleId(jobOptional.get().getVehicleId());

                // vehicleHistory.setName("Job Image");
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

    @PostMapping("/images/file/employee/{jobId}/{uuidEmployee}")
    public ResponseEntity<ImageModelJob> createImageFromFileWithUuidEmployee(
            @PathVariable("jobId") long jobId, @PathVariable("uuidEmployee") String uuidEmployee,
            @RequestPart("description") String description,
            @RequestPart("file") MultipartFile file) throws IOException {

        LOG.info("createImageFromFile");
        try {

            Optional<Employee> employeeOptional = this.employeeRepository.findByToken(uuidEmployee);

            if (employeeOptional.isPresent()) {

                Optional<Job> jobOptional = jobRepository.findById(jobId);
                ImageModelJob imageModelJob = new ImageModelJob();

                if (file.getOriginalFilename() != null) {
                    imageModelJob.setFileName(file.getOriginalFilename());
                }

                if (jobOptional.isPresent()) {

                    Job job = jobOptional.get();
                    imageModelJob.setJob(job);
                    if (description != null && description != "") {
                        imageModelJob.setDescription(description);
                    }
                    imageModelJob.setEmployeeId(employeeOptional.get().getId());

                    ImageModelJob _imageModelSaved = this.imageModelJobRepository.save(imageModelJob);

                    getSaveAndResizedJpegFile(file, _imageModelSaved);

                    VehicleHistory vehicleHistory = new VehicleHistory();
                    vehicleHistory.setName("Job Image Employee");
                    vehicleHistory.setUserId(0);
                    vehicleHistory.setEmployeeId(employeeOptional.get().getId());

                    vehicleHistory.setVehicleId(jobOptional.get().getVehicleId());

                    // vehicleHistory.setName("Job Image");
                    vehicleHistory.setObjectKey(_imageModelSaved.getId());
                    vehicleHistory.setType(0); // 0) add 1) update 2) delete

                    vehicleHistory.setValue("" + _imageModelSaved.getDescription());

                    this.vehicleHistoryRepository.save(vehicleHistory);

                    try {

                        Note note = new Note();
                        note.setJobId(job.getId());
                        note.setEmployeeId(employeeOptional.get().getId());
                        note.setCompanyId(employeeOptional.get().getCompanyId());
                        note.setUserId(0);
                        note.setNotes("JOB");
                        note.setVehicleId(jobOptional.get().getVehicleId());
                        System.out.println("Sending .." + note.toString());
                        noteWebSocketHandler.sendJobToClients(note);
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

    @PostMapping("/images/file/{jobId}/{userId}")
    public ResponseEntity<ImageModelJob> createImageFromFileWithUserId(
            @PathVariable("jobId") long jobId, @PathVariable("userId") long userId,
            @RequestPart("description") String description,
            @RequestPart("file") MultipartFile file) throws IOException {

        LOG.info("createImageFromFile");
        try {
            Optional<User> userOptional = this.userRepository.findById(userId);

            Optional<Job> jobOptional = jobRepository.findById(jobId);
            ImageModelJob imageModelJob = new ImageModelJob();

            if (file.getOriginalFilename() != null) {
                imageModelJob.setFileName(file.getOriginalFilename());
            }

            if (jobOptional.isPresent()) {

                Job job = jobOptional.get();
                imageModelJob.setJob(job);
                if (description != null && description != "") {
                    imageModelJob.setDescription(description);
                }
                imageModelJob.setUserId(userId);
                ImageModelJob _imageModelSaved = this.imageModelJobRepository.save(imageModelJob);

                getSaveAndResizedJpegFile(file, _imageModelSaved);

                VehicleHistory vehicleHistory = new VehicleHistory();
                vehicleHistory.setName("Job Image");

                vehicleHistory.setUserId(userId);

                vehicleHistory.setVehicleId(jobOptional.get().getVehicleId());

                // vehicleHistory.setName("Job Image");
                vehicleHistory.setObjectKey(_imageModelSaved.getId());
                vehicleHistory.setType(0); // 0) add 1) update 2) delete

                vehicleHistory.setValue("" + _imageModelSaved.getDescription());

                this.vehicleHistoryRepository.save(vehicleHistory);

                try {

                    Note note = new Note();
                    note.setJobId(job.getId());
                    // note.setEmployeeId(employeeOptional.get().getId());
                    note.setCompanyId(userOptional.get().getCompanyId());
                    note.setUserId(userId);
                    note.setVehicleId(jobOptional.get().getVehicleId());
                    note.setNotes("JOB IMAGE");
                    System.out.println("Sending .." + note.toString());
                    noteWebSocketHandler.sendJobToClients(note);
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

    @PostMapping("/images/sequence/{jobId}")
    // @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<List<ImageModelJob>> updateSequenceNumber(@PathVariable("jobId") long jobId,
            @RequestBody List<SequenceCarrier> sequenceCarriers) {

        Optional<Job> jobOptional = this.jobRepository.findById(jobId);
        List<ImageModelJob> imageModelJobs = new ArrayList<ImageModelJob>();

        if (jobOptional.isPresent()) {
            imageModelJobs = this.imageModelJobRepository.findByJobId(jobId);
            for (ImageModelJob imageModelJob : imageModelJobs) {
                for (SequenceCarrier sequenceCarrier : sequenceCarriers) {

                    if (imageModelJob.getId() == sequenceCarrier.getId()) {
                        imageModelJob.setSequenceNumber(sequenceCarrier.getIndex());
                        imageModelJob = this.imageModelJobRepository.save(imageModelJob);
                    }

                }
            }
        }

        return new ResponseEntity<>(imageModelJobs, HttpStatus.OK);

    }

    @PutMapping("/images/{jobId}/{imageId}/{docType}")
    public ResponseEntity<HttpStatus> setImageDocType(
            @PathVariable("jobId") long jobId,
            @PathVariable("imageId") long imageId,
            @PathVariable("docType") long docTypeIn) {

        LOG.info("" + jobId + " " + imageId);

        try {

            Optional<Job> jobOptional = jobRepository.findById(jobId);

            if (jobOptional.isPresent()) {

                for (ImageModelJob imageModel : jobOptional.get().getImageModels()) {

                    imageModel.setShowInSearch(false);
                    if (imageModel.getId() == imageId) {
                        imageModel.setDocType((int) docTypeIn);
                        this.imageModelJobRepository.save(imageModel);

                        VehicleHistory vehicleHistory = new VehicleHistory();
                        vehicleHistory.setName("Job Image Doc Type");

                        // vehicleHistory.setUserId(_imageModelSaved.getUserId());
                        vehicleHistory.setVehicleId(jobOptional.get().getVehicleId());

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

    @PutMapping("/images/{jobId}/{imageId}/{docType}/{userId}")
    public ResponseEntity<HttpStatus> setImageDocTypeWithUserId(
            @PathVariable("jobId") long jobId,
            @PathVariable("imageId") long imageId,
            @PathVariable("docType") long docTypeIn,
            @PathVariable("userId") long userId) {

        LOG.info("" + jobId + " " + imageId);

        try {

            Optional<Job> jobOptional = jobRepository.findById(jobId);

            if (jobOptional.isPresent()) {

                for (ImageModelJob imageModel : jobOptional.get().getImageModels()) {

                    imageModel.setShowInSearch(false);
                    if (imageModel.getId() == imageId) {
                        imageModel.setDocType((int) docTypeIn);
                        this.imageModelJobRepository.save(imageModel);

                        VehicleHistory vehicleHistory = new VehicleHistory();
                        vehicleHistory.setName("Job Image Doc Type");

                        vehicleHistory.setUserId(userId);
                        vehicleHistory.setVehicleId(jobOptional.get().getVehicleId());

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

    @PutMapping("/images/{jobId}/{imageId}")
    public ResponseEntity<HttpStatus> setImageForSearch(
            @PathVariable("jobId") long jobId,
            @PathVariable("imageId") long imageId) {

        LOG.info("" + jobId + " " + imageId);

        try {

            Optional<Job> jobOptional = jobRepository.findById(jobId);

            if (jobOptional.isPresent()) {

                for (ImageModelJob imageModel : jobOptional.get().getImageModels()) {

                    imageModel.setShowInSearch(false);
                    if (imageModel.getId() == imageId) {
                        imageModel.setShowInSearch(true);
                    }
                    this.imageModelJobRepository.save(imageModel);
                }
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);

            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/images/{jobId}/{imageId}/{userId}")
    public ResponseEntity<HttpStatus> deleteImage(
            @PathVariable("jobId") long jobId,
            @PathVariable("imageId") long imageId,
            @PathVariable("userId") long userId) {
        try {

            Optional<Job> jobOptional = this.jobRepository.findById(jobId);
            Optional<User> userOptional = this.userRepository.findById(userId);

            if (jobOptional.isPresent()) {

                if (imageId > 0) {

                    Optional<ImageModelJob> imageModelOptional = this.imageModelJobRepository.findById(imageId);

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
                        this.imageModelJobRepository.deleteById(imageId);

                    }
                }
                VehicleHistory vehicleHistory = new VehicleHistory();
                vehicleHistory.setName("Job Image");

                // vehicleHistory.setUserId(_imageModelSaved.getUserId());
                vehicleHistory.setVehicleId(jobOptional.get().getVehicleId());

                vehicleHistory.setObjectKey(imageId);
                vehicleHistory.setType(2); // 0) add 1) update 2) delete

                vehicleHistory.setValue("");
                vehicleHistory.setUserId(userId);

                this.vehicleHistoryRepository.save(vehicleHistory);
                try {

                    Note note = new Note();
                    note.setJobId(jobId);
                    // note.setEmployeeId(employeeOptional.get().getId());
                    note.setCompanyId(userOptional.get().getCompanyId());
                    note.setUserId(userId);
                    note.setVehicleId(jobOptional.get().getVehicleId());
                    note.setNotes("JOB IMAGE DELETION");
                    System.out.println("Sending .." + note.toString());
                    noteWebSocketHandler.sendJobToClients(note);
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

    @DeleteMapping("/images/employee/{jobId}/{imageId}/{uuidEmployee}")
    public ResponseEntity<HttpStatus> deleteImageUuidEmployee(
            @PathVariable("jobId") long jobId,
            @PathVariable("imageId") long imageId,
            @PathVariable("uuidEmployee") String uuidEmployee) {
        try {

            Optional<Employee> employeeOptional = this.employeeRepository.findByToken(uuidEmployee);

            if (employeeOptional.isPresent()) {
                Optional<Job> jobOptional = this.jobRepository.findById(jobId);

                if (jobOptional.isPresent()) {

                    if (imageId > 0) {

                        Optional<ImageModelJob> imageModelOptional = this.imageModelJobRepository.findById(imageId);

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
                            this.imageModelJobRepository.deleteById(imageId);

                        }
                    }
                    VehicleHistory vehicleHistory = new VehicleHistory();
                    vehicleHistory.setName("Job Image");

                    // vehicleHistory.setUserId(_imageModelSaved.getUserId());
                    vehicleHistory.setVehicleId(jobOptional.get().getVehicleId());

                    vehicleHistory.setObjectKey(imageId);
                    vehicleHistory.setType(2); // 0) add 1) update 2) delete
                    vehicleHistory.setUserId(0);
                    vehicleHistory.setValue("");
                    vehicleHistory.setEmployeeId(employeeOptional.get().getId());

                    this.vehicleHistoryRepository.save(vehicleHistory);

                    try {

                        Note note = new Note();
                        note.setJobId(jobId);
                        note.setVehicleId(jobOptional.get().getVehicleId());
                        note.setEmployeeId(employeeOptional.get().getId());
                        note.setCompanyId(employeeOptional.get().getCompanyId());
                        //note.setUserId(userId);
                        note.setNotes("JOB IMAGE DELETION");
                        System.out.println("Sending .." + note.toString());
                        noteWebSocketHandler.sendJobToClients(note);
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
