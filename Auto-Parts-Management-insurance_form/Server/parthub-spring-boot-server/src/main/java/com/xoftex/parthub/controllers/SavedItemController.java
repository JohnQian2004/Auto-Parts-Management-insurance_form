package com.xoftex.parthub.controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.xoftex.parthub.models.Address;
import com.xoftex.parthub.models.Autopart;
import com.xoftex.parthub.models.Company;
import com.xoftex.parthub.models.EAddressType;
import com.xoftex.parthub.models.ImageModel;
import com.xoftex.parthub.models.SavedItem;
import com.xoftex.parthub.models.User;
import com.xoftex.parthub.models.ZipCode;
import com.xoftex.parthub.payload.response.MessageResponse;
import com.xoftex.parthub.repository.AutoPartRepository;
import com.xoftex.parthub.repository.CompanyRepository;
import com.xoftex.parthub.repository.FitmentRepository;
import com.xoftex.parthub.repository.SavedItemRepository;
import com.xoftex.parthub.repository.UserRepository;
import com.xoftex.parthub.repository.ZipCodeRepository;

import jakarta.servlet.http.HttpServletRequest;

//for Angular Client (withCredentials)
//@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
// @CrossOrigin(origins = "*", maxAge = 3600)
@CrossOrigin("*")
@RestController
@RequestMapping("/api")
public class SavedItemController {

  @Autowired
  SavedItemRepository savedItemRepository;

  @Autowired
  AutoPartRepository autoPartRepository;

  @Autowired
  CompanyRepository companyRepository;

  @Autowired
  FitmentRepository fitmentRepository;

  @Autowired
  UserRepository userRepository;

  @Autowired
  ZipCodeRepository zipCodeRepository;

  private static final Logger LOG = LoggerFactory.getLogger(SavedItemController.class);

  @PostMapping("/saveditems")
  public ResponseEntity<?> createSavedItem(@RequestBody SavedItem savedItemIn,
      HttpServletRequest request) {

    LOG.info(savedItemIn.toString());

    Optional<SavedItem> savedItemOptional = this.savedItemRepository.findByUserIdAndAutopartId(savedItemIn.getUserId(),
        savedItemIn.getAutopartId());

    if (!savedItemOptional.isPresent()) {
      SavedItem savedItem = new SavedItem();

      savedItem.setAutopartId(savedItemIn.getAutopartId());
      savedItem.setUserId(savedItemIn.getUserId());

      this.savedItemRepository.save(savedItem);
      return new ResponseEntity<>(savedItem, HttpStatus.CREATED);
    } else {

      return ResponseEntity.badRequest().body(new MessageResponse("Error: Item is already saved"));
    }
  }

  @DeleteMapping("/saveditems/{userId}/{autopartId}")
  public ResponseEntity<HttpStatus> deleteSavedItem(@PathVariable("userId") long userId,
      @PathVariable("autopartId") long autopartId) {
    try {

      LOG.info(" " + userId + " " + autopartId);

      Optional<SavedItem> savedItemOptional = this.savedItemRepository.findByUserIdAndAutopartId(userId, autopartId);

      if (savedItemOptional.isPresent()) {
        SavedItem savedItem = savedItemOptional.get();

        this.savedItemRepository.delete(savedItem);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
      } else {
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
      }

    } catch (Exception e) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @GetMapping("/saveditems/{userId}")
  public ResponseEntity<List<Autopart>> getSavedItems(@PathVariable long userId,
      HttpServletRequest request) {

    LOG.info(" " + userId);
    Optional<User> userOptional = this.userRepository.findById(userId);

    List<SavedItem> savedItems = this.savedItemRepository.findByUserId(userId);
    List<Autopart> autoparts = new ArrayList<Autopart>();

    if (savedItems.size() > 0) {
      User user = userOptional.get();

      for (SavedItem savedItem : savedItems) {

        Optional<Autopart> autoparOptional = this.autoPartRepository.findById(savedItem.getAutopartId());

        if (autoparOptional.isPresent()) {
          autoparts.add(autoparOptional.get());
        }

      }

      if (user.getAddresses() != null && user.getAddresses().size() > 0) {
        String zipCode = "21234";
        for (Address address : user.getAddresses()) {
          if (address.getName().equals(EAddressType.ADDRESS_TYPE_DEFAULT)
              || address.getName().equals(EAddressType.ADDRESS_TYPE_SHOP)) {

            zipCode = address.getZip();
            LOG.info(" " + zipCode);
          }
        }
        Optional<ZipCode> zipCodeOptional = this.zipCodeRepository.findByZip(zipCode);
        if (zipCodeOptional.isPresent()) {

          this.getAddtionalInfo(autoparts, zipCodeOptional.get());
        }
      } else {
        this.getAddtionalInfo(autoparts, null);
      }
    }
    return new ResponseEntity<>(autoparts, HttpStatus.OK);

  }

  private void getAddtionalInfo(List<Autopart> autoParts, ZipCode zipCode) {

    for (int i = 0; i < autoParts.size(); i++) {
      if (autoParts.get(i).getCompanyId() != null && autoParts.get(i).getCompanyId() != 0) {
        Optional<Company> comapanyOptional = this.companyRepository.findById(autoParts.get(i).getCompanyId());
        if (comapanyOptional.isPresent()) {
          Company company = comapanyOptional.get();
          if (company.getName() != null)
            autoParts.get(i).setBussinessName(company.getName());

          if (company.getUrl() != null)
            autoParts.get(i).setBussinessUrl(company.getUrl());
          autoParts.get(i).setStreet(company.getStreet());
          autoParts.get(i).setCity(company.getCity());
          autoParts.get(i).setState(company.getState());
          autoParts.get(i).setZip(company.getZip());
          autoParts.get(i).setPhone(company.getPhone());

          if (autoParts.get(i).isFitmented() == true) {
            autoParts.get(i).fitments = this.fitmentRepository.findByAutopartId(autoParts.get(i).getId());
          }

          // autoParts.get(i).setLat(company.getLat());
          // autoParts.get(i).setLng(company.getLng());

          // if (zipCode != null) {
          // autoParts.get(i).setDistance(
          // this.haversine(zipCode.getLat(), zipCode.getLng(), address.getLat(),
          // address.getLng()));
          // }

        }
      } else {

        Optional<User> userOptional = this.userRepository.findById(autoParts.get(i).getUserId());
        if (userOptional.isPresent()) {
          User user = userOptional.get();
          if (user.getBussinessname() != null)
            autoParts.get(i).setBussinessName(user.getBussinessname());

          if (user.getBussinessUrl() != null)
            autoParts.get(i).setBussinessUrl(user.getBussinessUrl());

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
        if (counter == 0)
          autoParts.get(i).showInSearchImageId = imageModel.getId();

        if (imageModel.isShowInSearch()) {
          autoParts.get(i).showInSearchImageId = imageModel.getId();
        }
        counter++;
      }

    }

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
}
