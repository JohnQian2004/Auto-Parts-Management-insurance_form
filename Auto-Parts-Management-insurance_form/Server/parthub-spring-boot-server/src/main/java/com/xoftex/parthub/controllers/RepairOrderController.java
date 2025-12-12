package com.xoftex.parthub.controllers;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;
import com.xoftex.parthub.models.Autopart;
import com.xoftex.parthub.models.RepairMenu.RepairMenuResponse;
import com.xoftex.parthub.models.Vin.Root;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/repairmeuals")
public class RepairOrderController {

  @Value("${repair.manual.url}") // http://localhost:5002
  String repairMenuUrl = "";

  private static final Logger LOG = LoggerFactory.getLogger(UserController.class);

  @GetMapping("/user")
  @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
  public ResponseEntity<RepairMenuResponse> getRepirMenual(@RequestParam String requestText) {

    LOG.info(requestText);
    try {

      String urlStr = "http://localhost:5002" ;

      String encoded = URLEncoder.encode(requestText, "UTF-8"); // "Hello%2C+World%21"
      
      URL url = new URL(repairMenuUrl + "/repairmenu?text=" + encoded);

      HttpURLConnection conn = (HttpURLConnection) url.openConnection();
      conn.setRequestMethod("GET");
      conn.setRequestProperty("Accept", "application/json");

      if (conn.getResponseCode() != 200) {
        LOG.info("abnormal response: " + conn.getResponseCode());
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
        RepairMenuResponse repairMenuResponse = g.fromJson(output, RepairMenuResponse.class);
        System.out.println(repairMenuResponse);
        return new ResponseEntity<>(repairMenuResponse, HttpStatus.OK);

      } catch (Exception ee) {

      }
    } catch (MalformedURLException e) {

      e.printStackTrace();

    } catch (IOException e) {

      e.printStackTrace();

    }

    return new ResponseEntity<>(new RepairMenuResponse(), HttpStatus.OK);
  }
}
