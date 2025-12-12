# Insurance Viewing Component - Requirements & Design Specification

## Executive Summary

**Objective**: Create `InsuranceViewingComponent` for secure, time-limited access to vehicle claim information for insurance companies (GEICO, State Farm, etc.) without requiring system authentication.

**Core Features**:
- **Triple UUID security** (company + public + private keys)
- Company-specific routing with UUID validation
- Two UI modes: CCC-like industry standard + system native
- Real-time status updates with email notifications  
- Audit trail in `vehicleHistory` and new `insuranceActivityLogs` table
- Print/snapshot/tracking capabilities
- Auto-expiring access tokens
- **Document/PDF/Image upload and update capabilities for insurance companies**
- **Dedicated backend controller for comprehensive insurance operations**

---

## Current System Analysis

### Existing Security Patterns
- JWT-based authentication with role-based access control
- UUID tokens for entities (vehicles, claims, employees, companies)
- Public routes already use `permitAll()` in WebSecurityConfig.java
- Comprehensive PDF generation with jsPDF/pdfMake

### Current Claim Structure
```java
@Entity
@Table(name = "claims")
public class Claim extends AuditModel {
    private String token; // 36-character UUID
    private int status; // 0: unlocked, 1: locked
    private Date lockedAt;
    private long vehicleId;
    private String comments;
}
```

### Current Insurancer Structure
```java
@Entity
@Table(name = "insurancers")
public class Insurancer extends AuditModel {
    private Long id;
    private String name; // GEICO, State Farm, etc.
    private String url;
    private Long companyId;
    // ... other fields
    // **NEEDS: private String token; // UUID for company-specific routing**
}
```

---

## Requirements Specification

### Functional Requirements

**FR-1: Triple Authentication System**
- Generate company UUID (stored in insurancers table)
- Generate public UUID (vehicle identifier) 
- Generate private UUID (access token) - **NEVER in URL, email only**
- Auto-expire private UUID after configurable time
- Email delivery of all three UUIDs

**FR-2: Company-Specific Route Security**
- Route pattern: `/insurance/{companyCode}/{publicUuid}`
- Company code must match UUID from insurancers table
- Private key validation via email input, never exposed in URL
- Bypass Angular AuthGuard for insurance routes
- Support company-specific routes (e.g., `/geico/{uuid}`)

**FR-3: Dual UI Modes**
- CCC-like Industry Standard View (professional claim format)
- System Native View (Bootstrap 4.6.2, consistent with current UI)

**FR-4: Status Management**
- Display/update insurance claim status (PENDING, APPROVED, DENIED, IN_REVIEW)
- Comment/notes functionality with validation
- Separate from production claims system

**FR-5: Notifications & Audit**
- Real-time backend updates + email notifications
- Complete audit trail in `vehicleHistory` and `insuranceActivityLogs`
- Company-level activity tracking

**FR-6: Document Management & Updates**
- Insurance companies can upload new documents/PDFs/images
- Support for multiple file formats (PDF, JPG, PNG, DOC, DOCX)
- File size validation and security scanning
- Version control for document updates
- Document categorization (estimates, photos, reports, etc.)
- Bulk document upload capabilities

**FR-7: Comprehensive Insurance Operations**
- Dedicated backend controller for all insurance-related operations
- CRUD operations for insurance claims and documents
- Real-time synchronization between insurance updates and main system
- Integration with existing vehicle and claim management systems

---

## Technical Design

### Backend Components

#### 1. Updated Insurancer Entity
```java
@Entity
@Table(name = "insurancers")
public class Insurancer extends AuditModel {
    // ... existing fields ...
    
    @Column(name = "token", length = 36)
    private String token; // UUID for company-specific routing
    
    // ... existing getters/setters ...
}
```

#### 2. New Entity: InsuranceClaim
```java
@Entity
@Table(name = "insurance_claims")
public class InsuranceClaim extends AuditModel {
    private String companyUuid;      // From insurancers table
    private String publicUuid;       // Vehicle identifier
    private String privateUuid;      // Access token (never in URL)
    private Long vehicleId;
    private String insuranceCompany;
    private String claimNumber;      // Insurance claim number
    private String status;           // PENDING, APPROVED, DENIED, IN_REVIEW
    private String comments;         // Insurance company comments
    private Date claimDate;
    private Date lastUpdated;
    private boolean isActive;
}
```

#### 3. New Entity: InsuranceActivityLogs
```java
@Entity
@Table(name = "insurance_activity_logs")
public class InsuranceActivityLogs extends AuditModel {
    private String companyUuid;      // From insurancers table
    private String publicUuid;       // Vehicle identifier
    private String privateUuid;      // Access token (never in URL)
    private Long vehicleId;
    private String insuranceCompany;
    private String actionType; // ACCESS, VIEW, UPDATE, COMMENT, DOCUMENT_UPLOAD, DOCUMENT_UPDATE
    private String ipAddress;
    private Date accessedAt;
    private Date expiresAt;
    private boolean isExpired;
    private String documentReference; // Reference to uploaded/updated documents
}
```

#### 4. New Entity: InsuranceAccess
```java
@Entity
@Table(name = "insurance_access")
public class InsuranceAccess extends AuditModel {
    private String companyUuid;      // From insurancers table
    private String publicUuid;       // Vehicle identifier
    private String privateUuid;      // Access token (never in URL)
    private Long vehicleId;
    private String insuranceCompany;
    private String contactEmail;
    private Date expiresAt;
    private boolean isActive;
}
```

#### 5. New Entity: InsuranceDocument (Following Existing DocType Pattern)
```java
@Entity
@Table(name = "insurance_documents")
public class InsuranceDocument extends AuditModel {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    
    private String companyUuid;      // From insurancers table
    private String publicUuid;       // Vehicle identifier
    private Long vehicleId;
    private Long insuranceClaimId;   // Reference to insurance_claims table
    
    // Following existing DocType pattern
    private String fileName;         // Original uploaded filename
    private String description;      // Document description
    private String token;            // UUID for file storage (like PdfFile pattern)
    
    // DocType categorization (following existing system)
    private Long docTypeId;          // Reference to DocType table
    private String docTypeName;      // Cached DocType name for quick access
    
    // File metadata
    private String filePath;         // Server file path
    private String fileSize;         // File size in bytes
    private String mimeType;         // MIME type
    private String version;          // Document version
    
    // Insurance company info
    private String uploadedBy;       // Insurance company name
    private Date uploadedAt;
    private Date lastModified;
    private boolean isActive;
    
    // Following existing pattern for sequence and search
    @Column(name = "sequence_number")
    private int sequenceNumber;
    
    @Column(name = "show_in_search")
    private boolean showInSearch;
}
```

#### 5. Security Configuration Addition
```java
// WebSecurityConfig.java
.requestMatchers("/api/insurance/**").permitAll()
```

#### 6. Enhanced Controller: InsuranceController (Following Existing Patterns)
```java
@CrossOrigin("*")
@RestController
@RequestMapping("/api/insurance")
public class InsuranceController {
    
    @Autowired
    private InsuranceAccessRepository insuranceAccessRepository;
    
    @Autowired
    private InsuranceDocumentRepository insuranceDocumentRepository;
    
    @Autowired
    private DocTypeRepository docTypeRepository;
    
    @Autowired
    private VehicleHistoryRepository vehicleHistoryRepository;
    
    @Autowired
    private VehicleRepository vehicleRepository;
    
    @Autowired
    private InsuranceClaimRepository insuranceClaimRepository;
    
    @Value("${insurance.documents.root.path}")
    private String fileRootPath;
    
    // Authentication endpoints (following existing pattern)
    @GetMapping("/access/{companyCode}/{publicUuid}")
    public ResponseEntity<?> validateAccess(@PathVariable String companyCode,
                                          @PathVariable String publicUuid, 
                                          @RequestParam String privateKey);
    
    @GetMapping("/claim/{companyCode}/{publicUuid}")  
    public ResponseEntity<InsuranceClaimViewResponse> getClaim(@PathVariable String companyCode,
                                                             @PathVariable String publicUuid,
                                                             @RequestParam String privateKey);
    
    @PostMapping("/status/{companyCode}/{publicUuid}")
    public ResponseEntity<?> updateClaimStatus(@PathVariable String companyCode,
                                             @PathVariable String publicUuid,
                                             @RequestParam String privateKey,
                                             @RequestBody InsuranceClaimStatusUpdate update);
    
    // Document Management Endpoints (Following Existing PdfFile/ImageVehicle Pattern)
    @PostMapping("/documents/{companyCode}/{publicUuid}")
    public ResponseEntity<InsuranceDocument> uploadDocument(
            @PathVariable String companyCode,
            @PathVariable String publicUuid,
            @RequestParam String privateKey,
            @RequestPart("description") String description,
            @RequestPart("docTypeId") String docTypeId,
            @RequestPart("file") MultipartFile file) throws IOException {
        
        // Validate access with triple UUID
        if (!isAccessValid(companyCode, publicUuid, privateKey)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        try {
            // Get vehicle from public UUID
            Optional<Vehicle> vehicleOptional = vehicleRepository.findByPublicUuid(publicUuid);
            if (!vehicleOptional.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            
            Vehicle vehicle = vehicleOptional.get();
            
            // Create document entity (following existing pattern)
            InsuranceDocument document = new InsuranceDocument();
            document.setCompanyUuid(companyCode);
            document.setPublicUuid(publicUuid);
            document.setVehicleId(vehicle.getId());
            document.setFileName(file.getOriginalFilename());
            document.setDescription(description);
            document.setDocTypeId(Long.parseLong(docTypeId));
            
            // Get DocType name for caching
            Optional<DocType> docTypeOptional = docTypeRepository.findById(Long.parseLong(docTypeId));
            if (docTypeOptional.isPresent()) {
                document.setDocTypeName(docTypeOptional.get().getName());
            }
            
            // Generate UUID token for file storage (following existing pattern)
            String randomCode = UUID.randomUUID().toString();
            document.setToken(randomCode);
            
            // Save document entity
            InsuranceDocument savedDocument = insuranceDocumentRepository.save(document);
            
            // Save file to disk (following existing PdfFile pattern)
            String path = this.fileRootPath + randomCode + getFileExtension(file.getOriginalFilename());
            File fileSaved = new File(path);
            try (OutputStream outputStream = new BufferedOutputStream(new FileOutputStream(fileSaved))) {
                outputStream.write(file.getBytes());
            }
            
            // Log in VehicleHistory (following existing pattern)
            VehicleHistory vehicleHistory = new VehicleHistory();
            vehicleHistory.setName("Insurance Document");
            vehicleHistory.setVehicleId(vehicle.getId());
            vehicleHistory.setObjectKey(savedDocument.getId());
            vehicleHistory.setType(0); // 0) add 1) update 2) delete
            vehicleHistory.setValue(description);
            vehicleHistory.setCompanyUuid(companyCode);
            
            vehicleHistoryRepository.save(vehicleHistory);
            
            return new ResponseEntity<>(savedDocument, HttpStatus.CREATED);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/documents/{companyCode}/{publicUuid}")
    public ResponseEntity<List<InsuranceDocument>> getDocuments(
            @PathVariable String companyCode,
            @PathVariable String publicUuid,
            @RequestParam String privateKey) {
        
        if (!isAccessValid(companyCode, publicUuid, privateKey)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        List<InsuranceDocument> documents = insuranceDocumentRepository
            .findByCompanyUuidAndPublicUuidOrderBySequenceNumberAsc(companyCode, publicUuid);
        
        return ResponseEntity.ok(documents);
    }
    
    @PutMapping("/documents/{companyCode}/{documentId}")
    public ResponseEntity<HttpStatus> updateDocument(
            @PathVariable String companyCode,
            @PathVariable Long documentId,
            @RequestParam String privateKey,
            @RequestPart(required = false) MultipartFile file,
            @RequestPart(required = false) String description,
            @RequestPart(required = false) String docTypeId) {
        
        if (!isAccessValid(companyCode, documentId, privateKey)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        Optional<InsuranceDocument> documentOptional = insuranceDocumentRepository.findById(documentId);
        if (!documentOptional.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        
        InsuranceDocument document = documentOptional.get();
        
        // Update fields if provided
        if (description != null) document.setDescription(description);
        if (docTypeId != null) {
            document.setDocTypeId(Long.parseLong(docTypeId));
            Optional<DocType> docTypeOptional = docTypeRepository.findById(Long.parseLong(docTypeId));
            if (docTypeOptional.isPresent()) {
                document.setDocTypeName(docTypeOptional.get().getName());
            }
        }
        
        // Handle file update if provided
        if (file != null) {
            // Delete old file
            String oldPath = this.fileRootPath + document.getToken() + getFileExtension(document.getFileName());
            File oldFile = new File(oldPath);
            if (oldFile.exists()) oldFile.delete();
            
            // Save new file
            String newPath = this.fileRootPath + document.getToken() + getFileExtension(file.getOriginalFilename());
            File newFile = new File(newPath);
            try (OutputStream outputStream = new BufferedOutputStream(new FileOutputStream(newFile))) {
                outputStream.write(file.getBytes());
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
            
            document.setFileName(file.getOriginalFilename());
        }
        
        document.setLastModified(new Date());
        insuranceDocumentRepository.save(document);
        
        // Log update in VehicleHistory
        VehicleHistory vehicleHistory = new VehicleHistory();
        vehicleHistory.setName("Insurance Document Update");
        vehicleHistory.setVehicleId(document.getVehicleId());
        vehicleHistory.setObjectKey(documentId);
        vehicleHistory.setType(1); // 0) add 1) update 2) delete
        vehicleHistory.setValue(description != null ? description : document.getDescription());
        vehicleHistory.setCompanyUuid(companyCode);
        
        vehicleHistoryRepository.save(vehicleHistory);
        
        return ResponseEntity.ok(HttpStatus.NO_CONTENT);
    }
    
    @DeleteMapping("/documents/{companyCode}/{documentId}")
    public ResponseEntity<HttpStatus> deleteDocument(
            @PathVariable String companyCode,
            @PathVariable Long documentId,
            @RequestParam String privateKey) {
        
        if (!isAccessValid(companyCode, documentId, privateKey)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        Optional<InsuranceDocument> documentOptional = insuranceDocumentRepository.findById(documentId);
        if (!documentOptional.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        
        InsuranceDocument document = documentOptional.get();
        
        // Delete file from disk (following existing pattern)
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
        
        return ResponseEntity.ok(HttpStatus.NO_CONTENT);
    }
    
    // Document sequence management (following existing pattern)
    @PostMapping("/documents/sequence/{companyCode}/{publicUuid}")
    public ResponseEntity<List<InsuranceDocument>> updateSequenceNumber(
            @PathVariable String companyCode,
            @PathVariable String publicUuid,
            @RequestParam String privateKey,
            @RequestBody List<SequenceCarrier> sequenceCarriers) {
        
        if (!isAccessValid(companyCode, publicUuid, privateKey)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
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
        
        return ResponseEntity.ok(documents);
    }
    
    // Document type assignment (following existing pattern)
    @PutMapping("/documents/{companyCode}/{documentId}/doctype/{docTypeId}")
    public ResponseEntity<HttpStatus> setDocumentDocType(
            @PathVariable String companyCode,
            @PathVariable Long documentId,
            @PathVariable Long docTypeId,
            @RequestParam String privateKey) {
        
        if (!isAccessValid(companyCode, documentId, privateKey)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        Optional<InsuranceDocument> documentOptional = insuranceDocumentRepository.findById(documentId);
        if (!documentOptional.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
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
        
        return ResponseEntity.ok(HttpStatus.NO_CONTENT);
    }
    
    // File download (following existing pattern)
    @GetMapping("/documents/download/{token}")
    public ResponseEntity<Resource> downloadDocument(
            @PathVariable String token,
            HttpServletRequest request) throws IOException {
        
        Optional<InsuranceDocument> documentOptional = insuranceDocumentRepository.findByToken(token);
        if (!documentOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        InsuranceDocument document = documentOptional.get();
        String filePath = this.fileRootPath + token + getFileExtension(document.getFileName());
        
        Path file = Paths.get(filePath);
        if (!file.toFile().exists()) {
            return ResponseEntity.notFound().build();
        }
        
        Resource resource = new UrlResource(file.toUri());
        
        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(document.getMimeType()))
            .header(HttpHeaders.CONTENT_DISPOSITION, 
                "attachment; filename=\"" + document.getFileName() + "\"")
            .body(resource);
    }
    
    // Bulk upload (following existing pattern)
    @PostMapping("/documents/bulk/{companyCode}/{publicUuid}")
    public ResponseEntity<List<InsuranceDocument>> bulkUploadDocuments(
            @PathVariable String companyCode,
            @PathVariable String publicUuid,
            @RequestParam String privateKey,
            @RequestPart("files") MultipartFile[] files,
            @RequestPart("docTypeId") String docTypeId,
            @RequestPart("descriptions") String[] descriptions) throws IOException {
        
        if (!isAccessValid(companyCode, publicUuid, privateKey)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        List<InsuranceDocument> uploadedDocuments = new ArrayList<>();
        
        for (int i = 0; i < files.length; i++) {
            MultipartFile file = files[i];
            String description = i < descriptions.length ? descriptions[i] : "";
            
            // Create document entity
            InsuranceDocument document = new InsuranceDocument();
            document.setCompanyUuid(companyCode);
            document.setPublicUuid(publicUuid);
            document.setFileName(file.getOriginalFilename());
            document.setDescription(description);
            document.setDocTypeId(Long.parseLong(docTypeId));
            
            // Get DocType name
            Optional<DocType> docTypeOptional = docTypeRepository.findById(Long.parseLong(docTypeId));
            if (docTypeOptional.isPresent()) {
                document.setDocTypeName(docTypeOptional.get().getName());
            }
            
            // Generate token and save
            String randomCode = UUID.randomUUID().toString();
            document.setToken(randomCode);
            
            InsuranceDocument savedDocument = insuranceDocumentRepository.save(document);
            
            // Save file
            String path = this.fileRootPath + randomCode + getFileExtension(file.getOriginalFilename());
            File fileSaved = new File(path);
            try (OutputStream outputStream = new BufferedOutputStream(new FileOutputStream(fileSaved))) {
                outputStream.write(file.getBytes());
            }
            
            uploadedDocuments.add(savedDocument);
            
            // Log in VehicleHistory
            VehicleHistory vehicleHistory = new VehicleHistory();
            vehicleHistory.setName("Insurance Document Bulk Upload");
            vehicleHistory.setVehicleId(savedDocument.getVehicleId());
            vehicleHistory.setObjectKey(savedDocument.getId());
            vehicleHistory.setType(0);
            vehicleHistory.setValue(description);
            vehicleHistory.setCompanyUuid(companyCode);
            
            vehicleHistoryRepository.save(vehicleHistory);
        }
        
        return ResponseEntity.ok(uploadedDocuments);
    }
    
    // Helper methods
    private boolean isAccessValid(String companyCode, String publicUuid, String privateKey) {
        // Implement triple UUID validation logic
        return true; // Placeholder
    }
    
    private boolean isAccessValid(String companyCode, Long documentId, String privateKey) {
        // Implement validation logic for document operations
        return true; // Placeholder
    }
    
    private String getFileExtension(String filename) {
        if (filename != null && filename.contains(".")) {
            return filename.substring(filename.lastIndexOf("."));
        }
        return "";
    }
}
```

#### 6. New Repository: InsuranceClaimRepository
```java
@Repository
public interface InsuranceClaimRepository extends JpaRepository<InsuranceClaim, Long> {
    
    List<InsuranceClaim> findByCompanyUuidAndPublicUuid(String companyUuid, String publicUuid);
    
    Optional<InsuranceClaim> findByCompanyUuidAndPublicUuidAndPrivateUuid(
        String companyUuid, String publicUuid, String privateUuid);
    
    List<InsuranceClaim> findByVehicleId(Long vehicleId);
    
    List<InsuranceClaim> findByInsuranceCompany(String insuranceCompany);
}
```

#### 7. New Repository: InsuranceDocumentRepository
```java
@Repository
public interface InsuranceDocumentRepository extends JpaRepository<InsuranceDocument, Long> {
    
    List<InsuranceDocument> findByCompanyUuidAndPublicUuidOrderBySequenceNumberAsc(
        String companyUuid, String publicUuid);
    
    Optional<InsuranceDocument> findByToken(String token);
    
    List<InsuranceDocument> findByCompanyUuidAndDocTypeId(String companyUuid, Long docTypeId);
    
    List<InsuranceDocument> findByCompanyUuidAndPublicUuidAndDocTypeId(
        String companyUuid, String publicUuid, Long docTypeId);
}
```

#### 8. Updated VehicleHistory Entity (Adding Insurance Support)
```java
@Entity
@Table(name = "vehicle_history")
public class VehicleHistory extends AuditModel {
    // ... existing fields ...
    
    @Column(name = "company_uuid")
    private String companyUuid;  // For insurance company tracking
    
    // ... existing getters/setters ...
}
```

---

## Integration with Existing DocType System

### DocType-Based Document Categorization

The insurance document system follows the exact same pattern used by the existing `ImageVehicle` and `PdfFile` controllers for document categorization. This ensures consistency across the entire system.

#### 1. Document Type Assignment (Following Existing Pattern)
```java
// From ImageVehicleController - exact same pattern
@PutMapping("/images/{vehicleId}/{imageId}/{docType}")
public ResponseEntity<HttpStatus> setImageDocType(
    @PathVariable("vehicleId") long vehicleId,
    @PathVariable("imageId") long imageId,
    @PathVariable("docType") long docTypeIn) {
    
    // ... validation logic ...
    
    for (ImageModelVehicle imageModel : vehicleOptional.get().getImageModels()) {
        imageModel.setShowInSearch(false);
        if (imageModel.getId() == imageId) {
            imageModel.setDocType((int) docTypeIn);  // Set DocType ID
            this.imageModelVehicleRepository.save(imageModel);
            
            // Log in VehicleHistory (same pattern)
            VehicleHistory vehicleHistory = new VehicleHistory();
            vehicleHistory.setName("Vehicle Image Doc Type");
            vehicleHistory.setVehicleId(vehicleId);
            vehicleHistory.setObjectKey(imageId);
            vehicleHistory.setType(1); // 0) add 1) update 2) delete
            vehicleHistory.setValue("" + docTypeIn);
            this.vehicleHistoryRepository.save(vehicleHistory);
        }
    }
}
```

#### 2. Insurance Document DocType Integration
```java
// Insurance document follows the exact same pattern
@PutMapping("/documents/{companyCode}/{documentId}/doctype/{docTypeId}")
public ResponseEntity<HttpStatus> setDocumentDocType(
    @PathVariable String companyCode,
    @PathVariable Long documentId,
    @PathVariable Long docTypeId,
    @RequestParam String privateKey) {
    
    // ... validation logic ...
    
    InsuranceDocument document = documentOptional.get();
    document.setDocTypeId(docTypeId);  // Set DocType ID (same as ImageVehicle)
    
    // Cache DocType name for quick access
    Optional<DocType> docTypeOptional = docTypeRepository.findById(docTypeId);
    if (docTypeOptional.isPresent()) {
        document.setDocTypeName(docTypeOptional.get().getName());
    }
    
    insuranceDocumentRepository.save(document);
    
    // Log in VehicleHistory (same pattern as ImageVehicle)
    VehicleHistory vehicleHistory = new VehicleHistory();
    vehicleHistory.setName("Insurance Document Doc Type");
    vehicleHistory.setVehicleId(document.getVehicleId());
    vehicleHistory.setObjectKey(documentId);
    vehicleHistory.setType(1); // 0) add 1) update 2) delete
    vehicleHistory.setValue(docTypeId.toString());
    vehicleHistory.setCompanyUuid(companyCode);  // Additional insurance tracking
    vehicleHistoryRepository.save(vehicleHistory);
}
```

#### 3. Sequence Management (Following Existing Pattern)
```java
// From ImageVehicleController - exact same pattern
@PostMapping("/images/sequence/{vehicleId}")
public ResponseEntity<List<ImageModelVehicle>> updateSequenceNumber(
    @PathVariable("vehicleId") long vehicleId,
    @RequestBody List<SequenceCarrier> sequenceCarriers) {
    
    List<ImageModelVehicle> imageModelVehicles = this.imageModelVehicleRepository.findByVehicleId(vehicleId);
    
    for (ImageModelVehicle imageModelVehicle : imageModelVehicles) {
        for (SequenceCarrier sequenceCarrier : sequenceCarriers) {
            if (imageModelVehicle.getId() == sequenceCarrier.getId()) {
                imageModelVehicle.setSequenceNumber(sequenceCarrier.getIndex());
                imageModelVehicle = this.imageModelVehicleRepository.save(imageModelVehicle);
            }
        }
    }
    return ResponseEntity.ok(imageModelVehicles);
}

// Insurance documents follow the exact same pattern
@PostMapping("/documents/sequence/{companyCode}/{publicUuid}")
public ResponseEntity<List<InsuranceDocument>> updateSequenceNumber(
    @PathVariable String companyCode,
    @PathVariable String publicUuid,
    @RequestParam String privateKey,
    @RequestBody List<SequenceCarrier> sequenceCarriers) {
    
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
    return ResponseEntity.ok(documents);
}
```

#### 4. File Storage Pattern (Following Existing PdfFile Pattern)
```java
// From PdfFileController - exact same pattern
@PostMapping("/file/{vehicleId}/{userId}")
public ResponseEntity<PdfFile> createPdfFile(
    @PathVariable("vehicleId") long vehicleId, 
    @PathVariable("userId") long userId,
    @RequestPart("description") String description,
    @RequestPart("file") MultipartFile file) throws IOException {
    
    // ... validation logic ...
    
    // Generate UUID token (same pattern)
    String randomCode = UUID.randomUUID().toString();
    pdfFile.setToken(randomCode);
    
    PdfFile _pdfFile = this.pdfFileRepository.save(pdfFile);
    
    // Save file with UUID naming (same pattern)
    String path = this.fileRootPath + randomCode + ".pdf";
    File fileSaved = new File(path);
    try (OutputStream outputStream = new BufferedOutputStream(new FileOutputStream(fileSaved))) {
        outputStream.write(file.getBytes());
    }
    
    // Log in VehicleHistory (same pattern)
    VehicleHistory vehicleHistory = new VehicleHistory();
    vehicleHistory.setName("Vehicle Pdf");
    vehicleHistory.setVehicleId(vehicleId);
    vehicleHistory.setUserId(userId);
    vehicleHistory.setObjectKey(_pdfFile.getId());
    vehicleHistory.setType(0); // 0) add 1) update 2) delete
    vehicleHistory.setValue("" + _pdfFile.getDescription());
    this.vehicleHistoryRepository.save(vehicleHistory);
}

// Insurance documents follow the exact same pattern
@PostMapping("/documents/{companyCode}/{publicUuid}")
public ResponseEntity<InsuranceDocument> uploadDocument(
    @PathVariable String companyCode,
    @PathVariable String publicUuid,
    @RequestParam String privateKey,
    @RequestPart("description") String description,
    @RequestPart("docTypeId") String docTypeId,
    @RequestPart("file") MultipartFile file) throws IOException {
    
    // ... validation logic ...
    
    // Generate UUID token (same pattern as PdfFile)
    String randomCode = UUID.randomUUID().toString();
    document.setToken(randomCode);
    
    InsuranceDocument savedDocument = insuranceDocumentRepository.save(document);
    
    // Save file with UUID naming (same pattern as PdfFile)
    String path = this.fileRootPath + randomCode + getFileExtension(file.getOriginalFilename());
    File fileSaved = new File(path);
    try (OutputStream outputStream = new BufferedOutputStream(new FileOutputStream(fileSaved))) {
        outputStream.write(file.getBytes());
    }
    
    // Log in VehicleHistory (same pattern as PdfFile)
    VehicleHistory vehicleHistory = new VehicleHistory();
    vehicleHistory.setName("Insurance Document");
    vehicleHistory.setVehicleId(vehicle.getId());
    vehicleHistory.setObjectKey(savedDocument.getId());
    vehicleHistory.setType(0); // 0) add 1) update 2) delete
    vehicleHistory.setValue(description);
    vehicleHistory.setCompanyUuid(companyCode);  // Additional insurance tracking
    vehicleHistoryRepository.save(vehicleHistory);
}
```

#### 5. Configuration Properties (Following Existing Pattern)
```properties
# Existing properties from application.properties
pdf.root.path=C:\\Projects\\images\\vehicle\\pdf\\
image.path.vehicle=C:\\Projects\\images\\vehicle\\
image.root.path.vehicle=C:\\Projects\\images\\vehicle\\
image.resize.vehicle=resize\\

# New insurance properties following the same pattern
insurance.documents.root.path=C:\\Projects\\images\\insurance\\documents\\
insurance.documents.resize.path=C:\\Projects\\images\\insurance\\resize\\
```

#### 6. Repository Pattern (Following Existing Pattern)
```java
// Existing repository pattern
@Repository
public interface ImageModelVehicleRepository extends JpaRepository<ImageModelVehicle, Long> {
    List<ImageModelVehicle> findByVehicleIdOrderBySequenceNumberAsc(long vehicleId);
}

@Repository
public interface PdfFileRepository extends JpaRepository<PdfFile, Long> {
    Optional<PdfFile> findByToken(String token);
    List<PdfFile> findByVehicleId(long vehicleId);
}

// Insurance repository follows the exact same pattern
@Repository
public interface InsuranceDocumentRepository extends JpaRepository<InsuranceDocument, Long> {
    List<InsuranceDocument> findByCompanyUuidAndPublicUuidOrderBySequenceNumberAsc(
        String companyUuid, String publicUuid);
    Optional<InsuranceDocument> findByToken(String token);
    List<InsuranceDocument> findByCompanyUuidAndDocTypeId(String companyUuid, Long docTypeId);
}
```

### Benefits of Following Existing Patterns

1. **Consistency**: Insurance documents behave exactly like existing vehicle images and PDFs
2. **Maintainability**: Same code patterns, same debugging approaches
3. **Integration**: Seamless integration with existing DocType management system
4. **Audit Trail**: Same VehicleHistory logging pattern for all document operations
5. **File Management**: Same UUID-based file storage and retrieval system
6. **Sequence Management**: Same drag-and-drop reordering functionality
7. **Type Assignment**: Same DocType dropdown and assignment workflow
8. **Security**: Same file validation and access control patterns

This approach ensures that insurance companies can manage documents using the exact same interface and workflow that internal users use for vehicle images and PDFs, providing a consistent user experience across the entire system.

### Frontend Components

#### 1. Component Structure
```
src/app/insurance-viewing/
├── insurance-viewing.component.ts
├── insurance-viewing.component.html
├── insurance-viewing.service.ts
├── insurance-ccc-view/
└── insurance-native-view/
```

#### 2. Updated Routing Configuration
```typescript
// app-routing.module.ts
{
  path: 'insurance/:companyCode/:publicUuid',
  component: InsuranceViewingComponent,
  canActivate: [InsuranceAuthGuard]
},
{
  path: 'geico/:publicUuid', 
  redirectTo: 'insurance/geico/:publicUuid'
}
```

#### 3. Enhanced Authentication Guard
```typescript
@Injectable()
export class InsuranceAuthGuard implements CanActivate {
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const companyCode = route.params['companyCode'];
    const publicUuid = route.params['publicUuid'];
    const privateKey = route.queryParams['privateKey']; // Will be removed from URL
    
    return this.insuranceService.validateAccess(companyCode, publicUuid, privateKey)
      .pipe(map(response => response.isValid));
  }
}
```

---

## Security Architecture

### Triple UUID Security Model
```
Company UUID (Insurancer Token):
├── Stored in insurancers table
├── Used for company-specific routing
├── Validates company identity
└── Long-term identifier (no expiration)

Public UUID (Vehicle Identifier):
├── Long-term identifier (no expiration)
├── Included in URL path
└── Links to vehicle record

Private UUID (Access Token):
├── Short-term (7-30 days configurable)
├── **NEVER in URL - email only**
├── Auto-expires
└── Single/limited use option
```

### Enhanced Access Flow
```
1. Claim Created → Generate Public UUID
2. Insurance Company Setup → Generate Company UUID (stored in insurancers)
3. Insurance Access Request → Generate Private UUID  
4. Email Sent → All three UUIDs included
5. Insurance Accesses → Validate company + public + private UUIDs
6. Access Granted → Log audit trail with company identification
7. Private UUID Expires → Access revoked
```

### Updated Email Security Template
```
Subject: Vehicle Claim Access - ${claimNumber}

Access Link: https://baycounter.com/#/insurance/${companyCode}/${publicUuid}

Private Access Key: ${privateUuid} (Enter this when prompted)

Vehicle: ${year} ${make} ${model}
VIN: ${vin}
Company: ${insuranceCompany}
Expires: ${expirationDate}

Note: Private access key is never stored in browser history
```

---

## Component Interface Design

### 1. CCC-Like Industry View
```
┌─────────────────────────────────────────┐
│ INSURANCE COMPANY HEADER                │
├─────────────────────────────────────────┤
│ CLAIM INFORMATION SUMMARY               │
│ ┌─────────────┬─────────────────────────┐ │
│ │ Vehicle Info│ Claim Details           │ │
│ │ Year/Make   │ Claim #, Date, Status   │ │
│ └─────────────┴─────────────────────────┘ │
├─────────────────────────────────────────┤
│ ESTIMATE BREAKDOWN                      │
│ Parts/Labor/Paint/Total                 │
├─────────────────────────────────────────┤
│ STATUS UPDATE SECTION                   │
│ [DROPDOWN] [TEXTAREA] [BUTTONS]         │
├─────────────────────────────────────────┤
│ DOCUMENT MANAGEMENT                     │
│ [UPLOAD NEW] [VIEW ALL] [SEARCH]        │
│ ┌─────────────────────────────────────┐ │
│ │ Document List with Actions          │ │
│ │ [EDIT] [DELETE] [DOWNLOAD] [VIEW]   │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### 2. System Native View
```
┌─────────────────────────────────────────┐
│ BOOTSTRAP HEADER                        │
├─────────────────────────────────────────┤
│ Vehicle Card with Image                 │
├─────────────────────────────────────────┤
│ Claims & Estimates Tabs                 │
├─────────────────────────────────────────┤
│ Insurance Actions Panel                 │
├─────────────────────────────────────────┤
│ Document Management Panel               │
│ File Upload Zone + Document Gallery     │
│ Bulk Upload + Search & Filter           │
└─────────────────────────────────────────┘
```

### 3. Document Upload Modal
```
┌─────────────────────────────────────────┐
│ UPLOAD NEW DOCUMENT                    │
├─────────────────────────────────────────┤
│ Document Type: [DROPDOWN]              │
│ File: [BROWSE] [DRAG & DROP ZONE]      │
│ Comments: [TEXTAREA]                   │
│                                         │
│ [UPLOAD] [CANCEL]                      │
└─────────────────────────────────────────┘
```

### 4. Document Management Interface
```
┌─────────────────────────────────────────┐
│ DOCUMENT LIBRARY                        │
├─────────────────────────────────────────┤
│ Filters: [Type] [Date] [Search]        │
├─────────────────────────────────────────┤
│ Document Grid                           │
│ ┌─────────┬─────────┬─────────┬─────────┐ │
│ │ Thumbnail│ Name   │ Type    │ Actions │ │
│ │ [IMG]   │ Doc1   │ Estimate│ [EDIT]  │ │
│ │         │         │         │ [DEL]   │ │
│ └─────────┴─────────┴─────────┴─────────┘ │
│ [BULK UPLOAD] [EXPORT ALL]              │
└─────────────────────────────────────────┘
```

---

## Implementation Workflow

### Phase 1: Backend Foundation (Week 1-2)
1. **Add UUID token field to Insurancer entity**
2. Create database tables (`insurance_access`, `insurance_claims`, `insurance_activity_logs`, `insurance_documents`)
3. Create entity classes and repositories following existing patterns
4. Update security configuration
5. Implement `InsuranceController` with **triple UUID validation**
6. Add company UUID validation logic
7. **Implement document management following existing PdfFile/ImageVehicle patterns**
8. **Integrate with existing DocType system for document categorization**
9. **Add file storage configuration properties (following existing pattern)**

### Phase 2: Frontend Components (Week 2-3)
1. Generate Angular components and services
2. Implement custom authentication guard with **company UUID validation**
3. Create main viewing component with **email-based private key input**
4. Integrate print/export functionality
5. Remove private key from URL parameters
6. **Implement document upload/download components following existing patterns**
7. **Create document management interface with DocType-based categorization**
8. **Add sequence management and document type assignment (following existing pattern)**

### Phase 3: UI Modes (Week 3-4)  
1. Implement CCC-like professional view
2. Create system native Bootstrap view
3. Add responsive design and mobile support
4. Integrate real-time WebSocket updates
5. Implement private key input modal
6. **Add document management panels to both UI modes following existing patterns**
7. **Implement bulk upload and document search functionality with DocType filtering**
8. **Add document sequence management UI (following existing ImageVehicle pattern)**

### Phase 4: Integration & Testing (Week 4-5)
1. Email template integration with triple UUID
2. Audit trail testing with company identification
3. Security penetration testing (URL exposure prevention)
4. End-to-end workflow validation
5. Company-specific routing validation
6. **Document upload/update workflow testing with DocType validation**
7. **File security scanning and validation testing following existing patterns**
8. **Integration testing with existing vehicle, claim, and DocType systems**
9. **VehicleHistory audit trail validation for insurance operations**

---

## Security Analysis

### Pros
✅ **Triple UUID Protection**: Three-factor authentication without user accounts
✅ **Company Identity Validation**: Company-specific routing with UUID verification
✅ **Private Key Security**: Private key never exposed in URL or browser history
✅ **Time-based Expiration**: Automatic access revocation
✅ **Complete Audit Trail**: Full activity logging with company identification
✅ **HTTPS Transport**: Encrypted communication
✅ **IP Logging**: Attack source identification
✅ **No System Access**: Isolated from main authentication
✅ **Document Security**: File validation, scanning, and access control
✅ **Comprehensive Operations**: Dedicated controller for all insurance functions

### Cons
⚠️ **Email Security**: Relies on email channel security
⚠️ **User Experience**: Additional step for private key input
⚠️ **Token Sharing**: Private key could be shared via email
⚠️ **No Multi-factor**: Single email-based delivery
⚠️ **Session Management**: No traditional session controls
⚠️ **File Upload Risks**: Potential for malicious file uploads
⚠️ **Storage Requirements**: Increased storage needs for documents

### Risk Mitigation
- Rate limiting on insurance endpoints
- IP address validation/restriction
- Email encryption for sensitive notifications
- Token usage tracking and limits
- Company UUID validation at routing level
- Private key input validation
- Regular security audits and monitoring
- **File type validation and security scanning**
- **File size limits and storage quotas**
- **Document access logging and audit trails**
- **Regular backup and disaster recovery procedures**

---

## Sample Implementation

### Backend Controller Method (Updated)
```java
@GetMapping("/claim/{companyCode}/{publicUuid}")
public ResponseEntity<InsuranceClaimViewResponse> getClaim(@PathVariable String companyCode,
                                                         @PathVariable String publicUuid,
                                                         @RequestParam String privateKey,
                                                         HttpServletRequest request) {
    // Validate company UUID
    if (!isCompanyValid(companyCode)) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
    
    // Validate access with all three UUIDs
    if (!isAccessValid(companyCode, publicUuid, privateKey)) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
    
    // Get data
    InsuranceAccess access = getAccess(companyCode, publicUuid, privateKey);
    Vehicle vehicle = vehicleRepository.findById(access.getVehicleId()).get();
    List<InsuranceClaim> insuranceClaims = insuranceClaimRepository.findByCompanyUuidAndPublicUuid(companyCode, publicUuid);
    List<InsuranceDocument> documents = documentService.getDocumentsByVehicle(companyCode, publicUuid);
    
    // Log access with company identification
    logAuditEvent(access, "VIEW", request);
    
    return ResponseEntity.ok(new InsuranceClaimViewResponse(vehicle, insuranceClaims, documents, access));
}

@PostMapping("/documents/{companyCode}/{publicUuid}/upload")
public ResponseEntity<?> uploadDocument(@PathVariable String companyCode,
                                      @PathVariable String publicUuid,
                                      @RequestParam String privateKey,
                                      @RequestParam("file") MultipartFile file,
                                      @RequestParam String documentType,
                                      @RequestParam(required = false) String comments,
                                      HttpServletRequest request) {
    
    // Validate access
    if (!isAccessValid(companyCode, publicUuid, privateKey)) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
    
    try {
        InsuranceDocument document = documentService.uploadDocument(companyCode, publicUuid, 
                                                                  file, documentType, comments);
        
        // Log document upload
        logAuditEvent(getAccess(companyCode, publicUuid, privateKey), "DOCUMENT_UPLOAD", request);
        
        return ResponseEntity.ok(document);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                           .body("Error uploading document: " + e.getMessage());
    }
}
```

### Frontend Service Method (Updated)
```typescript
@Injectable()
export class InsuranceViewingService {
  
  getClaim(companyCode: string, publicUuid: string, privateKey: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/insurance/claim/${companyCode}/${publicUuid}`, {
      params: { privateKey }
    });
  }
  
  updateStatus(companyCode: string, publicUuid: string, privateKey: string, update: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/insurance/status/${companyCode}/${publicUuid}`, update, {
      params: { privateKey }
    });
  }
  
  uploadDocument(companyCode: string, publicUuid: string, privateKey: string, 
                file: File, documentType: string, comments?: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);
    if (comments) {
      formData.append('comments', comments);
    }
    
    return this.http.post(`${this.baseUrl}/insurance/documents/${companyCode}/${publicUuid}/upload`, 
                         formData, {
      params: { privateKey }
    });
  }
  
  getDocuments(companyCode: string, publicUuid: string, privateKey: string): Observable<any[]> {
    return this.http.get(`${this.baseUrl}/insurance/documents/${companyCode}/${publicUuid}`, {
      params: { privateKey }
    });
  }
  
  bulkUploadDocuments(companyCode: string, publicUuid: string, privateKey: string, 
                     files: File[], documentType: string): Observable<any> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('documentType', documentType);
    
    return this.http.post(`${this.baseUrl}/insurance/documents/${companyCode}/${publicUuid}/bulk-upload`, 
                         formData, {
      params: { privateKey }
    });
  }
}
```

---

## Conclusion

This updated design provides a **triple UUID security system** that significantly enhances security while maintaining usability. The key improvements include:

1. **Company Identity Validation**: Company-specific routing with UUID verification
2. **Enhanced Private Key Security**: Private key never exposed in URL or browser history
3. **Comprehensive Audit Trail**: Company-level activity tracking and logging
4. **Professional Insurance Interface**: Dual UI modes for industry standards and internal consistency
5. **Document Management Capabilities**: Full CRUD operations for insurance documents with security validation
6. **Dedicated Insurance Controller**: Comprehensive backend system for all insurance operations
7. **File Security**: Upload validation, scanning, and access control for documents

The triple UUID approach provides stronger security than the original dual UUID specification by adding company-level validation and keeping the private key completely separate from URL exposure. The addition of document management capabilities and a dedicated insurance controller makes this a comprehensive solution for insurance company operations.

**Next Steps**: Begin with Phase 1 backend implementation, focusing on adding the company UUID field to the Insurancer entity, implementing the triple UUID validation system, and creating the document management infrastructure before proceeding to frontend development.