package com.xoftex.parthub.controllers;

import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.google.gson.Gson;
import com.xoftex.parthub.exception.ResourceNotFoundException;
import com.xoftex.parthub.models.Address;
import com.xoftex.parthub.models.Autopart;
import com.xoftex.parthub.models.Company;
import com.xoftex.parthub.models.ImageModel;
import com.xoftex.parthub.models.ImageModelJob;
import com.xoftex.parthub.models.ItemType;
import com.xoftex.parthub.models.Job;
import com.xoftex.parthub.models.Payment;
import com.xoftex.parthub.models.Receipt;
import com.xoftex.parthub.models.SavedItem;
import com.xoftex.parthub.models.SearchCarrier;
import com.xoftex.parthub.models.SequenceCarrier;
import com.xoftex.parthub.models.User;
import com.xoftex.parthub.models.VehicleHistory;
import com.xoftex.parthub.models.ZipCode;

import com.xoftex.parthub.payload.request.FitmentRequest;
import com.xoftex.parthub.payload.response.UserSatisticsResponse;
import com.xoftex.parthub.repository.AutoPartRepository;
import com.xoftex.parthub.repository.CompanyRepository;
import com.xoftex.parthub.repository.FitmentRepository;
import com.xoftex.parthub.repository.ImageModelRepository;
import com.xoftex.parthub.repository.ItemTypeRepository;
import com.xoftex.parthub.repository.ReceiptRepository;
import com.xoftex.parthub.repository.SavedItemRepository;
import com.xoftex.parthub.repository.UserRepository;
import com.xoftex.parthub.repository.VehicleHistoryRepository;
import com.xoftex.parthub.repository.ZipCodeRepository;
import com.xoftex.parthub.security.jwt.JwtUtils;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;

import com.xoftex.parthub.models.EAddressType;
import com.xoftex.parthub.models.Employee;
import com.xoftex.parthub.models.Fitment;
import com.xoftex.parthub.repository.EmployeeRepository;

@Tag(name = "Auto Parts", description = "Auto Part management APIs")
// for Angular Client (withCredentials)
// @CrossOrigin(origins = "http://localhost:4200", maxAge = 3600,
// allowCredentials = "true")
// @CrossOrigin(origins = "*", maxAge = 3600)
@CrossOrigin("*")
@RestController
@RequestMapping("/api")
public class AutoPartController {

    @Autowired
    AutoPartRepository autoPartRepository;

    @Autowired
    ImageModelRepository imageModelRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    CompanyRepository companyRepository;

    @Autowired
    ZipCodeRepository zipCodeRepository;

    @Autowired
    SavedItemRepository savedItemRepository;

    @Autowired
    FitmentRepository fitmentRepository;

    @Autowired
    VehicleHistoryRepository vehicleHistoryRepository;

    @Autowired
    EmployeeRepository employeeRepository;

    @Autowired
    ReceiptRepository receiptRepository;

    @Autowired
    ItemTypeRepository itemTypeRepository;

    @Autowired
    private JwtUtils jwtUtils;

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

    private static final Logger LOG = LoggerFactory.getLogger(AutoPartController.class);

    @GetMapping("/autoparts")
    public ResponseEntity<List<Autopart>> getAllAutoParts(
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) boolean archived) {
        try {
            List<Autopart> autoParts = new ArrayList<Autopart>();

            if (userId == null || userId == "") {
                autoPartRepository.findAll().forEach(autoParts::add);

            } else {
                if (status == null) {
                    autoPartRepository.findByUserId(Long.parseLong(userId)).forEach(autoParts::add);
                } else {
                    // autoPartRepository.findByUserIdAndStatus(Long.parseLong(userId),
                    // Integer.parseInt(status))
                    // .forEach(autoParts::add);
                    // autoPartRepository.findByCompanyIdAndStatus(Long.parseLong(userId),
                    // Integer.parseInt(status))
                    // .forEach(autoParts::add);
                    autoPartRepository
                            .findByCompanyIdAndStatusAndPublishedAndArchived(Long.parseLong(userId),
                                    Integer.parseInt(status), true, archived)
                            .forEach(autoParts::add);
                }

            }

            this.getAddtionalInfo(autoParts, null);
            if (autoParts.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            return new ResponseEntity<>(autoParts, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/autoparts/company")
    public ResponseEntity<List<Autopart>> searchAllPartsCompanyStatusPaging(@RequestBody SearchCarrier searchCarrier) {
        List<Autopart> autoParts = new ArrayList<Autopart>();
        int serachCount = 0;

        if (searchCarrier.companyId == 0) {

            autoParts = autoPartRepository.findByUserIdAndStatusAndPublishedAndArchivedOrderByIdDesc(
                    searchCarrier.userId,
                    searchCarrier.status, searchCarrier.published, searchCarrier.archived,
                    Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));

            serachCount = autoPartRepository.countByUserIdAndStatusAndPublishedAndArchived(searchCarrier.userId,
                    searchCarrier.status, searchCarrier.published, searchCarrier.archived);

        } else {
            autoParts = autoPartRepository.findByCompanyIdAndStatusAndPublishedAndArchivedOrderByIdDesc(
                    searchCarrier.companyId,
                    searchCarrier.status, searchCarrier.published, searchCarrier.archived,
                    Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));

            serachCount = autoPartRepository.countByCompanyIdAndStatusAndPublishedAndArchived(searchCarrier.companyId,
                    searchCarrier.status, searchCarrier.published, searchCarrier.archived);

        }

        for (Autopart autopart : autoParts) {
            autopart.searchCount = serachCount;

        }

        this.getAddtionalInfo(autoParts, null);
        // =======
        return new ResponseEntity<>(autoParts, HttpStatus.OK);
    }

    @PostMapping("/autoparts/user")
    public ResponseEntity<List<Autopart>> searchAllPartsUserStatusPaging(@RequestBody SearchCarrier searchCarrier) {
        List<Autopart> autoParts = new ArrayList<Autopart>();
        int serachCount = 0;

        autoParts = autoPartRepository.findByUserIdAndStatusAndPublishedAndArchivedOrderByIdDesc(
                searchCarrier.userId,
                searchCarrier.status, searchCarrier.published, searchCarrier.archived,
                Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));

        serachCount = autoPartRepository.countByUserIdAndStatusAndPublishedAndArchived(searchCarrier.userId,
                searchCarrier.status, searchCarrier.published, searchCarrier.archived);

        for (Autopart autopart : autoParts) {
            autopart.searchCount = serachCount;

        }

        this.getAddtionalInfo(autoParts, null);
        // =======
        return new ResponseEntity<>(autoParts, HttpStatus.OK);
    }

    @GetMapping("/autoparts/company/{id}/{status}")
    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<List<Autopart>> getAllCompanyAutoParts(
            @PathVariable("id") long companyId, @PathVariable("status") int status) {

        try {
            List<Autopart> autoParts = new ArrayList<Autopart>();

            autoParts = this.autoPartRepository.findByCompanyIdAndArchivedAndStatusNot(companyId, false, status);

            this.getAddtionalInfo(autoParts, null);
            if (autoParts.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            return new ResponseEntity<>(autoParts, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/autoparts/satistics")
    public ResponseEntity<UserSatisticsResponse> getUserSatistics(@RequestParam(required = false) String userId) {

        UserSatisticsResponse userSatisticsResponse = new UserSatisticsResponse();
        try {
            long userIdLong = Long.parseLong(userId);

            // userSatisticsResponse
            // .setTotalAutopartsUnpublished((int)
            // autoPartRepository.countByUserIdAndStatus(userIdLong, 0));
            userSatisticsResponse
                    .setTotalAutopartsPublished((int) autoPartRepository
                            .countByCompanyIdAndStatusAndArchivedAndPublished(userIdLong, 2, false, true));
            userSatisticsResponse
                    .setTotalAutopartsArchieved((int) autoPartRepository
                            .countByCompanyIdAndStatusAndArchivedAndPublished(userIdLong, 2, true, true));

            userSatisticsResponse.setTotalAutoparts((int) autoPartRepository.countByUserId(userIdLong));

            userSatisticsResponse.setTotalSavedItems((int) savedItemRepository.countByUserId(userIdLong));

            // userSatisticsResponse.setTotalViewCount((int)
            // autoPartRepository.getViewCountForUser(userIdLong));
            userSatisticsResponse.setTotalViewCount((int) autoPartRepository.getViewCountForCompany(userIdLong));

            return new ResponseEntity<>(userSatisticsResponse, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/autoparts/satistics/user")
    public ResponseEntity<UserSatisticsResponse> getUserSatisticsUser(@RequestParam(required = false) String userId) {

        UserSatisticsResponse userSatisticsResponse = new UserSatisticsResponse();
        try {
            long userIdLong = Long.parseLong(userId);

            // userSatisticsResponse
            // .setTotalAutopartsUnpublished((int)
            // autoPartRepository.countByUserIdAndStatus(userIdLong, 0));
            userSatisticsResponse
                    .setTotalAutopartsPublished((int) autoPartRepository
                            .countByUserIdAndStatusAndArchivedAndPublished(userIdLong, 2, false, true));
            userSatisticsResponse
                    .setTotalAutopartsArchieved((int) autoPartRepository
                            .countByUserIdAndStatusAndArchivedAndPublished(userIdLong, 2, true, true));

            userSatisticsResponse.setTotalAutoparts((int) autoPartRepository.countByUserId(userIdLong));

            userSatisticsResponse.setTotalSavedItems((int) savedItemRepository.countByUserId(userIdLong));

            // userSatisticsResponse.setTotalViewCount((int)
            // autoPartRepository.getViewCountForUser(userIdLong));
            userSatisticsResponse.setTotalViewCount((int) autoPartRepository.getViewCountForUser(userIdLong));

            return new ResponseEntity<>(userSatisticsResponse, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/autoparts/search/page/all")
    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<List<Autopart>> searchAllPartsWithPage(@RequestBody SearchCarrier searchCarrier) {

        LOG.info(searchCarrier.year + " " + searchCarrier.make + " " + searchCarrier.model + " "
                + searchCarrier.partName + " "
                + searchCarrier.partNumber + " " + searchCarrier.zipcode);

        List<Autopart> autoParts = new ArrayList<Autopart>();
        int searchCount = 0;
        // searchCount = autoPartRepository
        // .countByPartNumberContainsOrTitleContainsOrDescriptionContainsAndCompanyIdAndPublishedAndArchivedAndStatus(
        // searchCarrier.partNumber, searchCarrier.partNumber, searchCarrier.partNumber,
        // searchCarrier.companyId, searchCarrier.published, searchCarrier.archived,
        // searchCarrier.status);

        searchCount = autoPartRepository
                .count(
                        searchCarrier.partNumber, searchCarrier.partNumber, searchCarrier.partNumber,
                        searchCarrier.partNumber,
                        searchCarrier.companyId, searchCarrier.published, searchCarrier.archived,
                        searchCarrier.status);

        // autoParts = autoPartRepository
        // .findByPartNumberContainsOrTitleContainsOrDescriptionContainsAndCompanyIdAndPublishedAndArchivedAndStatus(
        // searchCarrier.partNumber, searchCarrier.partNumber, searchCarrier.partNumber,
        // searchCarrier.companyId, searchCarrier.published, searchCarrier.archived,
        // searchCarrier.status,
        // Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
        autoParts = autoPartRepository
                .search(
                        searchCarrier.partNumber, searchCarrier.partNumber, searchCarrier.partNumber,
                        searchCarrier.partNumber,
                        searchCarrier.companyId, searchCarrier.published, searchCarrier.archived,
                        searchCarrier.status,
                        Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
        for (Autopart autopart : autoParts) {
            autopart.searchCount = searchCount;
        }

        this.getAddtionalInfo(autoParts, null);

        return new ResponseEntity<>(autoParts, HttpStatus.OK);
    }

    @PostMapping("/autoparts/search/page/all/user")
    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<List<Autopart>> searchAllPartsWithPageUser(@RequestBody SearchCarrier searchCarrier) {

        LOG.info(searchCarrier.year + " " + searchCarrier.make + " " + searchCarrier.model + " "
                + searchCarrier.partName + " "
                + searchCarrier.partNumber + " " + searchCarrier.zipcode);

        List<Autopart> autoParts = new ArrayList<Autopart>();
        int searchCount = 0;
        // searchCount = autoPartRepository
        // .countByPartNumberContainsOrTitleContainsOrDescriptionContainsAndCompanyIdAndPublishedAndArchivedAndStatus(
        // searchCarrier.partNumber, searchCarrier.partNumber, searchCarrier.partNumber,
        // searchCarrier.companyId, searchCarrier.published, searchCarrier.archived,
        // searchCarrier.status);

        searchCount = autoPartRepository
                .countUser(
                        searchCarrier.partNumber, searchCarrier.partNumber, searchCarrier.partNumber,
                        searchCarrier.partNumber,
                        searchCarrier.userId, searchCarrier.published, searchCarrier.archived,
                        searchCarrier.status);

        // autoParts = autoPartRepository
        // .findByPartNumberContainsOrTitleContainsOrDescriptionContainsAndCompanyIdAndPublishedAndArchivedAndStatus(
        // searchCarrier.partNumber, searchCarrier.partNumber, searchCarrier.partNumber,
        // searchCarrier.companyId, searchCarrier.published, searchCarrier.archived,
        // searchCarrier.status,
        // Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
        autoParts = autoPartRepository
                .searchUser(
                        searchCarrier.partNumber, searchCarrier.partNumber, searchCarrier.partNumber,
                        searchCarrier.partNumber,
                        searchCarrier.userId, searchCarrier.published, searchCarrier.archived,
                        searchCarrier.status,
                        Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
        for (Autopart autopart : autoParts) {
            autopart.searchCount = searchCount;
        }

        this.getAddtionalInfo(autoParts, null);

        return new ResponseEntity<>(autoParts, HttpStatus.OK);
    }

    @PostMapping("/autoparts/search")
    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<List<Autopart>> searchAllParts(@RequestBody SearchCarrier searchCarrier) {

        LOG.info(searchCarrier.year + " " + searchCarrier.make + " " + searchCarrier.model + " "
                + searchCarrier.partName + " "
                + searchCarrier.partNumber + " " + searchCarrier.zipcode);

        List<Autopart> autoParts = new ArrayList<Autopart>();
        if (searchCarrier.archived == true) {
            autoParts = autoPartRepository
                    .searchWithArchivedFlag(
                            searchCarrier.partNumber, searchCarrier.partNumber, searchCarrier.partNumber,
                            searchCarrier.companyId, searchCarrier.archived);

        } else if (searchCarrier.status > 0) {
            autoParts = autoPartRepository
                    .searchInventory(
                            searchCarrier.partNumber, searchCarrier.partNumber, searchCarrier.partNumber,
                            searchCarrier.companyId, searchCarrier.archived,
                            searchCarrier.status);
        } else if (!searchCarrier.partNumber.equals("")) {
            autoParts = autoPartRepository
                    .searchWithArchivedFlag(
                            searchCarrier.partNumber, searchCarrier.partNumber, searchCarrier.partNumber,
                            searchCarrier.companyId, searchCarrier.archived);
        } else {

            switch (searchCarrier.type) {
                case 4: {

                    List<Autopart> autoParts0 = this.autoPartRepository.findByCompanyIdAndArchivedAndYearAndStatus(
                            searchCarrier.companyId, false, searchCarrier.year, 0);
                    autoParts.addAll(autoParts0);
                    List<Autopart> autoParts1 = this.autoPartRepository.findByCompanyIdAndArchivedAndYearAndStatus(
                            searchCarrier.companyId, false, searchCarrier.year, 1);
                    autoParts.addAll(autoParts1);
                    List<Autopart> autoParts2 = this.autoPartRepository.findByCompanyIdAndArchivedAndYearAndStatus(
                            searchCarrier.companyId, false, searchCarrier.year, 2);
                    autoParts.addAll(autoParts2);

                }
                    break;
                case 3: {
                    List<Autopart> autoParts0 = this.autoPartRepository
                            .findByCompanyIdAndArchivedAndYearAndMakeAndStatus(
                                    searchCarrier.companyId, false, searchCarrier.year, searchCarrier.make, 0);
                    autoParts.addAll(autoParts0);
                    List<Autopart> autoParts1 = this.autoPartRepository
                            .findByCompanyIdAndArchivedAndYearAndMakeAndStatus(
                                    searchCarrier.companyId, false, searchCarrier.year, searchCarrier.make, 1);
                    autoParts.addAll(autoParts1);
                    List<Autopart> autoParts2 = this.autoPartRepository
                            .findByCompanyIdAndArchivedAndYearAndMakeAndStatus(
                                    searchCarrier.companyId, false, searchCarrier.year, searchCarrier.make, 2);
                    autoParts.addAll(autoParts2);
                }
                    break;

                case 2: {
                    List<Autopart> autoParts0 = this.autoPartRepository
                            .findByCompanyIdAndArchivedAndYearAndMakeAndModelAndStatus(
                                    searchCarrier.companyId, false, searchCarrier.year, searchCarrier.make,
                                    searchCarrier.model, 0);
                    autoParts.addAll(autoParts0);
                    List<Autopart> autoParts1 = this.autoPartRepository
                            .findByCompanyIdAndArchivedAndYearAndMakeAndModelAndStatus(
                                    searchCarrier.companyId, false, searchCarrier.year, searchCarrier.make,
                                    searchCarrier.model, 1);
                    autoParts.addAll(autoParts1);
                    List<Autopart> autoParts2 = this.autoPartRepository
                            .findByCompanyIdAndArchivedAndYearAndMakeAndModelAndStatus(
                                    searchCarrier.companyId, false, searchCarrier.year, searchCarrier.make,
                                    searchCarrier.model, 2);
                    autoParts.addAll(autoParts2);

                }
                    break;
            }

        }
        if (autoParts.isEmpty()) {
            return new ResponseEntity<>(autoParts, HttpStatus.OK);
        }

        if (searchCarrier.zipcode != null) {

            Optional<ZipCode> zipCodeOptional = this.zipCodeRepository.findByZip(searchCarrier.zipcode);
            if (zipCodeOptional.isPresent()) {
                this.getAddtionalInfo(autoParts, zipCodeOptional.get());
            } else {

                throw new ResourceNotFoundException("Zip code [" + searchCarrier.zipcode + "] is not valid");

            }
        } else {
            this.getAddtionalInfo(autoParts, null);
        }

        return new ResponseEntity<>(autoParts, HttpStatus.OK);

    }

    @PostMapping("/autoparts/search/status/page")
    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<List<Autopart>> searchAllPartsStatusPaging(@RequestBody SearchCarrier searchCarrier) {
        List<Autopart> autoParts = new ArrayList<Autopart>();
        int serachCount = 0;
        if (searchCarrier.archived == true) {
            autoParts = autoPartRepository.findByCompanyIdAndArchivedOrderByIdDesc(searchCarrier.companyId,
                    true,
                    Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));

            serachCount = autoPartRepository.countByCompanyIdAndArchived(searchCarrier.companyId,
                    true);
        } else {
            autoParts = autoPartRepository.findByCompanyIdAndArchivedAndStatusOrderByIdDesc(searchCarrier.companyId,
                    false,
                    searchCarrier.status,
                    Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));

            serachCount = autoPartRepository.countByCompanyIdAndArchivedAndStatus(searchCarrier.companyId,
                    false, searchCarrier.status);
        }

        for (Autopart autopart : autoParts) {
            autopart.searchCount = serachCount;

        }

        this.getAddtionalInfo(autoParts, null);
        // =======
        return new ResponseEntity<>(autoParts, HttpStatus.OK);
    }

    @PostMapping("/autoparts/search/page")
    public ResponseEntity<List<Autopart>> searchAllPartsPaging(@RequestBody SearchCarrier searchCarrier) {

        LOG.info(" Mode: [" + searchCarrier.mode + "] " + searchCarrier.year + " " + searchCarrier.make + " "
                + searchCarrier.model + " "
                + searchCarrier.partName + " "
                + searchCarrier.partNumber + " " + searchCarrier.zipcode);

        int serachCount = 0;

        List<Autopart> autoParts = new ArrayList<Autopart>();
        if (searchCarrier.mode == 0) {

            serachCount = autoPartRepository.countByArchivedAndPublishedAndStatusOrderByIdDesc(false, true, 2);
            autoParts = autoPartRepository.findByArchivedAndPublishedAndStatusOrderByIdDesc(false, true, 2,
                    Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
            for (Autopart autopart : autoParts) {
                autopart.searchCount = serachCount;
            }
            if (searchCarrier.zipcode != null) {
                Optional<ZipCode> zipCodeOptional = this.zipCodeRepository.findByZip(searchCarrier.zipcode);
                if (zipCodeOptional.isPresent()) {
                    this.getAddtionalInfo(autoParts, zipCodeOptional.get());
                } else {
                    this.getAddtionalInfo(autoParts, null);
                }
            }

        } else if (searchCarrier.mode == 9) {

            serachCount = autoPartRepository.countByArchivedAndPublishedAndStatusOrderByIdDesc(false, true, 2);
            autoParts = autoPartRepository.findByArchivedAndPublishedAndStatusOrderByIdDesc(false, true, 2,
                    Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
            for (Autopart autopart : autoParts) {
                autopart.searchCount = serachCount;
                if (autopart.getToken() == null) {
                    String randomCode = UUID.randomUUID().toString();
                    autopart.setToken(randomCode);
                    this.autoPartRepository.save(autopart);
                }
            }
            if (searchCarrier.zipcode != null) {
                Optional<ZipCode> zipCodeOptional = this.zipCodeRepository.findByZip(searchCarrier.zipcode);
                if (zipCodeOptional.isPresent()) {
                    this.getAddtionalInfo(autoParts, zipCodeOptional.get());
                } else {
                    this.getAddtionalInfo(autoParts, null);
                }
            }

        } else if (searchCarrier.mode == 5) {
            if (searchCarrier.partName != null && searchCarrier.partName != "") {
                searchCarrier.partName = searchCarrier.partName.toUpperCase().trim();

                String[] partNames = searchCarrier.partName.split(" ");
                if (partNames.length > 1) {

                    // '(?=.*HONDA)(?=.*CIVIC)(?=.*2012)'
                    List<String> words = Arrays.asList(partNames);
                    String queryParam = words.stream()
                            .filter(s -> !s.trim().isEmpty()) // Exclude empty or whitespace-only strings
                            .map(s -> "(?=.*" + s + ")")
                            .collect(Collectors.joining());

                    System.out.println(queryParam);

                    serachCount = autoPartRepository.coutPartNameIn(
                            queryParam, 2, false,
                            true);
                    autoParts = autoPartRepository.findPartNameIn(
                            queryParam,
                            2, false, true,
                            Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
                } else {

                    serachCount = autoPartRepository.countByTitleContainsIgnoreCaseAndStatusAndArchivedAndPublished(
                            searchCarrier.partName, 2, false,
                            true);
                    autoParts = autoPartRepository.findByTitleContainsIgnoreCaseAndStatusAndArchivedAndPublished(
                            searchCarrier.partName,
                            2, false, true,
                            Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));

                }

                for (Autopart autopart : autoParts) {
                    autopart.searchCount = serachCount;
                }
                if (searchCarrier.zipcode != null) {
                    Optional<ZipCode> zipCodeOptional = this.zipCodeRepository.findByZip(searchCarrier.zipcode);
                    if (zipCodeOptional.isPresent()) {
                        this.getAddtionalInfo(autoParts, zipCodeOptional.get());
                    } else {
                        this.getAddtionalInfo(autoParts, null);
                    }
                }
            }

        } else if (searchCarrier.mode == 1 && !searchCarrier.partNumber.equals("")) {

            if (searchCarrier.pageNumber >= 0 && searchCarrier.pageSize > 1) {

                if (searchCarrier.withFitment == true) {
                    serachCount = autoPartRepository.countWithFitment(
                            searchCarrier.partNumber,
                            2, false, true);
                    autoParts = autoPartRepository.findWithFitment(
                            searchCarrier.partNumber,
                            2, false, true,
                            Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
                } else {
                    // serachCount =
                    // autoPartRepository.countByPartNumberContainsAndStatusAndArchivedAndPublished(
                    // searchCarrier.partNumber,
                    // 2, false, true);
                    // autoParts =
                    // autoPartRepository.findByPartNumberContainsAndStatusAndArchivedAndPublished(
                    // searchCarrier.partNumber,
                    // 2, false, true,
                    // Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));

                    serachCount = autoPartRepository.countPartNumberOrStockNumber(
                            searchCarrier.partNumber, searchCarrier.partNumber, true, false, 2);
                    autoParts = autoPartRepository.searchPartNumberOrStockerNumber(
                            searchCarrier.partNumber, searchCarrier.partNumber, true, false,
                            2,
                            Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));

                    // serachCount =
                    // autoPartRepository.countByPartNumberAndStatusAndArchivedAndPublished(
                    // searchCarrier.partNumber,
                    // 2, false, true);
                    // autoParts =
                    // autoPartRepository.findByPartNumberAndStatusAndArchivedAndPublished(
                    // searchCarrier.partNumber,
                    // 2, false, true,
                    // Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
                }

                for (Autopart autopart : autoParts) {
                    autopart.searchCount = serachCount;
                }

                if (searchCarrier.zipcode != null) {
                    Optional<ZipCode> zipCodeOptional = this.zipCodeRepository.findByZip(searchCarrier.zipcode);
                    if (zipCodeOptional.isPresent()) {
                        this.getAddtionalInfo(autoParts, zipCodeOptional.get());
                    } else {
                        this.getAddtionalInfo(autoParts, null);
                    }
                }
            }

        } else if (searchCarrier.mode == 1 && searchCarrier.partNumber.equals("")) {

            // search partName
            if (searchCarrier.pageNumber >= 0 && searchCarrier.pageSize > 1) {

                String[] partNames = searchCarrier.partName.split(" ");

                if (partNames.length > 1) {

                    // '(?=.*HONDA)(?=.*CIVIC)(?=.*2012)'
                    List<String> words = Arrays.asList(partNames);
                    String queryParam = words.stream()
                            .filter(s -> !s.trim().isEmpty()) // Exclude empty or whitespace-only strings
                            .map(s -> "(?=.*" + s + ")")
                            .collect(Collectors.joining());

                    System.out.println(queryParam);

                    serachCount = autoPartRepository.countPartNameOrDescriptionRLike(
                            queryParam, queryParam, true, false, 2);
                    autoParts = autoPartRepository.searchPartNameOrDescriptionRLike(
                            queryParam, queryParam, true, false,
                            2,
                            Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));

                } else {

                    serachCount = autoPartRepository.countPartNameOrDescription(
                            searchCarrier.partName, searchCarrier.partName, true, false, 2);
                    autoParts = autoPartRepository.searchPartNameOrDescription(
                            searchCarrier.partName, searchCarrier.partName, true, false,
                            2,
                            Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));

                }
                for (Autopart autopart : autoParts) {
                    autopart.searchCount = serachCount;
                }

                if (searchCarrier.zipcode != null) {
                    Optional<ZipCode> zipCodeOptional = this.zipCodeRepository.findByZip(searchCarrier.zipcode);
                    if (zipCodeOptional.isPresent()) {
                        this.getAddtionalInfo(autoParts, zipCodeOptional.get());
                    } else {
                        this.getAddtionalInfo(autoParts, null);
                    }
                }
            }

        } else {

            if (searchCarrier.pageNumber >= 0 && searchCarrier.pageSize > 1) {
                if (searchCarrier.mode == 2) {
                    if (searchCarrier.withFitment == true) {
                        serachCount = autoPartRepository
                                .countWithFitmentYearMakeModel(
                                        searchCarrier.year,
                                        searchCarrier.make, searchCarrier.model, searchCarrier.partNumber, 2, false,
                                        true);

                        autoParts = autoPartRepository
                                .findWithFitmentYearMakeModel(
                                        searchCarrier.year,
                                        searchCarrier.make, searchCarrier.model, searchCarrier.partNumber, 2, false,
                                        true,
                                        Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));

                    } else {
                        serachCount = autoPartRepository
                                .countByYearAndMakeAndModelAndPartNumberAndStatusAndArchivedAndPublished(
                                        searchCarrier.year,
                                        searchCarrier.make, searchCarrier.model, searchCarrier.partNumber, 2, false,
                                        true);

                        autoParts = autoPartRepository
                                .findByYearAndMakeAndModelAndPartNumberAndStatusAndArchivedAndPublished(
                                        searchCarrier.year,
                                        searchCarrier.make, searchCarrier.model, searchCarrier.partNumber, 2, false,
                                        true,
                                        Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
                    }

                } else {
                    // title only
                    if (searchCarrier.year == 0 && searchCarrier.make.equals("") && searchCarrier.model.equals("")) {

                        if (searchCarrier.location == 0) {
                            serachCount = autoPartRepository
                                    .countByTitleContainsAndStatusAndArchivedAndPublished(
                                            searchCarrier.partName, 2, false,
                                            true);

                            autoParts = autoPartRepository
                                    .findByTitleContainsAndStatusAndArchivedAndPublishedOrderByIdDesc(
                                            searchCarrier.partName, 2, false, true,
                                            Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
                        } else {
                            serachCount = autoPartRepository
                                    .countByLocationAndTitleContainsAndStatusAndArchivedAndPublished(
                                            searchCarrier.location,
                                            searchCarrier.partName, 2, false,
                                            true);

                            autoParts = autoPartRepository
                                    .findByLocationAndTitleContainsAndStatusAndArchivedAndPublishedOrderByIdDesc(
                                            searchCarrier.location,
                                            searchCarrier.partName, 2, false, true,
                                            Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
                        }
                        // make only
                    } else if (searchCarrier.year == 0 && !searchCarrier.make.equals("")
                            && searchCarrier.model.equals("") && searchCarrier.partName.equals("")) {

                        if (searchCarrier.location == 0) {
                            serachCount = autoPartRepository
                                    .countByMakeContainsAndStatusAndArchivedAndPublished(
                                            searchCarrier.make, 2, false,
                                            true);

                            autoParts = autoPartRepository
                                    .findByMakeContainsAndStatusAndArchivedAndPublishedOrderByIdDesc(
                                            searchCarrier.make, 2, false, true,
                                            Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
                        } else {
                            serachCount = autoPartRepository
                                    .countByLocationAndMakeContainsAndStatusAndArchivedAndPublished(
                                            searchCarrier.location,
                                            searchCarrier.make, 2, false,
                                            true);

                            autoParts = autoPartRepository
                                    .findByLocationAndMakeContainsAndStatusAndArchivedAndPublishedOrderByIdDesc(
                                            searchCarrier.location,
                                            searchCarrier.make, 2, false, true,
                                            Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
                        }
                        // make and model only
                    } else if (searchCarrier.year == 0 && !searchCarrier.make.equals("")
                            && !searchCarrier.model.equals("") && searchCarrier.partName.equals("")) {

                        if (searchCarrier.location == 0) {
                            serachCount = autoPartRepository
                                    .countByMakeAndModelContainsAndStatusAndArchivedAndPublished(
                                            searchCarrier.make, searchCarrier.model, 2, false,
                                            true);

                            autoParts = autoPartRepository
                                    .findByMakeAndModelContainsAndStatusAndArchivedAndPublishedOrderByIdDesc(
                                            searchCarrier.make, searchCarrier.model, 2, false, true,
                                            Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
                        } else {
                            serachCount = autoPartRepository
                                    .countByLocationAndMakeAndModelContainsAndStatusAndArchivedAndPublished(
                                            searchCarrier.location,
                                            searchCarrier.make, searchCarrier.model, 2, false,
                                            true);

                            autoParts = autoPartRepository
                                    .findByLocationAndMakeAndModelContainsAndStatusAndArchivedAndPublishedOrderByIdDesc(
                                            searchCarrier.location,
                                            searchCarrier.make, searchCarrier.model, 2, false, true,
                                            Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
                        }
                        // year only
                    } else if (searchCarrier.year >= 0 && searchCarrier.make.equals("")
                            && searchCarrier.model.equals("") && searchCarrier.partName.equals("")) {

                        if (searchCarrier.location == 0) {
                            serachCount = autoPartRepository
                                    .countByYearAndStatusAndArchivedAndPublished(
                                            searchCarrier.year,
                                            2, false,
                                            true);

                            autoParts = autoPartRepository
                                    .findByYearAndStatusAndArchivedAndPublishedOrderByIdDesc(
                                            searchCarrier.year,
                                            2, false, true,
                                            Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
                        } else {
                            serachCount = autoPartRepository
                                    .countByLocationAndYearAndStatusAndArchivedAndPublished(searchCarrier.location,
                                            searchCarrier.year,
                                            2, false,
                                            true);

                            autoParts = autoPartRepository
                                    .findByLocationAndYearAndStatusAndArchivedAndPublishedOrderByIdDesc(
                                            searchCarrier.location,
                                            searchCarrier.year,
                                            2, false, true,
                                            Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
                        }
                        // year and make only
                    } else if (searchCarrier.year >= 0 && !searchCarrier.make.equals("")
                            && searchCarrier.model.equals("") && searchCarrier.partName.equals("")) {

                        if (searchCarrier.location == 0) {
                            serachCount = autoPartRepository
                                    .countByYearAndMakeAndStatusAndArchivedAndPublished(
                                            searchCarrier.year, searchCarrier.make,
                                            2, false,
                                            true);

                            autoParts = autoPartRepository
                                    .findByYearAndMakeAndStatusAndArchivedAndPublishedOrderByIdDesc(
                                            searchCarrier.year, searchCarrier.make,
                                            2, false, true,
                                            Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
                        } else {
                            serachCount = autoPartRepository
                                    .countByLocationAndYearAndMakeAndStatusAndArchivedAndPublished(
                                            searchCarrier.location,
                                            searchCarrier.year, searchCarrier.make,
                                            2, false,
                                            true);

                            autoParts = autoPartRepository
                                    .findByLocationAndYearAndMakeAndStatusAndArchivedAndPublishedOrderByIdDesc(
                                            searchCarrier.location,
                                            searchCarrier.year, searchCarrier.make,
                                            2, false, true,
                                            Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
                        }
                        // year and title only
                    } else if (searchCarrier.year >= 0 && searchCarrier.make.equals("")
                            && searchCarrier.model.equals("") && !searchCarrier.partName.equals("")) {
                        if (searchCarrier.location == 0) {
                            serachCount = autoPartRepository
                                    .countByYearAndTitleContainsAndStatusAndArchivedAndPublished(
                                            searchCarrier.year, searchCarrier.partName,
                                            2, false,
                                            true);

                            autoParts = autoPartRepository
                                    .findByYearAndTitleContainsAndStatusAndArchivedAndPublishedOrderByIdDesc(
                                            searchCarrier.year, searchCarrier.partName,
                                            2, false, true,
                                            Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
                        } else {
                            serachCount = autoPartRepository
                                    .countByLocationAndYearAndTitleContainsAndStatusAndArchivedAndPublished(
                                            searchCarrier.location,
                                            searchCarrier.year, searchCarrier.partName,
                                            2, false,
                                            true);

                            autoParts = autoPartRepository
                                    .findByLocationAndYearAndTitleContainsAndStatusAndArchivedAndPublishedOrderByIdDesc(
                                            searchCarrier.location,
                                            searchCarrier.year, searchCarrier.partName,
                                            2, false, true,
                                            Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
                        }
                        // make and title only
                    } else if (searchCarrier.year == 0 && !searchCarrier.make.equals("")
                            && searchCarrier.model.equals("") && !searchCarrier.partName.equals("")) {

                        if (searchCarrier.location == 0) {
                            serachCount = autoPartRepository
                                    .countByMakeAndTitleContainsAndStatusAndArchivedAndPublished(
                                            searchCarrier.make, searchCarrier.partName,
                                            2, false,
                                            true);

                            autoParts = autoPartRepository
                                    .findByMakeAndTitleContainsAndStatusAndArchivedAndPublishedOrderByIdDesc(
                                            searchCarrier.make, searchCarrier.partName,
                                            2, false, true,
                                            Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
                        } else {
                            serachCount = autoPartRepository
                                    .countByLocationAndMakeAndTitleContainsAndStatusAndArchivedAndPublished(
                                            searchCarrier.location,
                                            searchCarrier.make, searchCarrier.partName,
                                            2, false,
                                            true);

                            autoParts = autoPartRepository
                                    .findByLocationAndMakeAndTitleContainsAndStatusAndArchivedAndPublishedOrderByIdDesc(
                                            searchCarrier.location,
                                            searchCarrier.make, searchCarrier.partName,
                                            2, false, true,
                                            Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
                        }
                        // year and make and title
                    } else if (searchCarrier.year >= 0 && !searchCarrier.make.equals("")
                            && searchCarrier.model.equals("") && !searchCarrier.partName.equals("")) {
                        if (searchCarrier.location == 0) {
                            serachCount = autoPartRepository
                                    .countByYearAndMakeAndTitleContainsAndStatusAndArchivedAndPublished(
                                            searchCarrier.year, searchCarrier.make, searchCarrier.partName,
                                            2, false,
                                            true);

                            autoParts = autoPartRepository
                                    .findByYearAndMakeAndTitleContainsAndStatusAndArchivedAndPublishedOrderByIdDesc(
                                            searchCarrier.year, searchCarrier.make, searchCarrier.partName,
                                            2, false, true,
                                            Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
                        } else {
                            serachCount = autoPartRepository
                                    .countByLocationAndYearAndMakeAndTitleContainsAndStatusAndArchivedAndPublished(
                                            searchCarrier.location,
                                            searchCarrier.year, searchCarrier.make, searchCarrier.partName,
                                            2, false,
                                            true);

                            autoParts = autoPartRepository
                                    .findByLocationAndYearAndMakeAndTitleContainsAndStatusAndArchivedAndPublishedOrderByIdDesc(
                                            searchCarrier.location,
                                            searchCarrier.year, searchCarrier.make, searchCarrier.partName,
                                            2, false, true,
                                            Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
                        }

                        // maek and model and title
                    } else if (searchCarrier.year == 0 && !searchCarrier.make.equals("")
                            && !searchCarrier.model.equals("") && !searchCarrier.partName.equals("")) {

                        if (searchCarrier.location == 0) {
                            serachCount = autoPartRepository
                                    .countByMakeAndModelAndTitleContainsAndStatusAndArchivedAndPublished(
                                            searchCarrier.make, searchCarrier.model, searchCarrier.partName,
                                            2, false,
                                            true);

                            autoParts = autoPartRepository
                                    .findByMakeAndModelAndTitleContainsAndStatusAndArchivedAndPublishedOrderByIdDesc(
                                            searchCarrier.make, searchCarrier.model, searchCarrier.partName,
                                            2, false, true,
                                            Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
                        } else {
                            serachCount = autoPartRepository
                                    .countByLocationAndMakeAndModelAndTitleContainsAndStatusAndArchivedAndPublished(
                                            searchCarrier.location,
                                            searchCarrier.make, searchCarrier.model, searchCarrier.partName,
                                            2, false,
                                            true);

                            autoParts = autoPartRepository
                                    .findByLocationAndMakeAndModelAndTitleContainsAndStatusAndArchivedAndPublishedOrderByIdDesc(
                                            searchCarrier.location,
                                            searchCarrier.make, searchCarrier.model, searchCarrier.partName,
                                            2, false, true,
                                            Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
                        }

                    } else {

                        if (searchCarrier.location == 0) {
                            serachCount = autoPartRepository
                                    .countByYearAndMakeAndModelAndTitleContainsAndStatusAndArchivedAndPublished(
                                            searchCarrier.year,
                                            searchCarrier.make, searchCarrier.model, searchCarrier.partName, 2, false,
                                            true);

                            autoParts = autoPartRepository
                                    .findByYearAndMakeAndModelAndTitleContainsAndStatusAndArchivedAndPublishedOrderByIdDesc(
                                            searchCarrier.year,
                                            searchCarrier.make, searchCarrier.model, searchCarrier.partName, 2, false,
                                            true,
                                            Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
                        } else {
                            serachCount = autoPartRepository
                                    .countByLocationAndYearAndMakeAndModelAndTitleContainsAndStatusAndArchivedAndPublished(
                                            searchCarrier.location,
                                            searchCarrier.year,
                                            searchCarrier.make, searchCarrier.model, searchCarrier.partName, 2, false,
                                            true);

                            autoParts = autoPartRepository
                                    .findByLocationAndYearAndMakeAndModelAndTitleContainsAndStatusAndArchivedAndPublishedOrderByIdDesc(
                                            searchCarrier.location,
                                            searchCarrier.year,
                                            searchCarrier.make, searchCarrier.model, searchCarrier.partName, 2, false,
                                            true,
                                            Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
                        }
                    }
                }

                for (Autopart autopart : autoParts) {
                    autopart.searchCount = serachCount;
                }

                if (searchCarrier.zipcode != null) {
                    Optional<ZipCode> zipCodeOptional = this.zipCodeRepository.findByZip(searchCarrier.zipcode);
                    if (zipCodeOptional.isPresent()) {
                        this.getAddtionalInfo(autoParts, zipCodeOptional.get());
                    } else {
                        this.getAddtionalInfo(autoParts, null);
                    }
                }

            } else {
                autoParts = autoPartRepository.findByYearAndMakeAndModelAndPartNameAndStatus(searchCarrier.year,
                        searchCarrier.make, searchCarrier.model, searchCarrier.partName, 1);
            }
        }
        if (autoParts.isEmpty()) {
            return new ResponseEntity<>(autoParts, HttpStatus.OK);
        }

        if (searchCarrier.zipcode != null) {

            Optional<ZipCode> zipCodeOptional = this.zipCodeRepository.findByZip(searchCarrier.zipcode);
            if (zipCodeOptional.isPresent()) {
                this.getAddtionalInfo(autoParts, zipCodeOptional.get());
            } else {

                throw new ResourceNotFoundException("Zip code [" + searchCarrier.zipcode + "] is not valid");

            }
        } else {
            this.getAddtionalInfo(autoParts, null);
        }

        return new ResponseEntity<>(autoParts, HttpStatus.OK);

    }

    public long haversine(
            double lat1, double lng1, double lat2, double lng2) {
        int r = 6371; // average radius of the earth in km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lng2 - lng1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                        * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        double d = r * c;
        d = d / 1.609; // to miles

        return Math.round(d);
    }

    private void getAddtionalInfoBackUp(List<Autopart> autoParts, ZipCode zipCode) {

        for (int i = 0; i < autoParts.size(); i++) {
            Optional<User> userOptional = this.userRepository.findById(autoParts.get(i).getUserId());
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                if (user.getBussinessname() != null) {
                    autoParts.get(i).setBussinessName(user.getBussinessname());
                }

                if (user.getBussinessUrl() != null) {
                    autoParts.get(i).setBussinessUrl(user.getBussinessUrl());
                }

                for (Address address : user.getAddresses()) {
                    if (address.getName().equals(EAddressType.ADDRESS_TYPE_DEFAULT)
                            || address.getName().equals(EAddressType.ADDRESS_TYPE_SHOP)) {
                        autoParts.get(i).setStreet(address.getStreet());
                        autoParts.get(i).setCity(address.getCity());
                        autoParts.get(i).setState(address.getState());
                        autoParts.get(i).setZip(address.getZip());
                        autoParts.get(i).setPhone(user.getPhone());
                        autoParts.get(i).setLat(address.getLat());
                        autoParts.get(i).setLng(address.getLng());

                        if (zipCode != null) {
                            autoParts.get(i).setDistance(
                                    this.haversine(zipCode.getLat(), zipCode.getLng(), address.getLat(),
                                            address.getLng()));
                        }
                    }
                }

            }

            // set showInSearchImageId
            int counter = 0;
            for (ImageModel imageModel : autoParts.get(i).getImageModels()) {

                // just set first one only
                if (counter == 0) {
                    autoParts.get(i).showInSearchImageId = imageModel.getId();
                }

                if (imageModel.isShowInSearch()) {
                    autoParts.get(i).showInSearchImageId = imageModel.getId();
                }
                counter++;
            }

        }

    }

    private void getAddtionalInfo(List<Autopart> autoParts, ZipCode zipCode) {

        for (int i = 0; i < autoParts.size(); i++) {
            if (autoParts.get(i).getCompanyId() != null && autoParts.get(i).getCompanyId() != 0) {
                Optional<Company> comapanyOptional = this.companyRepository.findById(autoParts.get(i).getCompanyId());
                if (comapanyOptional.isPresent()) {
                    Company company = comapanyOptional.get();
                    if (company.getName() != null) {
                        autoParts.get(i).setBussinessName(company.getName());
                    }

                    if (company.getUrl() != null) {
                        autoParts.get(i).setBussinessUrl(company.getUrl());
                    }
                    autoParts.get(i).setStreet(company.getStreet());
                    autoParts.get(i).setCity(company.getCity());
                    autoParts.get(i).setState(company.getState());
                    autoParts.get(i).setZip(company.getZip());
                    autoParts.get(i).setPhone(company.getPhone());

                    if (autoParts.get(i).isFitmented() == true) {
                        autoParts.get(i).fitments = this.fitmentRepository.findByAutopartId(autoParts.get(i).getId());
                    }

                    Optional<ZipCode> zipCodeOptional = this.zipCodeRepository.findByZip(company.getZip());
                    if (zipCodeOptional.isPresent()) {
                        autoParts.get(i).setLat(zipCodeOptional.get().getLat());
                        autoParts.get(i).setLng(zipCodeOptional.get().getLng());

                        if (zipCode != null) {
                            autoParts.get(i).setDistance(
                                    this.haversine(zipCode.getLat(), zipCode.getLng(), zipCodeOptional.get().getLat(),
                                            zipCodeOptional.get().getLng()));
                        }
                    }

                }
            } else {

                Optional<User> userOptional = this.userRepository.findById(autoParts.get(i).getUserId());
                if (userOptional.isPresent()) {
                    User user = userOptional.get();
                    if (user.getBussinessname() != null) {
                        autoParts.get(i).setBussinessName(user.getBussinessname());
                    }

                    if (user.getBussinessUrl() != null) {
                        autoParts.get(i).setBussinessUrl(user.getBussinessUrl());
                    }

                    for (Address address : user.getAddresses()) {
                        if (address.getName().equals(EAddressType.ADDRESS_TYPE_DEFAULT)
                                || address.getName().equals(EAddressType.ADDRESS_TYPE_SHOP)) {
                            autoParts.get(i).setStreet(address.getStreet());
                            autoParts.get(i).setCity(address.getCity());
                            autoParts.get(i).setState(address.getState());
                            autoParts.get(i).setZip(address.getZip());
                            autoParts.get(i).setPhone(user.getPhone());
                            autoParts.get(i).setLat(address.getLat());
                            autoParts.get(i).setLng(address.getLng());

                            if (zipCode != null) {
                                autoParts.get(i).setDistance(
                                        this.haversine(zipCode.getLat(), zipCode.getLng(), address.getLat(),
                                                address.getLng()));
                            }
                        }
                    }

                    if (autoParts.get(i).isFitmented() == true) {
                        autoParts.get(i).fitments = this.fitmentRepository.findByAutopartId(autoParts.get(i).getId());
                    }

                }

            }

            // set showInSearchImageId
            int counter = 0;
            for (ImageModel imageModel : autoParts.get(i).getImageModels()) {

                // just set first one only
                if (counter == 0) {
                    autoParts.get(i).showInSearchImageId = imageModel.getId();
                }

                if (imageModel.isShowInSearch()) {
                    autoParts.get(i).showInSearchImageId = imageModel.getId();
                }
                counter++;
            }

            if (autoParts.get(i).getStocknumber() == null) {
                autoParts.get(i).setStocknumber("");
            }

        }

    }

    private void getAddtionalInfoIndivisual(Autopart autopart, ZipCode zipCode) {

        if (autopart.getCompanyId() != null && autopart.getCompanyId() != 0) {
            Optional<Company> comapanyOptional = this.companyRepository.findById(autopart.getCompanyId());
            if (comapanyOptional.isPresent()) {
                Company company = comapanyOptional.get();
                if (company.getName() != null) {
                    autopart.setBussinessName(company.getName());
                }

                if (company.getUrl() != null) {
                    autopart.setBussinessUrl(company.getUrl());
                }

                autopart.setStreet(company.getStreet());
                autopart.setCity(company.getCity());
                autopart.setState(company.getState());
                autopart.setZip(company.getZip());
                autopart.setPhone(company.getPhone());

                if (autopart.isFitmented() == true) {
                    autopart.fitments = this.fitmentRepository.findByAutopartId(autopart.getId());
                }

                Optional<ZipCode> zipCodeOptional = this.zipCodeRepository.findByZip(company.getZip());
                if (zipCodeOptional.isPresent()) {
                    autopart.setLat(zipCodeOptional.get().getLat());
                    autopart.setLng(zipCodeOptional.get().getLng());

                    if (zipCode != null) {
                        autopart.setDistance(
                                this.haversine(zipCode.getLat(), zipCode.getLng(), zipCodeOptional.get().getLat(),
                                        zipCodeOptional.get().getLng()));
                    }
                }

            }
        } else {

            Optional<User> userOptional = this.userRepository.findById(autopart.getUserId());
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                if (user.getBussinessname() != null) {
                    autopart.setBussinessName(user.getBussinessname());
                }

                if (user.getBussinessUrl() != null) {
                    autopart.setBussinessUrl(user.getBussinessUrl());
                }

                for (Address address : user.getAddresses()) {
                    if (address.getName().equals(EAddressType.ADDRESS_TYPE_DEFAULT)
                            || address.getName().equals(EAddressType.ADDRESS_TYPE_SHOP)) {
                        autopart.setStreet(address.getStreet());
                        autopart.setCity(address.getCity());
                        autopart.setState(address.getState());
                        autopart.setZip(address.getZip());
                        autopart.setPhone(user.getPhone());
                        autopart.setLat(address.getLat());
                        autopart.setLng(address.getLng());

                        if (zipCode != null) {
                            autopart.setDistance(
                                    this.haversine(zipCode.getLat(), zipCode.getLng(), address.getLat(),
                                            address.getLng()));
                        }
                    }
                }

                if (autopart.isFitmented() == true) {
                    autopart.fitments = this.fitmentRepository.findByAutopartId(autopart.getId());
                }

            }

        }

        // set showInSearchImageId
        int counter = 0;
        for (ImageModel imageModel : autopart.getImageModels()) {

            // just set first one only
            if (counter == 0) {
                autopart.showInSearchImageId = imageModel.getId();
            }

            if (imageModel.isShowInSearch()) {
                autopart.showInSearchImageId = imageModel.getId();
            }
            counter++;
        }

        if (autopart.getStocknumber() == null) {
            autopart.setStocknumber("");
        }

    }

    @GetMapping("/autoparts/view/{id}")
    public void setAutopartViewCountById(@PathVariable("id") long id) {

        LOG.info("" + id);
        Optional<Autopart> autopartOptional = autoPartRepository.findById(id);

        Autopart autopart = new Autopart();

        if (autopartOptional.isPresent()) {
            autopart = autopartOptional.get();
            autopart.setViewCount(autopart.getViewCount() + 1);
            autopart = this.autoPartRepository.save(autopart);
        }

    }

    @GetMapping("/autoparts/employee/uuid/{uuid}")
    public ResponseEntity<Autopart> getAutopartByUuid(@PathVariable("uuid") String uuid) {
        Optional<Autopart> autopartOptional = autoPartRepository.findByToken(uuid);

        Autopart autopart = new Autopart();

        if (autopartOptional.isPresent()) {
            autopart = autopartOptional.get();
            this.getAddtionalInfoIndivisual(autopart, null);
            // Optional<User> userOptional =
            // this.userRepository.findById(autopart.getUserId());
            // if (userOptional.isPresent()) {

            // User user = userOptional.get();
            // if (user.getBussinessname() != null)
            // autopart.setBussinessName(user.getBussinessname());
            // if (user.getBussinessUrl() != null)
            // autopart.setBussinessUrl(user.getBussinessUrl());
            // for (Address address : user.getAddresses()) {
            // if (address.getName().equals(EAddressType.ADDRESS_TYPE_DEFAULT)
            // || address.getName().equals(EAddressType.ADDRESS_TYPE_SHOP)) {
            // autopart.setCity(address.getCity());
            // autopart.setState(address.getState());
            // autopart.setPhone(user.getPhone());
            // autopart.setZip(address.getZip());
            // autopart.setPhone(user.getPhone());
            // }
            // }
            // int counter = 0;
            // for (ImageModel imageModel : autopart.getImageModels()) {
            // // just set first one only
            // if (counter == 0)
            // autopart.showInSearchImageId = imageModel.getId();
            // if (imageModel.isShowInSearch()) {
            // autopart.showInSearchImageId = imageModel.getId();
            // }
            // counter++;
            // }
            // if (user.getBussinessname() != null)
            // autopart.setBussinessName(user.getBussinessname());
            // if (user.getBussinessUrl() != null)
            // autopart.setBussinessUrl(user.getBussinessUrl());
            // autopart.setViewCount(autopart.getViewCount() + 1);
            // autopart = this.autoPartRepository.save(autopart);
            // // get all fitments
            // if (autopart.isFitmented() == true) {
            // autopart.fitments =
            // this.fitmentRepository.findByAutopartId(autopart.getId());
            // }
            // }
            return new ResponseEntity<>(autopart, HttpStatus.OK);
        } else {

            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/autoparts/vehicle/{vehicleId}")
    public ResponseEntity<List<Autopart>> getAutopartByVehicleId(@PathVariable("vehicleId") long vehicleId) {

        List<Autopart> autoparts = new ArrayList<Autopart>();
        autoparts = autoPartRepository.findByVehicleId(vehicleId);

        for (Autopart autopart : autoparts) {
            this.getAddtionalInfoIndivisual(autopart, null);

            int counter = 0;
            for (ImageModel imageModel : autopart.getImageModels()) {

                // just set first one only
                if (counter == 0) {
                    autopart.showInSearchImageId = imageModel.getId();
                }

                if (imageModel.isShowInSearch()) {
                    autopart.showInSearchImageId = imageModel.getId();
                }
                counter++;
            }

        }

        // Optional<User> userOptional =
        // this.userRepository.findById(autopart.getUserId());
        // if (userOptional.isPresent()) {
        // User user = userOptional.get();
        // if (user.getBussinessname() != null)
        // autopart.setBussinessName(user.getBussinessname());
        // if (user.getBussinessUrl() != null)
        // autopart.setBussinessUrl(user.getBussinessUrl());
        // for (Address address : user.getAddresses()) {
        // if (address.getName().equals(EAddressType.ADDRESS_TYPE_DEFAULT)
        // || address.getName().equals(EAddressType.ADDRESS_TYPE_SHOP)) {
        // autopart.setCity(address.getCity());
        // autopart.setState(address.getState());
        // autopart.setPhone(user.getPhone());
        // autopart.setZip(address.getZip());
        // autopart.setPhone(user.getPhone());
        // }
        // }
        // int counter = 0;
        // for (ImageModel imageModel : autopart.getImageModels()) {
        // // just set first one only
        // if (counter == 0)
        // autopart.showInSearchImageId = imageModel.getId();
        // if (imageModel.isShowInSearch()) {
        // autopart.showInSearchImageId = imageModel.getId();
        // }
        // counter++;
        // }
        // if (user.getBussinessname() != null)
        // autopart.setBussinessName(user.getBussinessname());
        // if (user.getBussinessUrl() != null)
        // autopart.setBussinessUrl(user.getBussinessUrl());
        // autopart.setViewCount(autopart.getViewCount() + 1);
        // autopart = this.autoPartRepository.save(autopart);
        // // get all fitments
        // if (autopart.isFitmented() == true) {
        // autopart.fitments =
        // this.fitmentRepository.findByAutopartId(autopart.getId());
        // }
        // }
        return new ResponseEntity<>(autoparts, HttpStatus.OK);

    }

    @PostMapping("/autoparts/sequence/{vehicleId}")
    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<List<Autopart>> updateSequenceNumber(@PathVariable("vehicleId") long vehicleId,
            @RequestBody List<SequenceCarrier> sequenceCarriers) {

        LOG.info("updateSequenceNumber");
        List<Autopart> autoparts = this.autoPartRepository.findByVehicleId(vehicleId);

        for (Autopart autopart : autoparts) {

            for (SequenceCarrier sequenceCarrier : sequenceCarriers) {

                if (autopart.getId() == sequenceCarrier.getId()) {
                    autopart.setSequenceNumber(sequenceCarrier.getIndex());
                    autopart = this.autoPartRepository.save(autopart);

                    int counter = 0;
                    for (ImageModel imageModel : autopart.getImageModels()) {

                        // just set one and overide it later
                        if (counter == 0) {
                            autopart.showInSearchImageId = imageModel.getId();
                        }

                        if (imageModel.isShowInSearch()) {
                            autopart.showInSearchImageId = imageModel.getId();
                        }
                        counter++;
                    }

                }
            }
        }

        return new ResponseEntity<>(autoparts, HttpStatus.OK);

    }

    @PostMapping("/autoparts/sequence/purchaseorder/{purchaseOrderId}")
    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<List<Autopart>> updateSequenceNumberPurchaseOrder(
            @PathVariable("purchaseOrderId") long purchaseOrderId,
            @RequestBody List<SequenceCarrier> sequenceCarriers) {

        LOG.info("updateSequenceNumber");
        List<Autopart> autoparts = this.autoPartRepository.findByPurchaseOrderId(purchaseOrderId);

        for (Autopart autopart : autoparts) {

            for (SequenceCarrier sequenceCarrier : sequenceCarriers) {

                if (autopart.getId() == sequenceCarrier.getId()) {
                    autopart.setSequenceNumber(sequenceCarrier.getIndex());
                    autopart = this.autoPartRepository.save(autopart);

                    int counter = 0;
                    for (ImageModel imageModel : autopart.getImageModels()) {

                        // just set one and overide it later
                        if (counter == 0) {
                            autopart.showInSearchImageId = imageModel.getId();
                        }

                        if (imageModel.isShowInSearch()) {
                            autopart.showInSearchImageId = imageModel.getId();
                        }
                        counter++;
                    }

                }
            }
        }

        return new ResponseEntity<>(autoparts, HttpStatus.OK);

    }

    @GetMapping("/autoparts/uuid/{uuid}")
    public ResponseEntity<Autopart> getAutopartWithUuid(@PathVariable("uuid") String uuid) {
        Optional<Autopart> autopartOptional = autoPartRepository.findByToken(uuid);

        Autopart autopart = new Autopart();

        if (autopartOptional.isPresent()) {
            autopart = autopartOptional.get();
            this.getAddtionalInfoIndivisual(autopart, null);

            return new ResponseEntity<>(autopart, HttpStatus.OK);
        } else {

            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/autoparts/{id}")
    public ResponseEntity<Autopart> getAutopartById(@PathVariable("id") long id) {
        Optional<Autopart> autopartOptional = autoPartRepository.findById(id);

        Autopart autopart = new Autopart();

        if (autopartOptional.isPresent()) {
            autopart = autopartOptional.get();
            this.getAddtionalInfoIndivisual(autopart, null);
            // Optional<User> userOptional =
            // this.userRepository.findById(autopart.getUserId());
            // if (userOptional.isPresent()) {

            // User user = userOptional.get();
            // if (user.getBussinessname() != null)
            // autopart.setBussinessName(user.getBussinessname());
            // if (user.getBussinessUrl() != null)
            // autopart.setBussinessUrl(user.getBussinessUrl());
            // for (Address address : user.getAddresses()) {
            // if (address.getName().equals(EAddressType.ADDRESS_TYPE_DEFAULT)
            // || address.getName().equals(EAddressType.ADDRESS_TYPE_SHOP)) {
            // autopart.setCity(address.getCity());
            // autopart.setState(address.getState());
            // autopart.setPhone(user.getPhone());
            // autopart.setZip(address.getZip());
            // autopart.setPhone(user.getPhone());
            // }
            // }
            // int counter = 0;
            // for (ImageModel imageModel : autopart.getImageModels()) {
            // // just set first one only
            // if (counter == 0)
            // autopart.showInSearchImageId = imageModel.getId();
            // if (imageModel.isShowInSearch()) {
            // autopart.showInSearchImageId = imageModel.getId();
            // }
            // counter++;
            // }
            // if (user.getBussinessname() != null)
            // autopart.setBussinessName(user.getBussinessname());
            // if (user.getBussinessUrl() != null)
            // autopart.setBussinessUrl(user.getBussinessUrl());
            // autopart.setViewCount(autopart.getViewCount() + 1);
            // autopart = this.autoPartRepository.save(autopart);
            // // get all fitments
            // if (autopart.isFitmented() == true) {
            // autopart.fitments =
            // this.fitmentRepository.findByAutopartId(autopart.getId());
            // }
            // }
            return new ResponseEntity<>(autopart, HttpStatus.OK);
        } else {

            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/autoparts")
    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<Autopart> createAutopart(@RequestBody Autopart autopartIn,
            HttpServletRequest request) {
        boolean isNew = false;
        if (autopartIn.getId() == 0) {
            isNew = true;
        }
        Long userId;
        try {
            Autopart autopart = new Autopart();
            String jwt = parseJwt(request);
            if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
                String email = jwtUtils.getEmailFromJwtToken(jwt);
                System.out.println("--" + email);

                Optional<User> userOptional = this.userRepository.findByEmail(email);
                if (userOptional.isPresent()) {
                    userId = userOptional.get().getId();
                    autopart.setUserId(userId);
                }

            }
            autopart.setCompanyId(autopartIn.getCompanyId());

            if (autopartIn.getVehicleId() == null) {
                autopart.setVehicleId((long) 0);
            } else {
                autopart.setVehicleId(autopartIn.getVehicleId());
            }

            autopart.setComments(autopartIn.getComments());

            autopart.setSource(autopartIn.getSource());
            autopart.setApprovedAt(autopartIn.getApprovedAt());
            autopart.setApprovedBy(autopartIn.getApprovedBy());

            autopart.setVendorId(autopartIn.getVendorId());
            autopart.setPaymentMethodId(autopartIn.getPaymentMethodId());

            autopart.setYear(autopartIn.getYear());
            autopart.setMake(autopartIn.getMake());
            autopart.setModel(autopartIn.getModel());
            autopart.setLocation(autopartIn.getLocation());

            // autopart.setSubmodel(autopartIn.getSubmodel());
            // autopart.setEngineDesc(autopartIn.getEngineDesc());
            autopart.setEngine(autopartIn.getEngine());
            autopart.setTransmission(autopartIn.getTransmission());
            autopart.setPartName(autopartIn.getPartName());
            autopart.setPartNumber(autopartIn.getPartNumber());
            autopart.setClaimId(autopartIn.getClaimId());
            autopart.setPurchaseOrderId(autopartIn.getPurchaseOrderId());

            if (autopartIn.getReason() != null && autopartIn.getReason().equals("posting")) {
                autopart.setPostingAt(new Date());
            }

            autopart.setPrice(autopartIn.getPrice());
            autopart.setSalePrice(autopartIn.getSalePrice());
            autopart.setGrade(autopartIn.getGrade());

            autopart.setShipping(autopartIn.getShipping());
            autopart.setWarranty(autopartIn.getWarranty());
            autopart.setStocknumber(autopartIn.getStocknumber());

            autopart.setTitle(autopartIn.getTitle());
            autopart.setDescription(autopartIn.getDescription());
            autopart.setComments(autopartIn.getComments());
            autopart.setPublished(autopartIn.isPublished());

            autopart.setReceived(autopartIn.isReceived());
            autopart.setReceivedAt(autopartIn.getReceivedAt());

            autopart.setOrdered(autopartIn.isOrdered());
            autopart.setOrderedAt(autopartIn.getOrderedAt());

            autopart.setReturned(autopartIn.isReturned());
            autopart.setReturnedAt(autopartIn.getReturnedAt());

            autopart.setPurchaseStatus(autopartIn.getPurchaseStatus());

            String randomCode = UUID.randomUUID().toString();

            if (autopartIn.getId() == 0) {
                autopart.setToken(randomCode);
            }

            if (autopartIn.getStatus() > 0) {
                autopart.setStatus(autopartIn.getStatus());
            } else {
                autopart.setStatus(0);
            }

            autopart.setFitmented(autopartIn.isFitmented());

            autopart = autoPartRepository
                    .save(autopart);

            // does once during newly created
            if (autopartIn.getId() == 0 && autopartIn.getReason() != null && autopartIn.getReason().equals("posting")
                    && autopartIn.getPartNumber() != null && !autopartIn.getPartNumber().equals("")
                    && autopartIn.isFitmented() == true) {
                try {
                    if (autopartIn.fitments != null && autopartIn.fitments.size() > 0) {
                        for (Fitment fitment : autopartIn.fitments) {
                            fitment.setAutopartId(autopart.getId());
                            fitment = this.fitmentRepository.save(fitment);
                        }
                    } else {
                        this.postFitment(autopart);
                    }
                } catch (Exception ex) {
                    LOG.info(ex.getMessage());
                }
            }

            if (autopart.isFitmented() == true) {
                autopart.fitments = this.fitmentRepository.findByAutopartId(autopart.getId());
            }
            if (autopart.getVehicleId() > 0) {

                Receipt receipt = new Receipt();
                receipt.setAutopartId(autopart.getId());
                receipt.setVehicleId(autopart.getVehicleId());
                // receipt.setName(autopart.getTitle());
                receipt.setNotes(autopart.getTitle());
                receipt.setAmount(autopart.getSalePrice());
                receipt.setUserId(autopart.getUserId());
                receipt.setQuantity(1);
                randomCode = UUID.randomUUID().toString();
                receipt.setToken(randomCode);

                List<ItemType> itemTypes = this.itemTypeRepository
                        .findByCompanyIdOrderByNameAsc(autopart.getCompanyId());
                for (ItemType itemType : itemTypes) {
                    if (itemType.isCreatePurchaseOrder() == true && itemType.isCreateJobOrder() == false) {
                        receipt.setItemType((int) itemType.getId());
                    }
                }

                this.receiptRepository.save(receipt);

                VehicleHistory vehicleHistory = new VehicleHistory();
                vehicleHistory.setName("Autopart " + autopartIn.getReason() + " " + autopartIn.getTitle());

                vehicleHistory.setUserId(autopart.getUserId());
                vehicleHistory.setVehicleId(autopartIn.getVehicleId());

                // vehicleHistory.setName("Autopart");
                if (!isNew) {
                    vehicleHistory.setObjectKey(autopart.getId());
                    vehicleHistory.setType(1); // 0) add 1) update 2) delete
                } else {
                    vehicleHistory.setObjectKey(autopart.getId());
                    vehicleHistory.setType(0); // 0) add 1) update 2) delete
                }
                vehicleHistory.setValue("" + autopart.getSalePrice());

                this.vehicleHistoryRepository.save(vehicleHistory);

            }

            return new ResponseEntity<>(autopart, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/autoparts/employee/uuid/{uuidEmployee}")
    // @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<Autopart> createAutopartUuid(@RequestBody Autopart autopartIn,
            @PathVariable("uuidEmployee") String uuidEmployee,
            HttpServletRequest request) {
        LOG.info("back door" + uuidEmployee);

        Optional<Employee> employeeOptional = this.employeeRepository.getByToken(uuidEmployee);

        if (employeeOptional.isPresent()) {
            boolean isNew = false;
            if (autopartIn.getId() == 0) {
                isNew = true;
            }
            Long userId;
            try {
                Autopart autopart = new Autopart();
                String jwt = parseJwt(request);
                // if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
                // String email = jwtUtils.getEmailFromJwtToken(jwt);
                // System.out.println("--" + email);

                // Optional<User> userOptional = this.userRepository.findByEmail(email);
                // if (userOptional.isPresent()) {
                // userId = userOptional.get().getId();
                // autopart.setUserId(userId);
                // }
                // }
                autopart.setCompanyId(autopartIn.getCompanyId());

                if (autopartIn.getVehicleId() == null) {
                    autopart.setVehicleId((long) 0);
                } else {
                    autopart.setVehicleId(autopartIn.getVehicleId());
                }

                autopart.setEmployeeId(employeeOptional.get().getId());
                autopart.setComments(autopartIn.getComments());

                autopart.setSource(autopartIn.getSource());
                autopart.setApprovedAt(autopartIn.getApprovedAt());
                autopart.setApprovedBy(autopartIn.getApprovedBy());

                autopart.setVendorId(autopartIn.getVendorId());
                autopart.setPaymentMethodId(autopartIn.getPaymentMethodId());

                autopart.setYear(autopartIn.getYear());
                autopart.setMake(autopartIn.getMake());
                autopart.setModel(autopartIn.getModel());
                autopart.setLocation(autopartIn.getLocation());
                // autopart.setSubmodel(autopartIn.getSubmodel());
                // autopart.setEngineDesc(autopartIn.getEngineDesc());
                autopart.setEngine(autopartIn.getEngine());
                autopart.setTransmission(autopartIn.getTransmission());
                autopart.setPartName(autopartIn.getPartName());
                autopart.setPartNumber(autopartIn.getPartNumber());
                autopart.setClaimId(autopartIn.getClaimId());
                autopart.setPurchaseOrderId(autopartIn.getPurchaseOrderId());

                if (autopartIn.getReason() != null && autopartIn.getReason().equals("posting")) {
                    autopart.setPostingAt(new Date());
                }

                autopart.setPrice(autopartIn.getPrice());
                autopart.setSalePrice(autopartIn.getSalePrice());
                autopart.setGrade(autopartIn.getGrade());

                autopart.setShipping(autopartIn.getShipping());
                autopart.setWarranty(autopartIn.getWarranty());
                autopart.setStocknumber(autopartIn.getStocknumber());

                autopart.setTitle(autopartIn.getTitle());
                autopart.setDescription(autopartIn.getDescription());
                autopart.setComments(autopartIn.getComments());
                autopart.setPublished(autopartIn.isPublished());

                autopart.setReceived(autopartIn.isReceived());
                autopart.setReceivedAt(autopartIn.getReceivedAt());

                autopart.setOrdered(autopartIn.isOrdered());
                autopart.setOrderedAt(autopartIn.getOrderedAt());

                autopart.setReturned(autopartIn.isReturned());
                autopart.setReturnedAt(autopartIn.getReturnedAt());

                autopart.setPurchaseStatus(autopartIn.getPurchaseStatus());

                String randomCode = UUID.randomUUID().toString();

                if (autopartIn.getId() == 0) {
                    autopart.setToken(randomCode);
                }

                if (autopartIn.getStatus() > 0) {
                    autopart.setStatus(autopartIn.getStatus());
                } else {
                    autopart.setStatus(0);
                }

                autopart.setFitmented(autopartIn.isFitmented());

                autopart = autoPartRepository
                        .save(autopart);

                // does once during newly created
                if (autopartIn.getId() == 0 && autopartIn.getReason() != null
                        && (autopartIn.getReason().equals("posting")
                                || autopartIn.getReason().equals("posting employee"))
                        && autopartIn.getPartNumber() != null && !autopartIn.getPartNumber().equals("")
                        && autopartIn.isFitmented() == true) {
                    try {
                        if (autopartIn.fitments != null && autopartIn.fitments.size() > 0) {
                            for (Fitment fitment : autopartIn.fitments) {
                                fitment.setAutopartId(autopart.getId());
                                fitment = this.fitmentRepository.save(fitment);
                            }
                        } else {
                            this.postFitment(autopart);
                        }
                    } catch (Exception ex) {
                        LOG.info(ex.getMessage());
                    }
                }

                if (autopart.isFitmented() == true) {
                    autopart.fitments = this.fitmentRepository.findByAutopartId(autopart.getId());
                }
                if (autopart.getVehicleId() > 0) {
                    VehicleHistory vehicleHistory = new VehicleHistory();
                    vehicleHistory.setName("Autopart Employee " + autopartIn.getReason() + " " + autopartIn.getTitle());

                    vehicleHistory.setUserId(0);
                    vehicleHistory.setVehicleId(autopartIn.getVehicleId());
                    vehicleHistory.setEmployeeId(employeeOptional.get().getId());
                    // vehicleHistory.setName("Autopart");
                    if (!isNew) {
                        vehicleHistory.setObjectKey(autopart.getId());
                        vehicleHistory.setType(1); // 0) add 1) update 2) delete
                    } else {
                        vehicleHistory.setObjectKey(autopart.getId());
                        vehicleHistory.setType(0); // 0) add 1) update 2) delete
                    }
                    vehicleHistory.setValue("" + autopart.getSalePrice());

                    this.vehicleHistoryRepository.save(vehicleHistory);

                }

                return new ResponseEntity<>(autopart, HttpStatus.CREATED);
            } catch (Exception e) {
                return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    public ResponseEntity<String> postFitment(Autopart autopart) {

        try {

            FitmentRequest fitmentRequest = new FitmentRequest();
            fitmentRequest.autopartId = autopart.getId();
            fitmentRequest.year = autopart.getYear();
            fitmentRequest.make = autopart.getMake();
            fitmentRequest.model = autopart.getModel();
            fitmentRequest.partNumber = autopart.getPartNumber();
            Gson gson = new Gson();
            String jsonInputString = gson.toJson(fitmentRequest);

            String urlStr = "https://xxxxxxxx/ZPBUA1ZL9KLA00848?apikey=ZrQEPSkKYmlsbC5kcmFwZXIuYXV0b0BnbWFpbC5jb20=";

            // urlStr = this.fitmentUrl + this.fitmentApiKey;
            urlStr = this.fitmentUrl;
            URL url = new URL(urlStr);

            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Accept", "application/json");
            conn.setDoOutput(true);

            try (OutputStream os = conn.getOutputStream()) {
                byte[] input = jsonInputString.getBytes("utf-8");
                os.write(input, 0, input.length);
            }

            if (conn.getResponseCode() != 200) {
                // throw new RuntimeException("Failed : HTTP error code : "
                // + conn.getResponseCode());
                LOG.info("abnormal response: " + conn.getResponseCode());
                return new ResponseEntity<>("", HttpStatus.OK);
            }

            BufferedReader br = new BufferedReader(new InputStreamReader(
                    (conn.getInputStream())));

            String output;
            System.out.println("Output from Server .... \n");
            StringBuffer stringBuffer = new StringBuffer();
            while ((output = br.readLine()) != null) {
                System.out.println(output);
                stringBuffer.append(output);
            }

            conn.disconnect();
            output = stringBuffer.toString();
            Gson g = new Gson();
            try {

                return new ResponseEntity<>("", HttpStatus.OK);

            } catch (Exception ee) {

                return new ResponseEntity<>("", HttpStatus.OK);
            }
        } catch (MalformedURLException e) {

            e.printStackTrace();

        } catch (IOException e) {

            e.printStackTrace();

        }

        return new ResponseEntity<>("", HttpStatus.OK);
    }

    @PutMapping("/autoparts/{id}")
    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<Autopart> updateAutopart(@PathVariable("id") long id, @RequestBody Autopart autopartIn) {
        boolean isNew = false;
        if (autopartIn.getId() == 0) {
            isNew = true;
        }
        Optional<Autopart> autoparOptional = autoPartRepository.findById(id);

        if (autoparOptional.isPresent()) {
            Autopart autopart = autoparOptional.get();

            autopart.setCompanyId(autopartIn.getCompanyId());

            if (autopartIn.getVehicleId() == null) {
                autopart.setVehicleId((long) 0);
            } else {
                autopart.setVehicleId(autopartIn.getVehicleId());
            }

            autopart.setVendorId(autopartIn.getVendorId());
            autopart.setPaymentMethodId(autopartIn.getPaymentMethodId());
            autopart.setComments(autopartIn.getComments());
            autopart.setEmployeeId(autopartIn.getEmployeeId());
            autopart.setSource(autopartIn.getSource());
            autopart.setApprovedAt(autopartIn.getApprovedAt());
            autopart.setApprovedBy(autopartIn.getApprovedBy());

            if (autopartIn.getReason() != null && autopartIn.getReason().equals("posting")) {
                autopart.setPostingAt(new Date());
            }

            if (autopartIn.getReason() != null && autopartIn.getReason().equals("received")) {
                autopart.setReceived(autopartIn.isReceived());
                autopart.setReceivedAt(new Date());
            } else if (autopartIn.getReason() != null && autopartIn.getReason().equals("ordered")) {
                autopart.setOrdered(autopartIn.isOrdered());
                autopart.setOrderedAt(new Date());
            } else if (autopartIn.getReason() != null && autopartIn.getReason().equals("returned")) {
                autopart.setReturned(autopartIn.isReturned());
                autopart.setReturnedAt(new Date());
            } else if (autopartIn.getReason() != null && autopartIn.getReason().equals("wrong part")) {
                // autopart.setReturned(autopartIn.isReturned());
                autopart.setUpdatedAt(new Date());
            }

            autopart.setPurchaseStatus(autopartIn.getPurchaseStatus());

            // autopart.setReceived(autopartIn.isReceived());
            // autopart.setReceivedAt(autopartIn.getReceivedAt());
            // autopart.setOrdered(autopartIn.isOrdered());
            // autopart.setOrderedAt(autopartIn.getOrderedAt());
            // autopart.setReturned(autopartIn.isReturned());
            // autopart.setReturnedAt(autopartIn.getReturnedAt());
            autopart.setYear(autopartIn.getYear());
            autopart.setMake(autopartIn.getMake());
            autopart.setModel(autopartIn.getModel());
            autopart.setLocation(autopartIn.getLocation());
            autopart.setEngine(autopartIn.getEngine());
            // autopart.setSubmodel(autopartIn.getSubmodel());
            // autopart.setEngineDesc(autopartIn.getEngineDesc());
            autopart.setTransmission(autopartIn.getTransmission());
            autopart.setPartName(autopartIn.getPartName());
            autopart.setPartNumber(autopartIn.getPartNumber());

            autopart.setPrice(autopartIn.getPrice());
            autopart.setSalePrice(autopartIn.getSalePrice());
            autopart.setGrade(autopartIn.getGrade());
            autopart.setShipping(autopartIn.getShipping());
            autopart.setWarranty(autopartIn.getWarranty());
            autopart.setStocknumber(autopartIn.getStocknumber());

            autopart.setTitle(autopartIn.getTitle());
            autopart.setDescription(autopartIn.getDescription());

            autopart.setStatus(autopartIn.getStatus());

            autopart.setPublished(autopartIn.isPublished());
            autopart.setArchived(autopartIn.isArchived());

            autopart.setClaimId(autopartIn.getClaimId());
            autopart.setPurchaseOrderId(autopartIn.getPurchaseOrderId());

            autopart = autoPartRepository.save(autopart);

            // Optional<User> userOptional =
            // this.userRepository.findById(autopart.getUserId());
            // if (userOptional.isPresent()) {
            // User user = userOptional.get();
            // if (user.getBussinessname() != null)
            // autopart.setBussinessName(user.getBussinessname());
            // if (user.getBussinessUrl() != null)
            // autopart.setBussinessUrl(user.getBussinessUrl());
            // for (Address address : user.getAddresses()) {
            // if (address.getName().equals(EAddressType.ADDRESS_TYPE_DEFAULT)
            // || address.getName().equals(EAddressType.ADDRESS_TYPE_SHOP)) {
            // autopart.setCity(address.getCity());
            // autopart.setState(address.getState());
            // autopart.setZip(address.getZip());
            // autopart.setPhone(user.getPhone());
            // }
            // }
            // }
            this.getAddtionalInfoIndivisual(autopart, null);

            if (autopartIn.getUserId() != null) {
                // remove from saved Item if archived
                if (autopartIn.getReason() != null && autopartIn.getReason().equals("archive")) {
                    Optional<SavedItem> savedItemOptional = this.savedItemRepository
                            .findByUserIdAndAutopartId(autopartIn.getUserId(), autopart.getId());

                    if (savedItemOptional.isPresent()) {
                        SavedItem savedItem = savedItemOptional.get();

                        this.savedItemRepository.delete(savedItem);

                    }
                }
            }
            int counter = 0;
            for (ImageModel imageModel : autopart.getImageModels()) {

                // just set one and overide it later
                if (counter == 0) {
                    autopart.showInSearchImageId = imageModel.getId();
                }

                if (imageModel.isShowInSearch()) {
                    autopart.showInSearchImageId = imageModel.getId();
                }
                counter++;
            }

            if (autopart.isFitmented() == true) {
                autopart.fitments = this.fitmentRepository.findByAutopartId(autopart.getId());
            }

            if (autopart.getVehicleId() > 0) {

                Optional<Receipt> receiptOptional = this.receiptRepository.findByAutopartId(autopart.getId());
                if (receiptOptional.isPresent()) {
                    Receipt receipt = receiptOptional.get();
                    // receipt.setAutopartId(autopart.getId());
                    // receipt.setVehicleId(autopart.getVehicleId());
                    // receipt.setName(autopart.getTitle());
                    receipt.setNotes(autopart.getTitle());
                    receipt.setAmount(autopart.getSalePrice());
                    receipt.setUserId(autopart.getUserId());
                    // receipt.setQuantity(1);

                    // List<ItemType> itemTypes = this.itemTypeRepository
                    // .findByCompanyIdOrderByNameAsc(autopart.getCompanyId());
                    // for (ItemType itemType : itemTypes) {
                    // if (itemType.isCreatePurchaseOrder() == true && itemType.isCreateJobOrder()
                    // == false) {
                    // receipt.setItemType((int) itemType.getId());
                    // }
                    // }

                    this.receiptRepository.save(receipt);

                }
                VehicleHistory vehicleHistory = new VehicleHistory();
                vehicleHistory.setName("Autopart " + autopartIn.getReason() + " " + autopartIn.getTitle());

                if (autopart.getUserId() != null) {
                    vehicleHistory.setUserId(autopart.getUserId());
                }
                vehicleHistory.setVehicleId(autopartIn.getVehicleId());

                // vehicleHistory.setName("Autopart");
                if (!isNew) {
                    vehicleHistory.setObjectKey(autopart.getId());
                    vehicleHistory.setType(1); // 0) add 1) update 2) delete
                } else {
                    vehicleHistory.setObjectKey(autopart.getId());
                    vehicleHistory.setType(0); // 0) add 1) update 2) delete
                }
                vehicleHistory.setValue("" + autopart.getSalePrice());

                this.vehicleHistoryRepository.save(vehicleHistory);

            }

            return new ResponseEntity<>(autopart, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/autoparts/employee/{uuidEmployee}")
    // @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<Autopart> updateAutopartUuidEmployee(@PathVariable("uuidEmployee") String uuidEmployee,
            @RequestBody Autopart autopartIn) {
        boolean isNew = false;
        if (autopartIn.getId() == 0) {
            isNew = true;
        }
        Optional<Employee> employeeOptional = this.employeeRepository.findByToken(uuidEmployee);
        if (employeeOptional.isPresent()) {

            Optional<Autopart> autoparOptional = autoPartRepository.findById(autopartIn.getId());

            if (autoparOptional.isPresent()) {
                Autopart autopart = autoparOptional.get();

                autopart.setCompanyId(autopartIn.getCompanyId());

                if (autopartIn.getVehicleId() == null) {
                    autopart.setVehicleId((long) 0);
                } else {
                    autopart.setVehicleId(autopartIn.getVehicleId());
                }

                autopart.setVendorId(autopartIn.getVendorId());
                autopart.setPaymentMethodId(autopartIn.getPaymentMethodId());
                autopart.setComments(autopartIn.getComments());
                autopart.setEmployeeId(autopartIn.getEmployeeId());
                autopart.setSource(autopartIn.getSource());
                autopart.setApprovedAt(autopartIn.getApprovedAt());
                autopart.setEmployeeId(autopartIn.getEmployeeId());

                autopart.setApprovedBy(autopartIn.getApprovedBy());

                if (autopartIn.getReason() != null && autopartIn.getReason().equals("posting")) {
                    autopart.setPostingAt(new Date());
                }

                if (autopartIn.getReason() != null && autopartIn.getReason().equals("received")) {
                    autopart.setReceived(autopartIn.isReceived());
                    autopart.setReceivedAt(new Date());
                } else if (autopartIn.getReason() != null && autopartIn.getReason().equals("ordered")) {
                    autopart.setOrdered(autopartIn.isOrdered());
                    autopart.setOrderedAt(new Date());
                } else if (autopartIn.getReason() != null && autopartIn.getReason().equals("returned")) {
                    autopart.setReturned(autopartIn.isReturned());
                    autopart.setReturnedAt(new Date());
                } else if (autopartIn.getReason() != null && autopartIn.getReason().equals("wrong part")) {
                    // autopart.setReturned(autopartIn.isReturned());
                    autopart.setUpdatedAt(new Date());
                }

                autopart.setPurchaseStatus(autopartIn.getPurchaseStatus());

                // autopart.setReceived(autopartIn.isReceived());
                // autopart.setReceivedAt(autopartIn.getReceivedAt());
                // autopart.setOrdered(autopartIn.isOrdered());
                // autopart.setOrderedAt(autopartIn.getOrderedAt());
                // autopart.setReturned(autopartIn.isReturned());
                // autopart.setReturnedAt(autopartIn.getReturnedAt());
                autopart.setYear(autopartIn.getYear());
                autopart.setMake(autopartIn.getMake());
                autopart.setModel(autopartIn.getModel());
                autopart.setLocation(autopartIn.getLocation());
                autopart.setEngine(autopartIn.getEngine());
                // autopart.setSubmodel(autopartIn.getSubmodel());
                // autopart.setEngineDesc(autopartIn.getEngineDesc());
                autopart.setTransmission(autopartIn.getTransmission());
                autopart.setPartName(autopartIn.getPartName());
                autopart.setPartNumber(autopartIn.getPartNumber());

                autopart.setPrice(autopartIn.getPrice());
                autopart.setSalePrice(autopartIn.getSalePrice());
                autopart.setGrade(autopartIn.getGrade());
                autopart.setShipping(autopartIn.getShipping());
                autopart.setWarranty(autopartIn.getWarranty());
                autopart.setStocknumber(autopartIn.getStocknumber());

                autopart.setTitle(autopartIn.getTitle());
                autopart.setDescription(autopartIn.getDescription());

                autopart.setStatus(autopartIn.getStatus());

                autopart.setPublished(autopartIn.isPublished());
                autopart.setArchived(autopartIn.isArchived());

                autopart.setClaimId(autopartIn.getClaimId());
                autopart.setPurchaseOrderId(autopartIn.getPurchaseOrderId());

                autopart = autoPartRepository.save(autopart);

                // Optional<User> userOptional =
                // this.userRepository.findById(autopart.getUserId());
                // if (userOptional.isPresent()) {
                // User user = userOptional.get();
                // if (user.getBussinessname() != null)
                // autopart.setBussinessName(user.getBussinessname());
                // if (user.getBussinessUrl() != null)
                // autopart.setBussinessUrl(user.getBussinessUrl());
                // for (Address address : user.getAddresses()) {
                // if (address.getName().equals(EAddressType.ADDRESS_TYPE_DEFAULT)
                // || address.getName().equals(EAddressType.ADDRESS_TYPE_SHOP)) {
                // autopart.setCity(address.getCity());
                // autopart.setState(address.getState());
                // autopart.setZip(address.getZip());
                // autopart.setPhone(user.getPhone());
                // }
                // }
                // }
                this.getAddtionalInfoIndivisual(autopart, null);

                // remove from saved Item if archived
                if (autopartIn.getReason() != null && autopartIn.getReason().equals("archive")) {
                    Optional<SavedItem> savedItemOptional = this.savedItemRepository
                            .findByUserIdAndAutopartId(autopartIn.getUserId(), autopart.getId());

                    if (savedItemOptional.isPresent()) {
                        SavedItem savedItem = savedItemOptional.get();

                        this.savedItemRepository.delete(savedItem);

                    }
                }

                int counter = 0;
                for (ImageModel imageModel : autopart.getImageModels()) {

                    // just set one and overide it later
                    if (counter == 0) {
                        autopart.showInSearchImageId = imageModel.getId();
                    }

                    if (imageModel.isShowInSearch()) {
                        autopart.showInSearchImageId = imageModel.getId();
                    }
                    counter++;
                }

                if (autopart.isFitmented() == true) {
                    autopart.fitments = this.fitmentRepository.findByAutopartId(autopart.getId());
                }

                if (autopart.getVehicleId() > 0) {
                    VehicleHistory vehicleHistory = new VehicleHistory();
                    vehicleHistory.setName("Autopart Employee " + autopartIn.getReason() + " " + autopartIn.getTitle());

                    vehicleHistory.setUserId((long) 0);
                    vehicleHistory.setVehicleId(autopartIn.getVehicleId());

                    // vehicleHistory.setName("Autopart");
                    if (!isNew) {
                        vehicleHistory.setEmployeeId(employeeOptional.get().getId());
                        vehicleHistory.setObjectKey(autopart.getId());
                        vehicleHistory.setType(1); // 0) add 1) update 2) delete
                    } else {
                        vehicleHistory.setEmployeeId(employeeOptional.get().getId());
                        vehicleHistory.setObjectKey(autopart.getId());
                        vehicleHistory.setType(0); // 0) add 1) update 2) delete
                    }
                    vehicleHistory.setValue("" + autopart.getSalePrice());

                    this.vehicleHistoryRepository.save(vehicleHistory);

                }

                return new ResponseEntity<>(autopart, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/autoparts/{id}")
    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<HttpStatus> deleteAutopart(@PathVariable("id") long id) {
        try {
            LOG.info("" + id);

            Optional<Autopart> autoparOptional = autoPartRepository.findById(id);

            if (autoparOptional.isPresent()) {
                Autopart autopart = autoparOptional.get();
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

                if (autopart.getVehicleId() > 0) {
                    VehicleHistory vehicleHistory = new VehicleHistory();
                    vehicleHistory.setName("Autopart Image");

                    // vehicleHistory.setUserId(_imageModelSaved.getUserId());
                    vehicleHistory.setVehicleId(autopart.getVehicleId());

                    vehicleHistory.setObjectKey(autopart.getId());
                    vehicleHistory.setType(2); // 0) add 1) update 2) delete
                    vehicleHistory.setUserId(0);
                    vehicleHistory.setValue("");

                    this.vehicleHistoryRepository.save(vehicleHistory);
                }

                autoPartRepository.delete(autopart);

                List<SavedItem> savedItems = this.savedItemRepository.findByAutopartId(id);

                for (SavedItem savedItem : savedItems) {
                    this.savedItemRepository.delete(savedItem);
                }

                // remove fitments
                if (autopart.isFitmented() == true) {
                    List<Fitment> fitments = this.fitmentRepository.findByAutopartId(id);
                    if (fitments.size() > 0) {
                        for (Fitment fitment : fitments) {
                            this.fitmentRepository.delete(fitment);
                        }
                    }
                }

                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } else {
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);

            }

        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/autoparts/option/{id}/{userId}")
    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<HttpStatus> deleteAutopartOptionWithUser(@PathVariable("id") long id,
            @PathVariable("userId") long userId) {
        try {
            LOG.info("" + id);

            Optional<Autopart> autoparOptional = autoPartRepository.findById(id);

            if (autoparOptional.isPresent()) {
                Autopart autopart = autoparOptional.get();
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

                if (autopart.getVehicleId() > 0) {

                    Optional<Receipt> receiptOptional = this.receiptRepository.findByAutopartId(autopart.getId());
                    if (receiptOptional.isPresent()) {
                        Receipt receipt = receiptOptional.get();
                        this.receiptRepository.delete(receipt);
                    }

                    VehicleHistory vehicleHistory = new VehicleHistory();
                    vehicleHistory.setName("Vehicle Image");

                    // vehicleHistory.setUserId(_imageModelSaved.getUserId());
                    vehicleHistory.setVehicleId(autopart.getVehicleId());

                    vehicleHistory.setObjectKey(autopart.getId());
                    vehicleHistory.setType(2); // 0) add 1) update 2) delete
                    vehicleHistory.setUserId(userId);
                    vehicleHistory.setValue("");

                    this.vehicleHistoryRepository.save(vehicleHistory);
                }

                autoPartRepository.delete(autopart);

                List<SavedItem> savedItems = this.savedItemRepository.findByAutopartId(id);

                for (SavedItem savedItem : savedItems) {
                    this.savedItemRepository.delete(savedItem);
                }

                // remove fitments
                if (autopart.isFitmented() == true) {
                    List<Fitment> fitments = this.fitmentRepository.findByAutopartId(id);
                    if (fitments.size() > 0) {
                        for (Fitment fitment : fitments) {
                            this.fitmentRepository.delete(fitment);
                        }
                    }
                }

                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } else {
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);

            }

        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/autoparts/{id}/{userId}")
    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<HttpStatus> deleteAutopartWithUser(@PathVariable("id") long id,
            @PathVariable("userId") long userId) {
        try {
            LOG.info("" + id);

            Optional<Autopart> autoparOptional = autoPartRepository.findById(id);

            if (autoparOptional.isPresent()) {
                Autopart autopart = autoparOptional.get();
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

                if (autopart.getVehicleId() > 0) {

                    Optional<Receipt> receiptOptional = this.receiptRepository.findByAutopartId(autopart.getId());
                    if (receiptOptional.isPresent()) {
                        Receipt receipt = receiptOptional.get();
                        receipt.setAutopartId(0);
                        this.receiptRepository.save(receipt);
                    }

                    VehicleHistory vehicleHistory = new VehicleHistory();
                    vehicleHistory.setName("Vehicle Image");

                    // vehicleHistory.setUserId(_imageModelSaved.getUserId());
                    vehicleHistory.setVehicleId(autopart.getVehicleId());

                    vehicleHistory.setObjectKey(autopart.getId());
                    vehicleHistory.setType(2); // 0) add 1) update 2) delete
                    vehicleHistory.setUserId(userId);
                    vehicleHistory.setValue("");

                    this.vehicleHistoryRepository.save(vehicleHistory);
                }

                autoPartRepository.delete(autopart);

                List<SavedItem> savedItems = this.savedItemRepository.findByAutopartId(id);

                for (SavedItem savedItem : savedItems) {
                    this.savedItemRepository.delete(savedItem);
                }

                // remove fitments
                if (autopart.isFitmented() == true) {
                    List<Fitment> fitments = this.fitmentRepository.findByAutopartId(id);
                    if (fitments.size() > 0) {
                        for (Fitment fitment : fitments) {
                            this.fitmentRepository.delete(fitment);
                        }
                    }
                }

                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } else {
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);

            }

        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/autoparts/exmployee/{id}/{uuidEmployee}")
    // @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<HttpStatus> deleteAutopartWithUuidEmployee(@PathVariable("id") long id,
            @PathVariable("uuidEmployee") String uuidEmployee) {
        try {
            LOG.info("" + id);

            Optional<Autopart> autoparOptional = autoPartRepository.findById(id);
            Optional<Employee> emplolyeeOptional = this.employeeRepository.getByToken(uuidEmployee);
            if (autoparOptional.isPresent() && emplolyeeOptional.isPresent()) {
                Autopart autopart = autoparOptional.get();
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

                if (autopart.getVehicleId() > 0) {
                    VehicleHistory vehicleHistory = new VehicleHistory();
                    vehicleHistory.setName("Vehicle Image");

                    // vehicleHistory.setUserId(_imageModelSaved.getUserId());
                    vehicleHistory.setVehicleId(autopart.getVehicleId());

                    vehicleHistory.setObjectKey(autopart.getId());
                    vehicleHistory.setType(2); // 0) add 1) update 2) delete
                    vehicleHistory.setUserId(0);
                    vehicleHistory.setEmployeeId(emplolyeeOptional.get().getId());
                    vehicleHistory.setValue("");

                    this.vehicleHistoryRepository.save(vehicleHistory);
                }

                autoPartRepository.delete(autopart);

                List<SavedItem> savedItems = this.savedItemRepository.findByAutopartId(id);

                for (SavedItem savedItem : savedItems) {
                    this.savedItemRepository.delete(savedItem);
                }

                // remove fitments
                if (autopart.isFitmented() == true) {
                    List<Fitment> fitments = this.fitmentRepository.findByAutopartId(id);
                    if (fitments.size() > 0) {
                        for (Fitment fitment : fitments) {
                            this.fitmentRepository.delete(fitment);
                        }
                    }
                }

                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } else {
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);

            }

        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private String parseJwt(HttpServletRequest request) {
        String jwt = jwtUtils.getJwtFromCookies(request);
        return jwt;
    }

}
