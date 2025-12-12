package com.xoftex.parthub.controllers;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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

import com.google.gson.Gson;
import com.xoftex.parthub.models.Autopart;
import com.xoftex.parthub.models.Claim;
import com.xoftex.parthub.models.Fitment;
import com.xoftex.parthub.models.PartAI.Content;
import com.xoftex.parthub.models.PartAI.Content2;
import com.xoftex.parthub.models.PartAI.Partinfo;
import com.xoftex.parthub.payload.request.EstimateRequest;
import com.xoftex.parthub.payload.request.FitmentRequest;
import com.xoftex.parthub.payload.response.EstimateResponse;

import com.xoftex.parthub.controllers.ResponseData;

import com.xoftex.parthub.payload.response.FitmentResponse;
import com.xoftex.parthub.repository.AutoPartRepository;
import com.xoftex.parthub.repository.FitmentRepository;
import com.xoftex.parthub.repository.UserRepository;

import com.xoftex.parthub.utils.ChatRequest;
import com.xoftex.parthub.utils.VehicleEstimateClient;

import org.asynchttpclient.AsyncHttpClient;
import org.asynchttpclient.DefaultAsyncHttpClient;
import java.util.function.Consumer;

//for Angular Client (withCredentials)
//@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
// @CrossOrigin(origins = "*", maxAge = 3600)
@CrossOrigin("*")
@RestController
@RequestMapping("/api/fitments")
public class FitmentController {

  @Autowired
  UserRepository userRepository;

  @Autowired
  FitmentRepository fitmentRepository;

  @Autowired
  AutoPartRepository autoPartRepository;

  @Value("${fitment.url}")
  String fitmentUrl = "";

  @Value("${aiestimate.url}")
  String aiEstimateUrl = "";

  @Value("${fitment.apikey}")
  // String fitmentApiKey =
  // "?apikey=ZrQEPSkKYmlsbC5kcmFwZXIuYXV0b0BnbWFpbC5jb20=";
  String fitmentApiKey = "";

  @Value("${image.path.vehicle}")
  // String filePath = "C:\\Projects\\images\\vehicle\\test_image_";
  String filePath = "";

  @Value("${image.root.path.vehicle}")
  // String filePath = "C:\\Projects\\images\\vehicle\\;
  String fileRootPath = "";

  String imageNamePrefix = "test_vehicle_image_";

  @Value("${image.resize.vehicle}")
  String imageResizeDirectory = "";

  public static final String APPLICATION_JSON = "application/json";
  public static final String BEARER_TOKEN = "Bearer F6ppz5rX0zCGVf2tAjIAOSwlymlkHaHIigZdcFC8";

  private static final Logger LOG = LoggerFactory.getLogger(FitmentController.class);

  @PostMapping("/{id}")
  public ResponseEntity<Fitment> createAndUpdateFitment(@PathVariable("id") long autopartId,
      @RequestBody Fitment fitmentIn) {

    Optional<Autopart> autopartOptional = this.autoPartRepository.findById(autopartId);
    Fitment fitment = new Fitment();

    if (autopartOptional.isPresent()) {

      fitmentIn.setAutopartId(autopartId);

      fitment = this.fitmentRepository.save(fitmentIn);

    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>(fitment, HttpStatus.CREATED);

  }

  public void hit(String api, String partNumber, Consumer<String> consu)
      throws IOException {
    AsyncHttpClient client = new DefaultAsyncHttpClient();

    String instructionString = partNumber + " is a vehicle part number, please find\n";
    instructionString = instructionString
        + "1) part number, description, msrp ( average price), location(left, right, front, rear, etc), manufacture,source(where is all information comes from), year ( from and to) , make, model, engine \n";
    instructionString = instructionString
        + "2) compatibilities with year( list as {from: xxxx, to: xxxx}), make, model, engine;\n";
    instructionString = instructionString + "3: sample return : {\"role\":\"CHATBOT\",\"message\":\"```json\\n" + //
        "{\\n" + //
        "  \\\"part_information\\\": {\\n" + //
        "    \\\"part_number\\\": \\\"74231-47150\\\",\\n" + //
        "    \\\"description\\\": \\\"Door Lock Actuator Motor\\\",\\n" + //
        "    \\\"msrp\\\": 45,\\n" + //
        "    \\\"location\\\": \\\"Left Rear\\\",\\n" + //
        "    \\\"manufacturer\\\": \\\"Toyota Motor Corporation\\\",\\n" + //
        "    \\\"source\\\": \\\"Toyota Parts Catalog\\\",\\n" + //
        "    \\\"year\\\": {\\n" + //
        "      \\\"from\\\": 2005,\\n" + //
        "      \\\"to\\\": 2011\\n" + //
        "    },\\n" + //
        "    \\\"make\\\": \\\"Toyota\\\",\\n" + //
        "    \\\"model\\\": \\\"Camry\\\",\\n" + //
        "    \\\"engine\\\": \\\"2.4L L4\\\"\\n" + //
        "  },\\n" + //
        "  \\\"compatibilities\\\": [\\n" + //
        "    {\\n" + //
        "      \\\"year\\\": {\\n" + //
        "        \\\"from\\\": 2005,\\n" + //
        "        \\\"to\\\": 2011\\n" + //
        "      },\\n" + //
        "      \\\"make\\\": \\\"Toyota\\\",\\n" + //
        "      \\\"model\\\": \\\"Camry\\\",\\n" + //
        "      \\\"engine\\\": \\\"2.4L L4\\\"\\n" + //
        "    },\\n" + //
        "    {\\n" + //
        "      \\\"year\\\": {\\n" + //
        "        \\\"from\\\": 2006,\\n" + //
        "        \\\"to\\\": 2011\\n" + //
        "      },\\n" + //
        "      \\\"make\\\": \\\"Toyota\\\",\\n" + //
        "      \\\"model\\\": \\\"Solara\\\",\\n" + //
        "        \\\"engine\\\": \\\"2.4L L4\\\"\\n" + //
        "    }\\n" + //
        "  ]\\n" + //
        "}\\n" + //
        "```\"}";

    instructionString = instructionString + "4) return all in json only without summary\n";

    ChatRequest chatRequest = new ChatRequest();
    chatRequest.setPrompt(instructionString);
    chatRequest.setMessage(instructionString);

    client.prepare("POST", String.format("https://api.cohere.ai/v1/%s", api))
        .setHeader("accept", FitmentController.APPLICATION_JSON)
        .setHeader("content-type", FitmentController.APPLICATION_JSON)
        .setHeader("authorization", FitmentController.BEARER_TOKEN)
        .setBody(chatRequest.toJson())
        .execute()
        .toCompletableFuture()
        .thenAccept((response) -> {

          System.out.print(response.getResponseBody());
          // consu.accept(response.getResponseBody());

        })
        .join();

    client.close();
  }

  @PostMapping("/ai/cohere")
  public ResponseEntity<List<Fitment>> getFitmentFromCohereAIServer(@RequestBody FitmentRequest fitmentRequest) {

    List<Fitment> fitments = new ArrayList<Fitment>();

    try {

      this.hit("chat", fitmentRequest.partNumber, null);

    } catch (Exception e) {

      e.printStackTrace();

    }

    return new ResponseEntity<>(fitments, HttpStatus.OK);
  }

  @PostMapping("/ai")
  public ResponseEntity<List<Fitment>> getFitmentFromAIServer(@RequestBody FitmentRequest fitmentRequest) {

    List<Fitment> fitments = new ArrayList<Fitment>();
    Content aiResponse = new Content();
    Content2 aiResponse2 = new Content2();
    try {

      // FitmentRequest fitmentRequest = new FitmentRequest();
      // fitmentRequest.autopartId = autopart.getId();
      // fitmentRequest.year = autopart.getYear();
      // fitmentRequest.make = autopart.getMake();
      // fitmentRequest.model = autopart.getModel();
      // fitmentRequest.partNumber = autopart.getPartNumber();

      Gson gson = new Gson();
      String jsonInputString = gson.toJson(fitmentRequest);

      // String urlStr =
      // "https://xxxxxxxx/ZPBUA1ZL9KLA00848?apikey=ZrQEPSkKYmlsbC5kcmFwZXIuYXV0b0BnbWFpbC5jb20=";
      // "http://50.186.250.250:5001/search?partnumber=521190X953&numResult=10&source=google"

      String searchSource = "google";
      String partNumber = fitmentRequest.partNumber;
      boolean hasFitmentData = false;

      String urlStr = this.fitmentUrl + "?partnumber=" + partNumber
          + "&numResult=10&source=" + searchSource;

      URL url = new URL(urlStr);

      HttpURLConnection conn = (HttpURLConnection) url.openConnection();
      conn.setRequestMethod("GET");
      conn.setRequestProperty("Accept", "application/json");

      if (conn.getResponseCode() != 200) {
        LOG.info("abnormal response: " + conn.getResponseCode());
        return new ResponseEntity<>(fitments, HttpStatus.OK);
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

        aiResponse = g.fromJson(output, Content.class);

        if (aiResponse != null && aiResponse.partinfo != null) {
          // Partinfo partinfo = aiResponse.partinfo;
          for (Partinfo partinfo : aiResponse.partinfo) {

            if (partinfo.year.from > 0 && partinfo.year.to > 0) {

              for (int i = partinfo.year.from; i < partinfo.year.to; i++) {
                Fitment fitment = new Fitment();
                fitment.setDescription(partinfo.description);
                fitment.setLocation(partinfo.location);
                fitment.setMake(partinfo.make);
                fitment.setModel(partinfo.model);
                fitment.setTrim(partinfo.trim);
                fitment.setPartNumber(partinfo.partnumber);

                fitment.setYear(i);

                System.out.print(fitment);

                fitments.add(fitment);

                hasFitmentData = true;

              }
            } else {

              if (partinfo.year.from > 0) {

                Fitment fitment = new Fitment();
                fitment.setDescription(partinfo.description);
                fitment.setLocation(partinfo.location);
                fitment.setMake(partinfo.make);
                fitment.setModel(partinfo.model);
                fitment.setTrim(partinfo.trim);
                fitment.setPartNumber(partinfo.partnumber);
                fitment.setYear(partinfo.year.from);
                System.out.print(fitment);
                fitments.add(fitment);

              } else {

                Fitment fitment = new Fitment();
                fitment.setDescription(partinfo.description);
                fitment.setLocation(partinfo.location);
                fitment.setMake(partinfo.make);
                fitment.setModel(partinfo.model);
                fitment.setTrim(partinfo.trim);
                fitment.setPartNumber(partinfo.partnumber);

                System.out.print(fitment);
                fitments.add(fitment);
              }

            }
          }
        }

        return new ResponseEntity<>(fitments, HttpStatus.OK);

      } catch (Exception ee) {

        try {

          aiResponse2 = g.fromJson(output, Content2.class);

          if (aiResponse2 != null && aiResponse2.partinfo != null) {
            Partinfo partinfo = aiResponse2.partinfo;
            // for (Partinfo partinfo : aiResponse.partinfo) {

            if (partinfo.year.from > 0 && partinfo.year.to > 0) {

              for (int i = partinfo.year.from; i < partinfo.year.to; i++) {
                Fitment fitment = new Fitment();
                fitment.setDescription(partinfo.description);
                fitment.setLocation(partinfo.location);
                fitment.setMake(partinfo.make);
                fitment.setModel(partinfo.model);
                fitment.setTrim(partinfo.trim);
                fitment.setPartNumber(partinfo.partnumber);

                fitment.setYear(i);

                System.out.print(fitment);

                fitments.add(fitment);

                hasFitmentData = true;

              }
            } else {

              if (partinfo.year.from > 0) {

                Fitment fitment = new Fitment();
                fitment.setDescription(partinfo.description);
                fitment.setLocation(partinfo.location);
                fitment.setMake(partinfo.make);
                fitment.setModel(partinfo.model);
                fitment.setTrim(partinfo.trim);
                fitment.setPartNumber(partinfo.partnumber);
                fitment.setYear(partinfo.year.from);
                System.out.print(fitment);
                fitments.add(fitment);

              } else {

                Fitment fitment = new Fitment();
                fitment.setDescription(partinfo.description);
                fitment.setLocation(partinfo.location);
                fitment.setMake(partinfo.make);
                fitment.setModel(partinfo.model);
                fitment.setTrim(partinfo.trim);
                fitment.setPartNumber(partinfo.partnumber);

                System.out.print(fitment);
                fitments.add(fitment);
              }

            }
          }

        } catch (Exception ex) {

        }
        return new ResponseEntity<>(fitments, HttpStatus.OK);
      }
    } catch (

    MalformedURLException e) {

      e.printStackTrace();

    } catch (IOException e) {

      e.printStackTrace();

    }

    return new ResponseEntity<>(fitments, HttpStatus.OK);
  }

  @PostMapping("/ai/estimate")
  public ResponseEntity<EstimateResponse> getFitmentFromAIServerEstimate(@RequestBody EstimateRequest estimateRequest) {

    LOG.info(estimateRequest.workRequest + estimateRequest.vehicleId);

    try {
      VehicleEstimateClient client = new VehicleEstimateClient(aiEstimateUrl);

      try {
        // Test health check
        System.out.println("=== Health Check ===");
        VehicleEstimateClient.HealthResponse health = client.checkHealth();
        System.out.println("Status: " + health.getStatus());
        System.out.println("Message: " + health.getMessage());

        // Get available models
        System.out.println("\n=== Available Models ===");
        VehicleEstimateClient.ModelsResponse models = client.getAvailableModels();
        System.out.println("Default model: " + models.getDefaultModel());
        for (VehicleEstimateClient.ModelInfo model : models.getModels()) {
          System.out.println("- " + model.getName() + ": " + model.getDescription());
        }

        // Example 1: Text-only request
        System.out.println("\n=== Text-Only Estimate ===");
        String workRequest = "Customer reports brake pedal feels spongy and car pulls to the right when braking. 2019 Toyota Camry with 45,000 miles.";

        if (estimateRequest.images == null || estimateRequest.images.isEmpty()) {

          VehicleEstimateClient.EstimateResponse response = client.generateEstimate(estimateRequest.workRequest);

          if (response.isSuccess()) {
            System.out.println("Success: " + response.isSuccess());
            System.out.println("Model used: " + response.getMetadata().getModelUsed());
            System.out.println("Images processed: " + response.getMetadata().getImagesProcessed());
            System.out.println("Estimate JSON: " + response.getEstimate().toPrettyString());
            Gson g = new Gson();
            try {

              EstimateResponse aiResponse = new EstimateResponse();
              // System.out.println(response.getEstimate().toString());
              // aiResponse = g.fromJson(response.getEstimate().toString(),
              // EstimateResponse.class);
              // return new ResponseEntity<>(aiResponse, HttpStatus.OK);

              ResponseData responseData = new ResponseData();
              System.out.println(response.getEstimate().toString());
              responseData = g.fromJson(response.getEstimate().toString(), ResponseData.class);
              int counter = 0;
              for (Estimate estimate : responseData.getEstimateRequest().getEstimates()) {
                counter++;

                Claim claim = new Claim();
                claim.index = counter;
                claim.setAmount((float) estimate.getAmount());
                claim.setNotes(estimate.getName());
                claim.setComments(estimate.getNotes());
                claim.setName(estimate.getName());
                claim.setLabor((float) estimate.getLabor());

                if (estimate.getAutoparts() != null) {
                  for (AutoPart autoPart : estimate.getAutoparts()) {
                    counter++;
                    com.xoftex.parthub.models.Autopart autopart2 = new com.xoftex.parthub.models.Autopart();
                    autopart2.index = counter;
                    autopart2.setPrice((int) autoPart.getPrice());
                    autopart2.setComments(autoPart.getDescription());
                    autopart2.setPartNumber(autoPart.getPartNumber());
                    autopart2.setTitle(autoPart.getTitle());
                    autopart2.setGrade(autoPart.getGrade());
                    claim.autoparts.add(autopart2);
                  }
                }

                if (estimate.getJobs() != null) {
                  for (Job job : estimate.getJobs()) {
                    counter++;
                    com.xoftex.parthub.models.Job job2 = new com.xoftex.parthub.models.Job();
                    job2.index = counter;
                    job2.setJobRequestType(job.getType());
                    job2.setPrice((int) job.getPrice());
                    job2.setComments(job.getDescription());
                    job2.setName(job.getName());
                    job2.setNotes(job.getDescription());
                    job2.setHours((float) job.getHours());
                    claim.jobs.add(job2);
                  }
                }

                aiResponse.estimates.add(claim);
              }

              for (Receipt receipt : responseData.getEstimateRequest().getReceipts()) {
                com.xoftex.parthub.models.Receipt receipt2 = new com.xoftex.parthub.models.Receipt();
                receipt2.setAmount((int) receipt.getAmount());
                receipt2.setNotes(receipt.getNotes());
                receipt.setComments(receipt.getNotes());
                receipt2.setName(receipt.getName());
                receipt2.setQuantity(receipt.getQuantity());
                aiResponse.receipts.add(receipt2);
              }

              return new ResponseEntity<>(aiResponse, HttpStatus.OK);

            } catch (Exception e) {
              System.out.println(e.getMessage());
            }
          } else {
            System.out.println("Error: " + response.getError());
            System.out.println("Message: " + response.getMessage());
          }

        } else {

          // Example 2: Text + Images request
          System.out.println("\n=== Text + Images Estimate ===");

          List<File> images = new ArrayList<File>();
          for (int imageId : estimateRequest.images) {

            String path = this.fileRootPath + imageResizeDirectory + this.imageNamePrefix + imageId + ".jpeg";
            File file = new File(path);
            images.add(file);
          }
          // List<File> images = List.of(
          // new File("damage1.jpg"),
          // new File("damage2.png"));

          // Only run if image files exist
          boolean imagesExist = images.stream().allMatch(File::exists);
          if (imagesExist) {
            VehicleEstimateClient.EstimateResponse response = client.generateEstimate(
                estimateRequest.workRequest + ". Vehicle shows visible damage in uploaded photos",
                "gpt-4o",
                images);

            if (response.isSuccess()) {
              System.out.println("Success: " + response.isSuccess());
              System.out.println("Model used: " + response.getMetadata().getModelUsed());
              System.out.println("Images processed: " + response.getMetadata().getImagesProcessed());
              System.out.println("Estimate JSON: " + response.getEstimate().toPrettyString());
              Gson g = new Gson();
              try {

                EstimateResponse aiResponse = new EstimateResponse();
                // System.out.println(response.getEstimate().toString());
                // aiResponse = g.fromJson(response.getEstimate().toString(),
                // EstimateResponse.class);
                // return new ResponseEntity<>(aiResponse, HttpStatus.OK);

                ResponseData responseData = new ResponseData();
                System.out.println(response.getEstimate().toString());
                responseData = g.fromJson(response.getEstimate().toString(), ResponseData.class);
                int counter = 0;

                aiResponse.message = responseData.getImageAnalysis();

                for (Estimate estimate : responseData.getEstimateRequest().getEstimates()) {
                  counter++;

                  Claim claim = new Claim();
                  claim.index = counter;
                  claim.setItemType(estimate.getItemType());
                  claim.setAmount((float) estimate.getAmount());
                  claim.setNotes(estimate.getName());
                  claim.setComments(estimate.getNotes());
                  claim.setName(estimate.getName());
                  claim.setLabor((float) estimate.getLabor());

                  if (estimate.getAutoparts() != null) {
                    for (AutoPart autoPart : estimate.getAutoparts()) {
                      counter++;
                      com.xoftex.parthub.models.Autopart autopart2 = new com.xoftex.parthub.models.Autopart();
                      autopart2.index = counter;
                      autopart2.setPrice((int) autoPart.getPrice());
                      autopart2.setPartNumber(autoPart.getPartNumber());
                      autopart2.setComments(autoPart.getDescription());
                      autopart2.setTitle(autoPart.getTitle());
                      autopart2.setGrade(autoPart.getGrade());
                      claim.autoparts.add(autopart2);
                    }
                  }

                  if (estimate.getJobs() != null) {
                    for (Job job : estimate.getJobs()) {
                      counter++;
                      com.xoftex.parthub.models.Job job2 = new com.xoftex.parthub.models.Job();
                      job2.index = counter;
                      job2.setJobRequestType(job.getType());
                      job2.setPrice((int) job.getPrice());
                      job2.setComments(job.getDescription());
                      job2.setName(job.getName());
                      job2.setNotes(job.getDescription());
                      job2.setHours((float) job.getHours());
                      claim.jobs.add(job2);
                    }
                  }
                  aiResponse.estimates.add(claim);
                }

                for (Receipt receipt : responseData.getEstimateRequest().getReceipts()) {
                  com.xoftex.parthub.models.Receipt receipt2 = new com.xoftex.parthub.models.Receipt();
                  receipt2.setAmount((int) receipt.getAmount());
                  receipt2.setNotes(receipt.getNotes());
                  receipt.setComments(receipt.getNotes());
                  receipt2.setName(receipt.getName());
                  receipt2.setQuantity(receipt.getQuantity());
                  aiResponse.receipts.add(receipt2);
                }

                return new ResponseEntity<>(aiResponse, HttpStatus.OK);

              } catch (Exception e) {
                System.out.println(e.getMessage());
              }
            } else {
              System.out.println("Error: " + response.getError());
              System.out.println("Message: " + response.getMessage());
            }

          } else {
            System.out.println("Skipping image example - image files not found");
          }

        }

      } catch (VehicleEstimateClient.VehicleEstimateException e) {
        System.err.println("API Error: " + e.getMessage());
        System.err.println("Status Code: " + e.getStatusCode());
        if (e.getErrorResponse() != null) {
          System.err.println("Error Response: " + e.getErrorResponse().getError());
        }
      } catch (IOException e) {
        System.err.println("IO Error: " + e.getMessage());
      } catch (Exception e) {
        System.err.println("Unexpected error: " + e.getMessage());
        e.printStackTrace();
      }

    } catch (Exception e) {

    }

    return new ResponseEntity<>(null, HttpStatus.OK);
  }

  @PostMapping("/ai/original")
  public ResponseEntity<List<Fitment>> getFitmentFromAIServerOriginal(@RequestBody FitmentRequest fitmentRequest) {

    List<Fitment> fitments = new ArrayList<Fitment>();
    FitmentResponse fitmentResponse = new FitmentResponse();

    try {

      // FitmentRequest fitmentRequest = new FitmentRequest();
      // fitmentRequest.autopartId = autopart.getId();
      // fitmentRequest.year = autopart.getYear();
      // fitmentRequest.make = autopart.getMake();
      // fitmentRequest.model = autopart.getModel();
      // fitmentRequest.partNumber = autopart.getPartNumber();

      Gson gson = new Gson();
      String jsonInputString = gson.toJson(fitmentRequest);

      String urlStr = "https://xxxxxxxx/ZPBUA1ZL9KLA00848?apikey=ZrQEPSkKYmlsbC5kcmFwZXIuYXV0b0BnbWFpbC5jb20=";

      // urlStr = this.fitmentUrl + this.fitmentApiKey;
      // this.fitmentUrl = "http://localhost:8080/api/fitments/ai";
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
        return new ResponseEntity<>(fitments, HttpStatus.OK);
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

        // Type listOfMyClassObject = new TypeToken<ArrayList<Fitment>>() {
        // }.getType();
        // fitments = g.fromJson(output, listOfMyClassObject);

        fitmentResponse = g.fromJson(output, FitmentResponse.class);
        fitments = fitmentResponse.data;

        return new ResponseEntity<>(fitments, HttpStatus.OK);

      } catch (Exception ee) {

        return new ResponseEntity<>(fitments, HttpStatus.OK);
      }
    } catch (MalformedURLException e) {

      e.printStackTrace();

    } catch (IOException e) {

      e.printStackTrace();

    }

    return new ResponseEntity<>(fitments, HttpStatus.OK);
  }

  @GetMapping("/{id}")
  public ResponseEntity<Fitment> getFitment(@PathVariable("id") long fitmentId) {
    LOG.info("" + fitmentId);
    Optional<Fitment> FitmentOptional = this.fitmentRepository.findById(fitmentId);
    Fitment Fitment = new Fitment();
    if (FitmentOptional.isPresent()) {
      Fitment = FitmentOptional.get();
      return new ResponseEntity<>(Fitment, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }

  @GetMapping("/autopart/{autopartId}")
  public ResponseEntity<List<Fitment>> getAutopartFitments(@PathVariable("autopartId") long autopartId) {

    List<Fitment> fitments = new ArrayList<Fitment>();

    fitments = this.fitmentRepository.findByAutopartId(autopartId);
    if (fitments.isEmpty()) {
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    return new ResponseEntity<>(fitments, HttpStatus.OK);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteFitment(@PathVariable("id") long fitmentId) {
    LOG.info("" + fitmentId);
    Optional<Fitment> fitmentOptional = this.fitmentRepository.findById(fitmentId);
    Fitment Fitment = new Fitment();
    if (fitmentOptional.isPresent()) {
      Fitment = fitmentOptional.get();
      this.fitmentRepository.delete(Fitment);

      return new ResponseEntity<>(null, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

  }
}