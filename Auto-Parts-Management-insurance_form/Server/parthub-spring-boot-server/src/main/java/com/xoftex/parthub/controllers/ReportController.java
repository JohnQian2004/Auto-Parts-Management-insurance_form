package com.xoftex.parthub.controllers;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.xoftex.parthub.models.ImageModelVehicle;
import com.xoftex.parthub.models.Payment;
import com.xoftex.parthub.models.Receipt;
import com.xoftex.parthub.models.SearchCarrier;
import com.xoftex.parthub.models.Vehicle;
import com.xoftex.parthub.models.VehicleHistory;
import com.xoftex.parthub.repository.PaymentRepository;
import com.xoftex.parthub.repository.ReceiptRepository;
import com.xoftex.parthub.repository.VehicleHistoryRepository;
import com.xoftex.parthub.repository.VehicleRepository;

//for Angular Client (withCredentials)
@CrossOrigin("*")
@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private static final Logger LOG = LoggerFactory.getLogger(ReportController.class);

    @Autowired
    VehicleRepository vehicleRepository;

    @Autowired
    VehicleHistoryRepository vehicleHistoryRepository;

    @Autowired
    PaymentRepository paymentRepository;

    @Autowired
    ReceiptRepository receiptRepository;

    /**
     * Report Engine - Search Vehicles (Integrated from VehicleController)
     * This is the same searchVehicle functionality but in ReportController
     * for report-specific data loading with nested collections
     */
    @PostMapping("/search-vehicles")
    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<List<Vehicle>> searchVehiclesForReports(@RequestBody SearchCarrier searchCarrier) {

        LOG.info("Report Engine - Searching vehicles: " + searchCarrier.year + " " + searchCarrier.make + " "
                + searchCarrier.model + " " + searchCarrier.color);

        List<Vehicle> vehicles = new ArrayList<Vehicle>();

        if (!searchCarrier.partNumber.equals("")) {

            switch (searchCarrier.type) {

                case 1: {
                    vehicles = this.vehicleRepository.findByYearAndMakeAndModelAndColorAndCompanyIdAndArchived(
                            searchCarrier.year,
                            searchCarrier.make, searchCarrier.model, searchCarrier.color, searchCarrier.companyId,
                            searchCarrier.archived);
                }
                    break;
                case 2: {
                    vehicles = this.vehicleRepository.findByYearAndMakeAndModelAndCompanyIdAndArchived(
                            searchCarrier.year,
                            searchCarrier.make, searchCarrier.model, searchCarrier.companyId, searchCarrier.archived);
                }
                    break;
                case 3: {
                    vehicles = this.vehicleRepository.findByYearAndMakeAndCompanyIdAndArchived(searchCarrier.year,
                            searchCarrier.make, searchCarrier.companyId, searchCarrier.archived);
                }
                    break;
                case 4: {
                    vehicles = this.vehicleRepository.findByYearAndCompanyIdAndArchived(searchCarrier.year,
                            searchCarrier.companyId, searchCarrier.archived);
                }
                    break;

                case 5: {

                    int searchCount = this.vehicleRepository.countByCompanyIdAndArchived(searchCarrier.companyId,
                            searchCarrier.archived);

                    vehicles = this.vehicleRepository.findByCompanyIdAndArchivedOrderBySequenceNumberAsc(
                            searchCarrier.companyId,
                            searchCarrier.archived,
                            Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));

                    for (Vehicle vehicle : vehicles) {
                        vehicle.searchCount = searchCount;
                    }

                }
                    break;

                case 6: {

                    int searchCount = this.vehicleRepository.countByCustomerLastName(searchCarrier.companyId,
                            searchCarrier.archived, searchCarrier.lastName);

                    vehicles = this.vehicleRepository.findByCustomerLastName(searchCarrier.companyId,
                            searchCarrier.archived,
                            searchCarrier.lastName,
                            Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));

                    for (Vehicle vehicle : vehicles) {
                        vehicle.searchCount = searchCount;
                    }

                }
                    break;

                case 7: {

                    vehicles = this.vehicleRepository.findByCompanyIdAndArchivedOrderBySequenceNumberAsc(
                            searchCarrier.companyId,
                            searchCarrier.archived);

                    for (Vehicle vehicle : vehicles) {
                        // vehicle.setJobs(this.jobRepository.findByVehicleIdOrderBySequenceNumberAsc(vehicle.getId()));
                    }

                }
                    break;

                case 8: {

                    int searchCount = this.vehicleRepository.countByCustomerLastName(searchCarrier.companyId,
                            searchCarrier.archived, searchCarrier.lastName);

                    vehicles = this.vehicleRepository.findByCustomerLastName(searchCarrier.companyId,
                            searchCarrier.archived,
                            searchCarrier.lastName,
                            Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));

                    for (Vehicle vehicle : vehicles) {
                        vehicle.searchCount = searchCount;
                    }

                }
                    break;

                default: {
                    vehicles = this.vehicleRepository.findByYearAndMakeAndModelAndColorAndCompanyIdAndArchived(
                            searchCarrier.year,
                            searchCarrier.make, searchCarrier.model, searchCarrier.color, searchCarrier.companyId,
                            searchCarrier.archived);
                }
                    break;
            }

        } else {

            switch (searchCarrier.type) {

                case 1: {
                    vehicles = this.vehicleRepository.findByYearAndMakeAndModelAndColorAndCompanyIdAndArchived(
                            searchCarrier.year,
                            searchCarrier.make, searchCarrier.model, searchCarrier.color, searchCarrier.companyId,
                            searchCarrier.archived);
                }
                    break;
                case 2: {
                    vehicles = this.vehicleRepository.findByYearAndMakeAndModelAndCompanyIdAndArchived(
                            searchCarrier.year,
                            searchCarrier.make, searchCarrier.model, searchCarrier.companyId, searchCarrier.archived);
                }
                    break;
                case 3: {
                    vehicles = this.vehicleRepository.findByYearAndMakeAndCompanyIdAndArchived(searchCarrier.year,
                            searchCarrier.make, searchCarrier.companyId, searchCarrier.archived);
                }
                    break;
                case 4: {
                    vehicles = this.vehicleRepository.findByYearAndCompanyIdAndArchived(searchCarrier.year,
                            searchCarrier.companyId, searchCarrier.archived);
                }
                    break;

                case 5: {

                    int searchCount = this.vehicleRepository.countByCompanyIdAndArchived(searchCarrier.companyId,
                            searchCarrier.archived);

                    vehicles = this.vehicleRepository.findByCompanyIdAndArchivedOrderBySequenceNumberAsc(
                            searchCarrier.companyId,
                            searchCarrier.archived,
                            Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));

                    for (Vehicle vehicle : vehicles) {
                        vehicle.searchCount = searchCount;
                    }

                }
                    break;

                case 6: {

                    int searchCount = this.vehicleRepository.countByCustomerLastName(searchCarrier.companyId,
                            searchCarrier.archived, searchCarrier.lastName);

                    vehicles = this.vehicleRepository.findByCustomerLastName(searchCarrier.companyId,
                            searchCarrier.archived,
                            searchCarrier.lastName,
                            Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));

                    for (Vehicle vehicle : vehicles) {
                        vehicle.searchCount = searchCount;
                    }

                }
                    break;

                case 7: {

                    vehicles = this.vehicleRepository.findByCompanyIdAndArchivedOrderBySequenceNumberAsc(
                            searchCarrier.companyId,
                            searchCarrier.archived);

                    for (Vehicle vehicle : vehicles) {
                        // vehicle.setJobs(this.jobRepository.findByVehicleIdOrderBySequenceNumberAsc(vehicle.getId()));
                    }

                }
                    break;

                case 8: {

                    int searchCount = this.vehicleRepository.countByCustomerLastName(searchCarrier.companyId,
                            searchCarrier.archived, searchCarrier.lastName);

                    vehicles = this.vehicleRepository.findByCustomerLastName(searchCarrier.companyId,
                            searchCarrier.archived,
                            searchCarrier.lastName,
                            Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));

                    for (Vehicle vehicle : vehicles) {
                        vehicle.searchCount = searchCount;
                    }

                }
                    break;

                default: {
                    vehicles = this.vehicleRepository.findByYearAndMakeAndModelAndColorAndCompanyIdAndArchived(
                            searchCarrier.year,
                            searchCarrier.make, searchCarrier.model, searchCarrier.color, searchCarrier.companyId,
                            searchCarrier.archived);
                }
                    break;
            }

        }

        for (Vehicle vehicle : vehicles) {

            Optional<VehicleHistory> vehicleHistoryOptional = vehicleHistoryRepository
                    .findTopByVehicleIdOrderByCreatedAtDesc(vehicle.getId());
            if (vehicleHistoryOptional.isPresent()) {
                VehicleHistory vehicleHistory = vehicleHistoryOptional.get();

                vehicle.setLastVehicleHistory(vehicleHistory);
                vehicle.setUpdatedAt(vehicleHistory.getCreatedAt());
                vehicle.setLastUpdateObjectName(this.getFirstWord(vehicleHistory.getName()));

                String iconClassName = this.transferInfoToIconClass(vehicle, vehicleHistory.getName());

                if (iconClassName != null && iconClassName.contains("fa-solid")) {
                    vehicle.setLastUpdateIconName(iconClassName);
                } else {
                    vehicle.setLastUpdateIconName("fa-solid fa-question");
                }

            } else {
                vehicle.setLastUpdateObjectName("");
            }

            vehicle.setSerachString(
                    vehicle.getYear() + " "
                            + vehicle.getMake() + " "
                            + vehicle.getModel() + " "
                            + vehicle.getColor() + " "
                            + vehicle.getInsuranceCompany() + " "
                            + vehicle.getLoanerCarName() + " "
                            + vehicle.getCustomer().getFirstName() + " "
                            + vehicle.getCustomer().getLastName() + " "
                            + vehicle.getCustomer().getPhone() + " ");

            vehicle.setDaysInShop((int) this.getDifferenceDays(vehicle.getCreatedAt(), new Date()));
            if (vehicle.getRentalDate() != null)
                vehicle.setRentalCountDown((int) this.getDifferenceDaysRental(new Date(), vehicle.getRentalDate()));
            if (vehicle.getTargetDate() != null)
                vehicle.setTargetDateCountDown((int) this.getDifferenceDaysRental(new Date(), vehicle.getTargetDate()));

            vehicle.setDaysInShopPrecentage(vehicle.getDaysInShop() * 100 / 14);
            this.setShowInSearchImageId(vehicle);
        }

        LOG.info("Report Engine - Found " + vehicles.size() + " vehicles for company " + searchCarrier.companyId);

        return new ResponseEntity<>(vehicles, HttpStatus.OK);
    }

    /**
     * Report Engine - Get Vehicles with Nested Data (Report-Specific)
     * This will be the enhanced version with nested collections for payment
     * tracking
     */
    @GetMapping("/vehicles-with-nested-data")
    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<List<Vehicle>> getVehiclesWithNestedData(
            @RequestParam Long companyId,
            @RequestParam(required = false) String[] includeCollections,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String paymentStatus) {

        LOG.info("Report Engine - Getting vehicles with nested data for company: " + companyId);

        // For now, use the same search logic as searchVehicle but with type 5 (all
        // vehicles for company)
        SearchCarrier searchCarrier = new SearchCarrier();
        searchCarrier.companyId = companyId.intValue();
        searchCarrier.archived = false; // Get current vehicles
        searchCarrier.type = 5; // All vehicles for company
        searchCarrier.pageSize = 1000; // Large page size for reports
        searchCarrier.pageNumber = 0;
        searchCarrier.partNumber = "";

        List<Vehicle> vehicles = new ArrayList<Vehicle>();

        int searchCount = this.vehicleRepository.countByCompanyIdAndArchived(searchCarrier.companyId,
                searchCarrier.archived);

        vehicles = this.vehicleRepository.findByCompanyIdAndArchivedOrderBySequenceNumberAsc(searchCarrier.companyId,
                searchCarrier.archived,
                Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));

        for (Vehicle vehicle : vehicles) {
            vehicle.searchCount = searchCount;

            // Load nested collections based on includeCollections parameter
            if (includeCollections != null) {
                for (String collection : includeCollections) {
                    switch (collection.toLowerCase()) {
                        case "payments":
                            // Load payments for this vehicle
                            List<Payment> payments = this.paymentRepository.findByVehicleId(vehicle.getId());
                            vehicle.payments = payments;
                            LOG.debug("Loaded " + payments.size() + " payments for vehicle " + vehicle.getId());
                            break;

                        case "receipts":
                            // Load receipts for this vehicle
                            List<Receipt> receipts = this.receiptRepository.findByVehicleId(vehicle.getId());
                            vehicle.receipts = receipts;
                            LOG.debug("Loaded " + receipts.size() + " receipts for vehicle " + vehicle.getId());
                            break;

                        case "supplements":
                            // Supplements are already loaded via JPA relationship
                            LOG.debug("Supplements already available for vehicle " + vehicle.getId() +
                                    " (count: " + vehicle.getSupplements().size() + ")");
                            break;

                        default:
                            LOG.warn("Unknown collection type requested: " + collection);
                            break;
                    }
                }
            } else {
                // Default: load all collections for payment tracking report
                List<Payment> payments = this.paymentRepository.findByVehicleId(vehicle.getId());
                vehicle.payments = payments;

                List<Receipt> receipts = this.receiptRepository.findByVehicleId(vehicle.getId());
                vehicle.receipts = receipts;

                LOG.debug("Loaded default collections for vehicle " + vehicle.getId() +
                        " - Payments: " + payments.size() + ", Receipts: " + receipts.size() +
                        ", Supplements: " + vehicle.getSupplements().size());
            }

            // Apply the same vehicle processing as in searchVehiclesForReports
            this.processVehicleForReport(vehicle);
        }

        LOG.info("Report Engine - Loaded " + vehicles.size() + " vehicles with nested data");

        return new ResponseEntity<>(vehicles, HttpStatus.OK);
    }

    @PostMapping("/vehicles-with-nested-data-payment-tracking")
    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<List<Vehicle>> getVehiclesWithNestedDataPaymentTracking(
            @RequestParam Long companyId,
            @RequestParam(required = false) String[] includeCollections,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String paymentStatus,
            @RequestParam(required = false) Long dateFrom,
            @RequestParam(required = false) Long dateTo,
            @RequestBody SearchCarrier searchCarrier) {

        LOG.info("Report Engine - Getting vehicles with nested data for company: " + companyId);

        // Default SearchCarrier if not provided
        if (searchCarrier == null) {
            searchCarrier = new SearchCarrier();
            searchCarrier.companyId = companyId.intValue();
            searchCarrier.archived = false; // Get current vehicles
            searchCarrier.type = 5; // All vehicles for company
            searchCarrier.pageSize = 1000; // Large page size for reports
            searchCarrier.pageNumber = 0;
            searchCarrier.partNumber = "";
        }

        List<Vehicle> vehicles = new ArrayList<Vehicle>();
        int searchCount;

        // Handle archived data with date filtering if date parameters are provided
        if (searchCarrier.archived && dateFrom != null && dateTo != null) {
            Date fromDate = new Date(dateFrom);
            Date toDate = new Date(dateTo);
            LOG.info("Querying archived vehicles with date range: " + fromDate + " to " + toDate);

            // Count vehicles in date range
            searchCount = Math.toIntExact(this.vehicleRepository.countByCompanyIdAndArchivedAndUpdatedAtBetween(
                    (long) searchCarrier.companyId,
                    searchCarrier.archived,
                    fromDate,
                    toDate));

            // Get vehicles in date range
            vehicles = this.vehicleRepository.findByCompanyIdAndArchivedAndUpdatedAtBetween(
                    searchCarrier.companyId,
                    searchCarrier.archived,
                    fromDate,
                    toDate);

            // Apply pagination manually since we're using a custom query
            int startIndex = searchCarrier.pageNumber * searchCarrier.pageSize;
            int endIndex = Math.min(startIndex + searchCarrier.pageSize, vehicles.size());
            if (startIndex < vehicles.size()) {
                vehicles = vehicles.subList(startIndex, endIndex);
            } else {
                vehicles = new ArrayList<>();
            }

        } else {
            // Standard query for current vehicles or archived without date filter
            LOG.info("Querying vehicles with standard search: archived=" + searchCarrier.archived);

            searchCount = this.vehicleRepository.countByCompanyIdAndArchived(searchCarrier.companyId,
                    searchCarrier.archived);

            vehicles = this.vehicleRepository.findByCompanyIdAndArchivedOrderBySequenceNumberAsc(
                    searchCarrier.companyId,
                    searchCarrier.archived,
                    Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
        }

        for (Vehicle vehicle : vehicles) {
            vehicle.searchCount = searchCount;

            // Load nested collections based on includeCollections parameter
            if (includeCollections != null) {
                for (String collection : includeCollections) {
                    switch (collection.toLowerCase()) {
                        case "payments":
                            // Load payments for this vehicle
                            List<Payment> payments = this.paymentRepository.findByVehicleId(vehicle.getId());
                            vehicle.payments = payments;
                            LOG.debug("Loaded " + payments.size() + " payments for vehicle " + vehicle.getId());
                            break;

                        case "receipts":
                            // Load receipts for this vehicle
                            List<Receipt> receipts = this.receiptRepository.findByVehicleId(vehicle.getId());
                            vehicle.receipts = receipts;
                            LOG.debug("Loaded " + receipts.size() + " receipts for vehicle " + vehicle.getId());
                            break;

                        case "supplements":
                            // Supplements are already loaded via JPA relationship
                            LOG.debug("Supplements already available for vehicle " + vehicle.getId() +
                                    " (count: " + vehicle.getSupplements().size() + ")");
                            break;

                        default:
                            LOG.warn("Unknown collection type requested: " + collection);
                            break;
                    }
                }
            } else {
                // Default: load all collections for payment tracking report
                List<Payment> payments = this.paymentRepository.findByVehicleId(vehicle.getId());
                vehicle.payments = payments;

                List<Receipt> receipts = this.receiptRepository.findByVehicleId(vehicle.getId());
                vehicle.receipts = receipts;

                LOG.debug("Loaded default collections for vehicle " + vehicle.getId() +
                        " - Payments: " + payments.size() + ", Receipts: " + receipts.size() +
                        ", Supplements: " + vehicle.getSupplements().size());
            }

            // Apply the same vehicle processing as in searchVehiclesForReports
            this.processVehicleForReport(vehicle);
        }

        LOG.info("Report Engine - Loaded " + vehicles.size() + " vehicles with nested data");

        return new ResponseEntity<>(vehicles, HttpStatus.OK);
    }

    // Helper method to process vehicle for reports (shared logic)
    private void processVehicleForReport(Vehicle vehicle) {
        // Vehicle History Processing
        Optional<VehicleHistory> vehicleHistoryOptional = vehicleHistoryRepository
                .findTopByVehicleIdOrderByCreatedAtDesc(vehicle.getId());
        if (vehicleHistoryOptional.isPresent()) {
            VehicleHistory vehicleHistory = vehicleHistoryOptional.get();
            vehicle.setLastVehicleHistory(vehicleHistory);
            vehicle.setUpdatedAt(vehicleHistory.getCreatedAt());
            vehicle.setLastUpdateObjectName(this.getFirstWord(vehicleHistory.getName()));

            String iconClassName = this.transferInfoToIconClass(vehicle, vehicleHistory.getName());
            if (iconClassName != null && iconClassName.contains("fa-solid")) {
                vehicle.setLastUpdateIconName(iconClassName);
            } else {
                vehicle.setLastUpdateIconName("fa-solid fa-question");
            }
        } else {
            vehicle.setLastUpdateObjectName("");
        }

        // Search String Generation
        vehicle.setSerachString(
                vehicle.getYear() + " "
                        + vehicle.getMake() + " "
                        + vehicle.getModel() + " "
                        + vehicle.getColor() + " "
                        + vehicle.getInsuranceCompany() + " "
                        + vehicle.getLoanerCarName() + " "
                        + vehicle.getCustomer().getFirstName() + " "
                        + vehicle.getCustomer().getLastName() + " "
                        + vehicle.getCustomer().getPhone() + " ");

        // Days in Shop Calculations
        vehicle.setDaysInShop((int) this.getDifferenceDays(vehicle.getCreatedAt(), new Date()));
        if (vehicle.getRentalDate() != null)
            vehicle.setRentalCountDown((int) this.getDifferenceDaysRental(new Date(), vehicle.getRentalDate()));
        if (vehicle.getTargetDate() != null)
            vehicle.setTargetDateCountDown((int) this.getDifferenceDaysRental(new Date(), vehicle.getTargetDate()));

        vehicle.setDaysInShopPrecentage(vehicle.getDaysInShop() * 100 / 14);
        this.setShowInSearchImageId(vehicle);
    }

    public long getDifferenceDays(Date d1, Date d2) {
        long diff = d2.getTime() - d1.getTime();
        return TimeUnit.DAYS.convert(diff, TimeUnit.MILLISECONDS) + 1;
    }

    public long getDifferenceDaysRental(Date d1, Date d2) {
        long diff = d2.getTime() - d1.getTime();
        if (diff > 0) {
            return TimeUnit.DAYS.convert(diff, TimeUnit.MILLISECONDS) + 1;
        } else {
            return 0 - (TimeUnit.DAYS.convert(0 - diff, TimeUnit.MILLISECONDS) + 1);
        }
    }

    public void setShowInSearchImageId(Vehicle vehicle) {

        // set showInSearchImageId
        int counter = 0;
        for (ImageModelVehicle imageModel : vehicle.getImageModels()) {

            // just set first one only
            if (counter == 0)
                vehicle.showInSearchImageId = imageModel.getId();

            if (imageModel.isShowInSearch()) {
                vehicle.showInSearchImageId = imageModel.getId();
            }
            counter++;
        }

    }

    public String getFirstWord(String text) {
        if (text == null || text.trim().isEmpty()) {
            return "";
        }
        return text.trim().split("\\s+")[0];
    }

    public String transferInfoToIconClass(Vehicle vehicle, String historyName) {
        // This is a simplified version - you may need to implement the full logic
        // based on your business requirements
        if (historyName == null) {
            return "fa-solid fa-question";
        }

        String lowerName = historyName.toLowerCase();
        if (lowerName.contains("job")) {
            return "fa-solid fa-wrench";
        } else if (lowerName.contains("payment")) {
            return "fa-solid fa-credit-card";
        } else if (lowerName.contains("part")) {
            return "fa-solid fa-cog";
        } else if (lowerName.contains("estimate")) {
            return "fa-solid fa-calculator";
        } else if (lowerName.contains("claim")) {
            return "fa-solid fa-file-invoice";
        } else {
            return "fa-solid fa-question";
        }
    }

}
