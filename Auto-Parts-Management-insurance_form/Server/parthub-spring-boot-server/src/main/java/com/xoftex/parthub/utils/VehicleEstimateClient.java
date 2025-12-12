package com.xoftex.parthub.utils;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import okhttp3.*;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.TimeUnit;

/**
 * Java client for Vehicle Estimate API
 * Supports both text-only and text+image requests
 */
public class VehicleEstimateClient {
    
    private static final String DEFAULT_BASE_URL = "http://localhost:5000";
    private static final String DEFAULT_MODEL = "gpt-4o";
    private static final int DEFAULT_TIMEOUT = 120; // seconds
    
    private final String baseUrl;
    private final OkHttpClient httpClient;
    private final ObjectMapper objectMapper;
    
    public VehicleEstimateClient() {
        this(DEFAULT_BASE_URL);
    }
    
    public VehicleEstimateClient(String baseUrl) {
        this.baseUrl = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        this.httpClient = new OkHttpClient.Builder()
                .connectTimeout(DEFAULT_TIMEOUT, TimeUnit.SECONDS)
                .readTimeout(DEFAULT_TIMEOUT, TimeUnit.SECONDS)
                .writeTimeout(DEFAULT_TIMEOUT, TimeUnit.SECONDS)
                .build();
        this.objectMapper = new ObjectMapper();
    }
    
    /**
     * Generate estimate with text only
     */
    public EstimateResponse generateEstimate(String workRequest) throws IOException {
        return generateEstimate(workRequest, DEFAULT_MODEL, null);
    }
    
    /**
     * Generate estimate with text and model specification
     */
    public EstimateResponse generateEstimate(String workRequest, String model) throws IOException {
        return generateEstimate(workRequest, model, null);
    }
    
    /**
     * Generate estimate with text and images
     */
    public EstimateResponse generateEstimate(String workRequest, List<File> images) throws IOException {
        return generateEstimate(workRequest, DEFAULT_MODEL, images);
    }
    
    /**
     * Generate estimate with text, model, and images
     */
    public EstimateResponse generateEstimate(String workRequest, String model, List<File> images) throws IOException {
        if (workRequest == null || workRequest.trim().isEmpty()) {
            throw new IllegalArgumentException("Work request cannot be null or empty");
        }
        
        String url = baseUrl + "/estimate";
        
        if (images == null || images.isEmpty()) {
            // Text-only request using JSON
            return generateEstimateJson(url, workRequest, model);
        } else {
            // Text + images request using multipart form
            return generateEstimateMultipart(url, workRequest, model, images);
        }
    }
    
    private EstimateResponse generateEstimateJson(String url, String workRequest, String model) throws IOException {
        @SuppressWarnings("deprecation")
        RequestBody body = RequestBody.create(
            MediaType.parse("application/json"),
            String.format("{\"work_request\":\"%s\",\"model\":\"%s\"}", 
                         escapeJson(workRequest), escapeJson(model))
        );
        
        Request request = new Request.Builder()
                .url(url)
                .post(body)
                .addHeader("Content-Type", "application/json")
                .build();
        
        return executeRequest(request);
    }
    
    private EstimateResponse generateEstimateMultipart(String url, String workRequest, String model, List<File> images) throws IOException {
        MultipartBody.Builder builder = new MultipartBody.Builder()
                .setType(MultipartBody.FORM)
                .addFormDataPart("work_request", workRequest)
                .addFormDataPart("model", model);
        
        // Add images
        for (File image : images) {
            if (!image.exists() || !image.isFile()) {
                throw new IllegalArgumentException("Image file does not exist: " + image.getPath());
            }
            
            String mimeType = getMimeType(image.getName());
            RequestBody fileBody = RequestBody.create(MediaType.parse(mimeType), image);
            builder.addFormDataPart("images", image.getName(), fileBody);
        }
        
        RequestBody requestBody = builder.build();
        Request request = new Request.Builder()
                .url(url)
                .post(requestBody)
                .build();
        
        return executeRequest(request);
    }
    
    private EstimateResponse executeRequest(Request request) throws IOException {
        try (Response response = httpClient.newCall(request).execute()) {
            String responseBody = Objects.requireNonNull(response.body()).string();
            
            if (!response.isSuccessful()) {
                ErrorResponse error = objectMapper.readValue(responseBody, ErrorResponse.class);
                throw new VehicleEstimateException("API Error: " + error.getMessage(), response.code(), error);
            }
            
            return objectMapper.readValue(responseBody, EstimateResponse.class);
        }
    }
    
    /**
     * Check API health
     */
    public HealthResponse checkHealth() throws IOException {
        Request request = new Request.Builder()
                .url(baseUrl + "/health")
                .get()
                .build();
        
        try (Response response = httpClient.newCall(request).execute()) {
            String responseBody = Objects.requireNonNull(response.body()).string();
            
            if (!response.isSuccessful()) {
                throw new VehicleEstimateException("Health check failed", response.code(), null);
            }
            
            return objectMapper.readValue(responseBody, HealthResponse.class);
        }
    }
    
    /**
     * Get available models
     */
    public ModelsResponse getAvailableModels() throws IOException {
        Request request = new Request.Builder()
                .url(baseUrl + "/models")
                .get()
                .build();
        
        try (Response response = httpClient.newCall(request).execute()) {
            String responseBody = Objects.requireNonNull(response.body()).string();
            
            if (!response.isSuccessful()) {
                throw new VehicleEstimateException("Failed to get models", response.code(), null);
            }
            
            return objectMapper.readValue(responseBody, ModelsResponse.class);
        }
    }
    
    private String getMimeType(String filename) {
        String extension = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
        switch (extension) {
            case "jpg":
            case "jpeg":
                return "image/jpeg";
            case "png":
                return "image/png";
            default:
                return "application/octet-stream";
        }
    }
    
    private String escapeJson(String text) {
        return text.replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "\\r");
    }
    
    // Response classes
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class EstimateResponse {
        @JsonProperty("success")
        private boolean success;
        
        @JsonProperty("estimate")
        private JsonNode estimate;
        
        @JsonProperty("metadata")
        private Metadata metadata;
        
        @JsonProperty("error")
        private String error;
        
        @JsonProperty("message")
        private String message;
        
        // Getters and setters
        public boolean isSuccess() { return success; }
        public void setSuccess(boolean success) { this.success = success; }
        
        public JsonNode getEstimate() { return estimate; }
        public void setEstimate(JsonNode estimate) { this.estimate = estimate; }
        
        public Metadata getMetadata() { return metadata; }
        public void setMetadata(Metadata metadata) { this.metadata = metadata; }
        
        public String getError() { return error; }
        public void setError(String error) { this.error = error; }
        
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
    
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Metadata {
        @JsonProperty("images_processed")
        private int imagesProcessed;
        
        @JsonProperty("model_used")
        private String modelUsed;
        
        @JsonProperty("has_image_analysis")
        private boolean hasImageAnalysis;
        
        // Getters and setters
        public int getImagesProcessed() { return imagesProcessed; }
        public void setImagesProcessed(int imagesProcessed) { this.imagesProcessed = imagesProcessed; }
        
        public String getModelUsed() { return modelUsed; }
        public void setModelUsed(String modelUsed) { this.modelUsed = modelUsed; }
        
        public boolean isHasImageAnalysis() { return hasImageAnalysis; }
        public void setHasImageAnalysis(boolean hasImageAnalysis) { this.hasImageAnalysis = hasImageAnalysis; }
    }
    
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class HealthResponse {
        @JsonProperty("status")
        private String status;
        
        @JsonProperty("message")
        private String message;
        
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
    
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ModelsResponse {
        @JsonProperty("models")
        private List<ModelInfo> models;
        
        @JsonProperty("default")
        private String defaultModel;
        
        public List<ModelInfo> getModels() { return models; }
        public void setModels(List<ModelInfo> models) { this.models = models; }
        
        public String getDefaultModel() { return defaultModel; }
        public void setDefaultModel(String defaultModel) { this.defaultModel = defaultModel; }
    }
    
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ModelInfo {
        @JsonProperty("name")
        private String name;
        
        @JsonProperty("description")
        private String description;
        
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }
    
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ErrorResponse {
        @JsonProperty("error")
        private String error;
        
        @JsonProperty("message")
        private String message;
        
        public String getError() { return error; }
        public void setError(String error) { this.error = error; }
        
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
    
    // Custom exception
    public static class VehicleEstimateException extends RuntimeException {
        private final int statusCode;
        private final ErrorResponse errorResponse;
        
        public VehicleEstimateException(String message, int statusCode, ErrorResponse errorResponse) {
            super(message);
            this.statusCode = statusCode;
            this.errorResponse = errorResponse;
        }
        
        public int getStatusCode() { return statusCode; }
        public ErrorResponse getErrorResponse() { return errorResponse; }
    }
} 


 // Example usage class
// class VehicleEstimateClientExample {
//     public static void main(String[] args) {
//         VehicleEstimateClient client = new VehicleEstimateClient("http://localhost:5000");
        
//         try {
//             // Test health check
//             System.out.println("=== Health Check ===");
//             VehicleEstimateClient.HealthResponse health = client.checkHealth();
//             System.out.println("Status: " + health.getStatus());
//             System.out.println("Message: " + health.getMessage());
            
//             // Get available models
//             System.out.println("\n=== Available Models ===");
//             VehicleEstimateClient.ModelsResponse models = client.getAvailableModels();
//             System.out.println("Default model: " + models.getDefaultModel());
//             for (VehicleEstimateClient.ModelInfo model : models.getModels()) {
//                 System.out.println("- " + model.getName() + ": " + model.getDescription());
//             }
            
//             // Example 1: Text-only request
//             System.out.println("\n=== Text-Only Estimate ===");
//             String workRequest = "Customer reports brake pedal feels spongy and car pulls to the right when braking. 2019 Toyota Camry with 45,000 miles.";
            
//             VehicleEstimateClient.EstimateResponse response = client.generateEstimate(workRequest);
            
//             if (response.isSuccess()) {
//                 System.out.println("Success: " + response.isSuccess());
//                 System.out.println("Model used: " + response.getMetadata().getModelUsed());
//                 System.out.println("Images processed: " + response.getMetadata().getImagesProcessed());
//                 System.out.println("Estimate JSON: " + response.getEstimate().toPrettyString());
//             } else {
//                 System.out.println("Error: " + response.getError());
//                 System.out.println("Message: " + response.getMessage());
//             }
            
//             // Example 2: Text + Images request
//             System.out.println("\n=== Text + Images Estimate ===");
//             List<File> images = List.of(
//                 new File("damage1.jpg"),
//                 new File("damage2.png")
//             );
            
//             // Only run if image files exist
//             boolean imagesExist = images.stream().allMatch(File::exists);
//             if (imagesExist) {
//                 VehicleEstimateClient.EstimateResponse imageResponse = client.generateEstimate(
//                     "Vehicle shows visible damage in uploaded photos", 
//                     "gpt-4o", 
//                     images
//                 );
                
//                 if (imageResponse.isSuccess()) {
//                     System.out.println("Success: " + imageResponse.isSuccess());
//                     System.out.println("Images processed: " + imageResponse.getMetadata().getImagesProcessed());
//                     System.out.println("Has image analysis: " + imageResponse.getMetadata().isHasImageAnalysis());
//                 } else {
//                     System.out.println("Error: " + imageResponse.getError());
//                 }
//             } else {
//                 System.out.println("Skipping image example - image files not found");
//             }
            
//         } catch (VehicleEstimateClient.VehicleEstimateException e) {
//             System.err.println("API Error: " + e.getMessage());
//             System.err.println("Status Code: " + e.getStatusCode());
//             if (e.getErrorResponse() != null) {
//                 System.err.println("Error Response: " + e.getErrorResponse().getError());
//             }
//         } catch (IOException e) {
//             System.err.println("IO Error: " + e.getMessage());
//         } catch (Exception e) {
//             System.err.println("Unexpected error: " + e.getMessage());
//             e.printStackTrace();
//         }
//     }
//}