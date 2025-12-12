package com.xoftex.parthub.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.server.standard.ServerEndpointExporter;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.WebSocketHandler;
import com.xoftex.parthub.services.NoteWebSocketHandler;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final NoteWebSocketHandler jobWebSocketHandler;

    public WebSocketConfig(NoteWebSocketHandler jobWebSocketHandler) {
        this.jobWebSocketHandler = jobWebSocketHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(jobWebSocketHandler, "/ws/notes").setAllowedOrigins("*");
    }

    // This bean will automatically register the WebSocket handler to the server.
    @Bean
    public ServerEndpointExporter serverEndpointExporter() {
        return new ServerEndpointExporter();
    }
}
