package com.xoftex.parthub.controllers;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.xoftex.parthub.models.Autopart;
import com.xoftex.parthub.models.Vin.Root;
import com.xoftex.parthub.models.Vin2.Result;
import com.xoftex.parthub.models.Vin2.Vin2Root;
import com.xoftex.parthub.models.Zip.ZipRoot;
import com.xoftex.parthub.repository.AutoPartRepository;
import com.xoftex.parthub.repository.ImageModelRepository;

import io.swagger.v3.oas.annotations.tags.Tag;

/* ObjectMapper om = new ObjectMapper();
Root root = om.readValue(myJsonString, Root.class);
 */

@Tag(name = "VIN Sever ", description = "VIN APIs")
// for Angular Client (withCredentials)
// @CrossOrigin(origins = "http://localhost:4200", maxAge = 3600,
// allowCredentials = "true")
// @CrossOrigin(origins = "*", maxAge = 3600)
@CrossOrigin("*")
@RestController
@RequestMapping("/api")
public class VinController {

    @Autowired
    AutoPartRepository autoPartRepository;

    @Autowired
    ImageModelRepository imageModelRepository;

    @Value("${vin.search.url}")
    // String vinSerachUrl = "https://auto.dev/api/vin/";
    String vinSerachUrl = "";

    String vin2SerachUrl = "https://vpic.nhtsa.dot.gov/api/vehicles/decodevinextended/";

    String vin2SearchFormat = "?format=json";

    @Value("${vin.search.apikey}")
    // String vinSerachUrl = "?apikey=ZrQEPSkKYmlsbC5kcmFwZXIuYXV0b0BnbWFpbC5jb20=";
    String vinSerachApikey = "";

    private static final Logger LOG = LoggerFactory.getLogger(VinController.class);

    @GetMapping("/getVin/{vin}")
    public ResponseEntity<Autopart> getVinInfo(@PathVariable("vin") String vinStr) {

        Root vin = new Root();

        LOG.info(vinStr);

        try {
            String urlStr = "https://auto.dev/api/vin/ZPBUA1ZL9KLA00848?apikey=ZrQEPSkKYmlsbC5kcmFwZXIuYXV0b0BnbWFpbC5jb20=";

            urlStr = this.vinSerachUrl + vinStr + this.vinSerachApikey;
            URL url = new URL(urlStr);

            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Accept", "application/json");

            if (conn.getResponseCode() != 200) {
                // throw new RuntimeException("Failed : HTTP error code : "
                // + conn.getResponseCode());
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
                vin = g.fromJson(output, Root.class);

                Autopart autopart = new Autopart();

                autopart.setYear(vin.years.get(0).year);

                if (vin.make.name != null && vin.make.name.equals("MINI")) {
                    vin.make.name = "Mini";
                }
                String make = vin.make.name;
                if (make.equals("INFINITI"))
                    make = "Infiniti";

                autopart.setMake(make);
                autopart.setModel(vin.model.name);
                autopart.setEngine(vin.engine.size);

                Double engineSize = vin.engine.size;
                String engineConfiguration = vin.engine.configuration;
                String engineCompressorType = vin.engine.compressorType;
                String engineEesc = "";
                int engineCylinder = vin.engine.cylinder;
                String transmissoinName = vin.transmission.name;

                // if (engineCompressorType.equals("twin turbocharger")) {
                // engineCompressorType = "Twin-Turbo";
                // engineEesc = engineSize + ".L" + " " + engineCompressorType;
                // } else {
                // engineEesc = engineSize + ".L" + " " + engineCylinder + "cyl";
                // }
                if (engineConfiguration.equals("V"))
                    engineEesc = engineSize + "L" + " " + "V" + engineCylinder;
                else
                    engineEesc = engineSize + "L" + " " + "I" + engineCylinder;

                // if (engineCompressorType.equals("turbocharger"))
                //     autopart.setEngineDesc(engineEesc + " Turbo");
                // else if (engineCompressorType.equals("Diesel"))
                //     autopart.setEngineDesc(engineEesc + " Diesel");
                // else
                //     autopart.setEngineDesc(engineEesc);

                autopart.setTransmission(vin.transmission.name);
                // autopart.setTransmission(transmissoinName);

                String drivenWheels = "";

                if (vin.drivenWheels.equals("all wheel drive"))
                    drivenWheels = "AWD";
                else if (vin.drivenWheels.equals("front wheel drive"))
                    drivenWheels = "FWD";
                else if (vin.drivenWheels.equals("real wheel drive"))
                    drivenWheels = "RWD";
                else
                    drivenWheels = vin.drivenWheels;

                // autopart.setTransmission(vin.transmission.transmissionType);
                String style = "";
                String trim = "";
                try {
                    style = vin.years.get(0).styles.get(0).name;
                    trim = vin.years.get(0).styles.get(0).trim;
                } catch (Exception ex) {
                    style = vin.engine.size + ".L " + vin.transmission.name + " " + drivenWheels + " " + vin.numOfDoors
                            + " dr";
                }
                // autopart.setDescription(
                // vin.engine.size + ".L " + vin.transmission.name + " " + drivenWheels + "" +
                // style);
                //autopart.setTrim(trim);
                autopart.setDescription(style);

                return new ResponseEntity<>(autopart, HttpStatus.OK);

            } catch (Exception ee) {

                Autopart autopart = new Autopart();

                autopart = this.SearchAgain(vinStr);
                return new ResponseEntity<>(autopart, HttpStatus.OK);
            }
        } catch (MalformedURLException e) {

            e.printStackTrace();

        } catch (IOException e) {

            e.printStackTrace();

        }

        return new ResponseEntity<>(new Autopart(), HttpStatus.OK);

    }

    public Autopart SearchAgain(String vinStr) {

        Vin2Root vin = new Vin2Root();
        Autopart autopart = new Autopart();
        LOG.info("Not Found in auto.dev: " + vinStr);

        try {
            String urlStr = "https://vpic.nhtsa.dot.gov/api/vehicles/decodevinextended/1FTPX1EV0A0017433?format=json";

            urlStr = this.vin2SerachUrl + vinStr + this.vin2SearchFormat;
            URL url = new URL(urlStr);

            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Accept", "application/json");

            if (conn.getResponseCode() != 200) {
                // throw new RuntimeException("Failed : HTTP error code : "
                // + conn.getResponseCode());
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
                vin = g.fromJson(output, Vin2Root.class);
                // System.out.println(vin);

                String style = "";
                if (vin != null && vin.Results.size() > 0) {

                    for (Result result : vin.Results) {
                        if (result.Variable.equals("Model Year")) {
                            autopart.setYear(Integer.parseInt(result.Value));
                        }

                        if (result.Variable.equals("Make")) {
                            if (result.Value != null) {

                                if (!result.Value.equals("BMW") && !result.Value.equals("GMC"))
                                    result.Value = result.Value.substring(0, 1).toUpperCase()
                                            + result.Value.substring(1).toLowerCase();
                            }
                            autopart.setMake(result.Value);
                        }

                        if (result.Variable.equals("Model")) {
                            autopart.setModel(result.Value);
                        }

                        // if (result.Variable.equals("Trim")) {
                        //     autopart.setTrim(result.Value);
                        // }

                        // {
                        // "Value": "V-Shaped",
                        // "ValueId": "2",
                        // "Variable": "Engine Configuration",
                        // "VariableId": 64
                        // }
                        String enigneConfiguration = "";
                        if (result.Variable.equals("Engine Configuration")) {
                            enigneConfiguration = result.Value;
                            if (enigneConfiguration.equals("V-Shaped")) {
                                enigneConfiguration = "V";
                            }
                        }

                        if (result.Variable.equals("Vehicle Type")) {
                            if (result.Value != null && !result.Value.equals("INCOMPLETE VEHICLE")) {

                                if (result.Value.equals("MULTIPURPOSE PASSENGER VEHICLE (MPV)")) {
                                    result.Value = "MPV";
                                }

                                style += result.Value;

                            }

                        }

                        if (result.Variable.equals("Drive Type")) {
                            if (result.Value != null) {
                                if (result.Value.contains("/")) {
                                    try {
                                        result.Value = result.Value.substring(0, result.Value.indexOf("/"));
                                    } catch (Exception ex) {
                                    }
                                }

                                style += " " + result.Value;
                            }
                        }
                        String engineSize = "";
                        if (result.Variable.equals("Displacement (L)")) {
                            if (result.Value != null) {
                                style += " " + result.Value + "L";
                                engineSize = result.Value;
                            }
                        }
                        String engineNumber = "";

                        if (result.Variable.equals("Engine Number of Cylinders")) {
                            if (result.Value != null) {
                                style += " " + result.Value + "cyl";
                                engineNumber = result.Value;
                            }
                        }
                        // if (enigneConfiguration.equals("V"))
                        //     autopart.setEngineDesc(engineSize + "L" + " " + "V" + engineNumber);
                        // else
                        //     autopart.setEngineDesc(engineSize + "L" + " " + "I" + engineNumber);

                        if (result.Variable.equals("Doors")) {
                            if (result.Value != null)
                                style += " " + result.Value + "dr";
                        }

                        // if (result.Variable.equals("Body Class")) {
                        // if (result.Value != null)
                        // style += " " + result.Value ;
                        // }

                        // style = vin.engine.size + ".L " + vin.transmission.name + " " + drivenWheels
                        // + " "
                        // + vin.numOfDoors
                        // + " dr";

                        autopart.setDescription(style.trim());

                    }
                }
            } catch (Exception ex) {

            }
        } catch (Exception ex) {

        }

        return autopart;

    }

    @GetMapping("/getZip/{zip}")
    public ResponseEntity<ZipRoot> getZipInfo(@PathVariable("zip") String zip) {

        ZipRoot zipRoot = new ZipRoot();

        LOG.info(zip);

        try {
            String urlStr = "https://ziptasticapi.com/";

            urlStr = urlStr + zip;
            URL url = new URL(urlStr);

            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Accept", "application/json");

            if (conn.getResponseCode() != 200) {
                // throw new RuntimeException("Failed : HTTP error code : "
                // + conn.getResponseCode());
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
                zipRoot = g.fromJson(output, ZipRoot.class);
                return new ResponseEntity<>(zipRoot, HttpStatus.OK);

            } catch (Exception ee) {

                JsonObject convertedObject = new Gson().fromJson(output, JsonObject.class);
                zipRoot = g.fromJson(convertedObject.toString(), ZipRoot.class);
                return new ResponseEntity<>(zipRoot, HttpStatus.OK);
            }
        } catch (MalformedURLException e) {

            e.printStackTrace();

        } catch (IOException e) {

            e.printStackTrace();

        }

        return new ResponseEntity<>(new ZipRoot(), HttpStatus.OK);

    }
}
