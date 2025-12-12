# Insurance System - DTOs and Services Implementation Summary

## Overview
This document summarizes the implementation of DTOs and services for the Insurance Viewing Component, following the exact patterns used in the existing Angular application.

## Frontend Models (Angular) - Client/angular-parthub/src/app/models/

### 1. Updated Models
- **`insurancer.model.ts`** - Added `token` field for company UUID routing

### 2. New Models
- **`insurance.claim.model.ts`** - Insurance claim data model
- **`insurance.access.model.ts`** - Insurance access token model  
- **`insurance.document.model.ts`** - Insurance document model
- **`insurance.claim.view.response.model.ts`** - Response model for claim view
- **`insurance.claim.status.update.model.ts`** - Model for status updates

## Frontend Services (Angular) - Client/angular-parthub/src/app/_services/

### 1. Updated Services
- **`insurancer.service.ts`** - Added token-based methods:
  - `getInsurancerByToken(token: string)`
  - `getInsurancerByName(name: string)`
  - `updateInsurancerToken(insurancerId: any, token: string)`

### 2. New Services
- **`insurance.service.ts`** - Comprehensive insurance service with methods:
  - **Authentication**: `validateAccess()`
  - **Claims Management**: `getClaim()`, `updateClaimStatus()`
  - **Document Management**: `uploadDocument()`, `getDocuments()`, `updateDocument()`, `deleteDocument()`
  - **Sequence Management**: `updateSequenceNumber()`
  - **Document Type**: `setDocumentDocType()`
  - **File Operations**: `downloadDocument()`, `bulkUploadDocuments()`

## Backend DTOs - Server/parthub-spring-boot-server/src/main/java/com/xoftex/parthub/payload/

### 1. Response DTOs
- **`InsuranceClaimViewResponse.java`** - Response for claim view with vehicle, claims, and documents

### 2. Request DTOs  
- **`InsuranceClaimStatusUpdate.java`** - Request model for updating claim status

## Backend Controller Updates

### 1. InsuranceController
- Updated to use proper DTOs instead of inner classes
- All endpoints properly integrated with DTOs
- Maintains triple UUID security system

### 2. InsurancerController  
- Added new endpoints for insurance system:
  - `GET /api/insurancers/token/{token}` - Get insurancer by token
  - `GET /api/insurancers/name/{name}` - Get insurancer by name
  - `PUT /api/insurancers/{id}/token` - Update insurancer token

## API Endpoints Summary

### Insurance System (`/api/insurance`)
- `GET /access/{companyCode}/{publicUuid}` - Validate access
- `GET /claim/{companyCode}/{publicUuid}` - Get claim information
- `POST /status/{companyCode}/{publicUuid}` - Update claim status
- `POST /documents/{companyCode}/{publicUuid}` - Upload document
- `GET /documents/{companyCode}/{publicUuid}` - Get documents
- `PUT /documents/{companyCode}/{documentId}` - Update document
- `DELETE /documents/{companyCode}/{documentId}` - Delete document
- `POST /documents/sequence/{companyCode}/{publicUuid}` - Update sequence
- `PUT /documents/{companyCode}/{documentId}/doctype/{docTypeId}` - Set document type
- `GET /documents/download/{token}` - Download document
- `POST /documents/bulk/{companyCode}/{publicUuid}` - Bulk upload

### Insurancer System (`/api/insurancers`)
- `GET /token/{token}` - Get insurancer by token
- `GET /name/{name}` - Get insurancer by name
- `PUT /{id}/token` - Update insurancer token

## Security Features

### Triple UUID System
- **Company UUID** - Stored in `insurancers.token`
- **Public UUID** - Vehicle identifier in URL
- **Private UUID** - Access token (never in URL)

### Access Control
- All insurance endpoints require valid triple UUID combination
- Private key validation on every request
- Automatic expiration and access revocation

## Integration Points

### 1. Existing Systems
- **DocType System** - Document categorization
- **VehicleHistory** - Audit trail with company UUID
- **File Management** - Following existing PdfFile patterns
- **Sequence Management** - Using existing SequenceCarrier

### 2. New Features
- **Company-specific routing** via UUID tokens
- **Insurance document management** with categorization
- **Comprehensive audit logging** with company identification
- **Bulk operations** for document management

## Usage Examples

### 1. Setting up Insurance Company
```typescript
// Generate UUID token
const token = this.generateUUID();

// Update insurancer with token
this.insurancerService.updateInsurancerToken(insurancerId, token).subscribe(
  response => console.log('Token updated:', response)
);
```

### 2. Validating Insurance Access
```typescript
// Validate triple UUID access
this.insuranceService.validateAccess(companyCode, publicUuid, privateKey).subscribe(
  response => console.log('Access granted'),
  error => console.log('Access denied')
);
```

### 3. Uploading Insurance Document
```typescript
// Upload document with metadata
this.insuranceService.uploadDocument(companyCode, publicUuid, privateKey, 
  description, docTypeId, file).subscribe(
  response => console.log('Document uploaded:', response)
);
```

## Next Steps

### Phase 2: Frontend Components
1. **InsuranceViewingComponent** - Main viewing component
2. **InsuranceAuthGuard** - Custom authentication guard
3. **Document Management Interface** - Upload, edit, delete documents
4. **Claim Status Management** - Update claim status and comments

### Phase 3: UI Modes
1. **CCC-like Professional View** - Industry standard interface
2. **System Native Bootstrap View** - Integrated with existing UI
3. **Responsive Design** - Mobile and tablet support

## Testing

### 1. Backend Testing
```bash
# Test insurance endpoints
curl "http://localhost:8080/api/insurance/access/company-uuid/public-uuid?privateKey=private-uuid"
```

### 2. Frontend Testing
```bash
# Test Angular services
ng test --include="**/insurance.service.spec.ts"
```

## File Structure

```
Client/angular-parthub/src/app/
├── models/
│   ├── insurancer.model.ts (updated)
│   ├── insurance.claim.model.ts (new)
│   ├── insurance.access.model.ts (new)
│   ├── insurance.document.model.ts (new)
│   ├── insurance.claim.view.response.model.ts (new)
│   └── insurance.claim.status.update.model.ts (new)
└── _services/
    ├── insurancer.service.ts (updated)
    └── insurance.service.ts (new)

Server/parthub-spring-boot-server/src/main/java/com/xoftex/parthub/
├── payload/
│   ├── request/
│   │   └── InsuranceClaimStatusUpdate.java (new)
│   └── response/
│       └── InsuranceClaimViewResponse.java (new)
└── controllers/
    ├── InsuranceController.java (updated)
    └── InsurancerController.java (updated)
```

## Conclusion

The DTOs and services implementation is now complete and follows the exact same patterns as the existing Angular application. All models, services, and DTOs are properly integrated and ready for the next phase of frontend component development.

The system maintains consistency with existing patterns while adding the new insurance functionality with proper security, audit trails, and document management capabilities.
