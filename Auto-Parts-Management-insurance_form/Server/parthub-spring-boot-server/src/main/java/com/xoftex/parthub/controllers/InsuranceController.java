package com.xoftex.parthub.controllers;

import java.io.IOException;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.xoftex.parthub.models.InsuranceDocument;
import com.xoftex.parthub.models.InsuranceClaim;
import com.xoftex.parthub.models.SequenceCarrier;
import com.xoftex.parthub.payload.request.InsuranceClaimStatusUpdate;
import com.xoftex.parthub.payload.response.InsuranceClaimViewResponse;
import com.xoftex.parthub.services.InsuranceService;

import jakarta.servlet.http.HttpServletRequest;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/insurance")
public class InsuranceController {
    
    private static final Logger LOG = LoggerFactory.getLogger(InsuranceController.class);
    
    @Autowired
    private InsuranceService insuranceService;
    
    // Authentication endpoints
    @GetMapping("/access/{companyCode}/{publicUuid}")
    public ResponseEntity<?> validateAccess(@PathVariable String companyCode,
                                          @PathVariable String publicUuid, 
                                          @RequestParam String privateKey,
                                          HttpServletRequest request) {
        
        LOG.info("Validating access for company: {}, publicUuid: {}", companyCode, publicUuid);
        
        // Validate company UUID
        if (!insuranceService.isCompanyValid(companyCode)) {
            LOG.warn("Invalid company code: {}", companyCode);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid company code");
        }
        
        // Validate access with all three UUIDs
        if (!insuranceService.isAccessValid(companyCode, publicUuid, privateKey)) {
            LOG.warn("Invalid access for company: {}, publicUuid: {}", companyCode, publicUuid);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid access credentials");
        }
        
        // Log access
        insuranceService.logAuditEvent(companyCode, publicUuid, privateKey, "ACCESS", getClientIpAddress(request));
        
        return ResponseEntity.ok().body("Access granted");
    }
    
    @GetMapping("/claim/{companyCode}/{publicUuid}")
    public ResponseEntity<?> getClaim(@PathVariable String companyCode,
                                    @PathVariable String publicUuid,
                                    @RequestParam String privateKey,
                                    HttpServletRequest request) {
        
        LOG.info("Getting claim for company: {}, publicUuid: {}", companyCode, publicUuid);
        
        // Validate access
        if (!insuranceService.isAccessValid(companyCode, publicUuid, privateKey)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        try {
            // Get claim data from service
            InsuranceClaimViewResponse response = insuranceService.getClaimView(companyCode, publicUuid, privateKey);
            
            // Log access
            insuranceService.logAuditEvent(companyCode, publicUuid, privateKey, "VIEW", getClientIpAddress(request));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            LOG.error("Error getting claim: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping("/status/{companyCode}/{publicUuid}")
    public ResponseEntity<?> updateClaimStatus(@PathVariable String companyCode,
                                             @PathVariable String publicUuid,
                                             @RequestParam String privateKey,
                                             @RequestBody InsuranceClaimStatusUpdate update,
                                             HttpServletRequest request) {
        
        LOG.info("Updating claim status for company: {}, publicUuid: {}", companyCode, publicUuid);
        
        // Validate access
        if (!insuranceService.isAccessValid(companyCode, publicUuid, privateKey)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        try {
            // Update claim status using service
            InsuranceClaim savedClaim = insuranceService.updateClaimStatus(companyCode, publicUuid, privateKey, update);
            
            // Log update
            insuranceService.logAuditEvent(companyCode, publicUuid, privateKey, "UPDATE", getClientIpAddress(request));
            
            return ResponseEntity.ok(savedClaim);
            
        } catch (Exception e) {
            LOG.error("Error updating claim status: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Document Management Endpoints
    @PostMapping("/documents/{companyCode}/{publicUuid}")
    public ResponseEntity<InsuranceDocument> uploadDocument(
            @PathVariable String companyCode,
            @PathVariable String publicUuid,
            @RequestParam String privateKey,
            @RequestPart("description") String description,
            @RequestPart("docTypeId") String docTypeId,
            @RequestPart("file") MultipartFile file,
            HttpServletRequest request) throws IOException {
        
        LOG.info("Uploading document for company: {}, publicUuid: {}", companyCode, publicUuid);
        
        // Validate access
        if (!insuranceService.isAccessValid(companyCode, publicUuid, privateKey)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        try {
            // Upload document using service
            InsuranceDocument savedDocument = insuranceService.uploadDocument(
                companyCode, publicUuid, privateKey, description, 
                Long.parseLong(docTypeId), file.getBytes(), file.getOriginalFilename()
            );
            
            // Log document upload
            insuranceService.logAuditEvent(companyCode, publicUuid, privateKey, "DOCUMENT_UPLOAD", getClientIpAddress(request));
            
            return new ResponseEntity<>(savedDocument, HttpStatus.CREATED);
            
        } catch (Exception e) {
            LOG.error("Error uploading document: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/documents/{companyCode}/{publicUuid}")
    public ResponseEntity<List<InsuranceDocument>> getDocuments(
            @PathVariable String companyCode,
            @PathVariable String publicUuid,
            @RequestParam String privateKey) {
        
        if (!insuranceService.isAccessValid(companyCode, publicUuid, privateKey)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        try {
            List<InsuranceDocument> documents = insuranceService.getDocuments(companyCode, publicUuid, privateKey);
            return ResponseEntity.ok(documents);
        } catch (Exception e) {
            LOG.error("Error getting documents: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PutMapping("/documents/{companyCode}/{documentId}")
    public ResponseEntity<HttpStatus> updateDocument(
            @PathVariable String companyCode,
            @PathVariable Long documentId,
            @RequestParam String privateKey,
            @RequestPart(required = false) MultipartFile file,
            @RequestPart(required = false) String description,
            @RequestPart(required = false) String docTypeId) {
        
        if (!insuranceService.isAccessValid(companyCode, documentId, privateKey)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        try {
            byte[] fileBytes = null;
            String fileName = null;
            
            if (file != null) {
                fileBytes = file.getBytes();
                fileName = file.getOriginalFilename();
            }
            
            insuranceService.updateDocument(companyCode, documentId, privateKey, description, 
                docTypeId != null ? Long.parseLong(docTypeId) : null, fileBytes, fileName);
            
            return ResponseEntity.ok(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            LOG.error("Error updating document: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @DeleteMapping("/documents/{companyCode}/{documentId}")
    public ResponseEntity<HttpStatus> deleteDocument(
            @PathVariable String companyCode,
            @PathVariable Long documentId,
            @RequestParam String privateKey) {
        
        if (!insuranceService.isAccessValid(companyCode, documentId, privateKey)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        try {
            insuranceService.deleteDocument(companyCode, documentId, privateKey);
            return ResponseEntity.ok(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            LOG.error("Error deleting document: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Document sequence management
    @PostMapping("/documents/sequence/{companyCode}/{publicUuid}")
    public ResponseEntity<List<InsuranceDocument>> updateSequenceNumber(
            @PathVariable String companyCode,
            @PathVariable String publicUuid,
            @RequestParam String privateKey,
            @RequestBody List<SequenceCarrier> sequenceCarriers) {
        
        if (!insuranceService.isAccessValid(companyCode, publicUuid, privateKey)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        try {
            List<InsuranceDocument> documents = insuranceService.updateSequenceNumber(companyCode, publicUuid, privateKey, sequenceCarriers);
            return ResponseEntity.ok(documents);
        } catch (Exception e) {
            LOG.error("Error updating sequence numbers: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Document type assignment
    @PutMapping("/documents/{companyCode}/{documentId}/doctype/{docTypeId}")
    public ResponseEntity<HttpStatus> setDocumentDocType(
            @PathVariable String companyCode,
            @PathVariable Long documentId,
            @PathVariable Long docTypeId,
            @RequestParam String privateKey) {
        
        if (!insuranceService.isAccessValid(companyCode, documentId, privateKey)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        try {
            insuranceService.setDocumentDocType(companyCode, documentId, docTypeId, privateKey);
            return ResponseEntity.ok(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            LOG.error("Error setting document type: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // File download
    @GetMapping("/documents/download/{token}")
    public ResponseEntity<byte[]> downloadDocument(@PathVariable String token) {
        try {
            byte[] fileBytes = insuranceService.downloadDocument(token);
            return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=\"document\"")
                .body(fileBytes);
        } catch (Exception e) {
            LOG.error("Error downloading document: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Bulk upload
    @PostMapping("/documents/bulk/{companyCode}/{publicUuid}")
    public ResponseEntity<List<InsuranceDocument>> bulkUploadDocuments(
            @PathVariable String companyCode,
            @PathVariable String publicUuid,
            @RequestParam String privateKey,
            @RequestPart("files") MultipartFile[] files,
            @RequestPart("docTypeId") String docTypeId,
            @RequestPart("descriptions") String[] descriptions) throws IOException {
        
        if (!insuranceService.isAccessValid(companyCode, publicUuid, privateKey)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        try {
            List<byte[]> fileBytes = new java.util.ArrayList<>();
            List<String> fileNames = new java.util.ArrayList<>();
            List<String> descList = new java.util.ArrayList<>();
            
            for (MultipartFile file : files) {
                fileBytes.add(file.getBytes());
                fileNames.add(file.getOriginalFilename());
            }
            
            for (String desc : descriptions) {
                descList.add(desc);
            }
            
            List<InsuranceDocument> uploadedDocuments = insuranceService.bulkUploadDocuments(
                companyCode, publicUuid, privateKey, fileBytes, fileNames, 
                Long.parseLong(docTypeId), descList
            );
            
            return ResponseEntity.ok(uploadedDocuments);
        } catch (Exception e) {
            LOG.error("Error bulk uploading documents: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Activity logs
    @GetMapping("/logs/{companyCode}/{publicUuid}")
    public ResponseEntity<List<com.xoftex.parthub.models.InsuranceActivityLogs>> getActivityLogs(
            @PathVariable String companyCode,
            @PathVariable String publicUuid) {
        
        try {
            List<com.xoftex.parthub.models.InsuranceActivityLogs> logs = insuranceService.getActivityLogs(companyCode, publicUuid);
            return ResponseEntity.ok(logs);
        } catch (Exception e) {
            LOG.error("Error getting activity logs: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Helper method for getting client IP address
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0];
        }
        return request.getRemoteAddr();
    }
}
