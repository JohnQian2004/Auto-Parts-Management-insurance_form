package com.xoftex.parthub.controllers;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.WeekFields;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

import com.xoftex.parthub.models.Customer;

import com.xoftex.parthub.models.SearchCarrier;
import com.xoftex.parthub.models.User;
 
import com.xoftex.parthub.payload.request.DateCarrier;
import com.xoftex.parthub.repository.CustomerRepository;
import com.xoftex.parthub.repository.ImageModelRepository;
import com.xoftex.parthub.repository.UserRepository;
import com.xoftex.parthub.repository.VehicleRepository;

import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Customer Sever ", description = "Customer APIs")
// for Angular Client (withCredentials)
// @CrossOrigin(origins = "http://localhost:4200", maxAge = 3600,
// allowCredentials = "true")
// @CrossOrigin(origins = "*", maxAge = 3600)
@CrossOrigin("*")
@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    @Autowired
    VehicleRepository vehicleRepository;

    @Autowired
    ImageModelRepository imageModelRepository;

    @Autowired
    CustomerRepository customerRepository;

    @Autowired
    UserRepository userRepository;

    private static final Logger LOG = LoggerFactory.getLogger(CustomerController.class);

    @GetMapping("/search/phone/{companyId}/{phone}")
    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<List<Customer>> searchCustomers(@PathVariable("companyId") long companyId,
            @PathVariable("phone") String phone) {

        LOG.info(phone);
        List<Customer> customers = new ArrayList<Customer>();

        customers = this.customerRepository.findByPhoneAndCompanyId(phone, companyId);

        return new ResponseEntity<>(customers, HttpStatus.OK);

    }

    @GetMapping("/search/lastname/{companyId}/{lastName}")
    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<List<Customer>> searchCustomersByLastName(
            @PathVariable("companyId") long companyId,
            @PathVariable("lastName") String lastName) {

        LOG.info(lastName);
        List<Customer> customers = new ArrayList<Customer>();

        customers = this.customerRepository.findByLastNameAndCompanyId(lastName, companyId);

        return new ResponseEntity<>(customers, HttpStatus.OK);

    }

    @GetMapping("/company/{companyId}")
    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<List<Customer>> getAllCustomers(
            @PathVariable("companyId") long companyId) {

        LOG.info("" + companyId);
        List<Customer> customers = new ArrayList<Customer>();

        customers = this.customerRepository.findByCompanyId(companyId);

        return new ResponseEntity<>(customers, HttpStatus.OK);

    }

    @GetMapping("/company/count/{companyId}")
    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<?> getAllCustomerCounts(
            @PathVariable("companyId") long companyId) {

        LOG.info("" + companyId);

        int count = this.customerRepository.countByCompanyIdAndArchived(companyId, false);

        return new ResponseEntity<>(count, HttpStatus.OK);

    }

    @PostMapping("/company/page/{companyId}")
    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<List<Customer>> getAllCustomersWithPage(
            @PathVariable("companyId") long companyId,
            @RequestBody SearchCarrier searchCarrier) {

        LOG.info(searchCarrier.pageNumber + " " + searchCarrier.pageSize);

        int serachCount = 0;

        LOG.info("" + companyId);
        List<Customer> customers = new ArrayList<Customer>();

        if (searchCarrier.pageNumber >= 0 && searchCarrier.pageSize > 1) {
            serachCount = this.customerRepository.countByCompanyIdAndArchived(companyId, false);

            customers = this.customerRepository.findByCompanyIdAndArchived(companyId, false,
                    Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));

            for (Customer customer : customers) {
                customer.serachCount = serachCount;
            }
        }
        return new ResponseEntity<>(customers, HttpStatus.OK);

    }

    @PostMapping("/company/lastname/page/{companyId}")
    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<List<Customer>> getAllCustomersStartingWithPage(
            @PathVariable("companyId") long companyId,
            @RequestBody SearchCarrier searchCarrier) {

        LOG.info(searchCarrier.pageNumber + " " + searchCarrier.pageSize);

        int serachCount = 0;
        int totalCount = 0;

        LOG.info("" + companyId);
        List<Customer> customers = new ArrayList<Customer>();

        if (searchCarrier.pageNumber >= 0 && searchCarrier.pageSize > 1 && !searchCarrier.partName.equals("")) {
            totalCount = this.customerRepository.countByCompanyIdAndArchived(companyId, false);

            serachCount = this.customerRepository.countByCompanyIdAndArchivedAndLastNameStartingWithIgnoreCase(
                    companyId, false, searchCarrier.partName);

            customers = this.customerRepository.findByCompanyIdAndArchivedAndLastNameStartingWithIgnoreCase(
                    companyId, false, searchCarrier.partName,
                    Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));

            for (Customer customer : customers) {
                customer.serachCount = serachCount;
                customer.totalCount = totalCount;
            }
        }
        return new ResponseEntity<>(customers, HttpStatus.OK);

    }

    @PostMapping("/{userId}")
    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<Customer> createAndSaveCustomer(
            @PathVariable("userId") long userId,
            @RequestBody Customer customer) {

        Optional<User> userOptional = this.userRepository.findById(userId);

        Customer customer2 = new Customer();

        User user = new User();

        if (userOptional.isPresent()) {

            user = userOptional.get();
            // customer.setUserId(userId);
            customer2 = this.customerRepository.save(customer);
        } else {

            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<Customer>(customer2, HttpStatus.OK);
    }

    @DeleteMapping("/{customerId}")
    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<?> deleteCustomer(@PathVariable("customerId") long customerId) {
        LOG.info("" + customerId);
        Optional<Customer> customerOptional = this.customerRepository.findById(customerId);
        Customer customer = new Customer();
        if (customerOptional.isPresent()) {
            customer = customerOptional.get();

            // for( Vehicle vehicle : customer.getVehicles()){
            // vehicle.setCustomer(null);
            // this.vehicleRepository.save(vehicle);
            // }
            // customer.setVehicles(null);
            customer.setArchived(true);
            this.customerRepository.save(customer);

            return new ResponseEntity<>(null, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

    }

    @PostMapping("/date/{companyId}")
    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<List<Customer>> getCustomerByDate(@PathVariable("companyId") long companyId,
            @RequestBody DateCarrier dateCarrier) {

        List<Customer> customers = new ArrayList<Customer>();
        Date from = new Date();
        Date to = new Date();

        if (dateCarrier.week > 0) {
            from = this.asDate(this.getFirstDayOfWeek(dateCarrier.year, dateCarrier.week, Locale.US));
            // Date to = this.asDate(this.getFirstDayOfWeek(dateCarrier.year,
            // dateCarrier.week + 1, Locale.US).minus(1, ChronoUnit.DAYS));
            to = this
                    .asDate(this.getFirstDayOfWeek(dateCarrier.year, dateCarrier.week + 1, Locale.US));
        } else {
            try {
                DateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
                from = formatter.parse(formatter.format(dateCarrier.from));
                long timeadj = 24 * 60 * 60 * 1000;
                to = new Date(from.getTime() + timeadj);
            } catch (Exception ex) {
                System.out.println(ex);
            }
        }

        List<Customer> customerList = this.customerRepository.findByCompanyIdAndArchivedAndCreatedAtBetween(companyId,
                false,
                from, to);

        if (customerList.size() > 0) {

            for (Customer customer : customerList) {

                customers.add(customer);
            }

            return new ResponseEntity<>(customers, HttpStatus.OK);

        } else

        {
            // otherwise too much crap
            return new ResponseEntity<>(HttpStatus.OK);
        }
    }

    // Locale.US
    private LocalDate getFirstDayOfWeek(int year, int weekNumber, Locale locale) {
        return LocalDate
                .of(year, 2, 1)
                .with(WeekFields.of(locale).getFirstDayOfWeek())
                .with(WeekFields.of(locale).weekOfWeekBasedYear(), weekNumber);
    }

    private Date asDate(LocalDate localDate) {
        return Date.from(localDate.atStartOfDay().atZone(ZoneId.systemDefault()).toInstant());
    }

}
