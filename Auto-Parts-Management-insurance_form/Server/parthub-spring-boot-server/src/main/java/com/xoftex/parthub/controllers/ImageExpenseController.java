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

import com.xoftex.parthub.models.ImageModelExpense;
import com.xoftex.parthub.models.ImageModelVehicle;
import com.xoftex.parthub.models.SequenceCarrier;
import com.xoftex.parthub.models.User;
import com.xoftex.parthub.models.Expense;
import com.xoftex.parthub.models.Note;
import com.xoftex.parthub.models.VehicleHistory;
import com.xoftex.parthub.repository.AutoPartRepository;
import com.xoftex.parthub.repository.CompanyRepository;
import com.xoftex.parthub.repository.EmployeeRepository;
import com.xoftex.parthub.repository.ImageModelRepository;
import com.xoftex.parthub.repository.ImageModelExpenseRepository;
import com.xoftex.parthub.repository.VehicleHistoryRepository;
import com.xoftex.parthub.repository.ExpenseRepository;
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
@RequestMapping("/api/expenseimages")
public class ImageExpenseController {

    @Autowired
    AutoPartRepository autoPartRepository;

    @Autowired
    EmployeeRepository employeeRepository;

    @Autowired
    ExpenseRepository expenseRepository;

 

    @Autowired
    ImageModelExpenseRepository imageModelExpenseRepository;

 

    @Autowired
    CompanyRepository companyRepository;

    @Autowired
    VehicleHistoryRepository vehicleHistoryRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    private JwtUtils jwtUtils;

    @Value("${image.path.expense}")
    // String filePath = "C:\\Projects\\images\\expense\\test_image_";
    String filePath = "";

    @Value("${image.root.path.expense}")
    // String filePath = "C:\\Projects\\images\\expense\\;
    String fileRootPath = "";

    String imageNamePrefix = "test_expense_image_";

    @Value("${image.resize.expense}")
    String imageResizeDirectory = "";

    private static final Logger LOG = LoggerFactory.getLogger(ImageExpenseController.class);

    private final NoteWebSocketHandler noteWebSocketHandler;

    public ImageExpenseController(NoteWebSocketHandler noteWebSocketHandler) {
        this.noteWebSocketHandler = noteWebSocketHandler;
    }

    // @PostMapping("/send")
    // public String sendExpense(@RequestBody Note note) {
    //     noteWebSocketHandler.sendExpenseToClients(note);
    //     System.out.print(note);
    //     return "Expense sent to clients";
    // }

    @PostMapping("/images/{expenseId}")
    public ResponseEntity<ImageModelExpense> createImage(@RequestBody ImageModelExpense imageModelIn,
            @PathVariable("expenseId") long expenseId) {
        try {
            LOG.info("" + expenseId);
            Optional<Expense> expenseOptional = expenseRepository.findById(expenseId);

            if (expenseOptional.isPresent()) {
                Expense expense = expenseOptional.get();
                imageModelIn.setExpense(expense);
                imageModelIn.setCompanyId(expense.getCompanyId());
                imageModelIn.setSequenceNumber(0);

                ImageModelExpense _imageModelSaved = this.imageModelExpenseRepository.save(imageModelIn);

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



                return new ResponseEntity<>(_imageModelSaved, HttpStatus.CREATED);

            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/images/external/{expenseId}")
    public ResponseEntity<ImageModelExpense> createImageExternal(@RequestBody String base64Str,
            @PathVariable("expenseId") long expenseId) {
        try {
            LOG.info("" + expenseId);
            Optional<Expense> expenseOptional = expenseRepository.findById(expenseId);
            ImageModelExpense imageModelIn = new ImageModelExpense();

            if (expenseOptional.isPresent()) {
                Expense job = expenseOptional.get();
                imageModelIn.setExpense(job);
                imageModelIn.setSequenceNumber(0);
                imageModelIn.setPicByte(base64Str);

                ImageModelExpense _imageModelSaved = this.imageModelExpenseRepository.save(imageModelIn);

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

    private void getSaveAndResizedJpegFile(MultipartFile file, ImageModelExpense _imageModelSaved) throws IOException {
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

    @PostMapping("/images/file/{expenseId}")
    public ResponseEntity<ImageModelExpense> createImageFromFile(
            @PathVariable("expenseId") long expenseId, @RequestPart("description") String description,
            @RequestPart("file") MultipartFile file) throws IOException {

        LOG.info("createImageFromFile");
        try {

            Optional<Expense> expenseOptional = expenseRepository.findById(expenseId);
            ImageModelExpense imageModelExpense = new ImageModelExpense();

            if (file.getOriginalFilename() != null) {
                imageModelExpense.setFileName(file.getOriginalFilename());
            }

            if (expenseOptional.isPresent()) {

                Expense expense = expenseOptional.get();
                imageModelExpense.setExpense(expense);
                if (description != null && description != "") {
                    imageModelExpense.setDescription(description);
                }

                ImageModelExpense _imageModelSaved = this.imageModelExpenseRepository.save(imageModelExpense);

                getSaveAndResizedJpegFile(file, _imageModelSaved);


                return new ResponseEntity<>(_imageModelSaved, HttpStatus.CREATED);

            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

        } catch (Exception e) {
            LOG.info(e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/images/file/employee/{expenseId}/{uuidEmployee}")
    public ResponseEntity<ImageModelExpense> createImageFromFileWithUuidEmployee(
            @PathVariable("expenseId") long expenseId, @PathVariable("uuidEmployee") String uuidEmployee,
            @RequestPart("description") String description,
            @RequestPart("file") MultipartFile file) throws IOException {

        LOG.info("createImageFromFile");
        try {

            Optional<Employee> employeeOptional = this.employeeRepository.findByToken(uuidEmployee);

            if (employeeOptional.isPresent()) {

                Optional<Expense> expenseOptional = expenseRepository.findById(expenseId);
                ImageModelExpense imageModelExpense = new ImageModelExpense();

                if (file.getOriginalFilename() != null) {
                    imageModelExpense.setFileName(file.getOriginalFilename());
                }

                if (expenseOptional.isPresent()) {

                    Expense expense = expenseOptional.get();
                    imageModelExpense.setExpense(expense);
                    if (description != null && description != "") {
                        imageModelExpense.setDescription(description);
                    }
                    imageModelExpense.setEmployeeId(employeeOptional.get().getId());

                    ImageModelExpense _imageModelSaved = this.imageModelExpenseRepository.save(imageModelExpense);

                    getSaveAndResizedJpegFile(file, _imageModelSaved);


                    try {

                        // Note note = new Note();
                        // note.setExpenseId(job.getId());
                        // note.setEmployeeId(employeeOptional.get().getId());
                        // note.setCompanyId(employeeOptional.get().getCompanyId());
                        // note.setUserId(0);
                        // note.setNotes("JOB");
                        // note.setVehicleId(expenseOptional.get().getVehicleId());
                        // System.out.println("Sending .." + note.toString());
                        // noteWebSocketHandler.sendExpenseToClients(note);
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

    @PostMapping("/images/file/{expenseId}/{userId}")
    public ResponseEntity<ImageModelExpense> createImageFromFileWithUserId(
            @PathVariable("expenseId") long expenseId, @PathVariable("userId") long userId,
            @RequestPart("description") String description,
            @RequestPart("file") MultipartFile file) throws IOException {

        LOG.info("createImageFromFile");
        try {
            Optional<User> userOptional = this.userRepository.findById(userId);

            Optional<Expense> expenseOptional = expenseRepository.findById(expenseId);
            ImageModelExpense imageModelExpense = new ImageModelExpense();

            if (file.getOriginalFilename() != null) {
                imageModelExpense.setFileName(file.getOriginalFilename());
            }

            if (expenseOptional.isPresent()) {

                Expense expense = expenseOptional.get();
                imageModelExpense.setExpense(expense);
                if (description != null && description != "") {
                    imageModelExpense.setDescription(description);
                }
                imageModelExpense.setUserId(userId);
                ImageModelExpense _imageModelSaved = this.imageModelExpenseRepository.save(imageModelExpense);

                getSaveAndResizedJpegFile(file, _imageModelSaved);


                try {

                    // Note note = new Note();
                    // note.setExpenseId(job.getId());
                    // // note.setEmployeeId(employeeOptional.get().getId());
                    // note.setCompanyId(userOptional.get().getCompanyId());
                    // note.setUserId(userId);
                    // note.setVehicleId(expenseOptional.get().getVehicleId());
                    // note.setNotes("JOB IMAGE");
                    // System.out.println("Sending .." + note.toString());
                    // noteWebSocketHandler.sendExpenseToClients(note);
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

    @PostMapping("/images/sequence/{expenseId}")
    // @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<List<ImageModelExpense>> updateSequenceNumber(@PathVariable("expenseId") long expenseId,
            @RequestBody List<SequenceCarrier> sequenceCarriers) {

        Optional<Expense> expenseOptional = this.expenseRepository.findById(expenseId);
        List<ImageModelExpense> imageModelExpenses = new ArrayList<ImageModelExpense>();

        if (expenseOptional.isPresent()) {
            imageModelExpenses = this.imageModelExpenseRepository.findByExpenseId(expenseId);
            for (ImageModelExpense imageModelExpense : imageModelExpenses) {
                for (SequenceCarrier sequenceCarrier : sequenceCarriers) {

                    if (imageModelExpense.getId() == sequenceCarrier.getId()) {
                        imageModelExpense.setSequenceNumber(sequenceCarrier.getIndex());
                        imageModelExpense = this.imageModelExpenseRepository.save(imageModelExpense);
                    }

                }
            }
        }

        return new ResponseEntity<>(imageModelExpenses, HttpStatus.OK);

    }


    @PutMapping("/images/{expenseId}/{imageId}")
    public ResponseEntity<HttpStatus> setImageForSearch(
            @PathVariable("expenseId") long expenseId,
            @PathVariable("imageId") long imageId) {

        LOG.info("" + expenseId + " " + imageId);

        try {

            Optional<Expense> expenseOptional = expenseRepository.findById(expenseId);

            if (expenseOptional.isPresent()) {

                for (ImageModelExpense imageModel : expenseOptional.get().getImageModels()) {

                    imageModel.setShowInSearch(false);
                    if (imageModel.getId() == imageId) {
                        imageModel.setShowInSearch(true);
                    }
                    this.imageModelExpenseRepository.save(imageModel);
                }
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);

            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/images/{expenseId}/{imageId}/{userId}")
    public ResponseEntity<HttpStatus> deleteImage(
            @PathVariable("expenseId") long expenseId,
            @PathVariable("imageId") long imageId,
            @PathVariable("userId") long userId) {
        try {

            Optional<Expense> expenseOptional = this.expenseRepository.findById(expenseId);
            Optional<User> userOptional = this.userRepository.findById(userId);

            if (expenseOptional.isPresent()) {

                if (imageId > 0) {

                    Optional<ImageModelExpense> imageModelOptional = this.imageModelExpenseRepository.findById(imageId);

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
                        this.imageModelExpenseRepository.deleteById(imageId);

                    }
                }
          
                try {

                    // Note note = new Note();
                    // note.setExpenseId(expenseId);
                    // // note.setEmployeeId(employeeOptional.get().getId());
                    // note.setCompanyId(userOptional.get().getCompanyId());
                    // note.setUserId(userId);
                    // note.setVehicleId(expenseOptional.get().getVehicleId());
                    // note.setNotes("JOB IMAGE DELETION");
                    // System.out.println("Sending .." + note.toString());
                    // noteWebSocketHandler.sendExpenseToClients(note);
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

    @DeleteMapping("/images/employee/{expenseId}/{imageId}/{uuidEmployee}")
    public ResponseEntity<HttpStatus> deleteImageUuidEmployee(
            @PathVariable("expenseId") long expenseId,
            @PathVariable("imageId") long imageId,
            @PathVariable("uuidEmployee") String uuidEmployee) {
        try {

            Optional<Employee> employeeOptional = this.employeeRepository.findByToken(uuidEmployee);

            if (employeeOptional.isPresent()) {
                Optional<Expense> expenseOptional = this.expenseRepository.findById(expenseId);

                if (expenseOptional.isPresent()) {

                    if (imageId > 0) {

                        Optional<ImageModelExpense> imageModelOptional = this.imageModelExpenseRepository.findById(imageId);

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
                            this.imageModelExpenseRepository.deleteById(imageId);

                        }
                    }
          

                    try {

                        // Note note = new Note();
                        // note.setExpenseId(expenseId);
                        // note.setVehicleId(expenseOptional.get().getVehicleId());
                        // note.setEmployeeId(employeeOptional.get().getId());
                        // note.setCompanyId(employeeOptional.get().getCompanyId());
                        // //note.setUserId(userId);
                        // note.setNotes("JOB IMAGE DELETION");
                        // System.out.println("Sending .." + note.toString());
                        // noteWebSocketHandler.sendExpenseToClients(note);
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
