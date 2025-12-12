package com.xoftex.parthub.services;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

@Service
public class ActiveUserService {
    private final Map<String, String> activeTokens = new ConcurrentHashMap<>();

    public void addToken(String username, String token) {
        activeTokens.put(username, token);
    }

    public void removeToken(String username) {
        activeTokens.remove(username);
    }

    public int getActiveUserCount() {
        return activeTokens.size();
    }
}
