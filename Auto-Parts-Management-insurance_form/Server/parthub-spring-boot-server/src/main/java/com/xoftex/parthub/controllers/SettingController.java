package com.xoftex.parthub.controllers;

import java.util.Optional;

import javax.print.Doc;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

import com.xoftex.parthub.models.Company;
import com.xoftex.parthub.models.DeviceInfo;
import com.xoftex.parthub.models.Setting;

import com.xoftex.parthub.repository.ApprovalStatusRepository;
import com.xoftex.parthub.repository.ColumnInfoRepository;
import com.xoftex.parthub.repository.CompanyRepository;
import com.xoftex.parthub.repository.DeviceInfoRepository;
import com.xoftex.parthub.repository.DisclaimerRepository;
import com.xoftex.parthub.repository.DocTypeRepository;
import com.xoftex.parthub.repository.EmployeeRepository;
import com.xoftex.parthub.repository.EmployeeRoleRepository;
import com.xoftex.parthub.repository.InTakeWayRepository;
import com.xoftex.parthub.repository.InsurancerRepository;
import com.xoftex.parthub.repository.ItemTypeRepository;
import com.xoftex.parthub.repository.JobRequestTypeRepository;
import com.xoftex.parthub.repository.KeyLocationRepository;
import com.xoftex.parthub.repository.LocationRepository;
import com.xoftex.parthub.repository.NoteRepository;
import com.xoftex.parthub.repository.PaymentMethodRepository;
import com.xoftex.parthub.repository.PaymentStatusRepository;
import com.xoftex.parthub.repository.PaymentTypeRepository;
import com.xoftex.parthub.repository.RentalRepository;
import com.xoftex.parthub.repository.ServiceRepository;
import com.xoftex.parthub.repository.StatusRepository;
import com.xoftex.parthub.repository.UserRepository;
import com.xoftex.parthub.repository.VendorRepository;
import com.xoftex.parthub.repository.WarrantyRepository;
import com.xoftex.parthub.security.jwt.JwtUtils;

 
//for Angular Client (withCredentials)
//@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
// @CrossOrigin(origins = "*", maxAge = 3600)
@CrossOrigin("*")
@RestController
@RequestMapping("/api/settings")
public class SettingController {

  @Autowired
  UserRepository userRepository;

  @Autowired
  NoteRepository noteRepository;

  @Autowired
  JobRequestTypeRepository jobRequestTypeRepository;

  @Autowired
  PaymentMethodRepository paymentMethodRepository;

  @Autowired
  StatusRepository statusRepository;

  @Autowired
  EmployeeRoleRepository employeeRoleRepository;

  @Autowired
  EmployeeRepository employeeRepository;

  @Autowired
  ApprovalStatusRepository approvalStatusRepository;

  @Autowired
  PaymentStatusRepository paymentStatusRepository;

  @Autowired
  ServiceRepository serviceRepository;

  @Autowired
  LocationRepository locationRepository;

  @Autowired
  KeyLocationRepository keyLocationRepository;

  @Autowired
  PaymentTypeRepository paymentTypeRepository;

  @Autowired
  ItemTypeRepository itemTypeRepository;

  @Autowired
  DocTypeRepository docTypeRepository;

  @Autowired
  CompanyRepository companyRepository;

  @Autowired
  InsurancerRepository insurancerRepository;

  @Autowired
  InTakeWayRepository inTakeWayRepository;

  @Autowired
  RentalRepository rentalRepository;

  @Autowired
  VendorRepository vendorRepository;

  @Autowired
  DisclaimerRepository disclaimerRepository;

  @Autowired
  WarrantyRepository warrantyRepository;

  @Autowired
  ColumnInfoRepository columnInfoRepository;


  @Autowired
  DeviceInfoRepository deviceInfoRepository;

  @Autowired
  JwtUtils jwtUtils;

  private static final Logger LOG = LoggerFactory.getLogger(SettingController.class);

  @GetMapping("/company/{companyId}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<Setting> getSetting(@PathVariable("companyId") long companyId) {

    try {

      // var companyIdTest = 1000000-comapnyId * 7777 *3;
      // comapnyId = (incomming + 1000000) /7777/3 ;
      companyId = (companyId) / 23331;

      Setting setting = new Setting();

      setting.JobRequestTypes = this.jobRequestTypeRepository.findByCompanyIdOrderByNameAsc(companyId);
      setting.paymentMethods = this.paymentMethodRepository.findByCompanyIdOrderByNameAsc(companyId);
      setting.statuss = this.statusRepository.findByCompanyIdOrderByNameAsc(companyId);
      setting.employeeRoles = this.employeeRoleRepository.findByCompanyIdOrderByNameAsc(companyId);
      setting.employees = this.employeeRepository.findByCompanyIdOrderByFirstNameAsc(companyId);
      setting.approvalStatuss = this.approvalStatusRepository.findByCompanyIdOrderByNameAsc(companyId);
      setting.paymentStatuss = this.paymentStatusRepository.findByCompanyIdOrderByNameAsc(companyId);
      setting.services = this.serviceRepository.findByCompanyIdOrderByNameAsc(companyId);
      setting.locations = this.locationRepository.findByCompanyIdOrderByNameAsc(companyId);
      setting.keyLocations = this.keyLocationRepository.findByCompanyIdOrderByNameAsc(companyId);

      setting.paymentTypes = this.paymentTypeRepository.findByCompanyIdOrderByNameAsc(companyId);
      setting.company = this.companyRepository.findById(companyId).get();
      setting.insurancers = this.insurancerRepository.findByCompanyIdOrderByNameAsc(companyId);
      setting.inTakeWays = this.inTakeWayRepository.findByCompanyIdOrderByNameAsc(companyId);
      setting.rentals = this.rentalRepository.findByCompanyIdOrderByNameAsc(companyId);
      setting.vendors = this.vendorRepository.findByCompanyIdOrderByNameAsc(companyId);
      setting.disclaimers = this.disclaimerRepository.findByCompanyIdOrderByNameAsc(companyId);
      setting.warranties = this.warrantyRepository.findByCompanyIdOrderByNameAsc(companyId);
      setting.columnInfos = this.columnInfoRepository.findByCompanyIdOrderByNameAsc(companyId);
      setting.itemTypes = this.itemTypeRepository.findByCompanyIdOrderByNameAsc(companyId);
      setting.docTypes = this.docTypeRepository.findByCompanyIdOrderByNameAsc(companyId);


       

      return new ResponseEntity<>(setting, HttpStatus.OK);
    } catch (Exception ex) {

      return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);

    }
  }

  @GetMapping("/company/uuid/{uuid}")
  // @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<Setting> getSettingUuid(@PathVariable("uuid") String uuid) {

    try {

      LOG.info(uuid);
      Optional<Company> companyOptional = this.companyRepository.findByToken(uuid);

      if (companyOptional.isPresent()) {

        long companyId = companyOptional.get().getId();
        Setting setting = new Setting();

        setting.JobRequestTypes = this.jobRequestTypeRepository.findByCompanyIdOrderByNameAsc(companyId);
        setting.paymentMethods = this.paymentMethodRepository.findByCompanyIdOrderByNameAsc(companyId);
        setting.statuss = this.statusRepository.findByCompanyIdOrderByNameAsc(companyId);
        setting.employeeRoles = this.employeeRoleRepository.findByCompanyIdOrderByNameAsc(companyId);
        setting.employees = this.employeeRepository.findByCompanyIdOrderByFirstNameAsc(companyId);
        setting.approvalStatuss = this.approvalStatusRepository.findByCompanyIdOrderByNameAsc(companyId);
        setting.paymentStatuss = this.paymentStatusRepository.findByCompanyIdOrderByNameAsc(companyId);
        setting.services = this.serviceRepository.findByCompanyIdOrderByNameAsc(companyId);
        setting.locations = this.locationRepository.findByCompanyIdOrderByNameAsc(companyId);
        setting.keyLocations = this.keyLocationRepository.findByCompanyIdOrderByNameAsc(companyId);


        setting.paymentTypes = this.paymentTypeRepository.findByCompanyIdOrderByNameAsc(companyId);
        setting.company = this.companyRepository.findById(companyId).get();
        setting.insurancers = this.insurancerRepository.findByCompanyIdOrderByNameAsc(companyId);
        setting.inTakeWays = this.inTakeWayRepository.findByCompanyIdOrderByNameAsc(companyId);
        setting.rentals = this.rentalRepository.findByCompanyIdOrderByNameAsc(companyId);
        setting.vendors = this.vendorRepository.findByCompanyIdOrderByNameAsc(companyId);
        setting.disclaimers = this.disclaimerRepository.findByCompanyIdOrderByNameAsc(companyId);
        setting.warranties = this.warrantyRepository.findByCompanyIdOrderByNameAsc(companyId);
        setting.columnInfos = this.columnInfoRepository.findByCompanyIdOrderByNameAsc(companyId);
        setting.itemTypes = this.itemTypeRepository.findByCompanyIdOrderByNameAsc(companyId);
        setting.docTypes = this.docTypeRepository.findByCompanyIdOrderByNameAsc(companyId);

        return new ResponseEntity<>(setting, HttpStatus.OK);
      }
    } catch (Exception ex) {

      return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);

    }
    return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
  }

  @PostMapping("/company/uuid/post/{uuid}")
  // @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<Setting> getSettingUuidPost(@PathVariable("uuid") String uuid,
      @RequestBody DeviceInfo deviceInfoIn) {

    try {

      LOG.info(uuid);
      LOG.info(deviceInfoIn.toString());
      Optional<Company> companyOptional = this.companyRepository.findByToken(uuid);

      if (companyOptional.isPresent()) {

        long companyId = companyOptional.get().getId();
        Setting setting = new Setting();

        deviceInfoIn.setCompanyId(companyId);

        setting.JobRequestTypes = this.jobRequestTypeRepository.findByCompanyIdOrderByNameAsc(companyId);
        setting.paymentMethods = this.paymentMethodRepository.findByCompanyIdOrderByNameAsc(companyId);
        setting.statuss = this.statusRepository.findByCompanyIdOrderByNameAsc(companyId);
        setting.employeeRoles = this.employeeRoleRepository.findByCompanyIdOrderByNameAsc(companyId);
        setting.employees = this.employeeRepository.findByCompanyIdOrderByFirstNameAsc(companyId);
        setting.approvalStatuss = this.approvalStatusRepository.findByCompanyIdOrderByNameAsc(companyId);
        setting.paymentStatuss = this.paymentStatusRepository.findByCompanyIdOrderByNameAsc(companyId);
        setting.services = this.serviceRepository.findByCompanyIdOrderByNameAsc(companyId);
        setting.locations = this.locationRepository.findByCompanyIdOrderByNameAsc(companyId);
        setting.keyLocations = this.keyLocationRepository.findByCompanyIdOrderByNameAsc(companyId);

        setting.paymentTypes = this.paymentTypeRepository.findByCompanyIdOrderByNameAsc(companyId);
        setting.company = this.companyRepository.findById(companyId).get();
        setting.insurancers = this.insurancerRepository.findByCompanyIdOrderByNameAsc(companyId);
        setting.inTakeWays = this.inTakeWayRepository.findByCompanyIdOrderByNameAsc(companyId);
        setting.rentals = this.rentalRepository.findByCompanyIdOrderByNameAsc(companyId);
        setting.vendors = this.vendorRepository.findByCompanyIdOrderByNameAsc(companyId);
        setting.disclaimers = this.disclaimerRepository.findByCompanyIdOrderByNameAsc(companyId);
        setting.warranties = this.warrantyRepository.findByCompanyIdOrderByNameAsc(companyId);
        setting.columnInfos = this.columnInfoRepository.findByCompanyIdOrderByNameAsc(companyId);
        setting.itemTypes = this.itemTypeRepository.findByCompanyIdOrderByNameAsc(companyId);
        setting.docTypes = this.docTypeRepository.findByCompanyIdOrderByNameAsc(companyId);

        // {"brand": "motorola", "deviceName": "moto g pure", "isDevice": true,
        // "manufacturer": "motorola", "modelName": "moto g pure", "osName":
        // "motorola/ellis_t/ellis:12/S3RH32.20-42-10-4-2-15-2/41bf1:user/release-keys",
        // "osVersion": "12", "platformApiLevel": 31, "totalMemory": 268435456}
        try {
          Optional<DeviceInfo> deviceInfoOptional = this.deviceInfoRepository
              .findByBrandAndDeviceNameAndManufacturerAndCompanyId(
                  deviceInfoIn.getBrand(), deviceInfoIn.getDeviceName(), deviceInfoIn.getManufacturer(), companyId);
          DeviceInfo deviceInfoSaved = new DeviceInfo();
          if (deviceInfoOptional.isPresent()) {
            deviceInfoOptional.get().setCounts(deviceInfoOptional.get().getCounts() + 1);
            deviceInfoSaved = this.deviceInfoRepository.save(deviceInfoOptional.get());

          } else {
            deviceInfoSaved = this.deviceInfoRepository.save(deviceInfoIn);
          }

          LOG.info(deviceInfoSaved.toString());
        } catch (Exception ex) {
          System.out.print(ex.getMessage());
        }
        return new ResponseEntity<>(setting, HttpStatus.OK);
      }
    } catch (Exception ex) {

      return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);

    }
    return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
  }
}