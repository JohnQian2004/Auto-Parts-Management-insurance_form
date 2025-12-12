package com.xoftex.parthub.controllers;

import java.util.List;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

// Main data classes
public class ResponseData {
    private List<ItemType> ItemType;
    private List<JobOrderType> JobOrderType;
    private EstimateRequest estimateRequest;
    private String imageAnalysis;
    
    // Getters and setters
    public List<ItemType> getItemType() { return ItemType; }
    public void setItemType(List<ItemType> itemType) { this.ItemType = itemType; }
    
    public List<JobOrderType> getJobOrderType() { return JobOrderType; }
    public void setJobOrderType(List<JobOrderType> jobOrderType) { this.JobOrderType = jobOrderType; }
    
    public EstimateRequest getEstimateRequest() { return estimateRequest; }
    public void setEstimateRequest(EstimateRequest estimateRequest) { this.estimateRequest = estimateRequest; }
    public String getImageAnalysis() {
        return imageAnalysis;
    }
    public void setImageAnalysis(String imageAnalysis) {
        this.imageAnalysis = imageAnalysis;
    }
}

class ItemType {
    private String code;
    private String description;
    private int id;
    
    // Getters and setters
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
}

class JobOrderType {
    private String code;
    private String description;
    private int id;
    
    // Getters and setters
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
}

class EstimateRequest {
    
    private double confidenceScore;
    private String createdAt;
    private String error;
    private List<Estimate> estimates;
    private boolean isSuccessful;
 
    private List<Receipt> receipts;
    private String workRequest;
    
    // Getters and setters
    public double getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(double confidenceScore) { this.confidenceScore = confidenceScore; }
    
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
    
    public String getError() { return error; }
    public void setError(String error) { this.error = error; }
    
    public List<Estimate> getEstimates() { return estimates; }
    public void setEstimates(List<Estimate> estimates) { this.estimates = estimates; }
    
    public boolean isSuccessful() { return isSuccessful; }
    public void setSuccessful(boolean successful) { isSuccessful = successful; }
    
    public List<Receipt> getReceipts() { return receipts; }
    public void setReceipts(List<Receipt> receipts) { this.receipts = receipts; }
    
    public String getWorkRequest() { return workRequest; }
    public void setWorkRequest(String workRequest) { this.workRequest = workRequest; }
}

class AutoPart {
    private int claimId;
    private String comments;
    private String description;
    private String grade;
    private int id;
    private String partName;
    private String partNumber;
    private double price;
    private double salePrice;
    private String title;
    
    // Getters and setters
    public int getClaimId() { return claimId; }
    public void setClaimId(int claimId) { this.claimId = claimId; }
    
    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }
    
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    
    public String getPartName() { return partName; }
    public void setPartName(String partName) { this.partName = partName; }
    
    public String getPartNumber() { return partNumber; }
    public void setPartNumber(String partNumber) { this.partNumber = partNumber; }
    
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    
    public double getSalePrice() { return salePrice; }
    public void setSalePrice(double salePrice) { this.salePrice = salePrice; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
}

class Estimate {
    private double amount;
    private String comments;
    private int id;
    private int itemType;
    private double labor;
    private boolean laborIncluded;
    private String name;
    private String notes;
    private double paint;
    private String partNumber;
    private int quantity;
    
    private List<AutoPart> autoparts;
    private List<Job> jobs;
    
    // Getters and setters
    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }
    
    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }
    
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    
    public int getItemType() { return itemType; }
    public void setItemType(int itemType) { this.itemType = itemType; }
    
    public double getLabor() { return labor; }
    public void setLabor(double labor) { this.labor = labor; }
    
    public boolean isLaborIncluded() { return laborIncluded; }
    public void setLaborIncluded(boolean laborIncluded) { this.laborIncluded = laborIncluded; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public double getPaint() { return paint; }
    public void setPaint(double paint) { this.paint = paint; }
    
    public String getPartNumber() { return partNumber; }
    public void setPartNumber(String partNumber) { this.partNumber = partNumber; }
    
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public List<AutoPart> getAutoparts() {
        return autoparts;
    }

    public void setAutoparts(List<AutoPart> autoparts) {
        this.autoparts = autoparts;
    }

    public List<Job> getJobs() {
        return jobs;
    }

    public void setJobs(List<Job> jobs) {
        this.jobs = jobs;
    }
}

class Job {
    private String area;
    private String description;
    private double hours;
    private String name;
    private double price;
    private int type;
    
    // Getters and setters
    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public double getHours() { return hours; }
    public void setHours(double hours) { this.hours = hours; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    
    public int getType() { return type; }
    public void setType(int type) { this.type = type; }
}

class Receipt {
    private double amount;
    private String comments;
    private int itemType;
    private String name;
    private String notes;
    private int quantity;
    
    // Getters and setters
    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }
    
    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }
    
    public int getItemType() { return itemType; }
    public void setItemType(int itemType) { this.itemType = itemType; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
}

// Main class with usage example
class JsonParser {
    public static void main(String[] args) {
        String jsonString = "{\"ItemType\":[{\"code\":\"labor\",\"description\":\"Labor costs associated with jobs\",\"id\":1},{\"code\":\"material\",\"description\":\"Costs for consumable materials (e.g., paint)\",\"id\":2},{\"code\":\"parts\",\"description\":\"Cost of parts used in the repair\",\"id\":3},{\"code\":\"other\",\"description\":\"Miscellaneous charges or fees\",\"id\":4}],\"JobOrderType\":[{\"code\":\"R&I\",\"description\":\"Remove and reinstall\",\"id\":1},{\"code\":\"Rpr\",\"description\":\"Repair\",\"id\":2},{\"code\":\"Add\",\"description\":\"Add operation, e.g., clear coat\",\"id\":3},{\"code\":\"Feather\",\"description\":\"Feather prime and block\",\"id\":4}],\"estimateRequest\":{\"autoparts\":[{\"claimId\":608,\"comments\":null,\"description\":\"New brake pads set for front wheels\",\"grade\":\"New\",\"id\":2309,\"partName\":null,\"partNumber\":null,\"price\":100.0,\"salePrice\":100.0,\"title\":\"Brake Pads Set\"},{\"claimId\":608,\"comments\":null,\"description\":\"New brake caliper for front right wheel\",\"grade\":\"New\",\"id\":2310,\"partName\":null,\"partNumber\":null,\"price\":120.0,\"salePrice\":120.0,\"title\":\"Brake Caliper\"},{\"claimId\":608,\"comments\":null,\"description\":\"Brake fluid for system bleeding\",\"grade\":\"New\",\"id\":2311,\"partName\":null,\"partNumber\":null,\"price\":20.0,\"salePrice\":20.0,\"title\":\"Brake Fluid\"}],\"confidenceScore\":0.95,\"createdAt\":\"2024-12-23\",\"error\":null,\"estimates\":[{\"amount\":450.0,\"comments\":null,\"id\":608,\"itemType\":2,\"labor\":3.0,\"laborIncluded\":true,\"name\":\"Brake System Inspection and Repair\",\"notes\":\"Brake system inspection and repair\",\"paint\":0.0,\"partNumber\":null,\"quantity\":1}],\"isSuccessful\":true,\"jobs\":[{\"area\":\"Front Brakes\",\"description\":\"Inspect the entire brake system for leaks and wear\",\"hours\":0.5,\"name\":\"Inspect Brake System\",\"price\":30.0,\"type\":1},{\"area\":\"Front Brakes\",\"description\":\"Replace worn brake pads on front wheels\",\"hours\":1.0,\"name\":\"Replace Brake Pads\",\"price\":60.0,\"type\":2},{\"area\":\"Front Right Brake\",\"description\":\"Replace the brake caliper on the front right wheel\",\"hours\":1.0,\"name\":\"Replace Brake Caliper\",\"price\":60.0,\"type\":3},{\"area\":\"Brake System\",\"description\":\"Bleed the brake system to remove air and replace fluid\",\"hours\":0.5,\"name\":\"Bleed Brake System\",\"price\":30.0,\"type\":2}],\"receipts\":[{\"amount\":180.0,\"itemType\":1,\"name\":\"Labor Costs\",\"notes\":\"Labor for brake inspection and repair\",\"quantity\":1},{\"amount\":240.0,\"comments\":null,\"itemType\":3,\"name\":\"Parts Costs\",\"notes\":\"New brake pads, caliper, and fluid\",\"quantity\":1},{\"amount\":30.0,\"comments\":null,\"itemType\":4,\"name\":\"Miscellaneous Charges\",\"notes\":\"Brake fluid and other materials\",\"quantity\":1}],\"workRequest\":\"Brake pedal feels spongy and car pulls to the right when braking\"}}";
        
        // Create Gson instance
        Gson gson = new GsonBuilder()
            .setPrettyPrinting()
            .create();
        
        try {
            // Parse JSON to ResponseData object
            ResponseData responseData = gson.fromJson(jsonString, ResponseData.class);
            
            // Access and display the parsed data
            System.out.println("=== ITEM TYPES ===");
            for (ItemType itemType : responseData.getItemType()) {
                System.out.println("ID: " + itemType.getId() + 
                                 ", Code: " + itemType.getCode() + 
                                 ", Description: " + itemType.getDescription());
            }
            
            System.out.println("\n=== JOB ORDER TYPES ===");
            for (JobOrderType jobOrderType : responseData.getJobOrderType()) {
                System.out.println("ID: " + jobOrderType.getId() + 
                                 ", Code: " + jobOrderType.getCode() + 
                                 ", Description: " + jobOrderType.getDescription());
            }
            
            System.out.println("\n=== ESTIMATE REQUEST ===");
            EstimateRequest er = responseData.getEstimateRequest();
            System.out.println("Work Request: " + er.getWorkRequest());
            System.out.println("Created At: " + er.getCreatedAt());
            System.out.println("Confidence Score: " + er.getConfidenceScore());
            System.out.println("Is Successful: " + er.isSuccessful());
            
            System.out.println("\n=== AUTO PARTS ===");
            // for (AutoPart part : er.getAutoparts()) {
            //     System.out.println("Title: " + part.getTitle() + 
            //                      ", Price: $" + part.getPrice() + 
            //                      ", Description: " + part.getDescription());
            // }
            
            // System.out.println("\n=== JOBS ===");
            // for (Job job : er.getJobs()) {
            //     System.out.println("Name: " + job.getName() + 
            //                      ", Area: " + job.getArea() + 
            //                      ", Hours: " + job.getHours() + 
            //                      ", Price: $" + job.getPrice());
            // }
            
            System.out.println("\n=== RECEIPTS ===");
            for (Receipt receipt : er.getReceipts()) {
                System.out.println("Name: " + receipt.getName() + 
                                 ", Amount: $" + receipt.getAmount() + 
                                 ", Notes: " + receipt.getNotes());
            }
            
            // Convert back to JSON to verify
            System.out.println("\n=== CONVERTED BACK TO JSON ===");
            String convertedJson = gson.toJson(responseData);
            System.out.println(convertedJson);
            
        } catch (Exception e) {
            System.err.println("Error parsing JSON: " + e.getMessage());
            e.printStackTrace();
        }
    }
}