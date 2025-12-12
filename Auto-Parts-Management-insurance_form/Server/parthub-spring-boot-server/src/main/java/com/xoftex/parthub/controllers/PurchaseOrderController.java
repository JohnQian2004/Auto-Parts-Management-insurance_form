package com.xoftex.parthub.controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

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

import org.springframework.web.bind.annotation.RestController;

import com.xoftex.parthub.models.PurchaseOrder;

import com.xoftex.parthub.models.SearchCarrier;
import com.xoftex.parthub.models.User;

import com.xoftex.parthub.repository.ImageModelRepository;
import com.xoftex.parthub.repository.PurchaseOrderRepository;
import com.xoftex.parthub.repository.SavedItemRepository;
import com.xoftex.parthub.repository.UserRepository;
import com.xoftex.parthub.repository.ZipCodeRepository;
import com.xoftex.parthub.security.jwt.JwtUtils;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;

@Tag(name = "Purchase Order", description = "Purchase Order management APIs")
// for Angular Client (withCredentials)
// @CrossOrigin(origins = "http://localhost:4200", maxAge = 3600,
// allowCredentials = "true")
// @CrossOrigin(origins = "*", maxAge = 3600)
@CrossOrigin("*")
@RestController
@RequestMapping("/api")
public class PurchaseOrderController {

    @Autowired
    PurchaseOrderRepository purchaseOrderRepository;

    @Autowired
    ImageModelRepository imageModelRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    ZipCodeRepository zipCodeRepository;

    @Autowired
    SavedItemRepository savedItemRepository;

    @Autowired
    private JwtUtils jwtUtils;

    @Value("${image.root.path}")
    // String filePath = "C:\\Projects\\images\\";
    String filePath = "";

    String imageNamePrefix = "test_image_";

    private static final Logger LOG = LoggerFactory.getLogger(AutoPartController.class);

    @GetMapping("/purchaseorders/company/{id}/{status}")
    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<List<PurchaseOrder>> getAllCompanyPurchaseOrders(
            @PathVariable("id") long companyId, @PathVariable("status") int status) {

        try {
            List<PurchaseOrder> purchaseOrder = new ArrayList<PurchaseOrder>();

            purchaseOrder = this.purchaseOrderRepository.findByCompanyIdAndArchivedAndStatusNot(companyId, false,
                    status);

            if (purchaseOrder.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            return new ResponseEntity<>(purchaseOrder, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/purchaseorders/search")
    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<List<PurchaseOrder>> searchAllPurchaseOrders(@RequestBody SearchCarrier searchCarrier) {

        LOG.info(searchCarrier.year + " " + searchCarrier.make + " " + searchCarrier.model + " "
                + searchCarrier.partName + " "
                + searchCarrier.partNumber + " " + searchCarrier.zipcode);

        List<PurchaseOrder> purchaseOrders = new ArrayList<PurchaseOrder>();
        if (searchCarrier.archived == true) {
            purchaseOrders = this.purchaseOrderRepository
                    .findByPartNumberContainsOrTitleContainsOrDescriptionContainsAndCompanyIdAndArchived(
                            searchCarrier.partNumber, searchCarrier.partNumber, searchCarrier.partNumber,
                            searchCarrier.companyId, searchCarrier.archived);

        } else if (searchCarrier.status > 0) {
            purchaseOrders = purchaseOrderRepository
                    .findByPartNumberContainsOrTitleContainsOrDescriptionContainsAndCompanyIdAndArchivedAndStatus(
                            searchCarrier.partNumber, searchCarrier.partNumber, searchCarrier.partNumber,
                            searchCarrier.companyId, searchCarrier.archived,
                            searchCarrier.status);
        } else if (!searchCarrier.partNumber.equals("")) {
            purchaseOrders = purchaseOrderRepository
                    .findByPartNumberContainsOrTitleContainsOrDescriptionContainsAndCompanyIdAndArchivedAndStatusNot(
                            searchCarrier.partNumber, searchCarrier.partNumber, searchCarrier.partNumber,
                            searchCarrier.companyId, searchCarrier.archived, 3);
        } else {

            switch (searchCarrier.type) {
                case 4: {

                    List<PurchaseOrder> autoParts0 = this.purchaseOrderRepository
                            .findByCompanyIdAndArchivedAndYearAndStatus(
                                    searchCarrier.companyId, false, searchCarrier.year, 0);
                    purchaseOrders.addAll(autoParts0);
                    List<PurchaseOrder> autoParts1 = this.purchaseOrderRepository
                            .findByCompanyIdAndArchivedAndYearAndStatus(
                                    searchCarrier.companyId, false, searchCarrier.year, 1);
                    purchaseOrders.addAll(autoParts1);
                    List<PurchaseOrder> autoParts2 = this.purchaseOrderRepository
                            .findByCompanyIdAndArchivedAndYearAndStatus(
                                    searchCarrier.companyId, false, searchCarrier.year, 2);
                    purchaseOrders.addAll(autoParts2);

                }
                    break;
                case 3: {
                    List<PurchaseOrder> autoParts0 = this.purchaseOrderRepository
                            .findByCompanyIdAndArchivedAndYearAndMakeAndStatus(
                                    searchCarrier.companyId, false, searchCarrier.year, searchCarrier.make, 0);
                    purchaseOrders.addAll(autoParts0);
                    List<PurchaseOrder> autoParts1 = this.purchaseOrderRepository
                            .findByCompanyIdAndArchivedAndYearAndMakeAndStatus(
                                    searchCarrier.companyId, false, searchCarrier.year, searchCarrier.make, 1);
                    purchaseOrders.addAll(autoParts1);
                    List<PurchaseOrder> autoParts2 = this.purchaseOrderRepository
                            .findByCompanyIdAndArchivedAndYearAndMakeAndStatus(
                                    searchCarrier.companyId, false, searchCarrier.year, searchCarrier.make, 2);
                    purchaseOrders.addAll(autoParts2);
                }
                    break;

                case 2: {
                    List<PurchaseOrder> autoParts0 = this.purchaseOrderRepository
                            .findByCompanyIdAndArchivedAndYearAndMakeAndModelAndStatus(
                                    searchCarrier.companyId, false, searchCarrier.year, searchCarrier.make,
                                    searchCarrier.model, 0);
                    purchaseOrders.addAll(autoParts0);
                    List<PurchaseOrder> autoParts1 = this.purchaseOrderRepository
                            .findByCompanyIdAndArchivedAndYearAndMakeAndModelAndStatus(
                                    searchCarrier.companyId, false, searchCarrier.year, searchCarrier.make,
                                    searchCarrier.model, 1);
                    purchaseOrders.addAll(autoParts1);
                    List<PurchaseOrder> autoParts2 = this.purchaseOrderRepository
                            .findByCompanyIdAndArchivedAndYearAndMakeAndModelAndStatus(
                                    searchCarrier.companyId, false, searchCarrier.year, searchCarrier.make,
                                    searchCarrier.model, 2);
                    purchaseOrders.addAll(autoParts2);

                }
                    break;
            }

        }
        if (purchaseOrders.isEmpty()) {
            return new ResponseEntity<>(purchaseOrders, HttpStatus.OK);
        }

        return new ResponseEntity<>(purchaseOrders, HttpStatus.OK);

    }

    @PostMapping("/purchaseorders/search/status/page")
    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<List<PurchaseOrder>> searchAllPurchaseOrderStatusPaging(
            @RequestBody SearchCarrier searchCarrier) {
        List<PurchaseOrder> purchaseOrders = new ArrayList<PurchaseOrder>();
        int serachCount = 0;
        if (searchCarrier.archived == true) {
            purchaseOrders = purchaseOrderRepository.findByCompanyIdAndArchivedOrderByIdDesc(searchCarrier.companyId,
                    true,

                    Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));

            serachCount = purchaseOrderRepository.countByCompanyIdAndArchived(searchCarrier.companyId,
                    true);
        } else {
            purchaseOrders = purchaseOrderRepository.findByCompanyIdAndArchivedAndStatusOrderByIdDesc(
                    searchCarrier.companyId,
                    false,
                    searchCarrier.status,
                    Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));

            serachCount = purchaseOrderRepository.countByCompanyIdAndArchivedAndStatus(searchCarrier.companyId,
                    false, searchCarrier.status);
        }

        for (PurchaseOrder purchaseOrder : purchaseOrders) {
            purchaseOrder.searchCount = serachCount;

        }
        // =======
        return new ResponseEntity<>(purchaseOrders, HttpStatus.OK);
    }

    @PostMapping("/purchaseorders/search/page")
    public ResponseEntity<List<PurchaseOrder>> searchAllPartsPaging(@RequestBody SearchCarrier searchCarrier) {

        LOG.info(searchCarrier.year + " " + searchCarrier.make + " " + searchCarrier.model + " "
                + searchCarrier.partName + " "
                + searchCarrier.partNumber + " " + searchCarrier.zipcode);

        int serachCount = 0;

        List<PurchaseOrder> purchseOrders = new ArrayList<PurchaseOrder>();

        if (!searchCarrier.partNumber.equals("")) {

            if (searchCarrier.pageNumber >= 0 && searchCarrier.pageSize > 1) {

                serachCount = purchaseOrderRepository.countByPartNumberAndStatus(searchCarrier.partNumber, 1);

                purchseOrders = purchaseOrderRepository.findByPartNumberAndStatus(searchCarrier.partNumber, 1,
                        Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
                for (PurchaseOrder purchaseOrder : purchseOrders) {
                    purchaseOrder.searchCount = serachCount;
                }
            }

        } else {

            if (searchCarrier.pageNumber >= 0 && searchCarrier.pageSize > 1) {

                serachCount = purchaseOrderRepository.countByYearAndMakeAndModelAndPartNameAndStatus(searchCarrier.year,
                        searchCarrier.make, searchCarrier.model, searchCarrier.partName, 1);

                purchseOrders = purchaseOrderRepository.findByYearAndMakeAndModelAndPartNameAndStatus(
                        searchCarrier.year,
                        searchCarrier.make, searchCarrier.model, searchCarrier.partName, 1,
                        Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));

                for (PurchaseOrder purchaseOrder : purchseOrders) {
                    purchaseOrder.searchCount = serachCount;
                }

            } else {
                purchseOrders = purchaseOrderRepository.findByYearAndMakeAndModelAndPartNameAndStatus(
                        searchCarrier.year,
                        searchCarrier.make, searchCarrier.model, searchCarrier.partName, 1);
            }
        }
        if (purchseOrders.isEmpty())

        {
            return new ResponseEntity<>(purchseOrders, HttpStatus.OK);
        }

        return new ResponseEntity<>(purchseOrders, HttpStatus.OK);

    }

    @PostMapping("/purchaseorders")
    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<PurchaseOrder> createPurchaseOrder(@RequestBody PurchaseOrder purchaseOrderIn,
            HttpServletRequest request) {

        Long userId;
        try {
            PurchaseOrder purchaseOrder = new PurchaseOrder();
            String jwt = parseJwt(request);
            if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
                String email = jwtUtils.getEmailFromJwtToken(jwt);
                System.out.println("--" + email);

                Optional<User> userOptional = this.userRepository.findByEmail(email);
                if (userOptional.isPresent()) {
                    userId = userOptional.get().getId();
                    purchaseOrder.setUserId(userId);
                }

            }

            if (purchaseOrderIn.getToken() == null || purchaseOrderIn.getToken().equals("")) {

                String randomCode = UUID.randomUUID().toString();
                purchaseOrderIn.setToken(randomCode);
            }

            purchaseOrder.setCompanyId(purchaseOrderIn.getCompanyId());
            purchaseOrder.setComments(purchaseOrderIn.getComments());

            purchaseOrder.setReason(purchaseOrderIn.getReason());

            purchaseOrder.setSource(purchaseOrderIn.getSource());
            purchaseOrder.setApprovedAt(purchaseOrderIn.getApprovedAt());
            purchaseOrder.setApprovedBy(purchaseOrderIn.getApprovedBy());

            purchaseOrder.setVendorId(purchaseOrderIn.getVendorId());
            purchaseOrder.setPaymentMethodId(purchaseOrderIn.getPaymentMethodId());

            purchaseOrder.setYear(purchaseOrderIn.getYear());
            purchaseOrder.setMake(purchaseOrderIn.getMake());
            purchaseOrder.setModel(purchaseOrderIn.getModel());
            purchaseOrder.setEngine(purchaseOrderIn.getEngine());
            purchaseOrder.setTransmission(purchaseOrderIn.getTransmission());
            purchaseOrder.setPartName(purchaseOrderIn.getPartName());
            purchaseOrder.setPartNumber(purchaseOrderIn.getPartNumber());

            purchaseOrder.setPrice(purchaseOrderIn.getPrice());
            purchaseOrder.setGrade(purchaseOrderIn.getGrade());

            purchaseOrder.setShipping(purchaseOrderIn.getShipping());
            purchaseOrder.setWarranty(purchaseOrderIn.getWarranty());
            purchaseOrder.setStocknumber(purchaseOrderIn.getStocknumber());

            purchaseOrder.setTitle(purchaseOrderIn.getTitle());
            purchaseOrder.setDescription(purchaseOrderIn.getDescription());
            purchaseOrder.setPublished(purchaseOrderIn.isPublished());

            purchaseOrder.setStatus(0);

            purchaseOrder = this.purchaseOrderRepository
                    .save(purchaseOrder);

            return new ResponseEntity<>(purchaseOrder, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/purchaseorders/{id}")
    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<PurchaseOrder> updatePurchaseOrder(@PathVariable("id") long id,
            @RequestBody PurchaseOrder purchaseOrderIn) {

        Optional<PurchaseOrder> purchaseOrderOptional = purchaseOrderRepository.findById(id);

        if (purchaseOrderOptional.isPresent()) {
            PurchaseOrder purchaseOrder = purchaseOrderOptional.get();

            purchaseOrder.setCompanyId(purchaseOrderIn.getCompanyId());
            purchaseOrder.setVendorId(purchaseOrderIn.getVendorId());
            purchaseOrder.setPaymentMethodId(purchaseOrderIn.getPaymentMethodId());
            purchaseOrder.setComments(purchaseOrderIn.getComments());

            purchaseOrder.setReason(purchaseOrderIn.getReason());

            purchaseOrder.setSource(purchaseOrderIn.getSource());
            purchaseOrder.setApprovedAt(purchaseOrderIn.getApprovedAt());
            purchaseOrder.setApprovedBy(purchaseOrderIn.getApprovedBy());

            purchaseOrder.setYear(purchaseOrderIn.getYear());
            purchaseOrder.setMake(purchaseOrderIn.getMake());
            purchaseOrder.setModel(purchaseOrderIn.getModel());
            purchaseOrder.setEngine(purchaseOrderIn.getEngine());
            purchaseOrder.setTransmission(purchaseOrderIn.getTransmission());
            purchaseOrder.setPartName(purchaseOrderIn.getPartName());
            purchaseOrder.setPartNumber(purchaseOrderIn.getPartNumber());

            purchaseOrder.setPrice(purchaseOrderIn.getPrice());
            purchaseOrder.setGrade(purchaseOrderIn.getGrade());

            purchaseOrder.setShipping(purchaseOrderIn.getShipping());
            purchaseOrder.setWarranty(purchaseOrderIn.getWarranty());
            purchaseOrder.setStocknumber(purchaseOrderIn.getStocknumber());

            purchaseOrder.setTitle(purchaseOrderIn.getTitle());
            purchaseOrder.setDescription(purchaseOrderIn.getDescription());

            purchaseOrder.setStatus(purchaseOrderIn.getStatus());

            purchaseOrder.setPublished(purchaseOrderIn.isPublished());
            purchaseOrder.setArchived(purchaseOrderIn.isArchived());

            purchaseOrder = this.purchaseOrderRepository.save(purchaseOrder);

            return new ResponseEntity<>(purchaseOrder, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/purchaseorders/{id}")
    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<HttpStatus> deleteAutopart(@PathVariable("id") long id) {
        try {
            LOG.info("" + id);

            Optional<PurchaseOrder> autoparOptional = this.purchaseOrderRepository.findById(id);

            if (autoparOptional.isPresent()) {
                PurchaseOrder purchaseOrder = autoparOptional.get();

                purchaseOrderRepository.delete(purchaseOrder);

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
