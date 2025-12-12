package com.xoftex.parthub.controllers;

import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Base64;
import java.util.Optional;

import javax.imageio.ImageIO;

import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
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

import com.xoftex.parthub.models.Autopart;
import com.xoftex.parthub.models.Employee;
import com.xoftex.parthub.models.ImageModel;
import com.xoftex.parthub.models.VehicleHistory;
import com.xoftex.parthub.repository.AutoPartRepository;
import com.xoftex.parthub.repository.EmployeeRepository;
import com.xoftex.parthub.repository.ImageModelRepository;
import com.xoftex.parthub.repository.VehicleHistoryRepository;
import com.xoftex.parthub.security.jwt.JwtUtils;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import net.coobird.thumbnailator.Thumbnails;

//for Angular Client (withCredentials)
//@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
// @CrossOrigin(origins = "*", maxAge = 3600)
@CrossOrigin("*")
@RestController
@RequestMapping("/api")
public class ImageController {

    @Autowired
    AutoPartRepository autoPartRepository;

    @Autowired
    ImageModelRepository imageModelRepository;

    @Autowired
    VehicleHistoryRepository vehicleHistoryRepository;

    @Autowired
    EmployeeRepository employeeRepository;

    @Autowired
    private JwtUtils jwtUtils;

    @Value("${image.path}")
    // String filePath = "C:\\Projects\\images\\test_image_";
    String filePath = "";

    @Value("${image.root.path}")
    // String filePath = "C:\\Projects\\images\\;
    String fileRootPath = "";

    String imageNamePrefix = "test_image_";

    @Value("${image.resize}")
    String imageResizeDirectory = "";

    private static final Logger LOG = LoggerFactory.getLogger(ImageController.class);

    @PostMapping("/images/{autopartId}")
    public ResponseEntity<ImageModel> createImage(@RequestBody ImageModel imageModelIn,
            @PathVariable("autopartId") long autopartId) {
        try {

            Optional<Autopart> autoparOptional = autoPartRepository.findById(autopartId);

            if (autoparOptional.isPresent()) {
                Autopart autopart = autoparOptional.get();
                imageModelIn.setAutopart(autopart);
                ImageModel _imageModelSaved = this.imageModelRepository.save(imageModelIn);

                String base64Image = _imageModelSaved.getPicByte().split(",")[1];
                byte[] imageBytes = Base64.getDecoder().decode(base64Image);

                String path = this.fileRootPath + this.imageNamePrefix + _imageModelSaved.getId() + ".jpeg";

                File file = new File(path);
                try (OutputStream outputStream = new BufferedOutputStream(new FileOutputStream(file))) {
                    outputStream.write(imageBytes);
                } catch (IOException e) {
                    e.printStackTrace();
                }
                String pathOut = this.fileRootPath + imageResizeDirectory + this.imageNamePrefix
                        + _imageModelSaved.getId()
                        + ".jpeg";
                // this.createFromImageFile(file, path);
                this.resizeImage(path, pathOut, 500, 500);

                VehicleHistory vehicleHistory = new VehicleHistory();
                vehicleHistory.setName("Autopart Image");

                // vehicleHistory.setUserId(_imageModelSaved.getUserId());
                vehicleHistory.setVehicleId(autopart.getVehicleId());

                vehicleHistory.setObjectKey(_imageModelSaved.getId());
                vehicleHistory.setType(0); // 0) add 1) update 2) delete

                vehicleHistory.setValue("");

                this.vehicleHistoryRepository.save(vehicleHistory);

                return new ResponseEntity<>(_imageModelSaved, HttpStatus.CREATED);

            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/images/external/{autopartId}")
    public ResponseEntity<ImageModel> createImageExternal(@RequestBody String base64Str,
            @PathVariable("autopartId") long autopartId) {
        try {

            Optional<Autopart> autoparOptional = autoPartRepository.findById(autopartId);

            if (autoparOptional.isPresent()) {
                Autopart autopart = autoparOptional.get();
                ImageModel imageModelIn = new ImageModel();
                // imageModelIn.setSequenceNumber(0);
                imageModelIn.setPicByte(base64Str);
                imageModelIn.setAutopart(autopart);

                ImageModel _imageModelSaved = this.imageModelRepository.save(imageModelIn);

                String base64Image = _imageModelSaved.getPicByte().split(",")[1];
                byte[] imageBytes = Base64.getDecoder().decode(base64Image);

                String path = this.fileRootPath + this.imageNamePrefix + _imageModelSaved.getId() + ".jpeg";

                File file = new File(path);
                try (OutputStream outputStream = new BufferedOutputStream(new FileOutputStream(file))) {
                    outputStream.write(imageBytes);
                } catch (IOException e) {
                    e.printStackTrace();
                }
                String pathOut = this.fileRootPath + imageResizeDirectory + this.imageNamePrefix
                        + _imageModelSaved.getId()
                        + ".jpeg";
                // this.createFromImageFile(file, path);
                this.resizeImage(path, pathOut, 500, 500);

                VehicleHistory vehicleHistory = new VehicleHistory();
                vehicleHistory.setName("Autopart Image");

                // vehicleHistory.setUserId(_imageModelSaved.getUserId());
                vehicleHistory.setVehicleId(autopart.getVehicleId());

                vehicleHistory.setObjectKey(_imageModelSaved.getId());
                vehicleHistory.setType(0); // 0) add 1) update 2) delete

                vehicleHistory.setValue("");

                this.vehicleHistoryRepository.save(vehicleHistory);

                return new ResponseEntity<>(_imageModelSaved, HttpStatus.CREATED);

            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public String getExtention(MultipartFile file) {

        return StringUtils.getFilenameExtension(file.getOriginalFilename());

    }

    public boolean convertFormat(String inputImagePath,
            String outputImagePath, String formatName) throws IOException {
        FileInputStream inputStream = new FileInputStream(inputImagePath);
        FileOutputStream outputStream = new FileOutputStream(outputImagePath);

        // reads input image from file
        BufferedImage inputImage = ImageIO.read(inputStream);

        // writes to the output image in specified format
        boolean result = ImageIO.write(inputImage, formatName, outputStream);

        // needs to close the streams
        outputStream.close();
        inputStream.close();

        return result;
    }

    private String getFileExtension(String filename) {
        if (filename != null && filename.contains(".")) {
            return filename.substring(filename.lastIndexOf("."));
        }
        return null; // Invalid file extension
    }

    @PostMapping("/images/file/{autopartId}")
    public ResponseEntity<ImageModel> createImageFromFile(
            @PathVariable("autopartId") long autopartId,
            @RequestPart("file") MultipartFile file) throws IOException {

        try {

            Optional<Autopart> autoparOptional = autoPartRepository.findById(autopartId);
            ImageModel imageModel = new ImageModel();

            if (autoparOptional.isPresent()) {

                Autopart autopart = autoparOptional.get();
                imageModel.setAutopart(autopart);

                ImageModel _imageModelSaved = this.imageModelRepository.save(imageModel);

                getSaveAndResizedJpegFile(file, _imageModelSaved);

                if (autopart.getVehicleId() > 0) {
                    VehicleHistory vehicleHistory = new VehicleHistory();
                    vehicleHistory.setName("Autopart Image");

                    // vehicleHistory.setUserId(_imageModelSaved.getUserId());
                    vehicleHistory.setVehicleId(autopart.getVehicleId());

                    vehicleHistory.setObjectKey(_imageModelSaved.getId());
                    vehicleHistory.setType(0); // 0) add 1) update 2) delete

                    vehicleHistory.setValue("");

                    this.vehicleHistoryRepository.save(vehicleHistory);
                }
                return new ResponseEntity<>(_imageModelSaved, HttpStatus.CREATED);

            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private void getSaveAndResizedJpegFile(MultipartFile file, ImageModel _imageModelSaved) throws IOException {
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

    // @PostMapping("/images/file/{autopartId}")
    public ResponseEntity<ImageModel> createImageFromFileXXXX(
            @PathVariable("autopartId") long autopartId,
            @RequestPart("file") MultipartFile file) throws IOException {

        try {

            Optional<Autopart> autoparOptional = autoPartRepository.findById(autopartId);
            ImageModel imageModel = new ImageModel();

            if (autoparOptional.isPresent()) {

                Autopart autopart = autoparOptional.get();
                imageModel.setAutopart(autopart);

                ImageModel _imageModelSaved = this.imageModelRepository.save(imageModel);

                String pathOriginal = this.fileRootPath + this.imageNamePrefix + _imageModelSaved.getId()
                        + "." + getExtention(file);

                String pathJpeg = this.fileRootPath + this.imageNamePrefix + _imageModelSaved.getId()
                        + ".jpeg";

                System.out.println(getExtention(file));
                System.out.println(pathOriginal);

                File fileSaved = new File(pathOriginal);
                try (OutputStream outputStream = new BufferedOutputStream(new FileOutputStream(fileSaved))) {
                    outputStream.write(file.getBytes());

                } catch (IOException e) {
                    e.printStackTrace();
                }
                if (!pathOriginal.equals(pathJpeg)) {
                    try {

                        if (convertFormat(pathOriginal, pathJpeg, "JPEG") == true) {
                        } else {
                            ImageIO.write(ImageIO.read(new File(pathOriginal)), "JPEG", new File(pathJpeg));
                        }

                    } catch (IOException ex) {
                        // Display message when exception is thrown
                        System.out.println(
                                "Error during converting image.");

                        // Print the line number
                        // where the exception occurred
                        ex.printStackTrace();
                    }
                }

                String pathOut = this.fileRootPath + imageResizeDirectory + this.imageNamePrefix
                        + _imageModelSaved.getId()
                        + ".jpeg";
                // this.createFromImageFile(file, path);
                this.resizeImage(pathJpeg, pathOut, 500, 500);

                VehicleHistory vehicleHistory = new VehicleHistory();
                vehicleHistory.setName("Autopart Image");

                // vehicleHistory.setUserId(_imageModelSaved.getUserId());
                vehicleHistory.setVehicleId(autopart.getVehicleId());

                vehicleHistory.setObjectKey(_imageModelSaved.getId());
                vehicleHistory.setType(0); // 0) add 1) update 2) delete

                vehicleHistory.setValue("");

                this.vehicleHistoryRepository.save(vehicleHistory);

                return new ResponseEntity<>(_imageModelSaved, HttpStatus.CREATED);

            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/images/file/external/employee/{autopartId}/{uuidEmployee}")
    public ResponseEntity<ImageModel> createImageFromFileWithUuidEmployee(
            @PathVariable("autopartId") long autopartId, @PathVariable("uuidEmployee") String uuidEmployee,
            @RequestPart("file") MultipartFile file) throws IOException {

        try {

            Optional<Employee> employeeOptional = this.employeeRepository.getByToken(uuidEmployee);
            if (employeeOptional.isPresent()) {
                Optional<Autopart> autoparOptional = autoPartRepository.findById(autopartId);
                ImageModel imageModel = new ImageModel();

                if (autoparOptional.isPresent()) {

                    Autopart autopart = autoparOptional.get();
                    imageModel.setAutopart(autopart);

                    ImageModel _imageModelSaved = this.imageModelRepository.save(imageModel);

                    getSaveAndResizedJpegFile(file, _imageModelSaved);

                    VehicleHistory vehicleHistory = new VehicleHistory();
                    vehicleHistory.setName("Autopart Image Employee");
                    vehicleHistory.setUserId((long) 0);
                    vehicleHistory.setEmployeeId(employeeOptional.get().getId());

                    vehicleHistory.setVehicleId(autopart.getVehicleId());

                    vehicleHistory.setObjectKey(_imageModelSaved.getId());
                    vehicleHistory.setType(0); // 0) add 1) update 2) delete

                    vehicleHistory.setValue("");

                    this.vehicleHistoryRepository.save(vehicleHistory);

                    return new ResponseEntity<>(_imageModelSaved, HttpStatus.CREATED);

                } else {
                    return new ResponseEntity<>(HttpStatus.NOT_FOUND);
                }
            }

        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/images/file/{autopartId}/{userId}")
    public ResponseEntity<ImageModel> createImageFromFileWithUserId(
            @PathVariable("autopartId") long autopartId, @PathVariable("userId") long userId,
            @RequestPart("file") MultipartFile file) throws IOException {

        try {

            Optional<Autopart> autoparOptional = autoPartRepository.findById(autopartId);
            ImageModel imageModel = new ImageModel();

            if (autoparOptional.isPresent()) {

                Autopart autopart = autoparOptional.get();
                imageModel.setAutopart(autopart);
                imageModel.setUserId(userId);
                ImageModel _imageModelSaved = this.imageModelRepository.save(imageModel);

                getSaveAndResizedJpegFile(file, _imageModelSaved);
                VehicleHistory vehicleHistory = new VehicleHistory();
                vehicleHistory.setName("Autopart Image");

                vehicleHistory.setUserId(userId);
                vehicleHistory.setVehicleId(autopart.getVehicleId());

                vehicleHistory.setObjectKey(_imageModelSaved.getId());
                vehicleHistory.setType(0); // 0) add 1) update 2) delete

                vehicleHistory.setValue("");

                this.vehicleHistoryRepository.save(vehicleHistory);

                return new ResponseEntity<>(_imageModelSaved, HttpStatus.CREATED);

            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/images/{autopartId}/{imageId}")
    public ResponseEntity<HttpStatus> setImageForSearch(
            @PathVariable("autopartId") long autopartId,
            @PathVariable("imageId") long imageId) {

        LOG.info("" + autopartId + " " + imageId);

        try {

            Optional<Autopart> autoparOptional = autoPartRepository.findById(autopartId);

            if (autoparOptional.isPresent()) {

                for (ImageModel imageModel : autoparOptional.get().getImageModels()) {

                    imageModel.setShowInSearch(false);
                    if (imageModel.getId() == imageId) {
                        imageModel.setShowInSearch(true);
                    }
                    this.imageModelRepository.save(imageModel);
                }
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);

            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/images/{autopartId}/{imageId}/{userId}")
    public ResponseEntity<HttpStatus> deleteImage(
            @PathVariable("autopartId") long autopartId,
            @PathVariable("imageId") long imageId,
            @PathVariable("userId") long userId) {
        try {

            Optional<Autopart> autoparOptional = autoPartRepository.findById(autopartId);

            if (autoparOptional.isPresent()) {

                if (imageId > 0) {

                    Optional<ImageModel> imageModelOptional = this.imageModelRepository.findById(imageId);

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
                        this.imageModelRepository.deleteById(imageId);

                    }
                }
                if (autoparOptional.get().getVehicleId() > 0) {
                    VehicleHistory vehicleHistory = new VehicleHistory();
                    vehicleHistory.setName("Autopart Image");

                    // vehicleHistory.setUserId(_imageModelSaved.getUserId());
                    vehicleHistory.setVehicleId(autoparOptional.get().getVehicleId());

                    vehicleHistory.setObjectKey(imageId);
                    vehicleHistory.setType(2); // 0) add 1) update 2) delete
                    vehicleHistory.setUserId(userId);
                    vehicleHistory.setValue("");

                    this.vehicleHistoryRepository.save(vehicleHistory);
                }
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);

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
        // System.out.println(filePath);
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
        // System.out.println(filePath);

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

    private String parseJwt(HttpServletRequest request) {
        String jwt = jwtUtils.getJwtFromCookies(request);
        return jwt;
    }

}
