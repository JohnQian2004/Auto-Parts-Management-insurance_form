package com.xoftex.parthub.controllers;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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

 
import com.xoftex.parthub.models.SearchCarrier;
import com.xoftex.parthub.models.ServiceProvider;
import com.xoftex.parthub.models.ServiceType;
import com.xoftex.parthub.models.User;
import com.xoftex.parthub.models.ZipCode;
import com.xoftex.parthub.payload.response.MessageResponse;
import com.xoftex.parthub.repository.RoleRepository;
import com.xoftex.parthub.repository.ServiceProviderRepository;
import com.xoftex.parthub.repository.ServiceTypeRepository;
import com.xoftex.parthub.repository.UserRepository;
import com.xoftex.parthub.repository.ZipCodeRepository;

//for Angular Client (withCredentials)
//@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
// @CrossOrigin(origins = "*", maxAge = 3600)
@CrossOrigin("*")
@RestController
@RequestMapping("/api/serviceproviders")
public class ServiceProviderController {

  @Autowired
  UserRepository userRepository;

  @Autowired
  RoleRepository roleRepository;

  @Autowired
  ServiceTypeRepository serviceTypeRepository;

  @Autowired
  ServiceProviderRepository serviceProviderRepository;

  @Autowired
  ZipCodeRepository zipCodeRepository;

  private static final Logger LOG = LoggerFactory.getLogger(ServiceTypeController.class);

  @PostMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<?> createAndUpdateServiceProvider(@PathVariable("id") long id,
      @RequestBody ServiceProvider serviceProviderIn) {

    Optional<User> userOptional = this.userRepository.findById(id);
    ServiceProvider serviceProvider = new ServiceProvider();

    if (userOptional.isPresent()) {

      serviceProviderIn.setUserId(id);

      Optional<ZipCode> zipCOptional = this.zipCodeRepository.findByZip(serviceProviderIn.getZip());

      if (zipCOptional.isPresent()) {

        // address.setZip(signUpRequest.getZip());
        // address.setLat(zipCOptional.get().getLat());
        // address.setLng(zipCOptional.get().getLng());

      } else {
        return ResponseEntity.badRequest()
            .body(new MessageResponse("Error: Zip Code [" + serviceProviderIn.getZip() + "] is not valid."));

      }

      // new
      if (serviceProviderIn.getId() == 0) {
        Optional<ServiceType> serviceTypeOptional = this.serviceTypeRepository
            .findById(serviceProviderIn.getServiceTypeId());
        if (serviceTypeOptional.isPresent()) {
          ServiceType serviceType = serviceTypeOptional.get();
          serviceType.setCounts(serviceType.getCounts() + 1);
          this.serviceTypeRepository.save(serviceType);
        }
      }

      serviceProvider = this.serviceProviderRepository.save(serviceProviderIn);

    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>(serviceProvider, HttpStatus.CREATED);

  }

  @GetMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<ServiceProvider> getServiceProvider(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<ServiceProvider> serviceProviderOptional = this.serviceProviderRepository.findById(id);
    ServiceProvider serviceProvider = new ServiceProvider();
    if (serviceProviderOptional.isPresent()) {
      serviceProvider = serviceProviderOptional.get();
      return new ResponseEntity<>(serviceProvider, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }

  @GetMapping("/company/{companyId}")
  // @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<ServiceProvider>> getAllServiceProvider(@PathVariable("companyId") long companyId) {

    List<ServiceProvider> serviceProviders = new ArrayList<ServiceProvider>();

    serviceProviders = this.serviceProviderRepository.findByCompanyIdOrderByNameAsc(companyId);
    if (serviceProviders.isEmpty()) {
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    return new ResponseEntity<>(serviceProviders, HttpStatus.OK);
  }

  @GetMapping("/user/{user}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<ServiceProvider>> getAllServiceProviderUser(@PathVariable("user") long userId) {

    List<ServiceProvider> serviceProviders = new ArrayList<ServiceProvider>();

    serviceProviders = this.serviceProviderRepository.findByUserIdOrderByNameAsc(userId);
    if (serviceProviders.isEmpty()) {
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    return new ResponseEntity<>(serviceProviders, HttpStatus.OK);
  }

  @PostMapping("/search/page")
  // @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<ServiceProvider>> getAllServiceProviderPage(@RequestBody SearchCarrier searchCarrier) {

    List<ServiceProvider> serviceProviders = new ArrayList<ServiceProvider>();
    int serachCount = 0;

    // search name only
    if (searchCarrier.serviceTypeId == 0 && searchCarrier.serviceName != null
        && !searchCarrier.serviceName.equals("")) {

      String[] partNames = searchCarrier.serviceName.split(" ");
      if (partNames.length > 0) {

        // '(?=.*HONDA)(?=.*CIVIC)(?=.*2012)'
        List<String> words = Arrays.asList(partNames);
        String queryParam = words.stream()
            .filter(s -> !s.trim().isEmpty()) // Exclude empty or whitespace-only strings
            .map(s -> "(?=.*" + s + ")")
            .collect(Collectors.joining());

        System.out.println(queryParam);

        serachCount = serviceProviderRepository.countNameIn(queryParam, false);
        serviceProviders = serviceProviderRepository.findNameIn(
            queryParam, false, Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));

      }

    } else if (searchCarrier.serviceTypeId > 0) {

      if (searchCarrier.serviceName != null
          && !searchCarrier.serviceName.equals("")) {

        String[] partNames = searchCarrier.serviceName.split(" ");
        if (partNames.length > 0) {

          // '(?=.*HONDA)(?=.*CIVIC)(?=.*2012)'
          List<String> words = Arrays.asList(partNames);
          String queryParam = words.stream()
              .filter(s -> !s.trim().isEmpty()) // Exclude empty or whitespace-only strings
              .map(s -> "(?=.*" + s + ")")
              .collect(Collectors.joining());

          System.out.println(queryParam);

          serachCount = serviceProviderRepository.countServiceTypeIdAndNameIn(searchCarrier.serviceTypeId, queryParam,
              false);
          serviceProviders = serviceProviderRepository.findServiceTypeIdAndNameIn(searchCarrier.serviceTypeId,
              queryParam, false, Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));

        }
      } else {

        serachCount = this.serviceProviderRepository.countByServiceTypeId(searchCarrier.serviceTypeId);

        serviceProviders = this.serviceProviderRepository.findByServiceTypeIdOrderByNameAsc(
            searchCarrier.serviceTypeId,
            Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));
      }

    } else {

      serachCount = this.serviceProviderRepository.countAll();

      serviceProviders = this.serviceProviderRepository.findAllOrderByNameAsc(
          Pageable.ofSize(searchCarrier.pageSize).withPage(searchCarrier.pageNumber));

    }

    if (searchCarrier.zipcode != null) {

      Optional<ZipCode> zipCodeOptional = this.zipCodeRepository.findByZip(searchCarrier.zipcode);
      if (zipCodeOptional.isPresent()) {

        for (ServiceProvider serviceProvider : serviceProviders) {

          serviceProvider.setSearchCount(serachCount);

          if (serviceProvider.getZip() != null) {

            Optional<ZipCode> zipCodeOptional2 = this.zipCodeRepository.findByZip(serviceProvider.getZip());

            if (zipCodeOptional2.isPresent()) {

              serviceProvider
                  .setDistance(this.haversine(zipCodeOptional2.get().getLat(), zipCodeOptional2.get().getLng(),
                      zipCodeOptional.get().getLat(), zipCodeOptional.get().getLng()));
            }
          }
        }
      }
    }

    if (serviceProviders.isEmpty()) {
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    return new ResponseEntity<>(serviceProviders, HttpStatus.OK);
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

  @DeleteMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<?> deleteServiceProvider(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<ServiceProvider> serviceProviderOptional = this.serviceProviderRepository.findById(id);
    ServiceProvider serviceProvider = new ServiceProvider();
    if (serviceProviderOptional.isPresent()) {
      serviceProvider = serviceProviderOptional.get();

      Optional<ServiceType> serviceTypeOptional = this.serviceTypeRepository
          .findById(serviceProvider.getServiceTypeId());
      if (serviceTypeOptional.isPresent()) {
        ServiceType serviceType = serviceTypeOptional.get();
        if (serviceType.getCounts() - 1 > 0) {
          serviceType.setCounts(serviceType.getCounts() - 1);
          this.serviceTypeRepository.save(serviceType);
        }
      }

      this.serviceProviderRepository.delete(serviceProvider);

      return new ResponseEntity<>(null, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }
}