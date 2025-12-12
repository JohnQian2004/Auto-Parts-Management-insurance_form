# Insurance System - Backend Services Implementation

## Overview
This document outlines the implementation of backend services for the Insurance Viewing Component, following the existing Spring Boot service patterns used in the project.

## Service Architecture

### 1. InsuranceService
**Location**: `src/main/java/com/xoftex/parthub/services/InsuranceService.java`

**Purpose**: Core service for all insurance-related business logic and operations.

**Key Features**:
- **Insurance Company Management**: Token-based company operations
- **Access Management**: Triple UUID validation and access control
- **Claims Management**: View and update insurance claims
- **Document Management**: Upload, update, delete, and sequence documents
- **Audit and Logging**: Comprehensive activity tracking
- **File Operations**: File storage, validation, and MIME type handling

**Main Methods**:
```java
// Access Management
public boolean validateAccess(String companyCode, String publicUuid, String privateKey)
public boolean isCompanyValid(String companyCode)

// Claims Management
public InsuranceClaimViewResponse getClaimView(String companyCode, String publicUuid, String privateKey)
public InsuranceClaim updateClaimStatus(String companyCode, String publicUuid, String privateKey, InsuranceClaimStatusUpdate update)

// Document Management
public InsuranceDocument uploadDocument(String companyCode, String publicUuid, String privateKey, String description, Long docTypeId, byte[] fileBytes, String fileName)
public List<InsuranceDocument> getDocuments(String companyCode, String publicUuid, String privateKey)
public boolean deleteDocument(String companyCode, Long documentId, String privateKey)

// Utility Methods
public String generateUUID()
public String getMimeType(String fileName)
public boolean isValidFileType(String fileName)
```

### 2. InsurancerService
**Location**: `src/main/java/com/xoftex/parthub/services/InsurancerService.java`

**Purpose**: Service for managing insurance company entities and operations.

**Key Features**:
- **CRUD Operations**: Create, read, update, delete insurancers
- **Token Management**: Generate and validate unique UUID tokens
- **Search Operations**: Company-specific insurancer search
- **Business Logic**: Token uniqueness validation

**Main Methods**:
```java
// Basic CRUD
public Insurancer createInsurancer(Long userId, Insurancer insurancer)
public Optional<Insurancer> getInsurancer(Long insurancerId)
public Insurancer updateInsurancer(Long insurancerId, Insurancer insurancer)
public boolean deleteInsurancer(Long insurancerId)

// Insurance System Specific
public Optional<Insurancer> getInsurancerByToken(String token)
public Insurancer updateInsurancerToken(Long insurancerId, String token)

// Utility Operations
public String generateUniqueToken()
public boolean isTokenUnique(String token)
public List<Insurancer> searchInsurancers(String searchTerm, Long companyId)
```

## Service Integration

### 1. Controller Updates
Both `InsuranceController` and `InsurancerController` have been updated to use the new services instead of directly accessing repositories.

**Before (Repository Pattern)**:
```java
@Autowired
private InsurancerRepository insurancerRepository;

public ResponseEntity<Insurancer> getInsurancer(@PathVariable("id") long id) {
    Optional<Insurancer> insurancerOptional = this.insurancerRepository.findById(id);
    // ... rest of method
}
```

**After (Service Pattern)**:
```java
@Autowired
private InsurancerService insurancerService;

public ResponseEntity<Insurancer> getInsurancer(@PathVariable("id") long id) {
    Optional<Insurancer> insurancerOptional = this.insurancerService.getInsurancer(id);
    // ... rest of method
}
```

### 2. Business Logic Centralization
All business logic is now centralized in the services, making the controllers cleaner and more focused on HTTP request/response handling.

## Security Features

### 1. Triple UUID System
The services implement the triple UUID security system:
- **Company UUID**: Stored in `insurancers.token`
- **Public UUID**: Vehicle identifier in URL
- **Private UUID**: Access token (never in URL)

### 2. Access Validation
Every operation validates access using the `validateAccess()` method:
```java
public boolean validateAccess(String companyCode, String publicUuid, String privateKey) {
    Optional<InsuranceAccess> access = insuranceAccessRepository
        .findByCompanyUuidAndPublicUuidAndPrivateUuid(companyCode, publicUuid, privateKey);
    
    if (!access.isPresent()) return false;
    
    InsuranceAccess accessRecord = access.get();
    
    // Check if access is active and not expired
    if (!accessRecord.isActive()) return false;
    if (accessRecord.getExpiresAt() != null && accessRecord.getExpiresAt().before(new Date())) return false;
    
    return true;
}
```

## File Management

### 1. Document Storage
Documents are stored using a UUID-based naming system:
```java
// Generate UUID token for file storage
String randomCode = generateUUID();
document.setToken(randomCode);

// Save file to disk
String path = this.fileRootPath + randomCode + getFileExtension(fileName);
File fileSaved = new File(path);
try (OutputStream outputStream = new FileOutputStream(fileSaved)) {
    outputStream.write(fileBytes);
}
```

### 2. File Type Validation
Supported file types are validated:
```java
public boolean isValidFileType(String fileName) {
    if (fileName == null) return false;
    
    String extension = getFileExtension(fileName).toLowerCase();
    return extension.matches("\\.(pdf|doc|docx|xls|xlsx|jpg|jpeg|png|gif|bmp|tiff)$");
}
```

### 3. MIME Type Detection
Automatic MIME type detection based on file extension:
```java
public String getMimeType(String fileName) {
    if (fileName == null) return "application/octet-stream";
    
    String extension = getFileExtension(fileName).toLowerCase();
    switch (extension) {
        case ".pdf": return "application/pdf";
        case ".doc": return "application/msword";
        case ".docx": return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        // ... more types
    }
}
```

## Audit and Logging

### 1. VehicleHistory Integration
All insurance operations are logged in the existing `VehicleHistory` system:
```java
// Log in VehicleHistory
VehicleHistory vehicleHistory = new VehicleHistory();
vehicleHistory.setName("Insurance Document");
vehicleHistory.setVehicleId(vehicle.getId());
vehicleHistory.setObjectKey(savedDocument.getId());
vehicleHistory.setType(0); // 0) add 1) update 2) delete
vehicleHistory.setValue(description);
vehicleHistory.setCompanyUuid(companyCode);

vehicleHistoryRepository.save(vehicleHistory);
```

### 2. Insurance Activity Logs
Dedicated logging for insurance-specific activities:
```java
public void logAuditEvent(String companyCode, String publicUuid, String privateKey, String actionType, String ipAddress) {
    try {
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
```

## Transaction Management

### 1. Service-Level Transactions
All services use `@Transactional` annotation for proper transaction management:
```java
@Service
@Transactional
public class InsuranceService {
    // All methods are transactional
}
```

### 2. Rollback on Exception
Any runtime exception will trigger a rollback of the entire transaction, ensuring data consistency.

## Error Handling

### 1. Runtime Exceptions
Services throw `RuntimeException` for business logic errors:
```java
if (!validateAccess(companyCode, publicUuid, privateKey)) {
    throw new RuntimeException("Invalid access credentials");
}

if (!vehicleOptional.isPresent()) {
    throw new RuntimeException("Vehicle not found");
}
```

### 2. Logging
Comprehensive logging at different levels:
```java
LOG.debug("Getting insurancer by token: {}", token);
LOG.info("Updating token for insurancer: {}", insurancerId);
LOG.error("Error saving file: {}", e.getMessage(), e);
```

## Configuration

### 1. File Path Configuration
File storage paths are configurable via properties:
```java
@Value("${insurance.documents.root.path}")
private String fileRootPath;
```

**application.properties**:
```properties
insurance.documents.root.path=C:\\Projects\\images\\insurance\\documents\\
insurance.documents.resize.path=C:\\Projects\\images\\insurance\\resize\\
```

## Testing

### 1. Service Testing
Services can be tested independently:
```java
@SpringBootTest
class InsuranceServiceTest {
    
    @Autowired
    private InsuranceService insuranceService;
    
    @Test
    void testValidateAccess() {
        // Test access validation logic
    }
}
```

### 2. Integration Testing
Full integration testing with controllers and repositories.

## Performance Considerations

### 1. Lazy Loading
JPA entities use lazy loading where appropriate to minimize database queries.

### 2. Batch Operations
Bulk document operations are supported for better performance:
```java
public List<InsuranceDocument> bulkUploadDocuments(String companyCode, String publicUuid, String privateKey, 
                                                   List<byte[]> fileBytes, List<String> fileNames, Long docTypeId, List<String> descriptions)
```

### 3. Caching
DocType names are cached in documents to reduce database lookups.

## Future Enhancements

### 1. Async Operations
File processing could be made asynchronous for better performance.

### 2. Compression
Document compression for storage optimization.

### 3. CDN Integration
Integration with CDN for document delivery.

## Conclusion

The backend services implementation provides a robust, secure, and maintainable foundation for the Insurance Viewing Component. By centralizing business logic in services and following established Spring Boot patterns, the system maintains consistency with the existing codebase while adding powerful new functionality.

The services handle all aspects of insurance operations including security, document management, audit logging, and file operations, making them ready for production use and future enhancements.
