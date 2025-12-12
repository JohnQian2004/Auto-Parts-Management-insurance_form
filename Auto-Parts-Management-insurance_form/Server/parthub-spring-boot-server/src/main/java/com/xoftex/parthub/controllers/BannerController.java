package com.xoftex.parthub.controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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

import com.xoftex.parthub.models.Banner;
import com.xoftex.parthub.models.User;
import com.xoftex.parthub.repository.BannerRepository;
import com.xoftex.parthub.repository.RoleRepository;
import com.xoftex.parthub.repository.UserRepository;

//for Angular Client (withCredentials)
//@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
// @CrossOrigin(origins = "*", maxAge = 3600)
@CrossOrigin("*")
@RestController
@RequestMapping("/api/banners")
public class BannerController {

  @Autowired
  UserRepository userRepository;

  @Autowired
  BannerRepository bannerRepository;

  private static final Logger LOG = LoggerFactory.getLogger(BannerController.class);

  @PostMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<Banner> createAndUpdateBanner(@PathVariable("id") long id,
      @RequestBody Banner bannerIn) {

    Optional<User> userOptional = this.userRepository.findById(id);
    Banner banner = new Banner();

    if (userOptional.isPresent()) {

      bannerIn.setUserId(id);

      banner = this.bannerRepository.save(bannerIn);

    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>(banner, HttpStatus.CREATED);

  }

  @PutMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<Banner> activeBanner(@PathVariable("id") long id,
      @RequestBody Banner bannerIn) {

    Optional<User> userOptional = this.userRepository.findById(id);
    Banner banner = new Banner();

    if (userOptional.isPresent()) {

      bannerIn.setUserId(id);

      List<Banner> banners = this.bannerRepository.findAllByOrderByIdAsc();
      if (!banners.isEmpty()) {
        for (Banner banner2 : banners) {
          banner2.setActive(false);
          this.bannerRepository.save(banner2);
        }
      }
      banner = this.bannerRepository.save(bannerIn);

    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>(banner, HttpStatus.CREATED);

  }

  @GetMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<Banner> getBanner(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<Banner> BannerOptional = this.bannerRepository.findById(id);
    Banner Banner = new Banner();
    if (BannerOptional.isPresent()) {
      Banner = BannerOptional.get();
      return new ResponseEntity<>(Banner, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }

  @GetMapping("/system")
  // @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<List<Banner>> getAllBanner() {

    List<Banner> banners = new ArrayList<Banner>();

    banners = this.bannerRepository.findAllByOrderByIdAsc();
    if (banners.isEmpty()) {
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    return new ResponseEntity<>(banners, HttpStatus.OK);
  }

  @GetMapping("/system/active")
  // @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<Banner> getActiveBanner() {

    List<Banner> banners = new ArrayList<Banner>();

    banners = this.bannerRepository.findAllByOrderByIdAsc();
    if (banners.isEmpty()) {
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    } else {
      for (Banner banner2 : banners) {
        if (banner2.isActive()) {
          return new ResponseEntity<>(banner2, HttpStatus.OK);
        }
      }
    }

    return new ResponseEntity<>(null, HttpStatus.OK);
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<?> deleteBanner(@PathVariable("id") long id) {
    LOG.info("" + id);
    Optional<Banner> bannerOptional = this.bannerRepository.findById(id);
    Banner banner = new Banner();
    if (bannerOptional.isPresent()) {
      banner = bannerOptional.get();
      this.bannerRepository.delete(banner);

      return new ResponseEntity<>(null, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }
}