package com.xoftex.parthub.services;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.xoftex.parthub.models.DocType;
import com.xoftex.parthub.models.InsuranceAccess;
import com.xoftex.parthub.models.InsuranceActivityLogs;
import com.xoftex.parthub.models.InsuranceClaim;
import com.xoftex.parthub.models.InsuranceDocument;
import com.xoftex.parthub.models.Insurancer;
import com.xoftex.parthub.models.SequenceCarrier;
import com.xoftex.parthub.models.Vehicle;
import com.xoftex.parthub.models.VehicleHistory;
import com.xoftex.parthub.payload.request.InsuranceClaimStatusUpdate;
import com.xoftex.parthub.payload.response.InsuranceClaimViewResponse;
import com.xoftex.parthub.repository.DocTypeRepository;
import com.xoftex.parthub.repository.InsuranceAccessRepository;
import com.xoftex.parthub.repository.InsuranceActivityLogsRepository;
import com.xoftex.parthub.repository.InsuranceClaimRepository;
import com.xoftex.parthub.repository.InsuranceDocumentRepository;
import com.xoftex.parthub.repository.InsurancerRepository;
import com.xoftex.parthub.repository.VehicleHistoryRepository;
import com.xoftex.parthub.repository.VehicleRepository;

@Service
@Transactional
public class InsuranceService {
    
    private static final Logger LOG = LoggerFactory.getLogger(InsuranceService.class);
    
    @Autowired
    private InsuranceAccessRepository insuranceAccessRepository;
    
    @Autowired
    private InsuranceDocumentRepository insuranceDocumentRepository;
    
    @Autowired
    private InsuranceClaimRepository insuranceClaimRepository;
    
    @Autowired
    private InsuranceActivityLogsRepository insuranceActivityLogsRepository;
    
    @Autowired
    private DocTypeRepository docTypeRepository;
    
    @Autowired
    private VehicleHistoryRepository vehicleHistoryRepository;
    
    @Autowired
    private VehicleRepository vehicleRepository;
    
    @Autowired
    private InsurancerRepository insurancerRepository;
    
    @Value("${insurance.documents.root.path}")
    private String fileRootPath;
    
    // Insurance Company Management
    public Optional<Insurancer> getInsurancerByToken(String token) {
        LOG.debug("Getting insurancer by token: {}", token);
        return insurancerRepository.findByToken(token);
    }
    
    public Optional<Insurancer> getInsurancerByName(String name) {
        LOG.debug("Getting insurancer by name: {}", name);
        return insurancerRepository.findByName(name);
    }
    
    public Insurancer updateInsurancerToken(Long insurancerId, String token) {
        LOG.info("Updating token for insurancer: {}", insurancerId);
        Optional<Insurancer> insurancerOptional = insurancerRepository.findById(insurancerId);
        if (insurancerOptional.isPresent()) {
            Insurancer insurancer = insurancerOptional.get();
            insurancer.setToken(token);
            return insurancerRepository.save(insurancer);
        }
        throw new RuntimeException("Insurancer not found with ID: " + insurancerId);
    }
    
    // Access Management
    public boolean validateAccess(String companyCode, String publicUuid, String privateKey) {
        LOG.debug("Validating access for company: {}, publicUuid: {}", companyCode, publicUuid);
        Optional<InsuranceAccess> access = insuranceAccessRepository
            .findByCompanyUuidAndPublicUuidAndPrivateUuid(companyCode, publicUuid, privateKey);
        
        if (!access.isPresent()) {
            return false;
        }
        
        InsuranceAccess accessRecord = access.get();
        
        // Check if access is active and not expired
        if (!accessRecord.isActive()) {
            return false;
        }
        
        if (accessRecord.getExpiresAt() != null && accessRecord.getExpiresAt().before(new Date())) {
            return false;
        }
        
        return true;
    }
    
    // Overloaded method for document operations
    public boolean validateAccess(String companyCode, Long documentId, String privateKey) {
        LOG.debug("Validating access for company: {}, documentId: {}", companyCode, documentId);
        
        // Find the document first
        Optional<InsuranceDocument> documentOptional = insuranceDocumentRepository.findById(documentId);
        if (!documentOptional.isPresent()) {
            return false;
        }
        
        InsuranceDocument document = documentOptional.get();
        
        // Validate access using the document's publicUuid
        return validateAccess(companyCode, document.getPublicUuid(), privateKey);
    }
    
    public boolean isCompanyValid(String companyCode) {
        LOG.debug("Validating company code: {}", companyCode);
        Optional<Insurancer> insurancer = insurancerRepository.findByToken(companyCode);
        return insurancer.isPresent();
    }
    
    public boolean isAccessValid(String companyCode, String publicUuid, String privateKey) {
        return validateAccess(companyCode, publicUuid, privateKey);
    }
    
    public boolean isAccessValid(String companyCode, Long documentId, String privateKey) {
        return validateAccess(companyCode, documentId, privateKey);
    }
    
    public Optional<InsuranceAccess> getAccessRecord(String companyCode, String publicUuid, String privateKey) {
        LOG.debug("Getting access record for company: {}, publicUuid: {}", companyCode, publicUuid);
        return insuranceAccessRepository.findByCompanyUuidAndPublicUuidAndPrivateUuid(companyCode, publicUuid, privateKey);
    }
    
    // Claims Management
    public InsuranceClaimViewResponse getClaimView(String companyCode, String publicUuid, String privateKey) {
        LOG.info("Getting claim view for company: {}, publicUuid: {}", companyCode, publicUuid);
        
        // Validate access
        if (!validateAccess(companyCode, publicUuid, privateKey)) {
            throw new RuntimeException("Invalid access credentials");
        }
        
        // Get vehicle from token (public UUID)
        Optional<Vehicle> vehicleOptional = vehicleRepository.findByToken(publicUuid);
        if (!vehicleOptional.isPresent()) {
            throw new RuntimeException("Vehicle not found");
        }
        
        Vehicle vehicle = vehicleOptional.get();
        
        // Get insurance claims
        List<InsuranceClaim> insuranceClaims = insuranceClaimRepository
            .findByCompanyUuidAndPublicUuid(companyCode, publicUuid);
        
        // Get documents
        List<InsuranceDocument> documents = insuranceDocumentRepository
            .findByCompanyUuidAndPublicUuidOrderBySequenceNumberAsc(companyCode, publicUuid);
        
        // Create response object
        InsuranceClaimViewResponse response = new InsuranceClaimViewResponse();
        response.vehicle = vehicle;
        response.insuranceClaims = insuranceClaims;
        response.documents = documents;
        
        return response;
    }
    
    public InsuranceClaim updateClaimStatus(String companyCode, String publicUuid, String privateKey, InsuranceClaimStatusUpdate update) {
        LOG.info("Updating claim status for company: {}, publicUuid: {}", companyCode, publicUuid);
        
        // Validate access
        if (!validateAccess(companyCode, publicUuid, privateKey)) {
            throw new RuntimeException("Invalid access credentials");
        }
        
        // Get existing claim
        List<InsuranceClaim> claims = insuranceClaimRepository
            .findByCompanyUuidAndPublicUuid(companyCode, publicUuid);
        
        if (claims.isEmpty()) {
            throw new RuntimeException("No claims found");
        }
        
        InsuranceClaim claim = claims.get(0);
        claim.setStatus(update.status);
        claim.setComments(update.comments);
        claim.setLastUpdated(new Date());
        
        return insuranceClaimRepository.save(claim);
    }
    
    // Document Management
    public InsuranceDocument uploadDocument(String companyCode, String publicUuid, String privateKey, 
                                          String description, Long docTypeId, byte[] fileBytes, String fileName) {
        LOG.info("Uploading document for company: {}, publicUuid: {}", companyCode, publicUuid);
        
        // Validate access
        if (!validateAccess(companyCode, publicUuid, privateKey)) {
            throw new RuntimeException("Invalid access credentials");
        }
        
        // Get vehicle from token (public UUID)
        Optional<Vehicle> vehicleOptional = vehicleRepository.findByToken(publicUuid);
        if (!vehicleOptional.isPresent()) {
            throw new RuntimeException("Vehicle not found");
        }
        
        Vehicle vehicle = vehicleOptional.get();
        
        // Create document entity
        InsuranceDocument document = new InsuranceDocument();
        document.setCompanyUuid(companyCode);
        document.setPublicUuid(publicUuid);
        document.setVehicleId(vehicle.getId());
        document.setFileName(fileName);
        document.setDescription(description);
        document.setDocTypeId(docTypeId);
        document.setUploadedBy(companyCode);
        
        // Get DocType name for caching
        Optional<DocType> docTypeOptional = docTypeRepository.findById(docTypeId);
        if (docTypeOptional.isPresent()) {
            document.setDocTypeName(docTypeOptional.get().getName());
        }
        
        // Generate UUID token for file storage
        String randomCode = generateUUID();
        document.setToken(randomCode);
        
        // Save document entity
        InsuranceDocument savedDocument = insuranceDocumentRepository.save(document);
        
        // Save file to disk
        String path = this.fileRootPath + randomCode + getFileExtension(fileName);
        File fileSaved = new File(path);
        try (OutputStream outputStream = new FileOutputStream(fileSaved)) {
            outputStream.write(fileBytes);
        } catch (IOException e) {
            LOG.error("Error saving file: {}", e.getMessage(), e);
            throw new RuntimeException("Error saving file", e);
        }
        
        // Log in VehicleHistory
        VehicleHistory vehicleHistory = new VehicleHistory();
        vehicleHistory.setName("Insurance Document");
        vehicleHistory.setVehicleId(vehicle.getId());
        vehicleHistory.setObjectKey(savedDocument.getId());
        vehicleHistory.setType(0); // 0) add 1) update 2) delete
        vehicleHistory.setValue(description);
        vehicleHistory.setCompanyUuid(companyCode);
        
        vehicleHistoryRepository.save(vehicleHistory);
        
        return savedDocument;
    }
    
    public List<InsuranceDocument> getDocuments(String companyCode, String publicUuid, String privateKey) {
        LOG.debug("Getting documents for company: {}, publicUuid: {}", companyCode, publicUuid);
        
        if (!validateAccess(companyCode, publicUuid, privateKey)) {
            throw new RuntimeException("Invalid access credentials");
        }
        
        return insuranceDocumentRepository
            .findByCompanyUuidAndPublicUuidOrderBySequenceNumberAsc(companyCode, publicUuid);
    }
    
    public InsuranceDocument updateDocument(String companyCode, Long documentId, String privateKey, 
                                          String description, Long docTypeId, byte[] fileBytes, String fileName) {
        LOG.info("Updating document: {} for company: {}", documentId, companyCode);
        
        if (!validateAccess(companyCode, documentId, privateKey)) {
            throw new RuntimeException("Invalid access credentials");
        }
        
        Optional<InsuranceDocument> documentOptional = insuranceDocumentRepository.findById(documentId);
        if (!documentOptional.isPresent()) {
            throw new RuntimeException("Document not found");
        }
        
        InsuranceDocument document = documentOptional.get();
        
        // Update fields if provided
        if (description != null) document.setDescription(description);
        if (docTypeId != null) {
            document.setDocTypeId(docTypeId);
            Optional<DocType> docTypeOptional = docTypeRepository.findById(docTypeId);
            if (docTypeOptional.isPresent()) {
                document.setDocTypeName(docTypeOptional.get().getName());
            }
        }
        
        // Handle file update if provided
        if (fileBytes != null && fileName != null) {
            // Delete old file
            String oldPath = this.fileRootPath + document.getToken() + getFileExtension(document.getFileName());
            File oldFile = new File(oldPath);
            if (oldFile.exists()) oldFile.delete();
            
            // Save new file
            String newPath = this.fileRootPath + document.getToken() + getFileExtension(fileName);
            File newFile = new File(newPath);
            try (OutputStream outputStream = new FileOutputStream(newFile)) {
                outputStream.write(fileBytes);
            } catch (IOException e) {
                LOG.error("Error saving new file: {}", e.getMessage(), e);
                throw new RuntimeException("Error saving new file", e);
            }
            
            document.setFileName(fileName);
        }
        
        document.setLastModified(new Date());
        return insuranceDocumentRepository.save(document);
    }
    
    public boolean deleteDocument(String companyCode, Long documentId, String privateKey) {
        LOG.info("Deleting document: {} for company: {}", documentId, companyCode);
        
        if (!validateAccess(companyCode, documentId, privateKey)) {
            throw new RuntimeException("Invalid access credentials");
        }
        
        Optional<InsuranceDocument> documentOptional = insuranceDocumentRepository.findById(documentId);
        if (!documentOptional.isPresent()) {
            throw new RuntimeException("Document not found");
        }
        
        InsuranceDocument document = documentOptional.get();
        
        // Delete file from disk
        String filePath = this.fileRootPath + document.getToken() + getFileExtension(document.getFileName());
        File file = new File(filePath);
        if (file.exists()) {
            file.delete();
        }
        
        // Delete from database
        insuranceDocumentRepository.deleteById(documentId);
        
        // Log deletion in VehicleHistory
        VehicleHistory vehicleHistory = new VehicleHistory();
        vehicleHistory.setName("Insurance Document");
        vehicleHistory.setVehicleId(document.getVehicleId());
        vehicleHistory.setObjectKey(documentId);
        vehicleHistory.setType(2); // 0) add 1) update 2) delete
        vehicleHistory.setValue("");
        vehicleHistory.setCompanyUuid(companyCode);
        
        vehicleHistoryRepository.save(vehicleHistory);
        
        return true;
    }
    
    // Document Operations
    public List<InsuranceDocument> updateSequenceNumber(String companyCode, String publicUuid, String privateKey, 
                                                       List<SequenceCarrier> sequenceCarriers) {
        LOG.info("Updating sequence numbers for company: {}, publicUuid: {}", companyCode, publicUuid);
        
        if (!validateAccess(companyCode, publicUuid, privateKey)) {
            throw new RuntimeException("Invalid access credentials");
        }
        
        List<InsuranceDocument> documents = insuranceDocumentRepository
            .findByCompanyUuidAndPublicUuidOrderBySequenceNumberAsc(companyCode, publicUuid);
        
        for (InsuranceDocument document : documents) {
            for (SequenceCarrier sequenceCarrier : sequenceCarriers) {
                if (document.getId() == sequenceCarrier.getId()) {
                    document.setSequenceNumber(sequenceCarrier.getIndex());
                    document = insuranceDocumentRepository.save(document);
                }
            }
        }
        
        return documents;
    }
    
    public boolean setDocumentDocType(String companyCode, Long documentId, Long docTypeId, String privateKey) {
        LOG.info("Setting document type for document: {} to docType: {}", documentId, docTypeId);
        
        if (!validateAccess(companyCode, documentId, privateKey)) {
            throw new RuntimeException("Invalid access credentials");
        }
        
        Optional<InsuranceDocument> documentOptional = insuranceDocumentRepository.findById(documentId);
        if (!documentOptional.isPresent()) {
            throw new RuntimeException("Document not found");
        }
        
        InsuranceDocument document = documentOptional.get();
        document.setDocTypeId(docTypeId);
        
        Optional<DocType> docTypeOptional = docTypeRepository.findById(docTypeId);
        if (docTypeOptional.isPresent()) {
            document.setDocTypeName(docTypeOptional.get().getName());
        }
        
        insuranceDocumentRepository.save(document);
        
        // Log in VehicleHistory
        VehicleHistory vehicleHistory = new VehicleHistory();
        vehicleHistory.setName("Insurance Document Doc Type");
        vehicleHistory.setVehicleId(document.getVehicleId());
        vehicleHistory.setObjectKey(documentId);
        vehicleHistory.setType(1); // 0) add 1) update 2) delete
        vehicleHistory.setValue(docTypeId.toString());
        vehicleHistory.setCompanyUuid(companyCode);
        
        vehicleHistoryRepository.save(vehicleHistory);
        
        return true;
    }
    
    public byte[] downloadDocument(String token) {
        LOG.debug("Downloading document with token: {}", token);
        
        Optional<InsuranceDocument> documentOptional = insuranceDocumentRepository.findByToken(token);
        if (!documentOptional.isPresent()) {
            throw new RuntimeException("Document not found");
        }
        
        InsuranceDocument document = documentOptional.get();
        String filePath = this.fileRootPath + token + getFileExtension(document.getFileName());
        
        Path file = Paths.get(filePath);
        if (!file.toFile().exists()) {
            throw new RuntimeException("File not found on disk");
        }
        
        try {
            return Files.readAllBytes(file);
        } catch (IOException e) {
            LOG.error("Error reading file: {}", e.getMessage(), e);
            throw new RuntimeException("Error reading file", e);
        }
    }
    
    // Bulk Operations
    public List<InsuranceDocument> bulkUploadDocuments(String companyCode, String publicUuid, String privateKey, 
                                                      List<byte[]> fileBytes, List<String> fileNames, Long docTypeId, List<String> descriptions) {
        LOG.info("Bulk uploading documents for company: {}, publicUuid: {}", companyCode, publicUuid);
        
        if (!validateAccess(companyCode, publicUuid, privateKey)) {
            throw new RuntimeException("Invalid access credentials");
        }
        
        List<InsuranceDocument> uploadedDocuments = new ArrayList<>();
        
        for (int i = 0; i < fileBytes.size(); i++) {
            byte[] fileBytesItem = fileBytes.get(i);
            String fileName = fileNames.get(i);
            String description = i < descriptions.size() ? descriptions.get(i) : "";
            
            InsuranceDocument document = uploadDocument(companyCode, publicUuid, privateKey, 
                                                     description, docTypeId, fileBytesItem, fileName);
            uploadedDocuments.add(document);
        }
        
        return uploadedDocuments;
    }
    
    // Audit and Logging
    public void logAuditEvent(String companyCode, String publicUuid, String privateKey, String actionType, String ipAddress) {
        LOG.debug("Logging audit event: {} for company: {}, publicUuid: {}", actionType, companyCode, publicUuid);
        
        try {
            // Get access record for additional info
            Optional<InsuranceAccess> access = insuranceAccessRepository
                .findByCompanyUuidAndPublicUuidAndPrivateUuid(companyCode, publicUuid, privateKey);
            
            if (access.isPresent()) {
                InsuranceAccess accessRecord = access.get();
                
                InsuranceActivityLogs log = new InsuranceActivityLogs(
                    companyCode, publicUuid, privateKey, accessRecord.getVehicleId(),
                    accessRecord.getInsuranceCompany(), actionType, ipAddress
                );
                
                insuranceActivityLogsRepository.save(log);
            }
        } catch (Exception e) {
            LOG.error("Error logging audit event: {}", e.getMessage(), e);
        }
    }
    
    public List<InsuranceActivityLogs> getActivityLogs(String companyCode, String publicUuid) {
        LOG.debug("Getting activity logs for company: {}, publicUuid: {}", companyCode, publicUuid);
        return insuranceActivityLogsRepository.findByCompanyUuidAndPublicUuidOrderByAccessedAtDesc(companyCode, publicUuid);
    }
    
    // Utility Methods
    public String generateUUID() {
        return UUID.randomUUID().toString();
    }
    
    public String getFileExtension(String filename) {
        if (filename != null && filename.contains(".")) {
            return filename.substring(filename.lastIndexOf("."));
        }
        return "";
    }
    
    public boolean isValidFileType(String fileName) {
        if (fileName == null) return false;
        
        String extension = getFileExtension(fileName).toLowerCase();
        return extension.matches("\\.(pdf|doc|docx|xls|xlsx|jpg|jpeg|png|gif|bmp|tiff)$");
    }
    
    public String getMimeType(String fileName) {
        if (fileName == null) return "application/octet-stream";
        
        String extension = getFileExtension(fileName).toLowerCase();
        switch (extension) {
            case ".pdf": return "application/pdf";
            case ".doc": return "application/msword";
            case ".docx": return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            case ".xls": return "application/vnd.ms-excel";
            case ".xlsx": return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            case ".jpg":
            case ".jpeg": return "image/jpeg";
            case ".png": return "image/png";
            case ".gif": return "image/gif";
            case ".bmp": return "image/bmp";
            case ".tiff": return "image/tiff";
            default: return "application/octet-stream";
        }
    }
}
