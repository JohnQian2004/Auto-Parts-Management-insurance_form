package com.xoftex.parthub.service;

import java.util.Random;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Twilio Simulator for testing SMS functionality without actual Twilio account
 * Simulates sending SMS and generates fake responses
 */
@Service
public class TwilioSimulatorService {

    private static final Logger LOG = LoggerFactory.getLogger(TwilioSimulatorService.class);
    private Random random = new Random();

    /**
     * Simulates sending an SMS message
     * Returns a simulated Twilio response
     */
    public SimulatedSmsResponse sendSms(String toPhoneNumber, String messageBody) {
        LOG.info("SIMULATOR: Sending SMS to {} with message: {}", toPhoneNumber, messageBody);

        // Simulate network delay
        try {
            Thread.sleep(500 + random.nextInt(1000)); // 0.5-1.5 seconds
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        // Generate fake Twilio SID
        String sid = "SM" + UUID.randomUUID().toString().replace("-", "").substring(0, 32);

        // Simulate different outcomes (90% success, 10% failure)
        boolean success = random.nextInt(100) < 90;

        SimulatedSmsResponse response = new SimulatedSmsResponse();
        response.setSid(sid);
        response.setTo(toPhoneNumber);
        response.setFrom("+15555551234"); // Simulated Twilio number
        response.setBody(messageBody);
        response.setStatus(success ? "sent" : "failed");
        response.setErrorMessage(success ? null : "Simulated network error");

        LOG.info("SIMULATOR: SMS {} - SID: {}", response.getStatus(), sid);

        return response;
    }

    /**
     * Simulates receiving an SMS reply from customer
     * This would normally come from Twilio webhook
     */
    public SimulatedSmsResponse simulateIncomingReply(String fromPhoneNumber, String originalMessage) {
        LOG.info("SIMULATOR: Generating auto-reply from {}", fromPhoneNumber);

        // Generate contextual auto-reply based on original message
        String replyMessage = generateAutoReply(originalMessage);

        String sid = "SM" + UUID.randomUUID().toString().replace("-", "").substring(0, 32);

        SimulatedSmsResponse response = new SimulatedSmsResponse();
        response.setSid(sid);
        response.setFrom(fromPhoneNumber);
        response.setTo("+15555551234"); // Our simulated number
        response.setBody(replyMessage);
        response.setStatus("received");

        LOG.info("SIMULATOR: Auto-reply generated: {}", replyMessage);

        return response;
    }

    /**
     * Generates contextual auto-reply based on message content
     */
    private String generateAutoReply(String originalMessage) {
        String lowerMessage = originalMessage.toLowerCase();

        if (lowerMessage.contains("ready") || lowerMessage.contains("pickup")) {
            String[] replies = {
                "Great! What time can I pick it up?",
                "Thank you! I'll be there this afternoon.",
                "Perfect! Can I come by around 3pm?",
                "Thanks for letting me know! See you soon."
            };
            return replies[random.nextInt(replies.length)];
        } else if (lowerMessage.contains("estimate") || lowerMessage.contains("price") || lowerMessage.contains("cost")) {
            String[] replies = {
                "Thanks for the update. Please proceed with the repairs.",
                "That sounds good. Go ahead with the work.",
                "Approved. When will it be ready?",
                "OK, please fix it. How long will it take?"
            };
            return replies[random.nextInt(replies.length)];
        } else if (lowerMessage.contains("waiting") || lowerMessage.contains("parts")) {
            String[] replies = {
                "OK, please let me know when the parts arrive.",
                "Thanks for the update. Keep me posted.",
                "No problem, I understand. Thanks!",
                "Alright, just let me know when it's ready."
            };
            return replies[random.nextInt(replies.length)];
        } else if (lowerMessage.contains("in progress") || lowerMessage.contains("working")) {
            String[] replies = {
                "Thanks for the update!",
                "Great, looking forward to getting it back.",
                "Appreciate the heads up!",
                "Thank you for keeping me informed."
            };
            return replies[random.nextInt(replies.length)];
        } else {
            String[] replies = {
                "Thank you for the update!",
                "Got it, thanks!",
                "OK, thanks for letting me know.",
                "Sounds good, thank you!",
                "Appreciate it!"
            };
            return replies[random.nextInt(replies.length)];
        }
    }

    /**
     * Simulated SMS Response object
     */
    public static class SimulatedSmsResponse {
        private String sid;
        private String to;
        private String from;
        private String body;
        private String status;
        private String errorMessage;

        public String getSid() {
            return sid;
        }

        public void setSid(String sid) {
            this.sid = sid;
        }

        public String getTo() {
            return to;
        }

        public void setTo(String to) {
            this.to = to;
        }

        public String getFrom() {
            return from;
        }

        public void setFrom(String from) {
            this.from = from;
        }

        public String getBody() {
            return body;
        }

        public void setBody(String body) {
            this.body = body;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public String getErrorMessage() {
            return errorMessage;
        }

        public void setErrorMessage(String errorMessage) {
            this.errorMessage = errorMessage;
        }
    }
}
