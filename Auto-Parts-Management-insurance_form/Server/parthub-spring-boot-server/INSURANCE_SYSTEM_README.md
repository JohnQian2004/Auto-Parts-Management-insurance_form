# Insurance Viewing Component - Backend Implementation

## Overview
This document describes the backend implementation of the Insurance Viewing Component for the Auto Parts Management system. The system provides secure, time-limited access to vehicle claim information for insurance companies without requiring system authentication.

## Architecture

### Triple UUID Security System
The system implements a three-factor authentication model:

1. **Company UUID** - Stored in `insurancers.token` field, used for company-specific routing
2. **Public UUID** - Vehicle identifier, included in URL path
3. **Private UUID** - Access token, never exposed in URL, delivered via email only

### Security Flow
```
1. Insurance company requests access → Generate triple UUIDs
2. Email sent with all three UUIDs
3. Insurance company accesses system → Validate all three UUIDs
4. Access granted → Log audit trail with company identification
5. Private UUID expires → Access automatically revoked
```

## Database Schema

### New Tables

#### 1. `insurance_access`
- Manages access tokens and expiration
- Links company, vehicle, and access credentials
- Tracks contact email and expiration dates

#### 2. `insurance_claims`
- Stores insurance claim information
- Links to vehicles via public UUID
- Tracks status, comments, and updates

#### 3. `insurance_activity_logs`
- Comprehensive audit trail
- Logs all insurance company activities
- Tracks IP addresses and access patterns

#### 4. `insurance_documents`
- Manages document uploads and categorization
- Follows existing DocType system patterns
- Supports sequence management and search

### Updated Tables

#### 1. `insurancers`
- Added `token` field for company UUID routing
- Enables company-specific URL patterns

#### 2. `vehicle_histories`
- Added `company_uuid` field for insurance tracking
- Maintains audit trail consistency

## API Endpoints

### Authentication
- `GET /api/insurance/access/{companyCode}/{publicUuid}` - Validate access credentials

### Claims Management
- `GET /api/insurance/claim/{companyCode}/{publicUuid}` - Get claim information
- `POST /api/insurance/status/{companyCode}/{publicUuid}` - Update claim status

### Document Management
- `POST /api/insurance/documents/{companyCode}/{publicUuid}` - Upload document
- `GET /api/insurance/documents/{companyCode}/{publicUuid}` - Get documents
- `PUT /api/insurance/documents/{companyCode}/{documentId}` - Update document
- `DELETE /api/insurance/documents/{companyCode}/{documentId}` - Delete document
- `POST /api/insurance/documents/sequence/{companyCode}/{publicUuid}` - Update sequence
- `PUT /api/insurance/documents/{companyCode}/{documentId}/doctype/{docTypeId}` - Set document type
- `GET /api/insurance/documents/download/{token}` - Download document
- `POST /api/insurance/documents/bulk/{companyCode}/{publicUuid}` - Bulk upload

## Implementation Details

### File Storage
- Documents stored using UUID-based naming (following existing PdfFile pattern)
- Root path configurable via `insurance.documents.root.path` property
- Supports multiple file formats with MIME type detection

### Document Categorization
- Integrates with existing DocType system
- Supports sequence management for document ordering
- Maintains consistency with ImageVehicle and PdfFile patterns

### Audit Trail
- All insurance activities logged in `insurance_activity_logs`
- VehicleHistory entries include company UUID for tracking
- IP address logging for security monitoring

## Configuration

### Properties
```properties
# Insurance document storage
insurance.documents.root.path=C:\\Projects\\images\\insurance\\documents\\
insurance.documents.resize.path=C:\\Projects\\images\\insurance\\resize\\
```

### Security
- Insurance endpoints added to WebSecurityConfig
- All `/api/insurance/**` endpoints permit all access
- Triple UUID validation at controller level

## Usage Examples

### 1. Setting up an Insurance Company
```sql
-- Add token to existing insurance company
UPDATE insurancers SET token = UUID() WHERE name = 'GEICO';

-- Or create new insurance company
INSERT INTO insurancers (name, token, company_id, user_id) 
VALUES ('New Insurance Co', UUID(), 1, 1);
```

### 2. Creating Access for a Vehicle
```sql
-- Generate access record
INSERT INTO insurance_access (company_uuid, public_uuid, private_uuid, vehicle_id, insurance_company, contact_email, expires_at)
VALUES (
    (SELECT token FROM insurancers WHERE name = 'GEICO'),
    'vehicle-public-uuid-here',
    'private-access-token-here',
    123,
    'GEICO',
    'claims@geico.com',
    DATE_ADD(NOW(), INTERVAL 30 DAY)
);
```

### 3. URL Pattern
```
https://yourdomain.com/#/insurance/{companyCode}/{publicUuid}?privateKey={privateUuid}
```

## Security Considerations

### Triple UUID Validation
- Company UUID validated against insurancers table
- Public UUID must exist in vehicles table
- Private UUID validated against insurance_access table

### Access Control
- All endpoints require valid triple UUID combination
- Private key never exposed in URL parameters
- Automatic expiration and access revocation

### Audit Logging
- Complete activity trail with company identification
- IP address tracking for security monitoring
- Document operation logging in VehicleHistory

## Testing

### 1. Database Migration
```bash
# Run the migration script
mysql -u username -p database_name < insurance_migration.sql
```

### 2. Directory Creation
```bash
# Create insurance document directories
mkdir -p "C:\Projects\images\insurance\documents"
mkdir -p "C:\Projects\images\insurance\resize"
```

### 3. API Testing
```bash
# Test access validation
curl "http://localhost:8080/api/insurance/access/company-uuid/public-uuid?privateKey=private-uuid"

# Test document upload
curl -X POST "http://localhost:8080/api/insurance/documents/company-uuid/public-uuid" \
  -F "file=@document.pdf" \
  -F "description=Test document" \
  -F "docTypeId=1" \
  -F "privateKey=private-uuid"
```

## Next Steps

### Phase 2: Frontend Components
1. Generate Angular components and services
2. Implement custom authentication guard
3. Create main viewing component with email-based private key input
4. Integrate document management interface

### Phase 3: UI Modes
1. Implement CCC-like professional view
2. Create system native Bootstrap view
3. Add responsive design and mobile support

### Phase 4: Integration & Testing
1. Email template integration
2. End-to-end workflow validation
3. Security penetration testing
4. Performance optimization

## Troubleshooting

### Common Issues

#### 1. File Upload Failures
- Check directory permissions for insurance document storage
- Verify `insurance.documents.root.path` property is set correctly
- Ensure sufficient disk space

#### 2. Authentication Failures
- Verify all three UUIDs are correct
- Check if access has expired
- Confirm company UUID exists in insurancers table

#### 3. Database Connection Issues
- Verify database migration completed successfully
- Check table structure matches entity definitions
- Confirm indexes are created for performance

### Logs
- Check application logs for detailed error information
- Monitor `insurance_activity_logs` for access patterns
- Review `vehicle_histories` for document operation tracking

## Support
For technical support or questions about the insurance system implementation, refer to the main project documentation or contact the development team.
