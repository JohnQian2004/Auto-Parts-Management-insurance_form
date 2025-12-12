package com.xoftex.parthub.controllers;

import java.util.ArrayList;
import java.util.Arrays;

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
import org.springframework.web.bind.annotation.RestController;

import com.xoftex.parthub.exception.ResourceNotFoundException;
import com.xoftex.parthub.models.Address;

import com.xoftex.parthub.models.Company;

import com.xoftex.parthub.models.RequestPart;

import com.xoftex.parthub.models.SearchCarrier;
import com.xoftex.parthub.models.User;
import com.xoftex.parthub.models.ZipCode;

import com.xoftex.parthub.payload.response.UserSatisticsResponse;
import com.xoftex.parthub.repository.AutoPartRepository;
import com.xoftex.parthub.repository.CompanyRepository;
import com.xoftex.parthub.repository.FitmentRepository;
import com.xoftex.parthub.repository.ImageModelRepository;
import com.xoftex.parthub.repository.ReqeustPartRepository;
import com.xoftex.parthub.repository.SavedItemRepository;
import com.xoftex.parthub.repository.UserRepository;
import com.xoftex.parthub.repository.ZipCodeRepository;
import com.xoftex.parthub.security.jwt.JwtUtils;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import com.xoftex.parthub.models.EAddressType;

@Tag(name = "Auto Parts", description = "Auto Part management APIs")
// for Angular Client (withCredentials)
// @CrossOrigin(origins = "http://localhost:4200", maxAge = 3600,
// allowCredentials = "true")
// @CrossOrigin(origins = "*", maxAge = 3600)
@CrossOrigin("*")
@RestController
@RequestMapping("/api")
public class RequestPartController {

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
    ReqeustPartRepository reqeustPartRepository;

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

    private static final Logger LOG = LoggerFactory.getLogger(RequestPartController.class);

    @PostMapping("/requestparts/company")
    public ResponseEntity<List<RequestPart>> searchAllRequestPartsCompanyStatusPaging(
            @RequestBody SearchCarrier searchCarrier) {
        List<RequestPart> requestParts = new ArrayList<RequestPart>();
        int serachCount = 0;

        if (searchCarrier.companyId == 0) {

            requestParts = reqeustPartRepository.findByUserIdAndArchivedOrderByIdDesc(
                    searchCarrier.userId,
                    searchCarrier.archived,

                    Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));

            serachCount = reqeustPartRepository.countByUserIdAndArchived(searchCarrier.userId,
                    searchCarrier.archived);

        } else {
            requestParts = reqeustPartRepository.findByCompanyIdAndArchivedOrderByIdDesc(
                    searchCarrier.companyId,
                    searchCarrier.archived,

                    Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));

            serachCount = reqeustPartRepository.countByCompanyIdAndArchived(searchCarrier.companyId,
                    searchCarrier.archived);

        }

        for (RequestPart requestpart : requestParts) {
            requestpart.searchCount = serachCount;

        }

        this.getAddtionalInfo(requestParts, null);
        // =======
        return new ResponseEntity<>(requestParts, HttpStatus.OK);
    }

    @PostMapping("/requestparts/user")
    public ResponseEntity<List<RequestPart>> searchAllPartsUserStatusPaging(@RequestBody SearchCarrier searchCarrier) {
        List<RequestPart> requestParts = new ArrayList<RequestPart>();
        int serachCount = 0;

        requestParts = reqeustPartRepository.findByUserIdAndArchivedOrderByIdDesc(
                searchCarrier.userId,
                searchCarrier.archived,

                Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));

        serachCount = reqeustPartRepository.countByUserIdAndArchived(searchCarrier.userId,
                searchCarrier.archived);

        for (RequestPart requestpart : requestParts) {
            requestpart.searchCount = serachCount;

        }

        this.getAddtionalInfo(requestParts, null);
        // =======
        return new ResponseEntity<>(requestParts, HttpStatus.OK);
    }

    @GetMapping("/requestparts/satistics")
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

    @GetMapping("/requestparts/satistics/user")
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

    // @PostMapping("/requestparts/search/page/all")
    // @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    // public ResponseEntity<List<Autopart>> searchAllPartsWithPage(@RequestBody
    // SearchCarrier searchCarrier) {

    // LOG.info(searchCarrier.year + " " + searchCarrier.make + " " +
    // searchCarrier.model + " "
    // + searchCarrier.partName + " "
    // + searchCarrier.partNumber + " " + searchCarrier.zipcode);

    // List<Autopart> autoParts = new ArrayList<Autopart>();
    // int searchCount = 0;

    // searchCount = autoPartRepository
    // .count(
    // searchCarrier.partNumber, searchCarrier.partNumber, searchCarrier.partNumber,
    // searchCarrier.partNumber,
    // searchCarrier.companyId, searchCarrier.published, searchCarrier.archived,
    // searchCarrier.status);

    // autoParts = autoPartRepository
    // .search(
    // searchCarrier.partNumber, searchCarrier.partNumber, searchCarrier.partNumber,
    // searchCarrier.partNumber,
    // searchCarrier.companyId, searchCarrier.published, searchCarrier.archived,
    // searchCarrier.status,
    // Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
    // for (Autopart autopart : autoParts) {
    // autopart.searchCount = searchCount;
    // }

    // this.getAddtionalInfo(autoParts, null);

    // return new ResponseEntity<>(autoParts, HttpStatus.OK);
    // }

    // @PostMapping("/requestparts/search/page/all/user")
    // @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    // public ResponseEntity<List<Autopart>> searchAllPartsWithPageUser(@RequestBody
    // SearchCarrier searchCarrier) {

    // LOG.info(searchCarrier.year + " " + searchCarrier.make + " " +
    // searchCarrier.model + " "
    // + searchCarrier.partName + " "
    // + searchCarrier.partNumber + " " + searchCarrier.zipcode);

    // List<Autopart> autoParts = new ArrayList<Autopart>();
    // int searchCount = 0;

    // searchCount = autoPartRepository
    // .countUser(
    // searchCarrier.partNumber, searchCarrier.partNumber, searchCarrier.partNumber,
    // searchCarrier.userId, searchCarrier.published, searchCarrier.archived,
    // searchCarrier.status);

    // autoParts = autoPartRepository
    // .searchUser(
    // searchCarrier.partNumber, searchCarrier.partNumber, searchCarrier.partNumber,
    // searchCarrier.userId, searchCarrier.published, searchCarrier.archived,
    // searchCarrier.status,
    // Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
    // for (Autopart autopart : autoParts) {
    // autopart.searchCount = searchCount;
    // }

    // this.getAddtionalInfo(autoParts, null);

    // return new ResponseEntity<>(autoParts, HttpStatus.OK);
    // }

    // @PostMapping("/requestparts/search")
    // @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    // public ResponseEntity<List<Autopart>> searchAllParts(@RequestBody
    // SearchCarrier searchCarrier) {

    // LOG.info(searchCarrier.year + " " + searchCarrier.make + " " +
    // searchCarrier.model + " "
    // + searchCarrier.partName + " "
    // + searchCarrier.partNumber + " " + searchCarrier.zipcode);

    // List<Autopart> autoParts = new ArrayList<Autopart>();
    // if (searchCarrier.archived == true) {
    // autoParts = autoPartRepository
    // .searchWithArchivedFlag(
    // searchCarrier.partNumber, searchCarrier.partNumber, searchCarrier.partNumber,
    // searchCarrier.companyId, searchCarrier.archived);

    // } else if (searchCarrier.status > 0) {
    // autoParts = autoPartRepository
    // .searchInventory(
    // searchCarrier.partNumber, searchCarrier.partNumber, searchCarrier.partNumber,
    // searchCarrier.companyId, searchCarrier.archived,
    // searchCarrier.status);
    // } else if (!searchCarrier.partNumber.equals("")) {
    // autoParts = autoPartRepository
    // .searchWithArchivedFlag(
    // searchCarrier.partNumber, searchCarrier.partNumber, searchCarrier.partNumber,
    // searchCarrier.companyId, searchCarrier.archived);
    // } else {

    // switch (searchCarrier.type) {
    // case 4: {

    // List<Autopart> autoParts0 =
    // this.autoPartRepository.findByCompanyIdAndArchivedAndYearAndStatus(
    // searchCarrier.companyId, false, searchCarrier.year, 0);
    // autoParts.addAll(autoParts0);
    // List<Autopart> autoParts1 =
    // this.autoPartRepository.findByCompanyIdAndArchivedAndYearAndStatus(
    // searchCarrier.companyId, false, searchCarrier.year, 1);
    // autoParts.addAll(autoParts1);
    // List<Autopart> autoParts2 =
    // this.autoPartRepository.findByCompanyIdAndArchivedAndYearAndStatus(
    // searchCarrier.companyId, false, searchCarrier.year, 2);
    // autoParts.addAll(autoParts2);

    // }
    // break;
    // case 3: {
    // List<Autopart> autoParts0 = this.autoPartRepository
    // .findByCompanyIdAndArchivedAndYearAndMakeAndStatus(
    // searchCarrier.companyId, false, searchCarrier.year, searchCarrier.make, 0);
    // autoParts.addAll(autoParts0);
    // List<Autopart> autoParts1 = this.autoPartRepository
    // .findByCompanyIdAndArchivedAndYearAndMakeAndStatus(
    // searchCarrier.companyId, false, searchCarrier.year, searchCarrier.make, 1);
    // autoParts.addAll(autoParts1);
    // List<Autopart> autoParts2 = this.autoPartRepository
    // .findByCompanyIdAndArchivedAndYearAndMakeAndStatus(
    // searchCarrier.companyId, false, searchCarrier.year, searchCarrier.make, 2);
    // autoParts.addAll(autoParts2);
    // }
    // break;

    // case 2: {
    // List<Autopart> autoParts0 = this.autoPartRepository
    // .findByCompanyIdAndArchivedAndYearAndMakeAndModelAndStatus(
    // searchCarrier.companyId, false, searchCarrier.year, searchCarrier.make,
    // searchCarrier.model, 0);
    // autoParts.addAll(autoParts0);
    // List<Autopart> autoParts1 = this.autoPartRepository
    // .findByCompanyIdAndArchivedAndYearAndMakeAndModelAndStatus(
    // searchCarrier.companyId, false, searchCarrier.year, searchCarrier.make,
    // searchCarrier.model, 1);
    // autoParts.addAll(autoParts1);
    // List<Autopart> autoParts2 = this.autoPartRepository
    // .findByCompanyIdAndArchivedAndYearAndMakeAndModelAndStatus(
    // searchCarrier.companyId, false, searchCarrier.year, searchCarrier.make,
    // searchCarrier.model, 2);
    // autoParts.addAll(autoParts2);

    // }
    // break;
    // }

    // }
    // if (autoParts.isEmpty()) {
    // return new ResponseEntity<>(autoParts, HttpStatus.OK);
    // }

    // if (searchCarrier.zipcode != null) {

    // Optional<ZipCode> zipCodeOptional =
    // this.zipCodeRepository.findByZip(searchCarrier.zipcode);
    // if (zipCodeOptional.isPresent()) {
    // this.getAddtionalInfo(autoParts, zipCodeOptional.get());
    // } else {

    // throw new ResourceNotFoundException("Zip code [" + searchCarrier.zipcode + "]
    // is not valid");

    // }
    // } else {
    // this.getAddtionalInfo(autoParts, null);
    // }

    // return new ResponseEntity<>(autoParts, HttpStatus.OK);

    // }

    @PostMapping("/requestparts/search/status/page")
    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<List<RequestPart>> searchAllRequestPartsStatusPaging(
            @RequestBody SearchCarrier searchCarrier) {
        List<RequestPart> autoParts = new ArrayList<RequestPart>();
        int serachCount = 0;
        if (searchCarrier.archived == true) {
            autoParts = reqeustPartRepository.findByCompanyIdAndArchivedOrderByIdDesc(searchCarrier.companyId,
                    true,

                    Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));

            serachCount = reqeustPartRepository.countByCompanyIdAndArchived(searchCarrier.companyId,
                    true);
        } else {
            autoParts = reqeustPartRepository.findByCompanyIdAndArchivedOrderByIdDesc(searchCarrier.companyId,
                    false,

                    Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));

            serachCount = reqeustPartRepository.countByCompanyIdAndArchived(searchCarrier.companyId,
                    false);
        }

        for (RequestPart requestpart : autoParts) {
            requestpart.searchCount = serachCount;

        }

        this.getAddtionalInfo(autoParts, null);
        // =======
        return new ResponseEntity<>(autoParts, HttpStatus.OK);
    }

    @PostMapping("/requestparts/search/page")
    public ResponseEntity<List<RequestPart>> searchAllRequestPartsPaging(@RequestBody SearchCarrier searchCarrier) {

        LOG.info(" Mode: [" + searchCarrier.mode + "] " + searchCarrier.year + " " + searchCarrier.make + " "
                + searchCarrier.model + " "
                + searchCarrier.partName + " "
                + searchCarrier.partNumber + " " + searchCarrier.zipcode);

        int serachCount = 0;

        List<RequestPart> requestParts = new ArrayList<RequestPart>();
        if (searchCarrier.mode == 0) {

            serachCount = reqeustPartRepository.countByArchivedOrderByIdDesc(false);
            requestParts = reqeustPartRepository.findByArchivedOrderByIdDesc(false,
                    Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
            for (RequestPart requestpart : requestParts) {
                requestpart.searchCount = serachCount;
            }
            if (searchCarrier.zipcode != null) {
                Optional<ZipCode> zipCodeOptional = this.zipCodeRepository.findByZip(searchCarrier.zipcode);
                if (zipCodeOptional.isPresent()) {
                    this.getAddtionalInfo(requestParts, zipCodeOptional.get());
                } else {
                    this.getAddtionalInfo(requestParts, null);
                }
            }

        } else if (searchCarrier.mode == 9) {

            serachCount = reqeustPartRepository.countByArchivedOrderByIdDesc(false);
            requestParts = reqeustPartRepository.findByArchivedOrderByIdDesc(false,
                    Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
            for (RequestPart requestpart : requestParts) {
                requestpart.searchCount = serachCount;
                if (requestpart.getToken() == null) {
                    String randomCode = UUID.randomUUID().toString();
                    requestpart.setToken(randomCode);
                    this.reqeustPartRepository.save(requestpart);
                }
            }
            if (searchCarrier.zipcode != null) {
                Optional<ZipCode> zipCodeOptional = this.zipCodeRepository.findByZip(searchCarrier.zipcode);
                if (zipCodeOptional.isPresent()) {
                    this.getAddtionalInfo(requestParts, zipCodeOptional.get());
                } else {
                    this.getAddtionalInfo(requestParts, null);
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

                    serachCount = reqeustPartRepository.coutPartNameIn(
                            queryParam, false);
                    requestParts = reqeustPartRepository.findPartNameIn(
                            queryParam,
                            false,
                            Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
                } else {

                    serachCount = reqeustPartRepository.countByTitleContainsIgnoreCaseAndArchived(
                            searchCarrier.partName, false);
                    requestParts = reqeustPartRepository.findByTitleContainsIgnoreCaseAndArchived(
                            searchCarrier.partName,
                            false,
                            Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));

                }

                for (RequestPart requestpart : requestParts) {
                    requestpart.searchCount = serachCount;
                }
                if (searchCarrier.zipcode != null) {
                    Optional<ZipCode> zipCodeOptional = this.zipCodeRepository.findByZip(searchCarrier.zipcode);
                    if (zipCodeOptional.isPresent()) {
                        this.getAddtionalInfo(requestParts, zipCodeOptional.get());
                    } else {
                        this.getAddtionalInfo(requestParts, null);
                    }
                }
            }

        } else if (searchCarrier.mode == 1 && !searchCarrier.partNumber.equals("")) {

            if (searchCarrier.pageNumber >= 0 && searchCarrier.pageSize > 1) {

                if (searchCarrier.withFitment == true) {
                    // serachCount = autoPartRepository.countWithFitment(
                    // searchCarrier.partNumber,
                    // 2, false, true);
                    // requestParts = autoPartRepository.findWithFitment(
                    // searchCarrier.partNumber,
                    // 2, false, true,
                    // Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
                } else {

                    // serachCount = autoPartRepository.countPartNumberOrStockNumber(
                    // searchCarrier.partNumber, searchCarrier.partNumber, true, false, 2);
                    // requestParts = autoPartRepository.searchPartNumberOrStockerNumber(
                    // searchCarrier.partNumber, searchCarrier.partNumber, true, false,
                    // 2,
                    // Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));

                }

                for (RequestPart requestpart : requestParts) {
                    requestpart.searchCount = serachCount;
                }

                if (searchCarrier.zipcode != null) {
                    Optional<ZipCode> zipCodeOptional = this.zipCodeRepository.findByZip(searchCarrier.zipcode);
                    if (zipCodeOptional.isPresent()) {
                        this.getAddtionalInfo(requestParts, zipCodeOptional.get());
                    } else {
                        this.getAddtionalInfo(requestParts, null);
                    }
                }
            }

        } else {

            if (searchCarrier.pageNumber >= 0 && searchCarrier.pageSize > 1) {
                if (searchCarrier.mode == 2) {
                    if (searchCarrier.withFitment == true) {
                        // serachCount = autoPartRepository
                        // .countWithFitmentYearMakeModel(
                        // searchCarrier.year,
                        // searchCarrier.make, searchCarrier.model, searchCarrier.partNumber, 2, false,
                        // true);

                        // requestParts = autoPartRepository
                        // .findWithFitmentYearMakeModel(
                        // searchCarrier.year,
                        // searchCarrier.make, searchCarrier.model, searchCarrier.partNumber, 2, false,
                        // true,
                        // Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));

                    } else {
                        serachCount = reqeustPartRepository
                                .countByYearAndMakeAndModelAndPartNumberAndArchived(
                                        searchCarrier.year,
                                        searchCarrier.make, searchCarrier.model, searchCarrier.partNumber, false);

                        requestParts = reqeustPartRepository
                                .findByYearAndMakeAndModelAndPartNumberAndArchived(
                                        searchCarrier.year,
                                        searchCarrier.make, searchCarrier.model, searchCarrier.partNumber, false,
                                        Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
                    }

                } else {
                    // title only with location
                    if (searchCarrier.year == 0 && searchCarrier.make.equals("") && searchCarrier.model.equals("")) {

                        if (searchCarrier.location == 0) {
                            serachCount = reqeustPartRepository
                                    .countByTitleContainsAndArchived(
                                            searchCarrier.partName, false);

                            requestParts = reqeustPartRepository
                                    .findByTitleContainsAndAndArchivedOrderByIdDesc(
                                            searchCarrier.partName, false,
                                            Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));

                        } else {
                            serachCount = reqeustPartRepository
                                    .countByLocationAndTitleContainsAndArchived(searchCarrier.location,
                                            searchCarrier.partName, false);

                            requestParts = reqeustPartRepository
                                    .findByLocationAndTitleContainsAndAndArchivedOrderByIdDesc(searchCarrier.location,
                                            searchCarrier.partName, false,
                                            Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
                        }
                        // make only with location
                    } else if (searchCarrier.year == 0 && !searchCarrier.make.equals("")
                            && searchCarrier.model.equals("") && searchCarrier.partName.equals("")) {

                        if (searchCarrier.location == 0) {

                            serachCount = reqeustPartRepository
                                    .countByMakeContainsAndArchived(
                                            searchCarrier.make, false);

                            requestParts = reqeustPartRepository
                                    .findByMakeContainsAndAndArchivedOrderByIdDesc(
                                            searchCarrier.make, false,
                                            Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));

                        } else {
                            serachCount = reqeustPartRepository
                                    .countByLocationAndMakeContainsAndArchived(searchCarrier.location,
                                            searchCarrier.make, false);

                            requestParts = reqeustPartRepository
                                    .findByLocationAndMakeContainsAndAndArchivedOrderByIdDesc(searchCarrier.location,
                                            searchCarrier.make, false,
                                            Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
                        }

                        // make and model only with location
                    } else if (searchCarrier.year == 0 && !searchCarrier.make.equals("")
                            && !searchCarrier.model.equals("") && searchCarrier.partName.equals("")) {

                        if (searchCarrier.location == 0) {
                            serachCount = reqeustPartRepository
                                    .countByLocationAndMakeAndModelContainsAndArchived(searchCarrier.location,
                                            searchCarrier.make, searchCarrier.model, false);

                            requestParts = reqeustPartRepository
                                    .findByLocationAndMakeAndModelContainsAndArchivedOrderByIdDesc(
                                            searchCarrier.location,
                                            searchCarrier.make, searchCarrier.model, false,
                                            Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
                        } else {
                            serachCount = reqeustPartRepository
                                    .countByLocationAndMakeAndModelContainsAndArchived(searchCarrier.location,
                                            searchCarrier.make, searchCarrier.model, false);

                            requestParts = reqeustPartRepository
                                    .findByLocationAndMakeAndModelContainsAndArchivedOrderByIdDesc(
                                            searchCarrier.location,
                                            searchCarrier.make, searchCarrier.model, false,
                                            Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
                        }
                        // year only with location
                    } else if (searchCarrier.year >= 0 && searchCarrier.make.equals("")
                            && searchCarrier.model.equals("") && searchCarrier.partName.equals("")) {

                        if (searchCarrier.location == 0) {
                            serachCount = reqeustPartRepository
                                    .countByLocationAndYearAndArchived(searchCarrier.location,
                                            searchCarrier.year,
                                            false);

                            requestParts = reqeustPartRepository
                                    .findByLocationAndYearAndArchivedOrderByIdDesc(searchCarrier.location,
                                            searchCarrier.year,
                                            false,
                                            Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
                        } else {
                            serachCount = reqeustPartRepository
                                    .countByLocationAndYearAndArchived(searchCarrier.location,
                                            searchCarrier.year,
                                            false);

                            requestParts = reqeustPartRepository
                                    .findByLocationAndYearAndArchivedOrderByIdDesc(searchCarrier.location,
                                            searchCarrier.year,
                                            false,
                                            Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
                        }
                        // year and make only with location
                    } else if (searchCarrier.year >= 0 && !searchCarrier.make.equals("")
                            && searchCarrier.model.equals("") && searchCarrier.partName.equals("")) {

                        if (searchCarrier.location == 0) {
                            serachCount = reqeustPartRepository
                                    .countByYearAndMakeAndArchived(
                                            searchCarrier.year, searchCarrier.make,
                                            false);

                            requestParts = reqeustPartRepository
                                    .findByYearAndMakeAndArchivedOrderByIdDesc(
                                            searchCarrier.year, searchCarrier.make,
                                            false,
                                            Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
                        } else {
                            serachCount = reqeustPartRepository
                                    .countByLocationAndYearAndMakeAndArchived(searchCarrier.location,
                                            searchCarrier.year, searchCarrier.make,
                                            false);

                            requestParts = reqeustPartRepository
                                    .findByLocationAndYearAndMakeAndArchivedOrderByIdDesc(searchCarrier.location,
                                            searchCarrier.year, searchCarrier.make,
                                            false,
                                            Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
                        }
                        // year and title only with location
                    } else if (searchCarrier.year >= 0 && searchCarrier.make.equals("")
                            && searchCarrier.model.equals("") && !searchCarrier.partName.equals("")) {

                        if (searchCarrier.location == 0) {
                            serachCount = reqeustPartRepository
                                    .countByYearAndTitleContainsAndArchived(
                                            searchCarrier.year, searchCarrier.partName,
                                            false);

                            requestParts = reqeustPartRepository
                                    .findByYearAndTitleContainsAndArchivedOrderByIdDesc(

                                            searchCarrier.year, searchCarrier.partName,
                                            false,
                                            Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
                        } else {
                            serachCount = reqeustPartRepository
                                    .countByYearAndTitleContainsAndArchived(
                                            searchCarrier.year, searchCarrier.partName,
                                            false);

                            requestParts = reqeustPartRepository
                                    .findByYearAndTitleContainsAndArchivedOrderByIdDesc(

                                            searchCarrier.year, searchCarrier.partName,
                                            false,
                                            Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
                        }
                        // make and title only with location
                    } else if (searchCarrier.year == 0 && !searchCarrier.make.equals("")
                            && searchCarrier.model.equals("") && !searchCarrier.partName.equals("")) {

                        if (searchCarrier.location == 0) {
                            serachCount = reqeustPartRepository
                                    .countByMakeAndTitleContainsAndArchived(
                                            searchCarrier.make, searchCarrier.partName,
                                            false);

                            requestParts = reqeustPartRepository
                                    .findByMakeAndTitleContainsAndArchivedOrderByIdDesc(

                                            searchCarrier.make, searchCarrier.partName,
                                            false,
                                            Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
                        } else {
                            serachCount = reqeustPartRepository
                                    .countByLocationAndMakeAndTitleContainsAndArchived(searchCarrier.location,
                                            searchCarrier.make, searchCarrier.partName,
                                            false);

                            requestParts = reqeustPartRepository
                                    .findByLocationAndMakeAndTitleContainsAndArchivedOrderByIdDesc(
                                            searchCarrier.location,
                                            searchCarrier.make, searchCarrier.partName,
                                            false,
                                            Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
                        }
                        // year and make and title with location
                    } else if (searchCarrier.year >= 0 && !searchCarrier.make.equals("")
                            && searchCarrier.model.equals("") && !searchCarrier.partName.equals("")) {

                        if (searchCarrier.location == 0) {
                            serachCount = reqeustPartRepository
                                    .countByYearAndMakeAndTitleContainsAndArchived(
                                            searchCarrier.year, searchCarrier.make, searchCarrier.partName,
                                            false);

                            requestParts = reqeustPartRepository
                                    .findByYearAndMakeAndTitleContainsAndArchivedOrderByIdDesc(

                                            searchCarrier.year, searchCarrier.make, searchCarrier.partName,
                                            false,
                                            Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
                        } else {
                            serachCount = reqeustPartRepository
                                    .countByLocationAndYearAndMakeAndTitleContainsAndArchived(searchCarrier.location,
                                            searchCarrier.year, searchCarrier.make, searchCarrier.partName,
                                            false);

                            requestParts = reqeustPartRepository
                                    .findByLocationAndYearAndMakeAndTitleContainsAndArchivedOrderByIdDesc(
                                            searchCarrier.location,
                                            searchCarrier.year, searchCarrier.make, searchCarrier.partName,
                                            false,
                                            Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
                        }

                        // maek and model and title with location
                    } else if (searchCarrier.year == 0 && !searchCarrier.make.equals("")
                            && !searchCarrier.model.equals("") && !searchCarrier.partName.equals("")) {

                        if (searchCarrier.location == 0) {
                            serachCount = reqeustPartRepository
                                    .countByMakeAndModelAndTitleContainsAndArchived(
                                            searchCarrier.make, searchCarrier.model, searchCarrier.partName,
                                            false);

                            requestParts = reqeustPartRepository
                                    .findByMakeAndModelAndTitleContainsAndArchivedOrderByIdDesc(

                                            searchCarrier.make, searchCarrier.model, searchCarrier.partName,
                                            false,
                                            Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
                        } else {
                            serachCount = reqeustPartRepository
                                    .countByLocationAndMakeAndModelAndTitleContainsAndArchived(searchCarrier.location,
                                            searchCarrier.make, searchCarrier.model, searchCarrier.partName,
                                            false);

                            requestParts = reqeustPartRepository
                                    .findByLocationAndMakeAndModelAndTitleContainsAndArchivedOrderByIdDesc(
                                            searchCarrier.location,
                                            searchCarrier.make, searchCarrier.model, searchCarrier.partName,
                                            false,
                                            Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
                        }

                    } else {
                        if (searchCarrier.location == 0) {
                            serachCount = reqeustPartRepository
                                    .countByYearAndMakeAndModelAndTitleContainsAndArchived(

                                            searchCarrier.year,
                                            searchCarrier.make, searchCarrier.model, searchCarrier.partName, false);

                            requestParts = reqeustPartRepository
                                    .findByYearAndMakeAndModelAndTitleContainsAndArchivedOrderByIdDesc(

                                            searchCarrier.year,
                                            searchCarrier.make, searchCarrier.model, searchCarrier.partName, false,
                                            Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
                        } else {
                            // with location
                            serachCount = reqeustPartRepository
                                    .countByLocationAndYearAndMakeAndModelAndTitleContainsAndArchived(
                                            searchCarrier.location,
                                            searchCarrier.year,
                                            searchCarrier.make, searchCarrier.model, searchCarrier.partName, false);

                            requestParts = reqeustPartRepository
                                    .findByLocationAndYearAndMakeAndModelAndTitleContainsAndArchivedOrderByIdDesc(
                                            searchCarrier.location,
                                            searchCarrier.year,
                                            searchCarrier.make, searchCarrier.model, searchCarrier.partName, false,
                                            Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
                        }
                    }
                }

                for (RequestPart requestpart : requestParts) {
                    requestpart.searchCount = serachCount;
                }

                if (searchCarrier.zipcode != null) {
                    Optional<ZipCode> zipCodeOptional = this.zipCodeRepository.findByZip(searchCarrier.zipcode);
                    if (zipCodeOptional.isPresent()) {
                        this.getAddtionalInfo(requestParts, zipCodeOptional.get());
                    } else {
                        this.getAddtionalInfo(requestParts, null);
                    }
                }

            } else {
                requestParts = reqeustPartRepository.findByYearAndMakeAndModelAndPartName(searchCarrier.year,
                        searchCarrier.make, searchCarrier.model, searchCarrier.partName);
            }
        }
        if (requestParts.isEmpty())

        {
            return new ResponseEntity<>(requestParts, HttpStatus.OK);
        }

        if (searchCarrier.zipcode != null) {

            Optional<ZipCode> zipCodeOptional = this.zipCodeRepository.findByZip(searchCarrier.zipcode);
            if (zipCodeOptional.isPresent()) {
                this.getAddtionalInfo(requestParts, zipCodeOptional.get());
            } else {

                throw new ResourceNotFoundException("Zip code [" + searchCarrier.zipcode + "] is not valid");

            }
        } else {
            this.getAddtionalInfo(requestParts, null);
        }

        return new ResponseEntity<>(requestParts, HttpStatus.OK);

    }

    public long haversine(

            double lat1, double lng1, double lat2, double lng2) {
        int r = 6371; // average radius of the earth in km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lng2 - lng1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                        * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        double d = r * c;
        d = d / 1.609; // to miles

        return Math.round(d);
    }

    private void getAddtionalInfo(List<RequestPart> requestParts, ZipCode zipCode) {

        for (int i = 0; i < requestParts.size(); i++) {
            if (requestParts.get(i).getCompanyId() != null && requestParts.get(i).getCompanyId() != 0) {
                Optional<Company> comapanyOptional = this.companyRepository
                        .findById(requestParts.get(i).getCompanyId());
                if (comapanyOptional.isPresent()) {
                    Company company = comapanyOptional.get();
                    if (company.getName() != null)
                        requestParts.get(i).setBussinessName(company.getName());

                    if (company.getUrl() != null)
                        requestParts.get(i).setBussinessUrl(company.getUrl());
                    requestParts.get(i).setStreet(company.getStreet());
                    requestParts.get(i).setCity(company.getCity());
                    requestParts.get(i).setState(company.getState());
                    requestParts.get(i).setZip(company.getZip());
                    requestParts.get(i).setPhone(company.getPhone());

                    Optional<ZipCode> zipCodeOptional = this.zipCodeRepository.findByZip(company.getZip());
                    if (zipCodeOptional.isPresent()) {
                        requestParts.get(i).setLat(zipCodeOptional.get().getLat());
                        requestParts.get(i).setLng(zipCodeOptional.get().getLng());

                        if (zipCode != null) {
                            requestParts.get(i).setDistance(
                                    this.haversine(zipCode.getLat(), zipCode.getLng(), zipCodeOptional.get().getLat(),
                                            zipCodeOptional.get().getLng()));
                        }
                    }

                }
            } else {

                Optional<User> userOptional = this.userRepository.findById(requestParts.get(i).getUserId());
                if (userOptional.isPresent()) {
                    User user = userOptional.get();
                    if (user.getBussinessname() != null)
                        requestParts.get(i).setBussinessName(user.getBussinessname());

                    if (user.getBussinessUrl() != null)
                        requestParts.get(i).setBussinessUrl(user.getBussinessUrl());

                    for (Address address : user.getAddresses()) {
                        if (address.getName().equals(EAddressType.ADDRESS_TYPE_DEFAULT)
                                || address.getName().equals(EAddressType.ADDRESS_TYPE_SHOP)) {
                            requestParts.get(i).setStreet(address.getStreet());
                            requestParts.get(i).setCity(address.getCity());
                            requestParts.get(i).setState(address.getState());
                            requestParts.get(i).setZip(address.getZip());
                            requestParts.get(i).setPhone(user.getPhone());
                            requestParts.get(i).setLat(address.getLat());
                            requestParts.get(i).setLng(address.getLng());

                            if (zipCode != null) {
                                requestParts.get(i).setDistance(
                                        this.haversine(zipCode.getLat(), zipCode.getLng(), address.getLat(),
                                                address.getLng()));
                            }
                        }
                    }

                }

            }

            if (requestParts.get(i).getStocknumber() == null) {
                requestParts.get(i).setStocknumber("");
            }

        }

    }

    private void getAddtionalInfoIndivisual(RequestPart requestpart, ZipCode zipCode) {

        if (requestpart.getCompanyId() != null && requestpart.getCompanyId() != 0) {
            Optional<Company> comapanyOptional = this.companyRepository.findById(requestpart.getCompanyId());
            if (comapanyOptional.isPresent()) {
                Company company = comapanyOptional.get();
                if (company.getName() != null)
                    requestpart.setBussinessName(company.getName());

                if (company.getUrl() != null)
                    requestpart.setBussinessUrl(company.getUrl());

                requestpart.setStreet(company.getStreet());
                requestpart.setCity(company.getCity());
                requestpart.setState(company.getState());
                requestpart.setZip(company.getZip());
                requestpart.setPhone(company.getPhone());

                Optional<ZipCode> zipCodeOptional = this.zipCodeRepository.findByZip(company.getZip());
                if (zipCodeOptional.isPresent()) {
                    requestpart.setLat(zipCodeOptional.get().getLat());
                    requestpart.setLng(zipCodeOptional.get().getLng());

                    if (zipCode != null) {
                        requestpart.setDistance(
                                this.haversine(zipCode.getLat(), zipCode.getLng(), zipCodeOptional.get().getLat(),
                                        zipCodeOptional.get().getLng()));
                    }
                }

            }
        } else {

            Optional<User> userOptional = this.userRepository.findById(requestpart.getUserId());
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                if (user.getBussinessname() != null)
                    requestpart.setBussinessName(user.getBussinessname());

                if (user.getBussinessUrl() != null)
                    requestpart.setBussinessUrl(user.getBussinessUrl());

                for (Address address : user.getAddresses()) {
                    if (address.getName().equals(EAddressType.ADDRESS_TYPE_DEFAULT)
                            || address.getName().equals(EAddressType.ADDRESS_TYPE_SHOP)) {
                        requestpart.setStreet(address.getStreet());
                        requestpart.setCity(address.getCity());
                        requestpart.setState(address.getState());
                        requestpart.setZip(address.getZip());
                        requestpart.setPhone(user.getPhone());
                        requestpart.setLat(address.getLat());
                        requestpart.setLng(address.getLng());

                        if (zipCode != null) {
                            requestpart.setDistance(
                                    this.haversine(zipCode.getLat(), zipCode.getLng(), address.getLat(),
                                            address.getLng()));
                        }
                    }
                }

            }

        }

        if (requestpart.getStocknumber() == null) {
            requestpart.setStocknumber("");
        }

    }

    @GetMapping("/requestparts/view/{id}")
    public void setRequestpartViewCountById(@PathVariable("id") long id) {

        LOG.info("" + id);
        Optional<RequestPart> requestpartOptional = reqeustPartRepository.findById(id);

        RequestPart requestpart = new RequestPart();

        if (requestpartOptional.isPresent()) {
            requestpart = requestpartOptional.get();
            requestpart.setViewCount(requestpart.getViewCount() + 1);
            requestpart = this.reqeustPartRepository.save(requestpart);
        }

    }

    @GetMapping("/requestparts/uuid/{uuid}")
    public ResponseEntity<RequestPart> getRequestpartByUuid(@PathVariable("uuid") String uuid) {
        Optional<RequestPart> requestpartOptional = reqeustPartRepository.findByToken(uuid);

        RequestPart requestpart = new RequestPart();

        if (requestpartOptional.isPresent()) {
            requestpart = requestpartOptional.get();
            this.getAddtionalInfoIndivisual(requestpart, null);

            return new ResponseEntity<>(requestpart, HttpStatus.OK);
        } else {

            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/requestparts/{id}")
    public ResponseEntity<RequestPart> getRequestpartById(@PathVariable("id") long id) {
        Optional<RequestPart> requestpartOptional = reqeustPartRepository.findById(id);

        RequestPart requestpart = new RequestPart();

        if (requestpartOptional.isPresent()) {
            requestpart = requestpartOptional.get();
            this.getAddtionalInfoIndivisual(requestpart, null);

            return new ResponseEntity<>(requestpart, HttpStatus.OK);
        } else {

            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/requestparts")
    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<RequestPart> createRequestpart(@RequestBody RequestPart requestpartIn,
            HttpServletRequest request) {

        Long userId;
        try {
            RequestPart requestpart = new RequestPart();
            String jwt = parseJwt(request);
            if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
                String email = jwtUtils.getEmailFromJwtToken(jwt);
                System.out.println("--" + email);

                Optional<User> userOptional = this.userRepository.findByEmail(email);
                if (userOptional.isPresent()) {
                    userId = userOptional.get().getId();
                    requestpart.setUserId(userId);
                }

            }
            requestpart.setCompanyId(requestpartIn.getCompanyId());
            requestpart.setComments(requestpartIn.getComments());

            requestpart.setYear(requestpartIn.getYear());
            requestpart.setMake(requestpartIn.getMake());
            requestpart.setModel(requestpartIn.getModel());
            requestpart.setLocation(requestpartIn.getLocation());
            requestpart.setEngine(requestpartIn.getEngine());
            requestpart.setTransmission(requestpartIn.getTransmission());
            requestpart.setPartName(requestpartIn.getPartName());
            requestpart.setPartNumber(requestpartIn.getPartNumber());

            requestpart.setPrice(requestpartIn.getPrice());
            requestpart.setSalePrice(requestpartIn.getSalePrice());
            requestpart.setGrade(requestpartIn.getGrade());

            requestpart.setShipping(requestpartIn.getShipping());
            requestpart.setWarranty(requestpartIn.getWarranty());
            requestpart.setStocknumber(requestpartIn.getStocknumber());

            requestpart.setTitle(requestpartIn.getTitle());
            requestpart.setDescription(requestpartIn.getDescription());
            requestpart.setComments(requestpartIn.getComments());

            String randomCode = UUID.randomUUID().toString();

            if (requestpartIn.getId() == 0) {
                requestpart.setToken(randomCode);
            }

            if (requestpartIn.getStatus() > 0)
                requestpart.setStatus(requestpartIn.getStatus());
            else
                requestpart.setStatus(0);

            requestpart = reqeustPartRepository
                    .save(requestpart);

            return new ResponseEntity<>(requestpart, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/requestparts/{id}")
    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<RequestPart> updateRequestpart(@PathVariable("id") long id,
            @RequestBody RequestPart requestpartIn) {

        Optional<RequestPart> autoparOptional = reqeustPartRepository.findById(id);

        if (autoparOptional.isPresent()) {
            RequestPart requestpart = autoparOptional.get();

            requestpart.setCompanyId(requestpartIn.getCompanyId());

            requestpart.setComments(requestpartIn.getComments());

            requestpart.setYear(requestpartIn.getYear());
            requestpart.setMake(requestpartIn.getMake());
            requestpart.setModel(requestpartIn.getModel());
            requestpart.setLocation(requestpartIn.getLocation());
            requestpart.setEngine(requestpartIn.getEngine());
            requestpart.setTransmission(requestpartIn.getTransmission());
            requestpart.setPartName(requestpartIn.getPartName());
            requestpart.setPartNumber(requestpartIn.getPartNumber());

            requestpart.setPrice(requestpartIn.getPrice());
            requestpart.setSalePrice(requestpartIn.getSalePrice());
            requestpart.setGrade(requestpartIn.getGrade());

            requestpart.setShipping(requestpartIn.getShipping());
            requestpart.setWarranty(requestpartIn.getWarranty());
            requestpart.setStocknumber(requestpartIn.getStocknumber());

            requestpart.setTitle(requestpartIn.getTitle());
            requestpart.setDescription(requestpartIn.getDescription());

            requestpart.setStatus(requestpartIn.getStatus());

            requestpart.setArchived(requestpartIn.isArchived());

            requestpart = reqeustPartRepository.save(requestpart);

            this.getAddtionalInfoIndivisual(requestpart, null);

            return new ResponseEntity<>(requestpart, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/requestparts/{id}")
    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<HttpStatus> deleteRequestpart(@PathVariable("id") long id) {
        try {
            LOG.info("" + id);

            Optional<RequestPart> autoparOptional = reqeustPartRepository.findById(id);

            if (autoparOptional.isPresent()) {
                RequestPart requestpart = autoparOptional.get();

                reqeustPartRepository.delete(requestpart);

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
