package com.xoftex.parthub.services;


import org.springframework.stereotype.Service;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.web.socket.TextMessage;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.xoftex.parthub.models.Job;
import com.xoftex.parthub.models.Note;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class NoteWebSocketHandler extends TextWebSocketHandler {

    private final ObjectMapper objectMapper = new ObjectMapper();

    private final List<WebSocketSession> sessions = new ArrayList<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.add(session);
        System.out.println("New WebSocket connection: " + session.getId());
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        // Handle incoming messages from clients if needed (this is optional)
        System.out.println("Message received: " + message.getPayload());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, org.springframework.web.socket.CloseStatus status) throws Exception {
        sessions.remove(session);
        System.out.println("WebSocket connection closed: " + session.getId());
    }

    // Method to send a Job object to all connected clients
    public void sendJobToClients(Note note) {
        try {
            String jobJson = objectMapper.writeValueAsString(note);
            for (WebSocketSession session : sessions) {
                if (session.isOpen()) {
                    session.sendMessage(new TextMessage(jobJson));
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
