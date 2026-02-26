package com.xoftex.parthub.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;

@Service
public class TwilioSmsService {

    private static final Logger LOG = LoggerFactory.getLogger(TwilioSmsService.class);

    @Value("${twilio.account.sid:}")
    private String accountSid;

    @Value("${twilio.auth.token:}")
    private String authToken;

    @Value("${twilio.phone.number:}")
    private String fromPhoneNumber;

    @Value("${twilio.simulator.enabled:true}")
    private boolean simulatorEnabled;

    @Autowired
    private TwilioSimulatorService simulatorService;

    private boolean initialized = false;

    private void initializeTwilio() {
        if (!initialized && accountSid != null && !accountSid.isEmpty() && authToken != null && !authToken.isEmpty()) {
            try {
                Twilio.init(accountSid, authToken);
                initialized = true;
                LOG.info("Twilio initialized successfully");
            } catch (Exception e) {
                LOG.error("Failed to initialize Twilio: " + e.getMessage());
            }
        }
    }

    public Message sendSms(String toPhoneNumber, String messageBody) {
        try {
            // Use simulator if enabled or Twilio not configured
            if (simulatorEnabled || !isConfigured()) {
                LOG.info("Using Twilio SIMULATOR mode");
                TwilioSimulatorService.SimulatedSmsResponse simResponse = 
                    simulatorService.sendSms(toPhoneNumber, messageBody);
                
                // Convert simulated response to Message-like object
                // Note: We'll return null and handle in controller
                LOG.info("SIMULATOR: SMS {} - SID: {}", simResponse.getStatus(), simResponse.getSid());
                return null; // Controller will handle simulator mode
            }

            initializeTwilio();

            if (!initialized) {
                LOG.error("Twilio not initialized. Check configuration.");
                return null;
            }

            // Format phone numbers
            String formattedTo = formatPhoneNumber(toPhoneNumber);
            String formattedFrom = formatPhoneNumber(fromPhoneNumber);

            LOG.info("Sending SMS from {} to {}: {}", formattedFrom, formattedTo, messageBody);

            Message message = Message.creator(
                    new PhoneNumber(formattedTo),
                    new PhoneNumber(formattedFrom),
                    messageBody)
                    .create();

            LOG.info("SMS sent successfully. SID: {}", message.getSid());
            return message;

        } catch (Exception e) {
            LOG.error("Failed to send SMS: " + e.getMessage(), e);
            throw new RuntimeException("Failed to send SMS: " + e.getMessage());
        }
    }

    public TwilioSimulatorService.SimulatedSmsResponse sendSmsSimulated(String toPhoneNumber, String messageBody) {
        return simulatorService.sendSms(toPhoneNumber, messageBody);
    }

    public TwilioSimulatorService.SimulatedSmsResponse simulateIncomingReply(String fromPhoneNumber, String originalMessage) {
        return simulatorService.simulateIncomingReply(fromPhoneNumber, originalMessage);
    }

    public boolean isSimulatorMode() {
        return simulatorEnabled || !isConfigured();
    }

    private String formatPhoneNumber(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.isEmpty()) {
            return phoneNumber;
        }

        // Remove all non-digit characters
        String digits = phoneNumber.replaceAll("[^0-9]", "");

        // Add +1 for US numbers if not present
        if (digits.length() == 10) {
            return "+1" + digits;
        } else if (digits.length() == 11 && digits.startsWith("1")) {
            return "+" + digits;
        }

        return phoneNumber; // Return as-is if format is unclear
    }

    public boolean isConfigured() {
        return accountSid != null && !accountSid.isEmpty() 
            && authToken != null && !authToken.isEmpty()
            && fromPhoneNumber != null && !fromPhoneNumber.isEmpty();
    }
}
