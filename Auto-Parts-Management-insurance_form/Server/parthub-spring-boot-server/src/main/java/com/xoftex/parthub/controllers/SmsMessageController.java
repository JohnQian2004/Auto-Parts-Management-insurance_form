package com.xoftex.parthub.controllers;

import java.util.List;
import java.util.Optional;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.twilio.rest.api.v2010.account.Message;
import com.xoftex.parthub.models.SmsMessage;
import com.xoftex.parthub.models.Vehicle;
import com.xoftex.parthub.repository.SmsMessageRepository;
import com.xoftex.parthub.repository.VehicleRepository;
import com.xoftex.parthub.service.TwilioSimulatorService;
import com.xoftex.parthub.service.TwilioSmsService;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/sms")
public class SmsMessageController {

    private static final Logger LOG = LoggerFactory.getLogger(SmsMessageController.class);

    @Autowired
    private SmsMessageRepository smsMessageRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private TwilioSmsService twilioSmsService;

    @PostMapping("/send")
    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<?> sendSms(@RequestBody SmsMessage smsMessage) {
        try {
            LOG.info("Sending SMS to: " + smsMessage.getPhoneNumber());

            // Check if using simulator mode
            if (twilioSmsService.isSimulatorMode()) {
                LOG.info("Using SIMULATOR mode for SMS");
                
                // Send via simulator
                TwilioSimulatorService.SimulatedSmsResponse simResponse = 
                    twilioSmsService.sendSmsSimulated(
                        smsMessage.getPhoneNumber(),
                        smsMessage.getMessage());

                // Save to database
                smsMessage.setDirection("outbound");
                smsMessage.setStatus(simResponse.getStatus());
                smsMessage.setTwilioSid(simResponse.getSid());
                smsMessage.setErrorMessage(simResponse.getErrorMessage());
                SmsMessage savedMessage = smsMessageRepository.save(smsMessage);

                LOG.info("SIMULATOR: SMS saved to database with ID: " + savedMessage.getId());

                // Simulate auto-reply after 2-5 seconds (in background)
                if ("sent".equals(simResponse.getStatus())) {
                    new Thread(() -> {
                        try {
                            Thread.sleep(2000 + (long)(Math.random() * 3000)); // 2-5 seconds
                            
                            // Generate auto-reply
                            TwilioSimulatorService.SimulatedSmsResponse replyResponse = 
                                twilioSmsService.simulateIncomingReply(
                                    smsMessage.getPhoneNumber(),
                                    smsMessage.getMessage());

                            // Save auto-reply to database
                            SmsMessage incomingMessage = new SmsMessage();
                            incomingMessage.setVehicleId(smsMessage.getVehicleId());
                            incomingMessage.setUserId(0); // System/Customer
                            incomingMessage.setPhoneNumber(replyResponse.getFrom());
                            incomingMessage.setMessage(replyResponse.getBody());
                            incomingMessage.setDirection("inbound");
                            incomingMessage.setStatus("received");
                            incomingMessage.setTwilioSid(replyResponse.getSid());
                            smsMessageRepository.save(incomingMessage);

                            LOG.info("SIMULATOR: Auto-reply saved to database");
                        } catch (Exception e) {
                            LOG.error("Error generating auto-reply: " + e.getMessage());
                        }
                    }).start();
                }

                return new ResponseEntity<>(savedMessage, HttpStatus.OK);
            }

            // Real Twilio mode
            Message twilioMessage = twilioSmsService.sendSms(
                    smsMessage.getPhoneNumber(),
                    smsMessage.getMessage());

            if (twilioMessage != null) {
                // Save to database
                smsMessage.setDirection("outbound");
                smsMessage.setStatus(twilioMessage.getStatus().toString());
                smsMessage.setTwilioSid(twilioMessage.getSid());
                SmsMessage savedMessage = smsMessageRepository.save(smsMessage);

                LOG.info("SMS saved to database with ID: " + savedMessage.getId());
                return new ResponseEntity<>(savedMessage, HttpStatus.OK);
            } else {
                smsMessage.setDirection("outbound");
                smsMessage.setStatus("failed");
                smsMessage.setErrorMessage("Twilio not configured");
                SmsMessage savedMessage = smsMessageRepository.save(smsMessage);
                return new ResponseEntity<>(savedMessage, HttpStatus.OK);
            }

        } catch (Exception e) {
            LOG.error("Error sending SMS: " + e.getMessage(), e);
            smsMessage.setDirection("outbound");
            smsMessage.setStatus("failed");
            smsMessage.setErrorMessage(e.getMessage());
            SmsMessage savedMessage = smsMessageRepository.save(smsMessage);
            return new ResponseEntity<>(savedMessage, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/webhook")
    public ResponseEntity<?> receiveWebhook(
            @RequestParam("From") String from,
            @RequestParam("Body") String body,
            @RequestParam(value = "MessageSid", required = false) String messageSid) {
        try {
            LOG.info("Received SMS webhook from: " + from + ", body: " + body);

            // Find vehicle by phone number
            List<Long> vehicleIds = smsMessageRepository.findVehicleIdsByPhoneNumber(from);
            
            long vehicleId = 0;
            if (!vehicleIds.isEmpty()) {
                vehicleId = vehicleIds.get(0); // Get most recent vehicle
            } else {
                // Try to find vehicle by customer phone
                List<Vehicle> vehicles = vehicleRepository.findByCustomerPhone(from);
                if (!vehicles.isEmpty()) {
                    vehicleId = vehicles.get(0).getId();
                }
            }

            // Save incoming message
            SmsMessage smsMessage = new SmsMessage();
            smsMessage.setPhoneNumber(from);
            smsMessage.setMessage(body);
            smsMessage.setDirection("inbound");
            smsMessage.setStatus("received");
            smsMessage.setTwilioSid(messageSid);
            smsMessage.setVehicleId(vehicleId);
            smsMessage.setUserId(0); // System received

            smsMessageRepository.save(smsMessage);

            LOG.info("Incoming SMS saved for vehicle ID: " + vehicleId);

            return new ResponseEntity<>("<?xml version=\"1.0\" encoding=\"UTF-8\"?><Response></Response>",
                    HttpStatus.OK);

        } catch (Exception e) {
            LOG.error("Error processing webhook: " + e.getMessage(), e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/vehicle/{vehicleId}")
    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<List<SmsMessage>> getVehicleSmsMessages(@PathVariable("vehicleId") long vehicleId) {
        try {
            List<SmsMessage> messages = smsMessageRepository.findByVehicleIdOrderByCreatedAtDesc(vehicleId);
            return new ResponseEntity<>(messages, HttpStatus.OK);
        } catch (Exception e) {
            LOG.error("Error fetching SMS messages: " + e.getMessage(), e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/phone/{phoneNumber}")
    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<List<SmsMessage>> getPhoneSmsMessages(@PathVariable("phoneNumber") String phoneNumber) {
        try {
            List<SmsMessage> messages = smsMessageRepository.findByPhoneNumberOrderByCreatedAtDesc(phoneNumber);
            return new ResponseEntity<>(messages, HttpStatus.OK);
        } catch (Exception e) {
            LOG.error("Error fetching SMS messages: " + e.getMessage(), e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/simulator/status")
    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN','SHOP', 'RECYCLER')")
    public ResponseEntity<?> getSimulatorStatus() {
        boolean isSimulator = twilioSmsService.isSimulatorMode();
        String mode = isSimulator ? "SIMULATOR" : "REAL_TWILIO";
        
        return new ResponseEntity<>(new SimulatorStatus(mode, isSimulator), HttpStatus.OK);
    }

    private static class SimulatorStatus {
        private String mode;
        private boolean simulatorEnabled;

        public SimulatorStatus(String mode, boolean simulatorEnabled) {
            this.mode = mode;
            this.simulatorEnabled = simulatorEnabled;
        }

        public String getMode() {
            return mode;
        }

        public boolean isSimulatorEnabled() {
            return simulatorEnabled;
        }
    }
}
