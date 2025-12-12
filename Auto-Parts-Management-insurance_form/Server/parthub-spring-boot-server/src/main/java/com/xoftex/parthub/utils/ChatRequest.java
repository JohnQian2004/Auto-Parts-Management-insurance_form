package com.xoftex.parthub.utils;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;


public class ChatRequest extends AbstractRequest {

  
    private String prompt;
    private String message;
    
    @Override
    public String toJson() {

        GsonBuilder builder = new GsonBuilder();
        builder.setPrettyPrinting();
        Gson gson = builder.create();
        return gson.toJson(this);
    }

    public String getPrompt() {
        return prompt;
    }

    public void setPrompt(String prompt) {
        this.prompt = prompt;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

}
