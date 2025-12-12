-- Insurance System Migration Script
-- This script adds the new insurance-related tables and updates existing ones

-- 1. Add token column to insurancers table
ALTER TABLE insurancers ADD COLUMN token VARCHAR(36) COMMENT 'UUID for company-specific routing';

-- 2. Add company_uuid column to vehicle_histories table
ALTER TABLE vehicle_histories ADD COLUMN company_uuid VARCHAR(36) COMMENT 'For insurance company tracking';

-- 3. Create insurance_access table
CREATE TABLE insurance_access (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_uuid VARCHAR(36) NOT NULL COMMENT 'From insurancers table',
    public_uuid VARCHAR(36) NOT NULL COMMENT 'Vehicle identifier',
    private_uuid VARCHAR(36) NOT NULL COMMENT 'Access token (never in URL)',
    vehicle_id BIGINT NOT NULL,
    insurance_company VARCHAR(255),
    contact_email VARCHAR(255),
    expires_at DATETIME,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_company_public_private (company_uuid, public_uuid, private_uuid),
    INDEX idx_company_public (company_uuid, public_uuid),
    INDEX idx_vehicle (vehicle_id),
    INDEX idx_expires (expires_at)
);

-- 4. Create insurance_claims table
CREATE TABLE insurance_claims (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_uuid VARCHAR(36) NOT NULL COMMENT 'From insurancers table',
    public_uuid VARCHAR(36) NOT NULL COMMENT 'Vehicle identifier',
    private_uuid VARCHAR(36) NOT NULL COMMENT 'Access token (never in URL)',
    vehicle_id BIGINT NOT NULL,
    insurance_company VARCHAR(255),
    claim_number VARCHAR(255) COMMENT 'Insurance claim number',
    status VARCHAR(50) DEFAULT 'PENDING' COMMENT 'PENDING, APPROVED, DENIED, IN_REVIEW',
    comments TEXT COMMENT 'Insurance company comments',
    claim_date DATETIME,
    last_updated DATETIME,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_company_public_private (company_uuid, public_uuid, private_uuid),
    INDEX idx_company_public (company_uuid, public_uuid),
    INDEX idx_vehicle (vehicle_id),
    INDEX idx_status (status)
);

-- 5. Create insurance_activity_logs table
CREATE TABLE insurance_activity_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_uuid VARCHAR(36) NOT NULL COMMENT 'From insurancers table',
    public_uuid VARCHAR(36) NOT NULL COMMENT 'Vehicle identifier',
    private_uuid VARCHAR(36) NOT NULL COMMENT 'Access token (never in URL)',
    vehicle_id BIGINT NOT NULL,
    insurance_company VARCHAR(255),
    action_type VARCHAR(100) COMMENT 'ACCESS, VIEW, UPDATE, COMMENT, DOCUMENT_UPLOAD, DOCUMENT_UPDATE',
    ip_address VARCHAR(45),
    accessed_at DATETIME,
    expires_at DATETIME,
    is_expired BOOLEAN DEFAULT FALSE,
    document_reference VARCHAR(255) COMMENT 'Reference to uploaded/updated documents',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_company_public (company_uuid, public_uuid),
    INDEX idx_vehicle (vehicle_id),
    INDEX idx_action_type (action_type),
    INDEX idx_accessed_at (accessed_at)
);

-- 6. Create insurance_documents table
CREATE TABLE insurance_documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_uuid VARCHAR(36) NOT NULL COMMENT 'From insurancers table',
    public_uuid VARCHAR(36) NOT NULL COMMENT 'Vehicle identifier',
    vehicle_id BIGINT NOT NULL,
    insurance_claim_id BIGINT COMMENT 'Reference to insurance_claims table',
    file_name VARCHAR(255) COMMENT 'Original uploaded filename',
    description TEXT COMMENT 'Document description',
    token VARCHAR(36) NOT NULL COMMENT 'UUID for file storage',
    doc_type_id BIGINT COMMENT 'Reference to DocType table',
    doc_type_name VARCHAR(255) COMMENT 'Cached DocType name for quick access',
    file_path VARCHAR(500) COMMENT 'Server file path',
    file_size VARCHAR(50) COMMENT 'File size in bytes',
    mime_type VARCHAR(100) COMMENT 'MIME type',
    version VARCHAR(50) COMMENT 'Document version',
    uploaded_by VARCHAR(255) COMMENT 'Insurance company name',
    uploaded_at DATETIME,
    last_modified DATETIME,
    is_active BOOLEAN DEFAULT TRUE,
    sequence_number INT DEFAULT 0,
    show_in_search BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_company_public (company_uuid, public_uuid),
    INDEX idx_token (token),
    INDEX idx_vehicle (vehicle_id),
    INDEX idx_doc_type (doc_type_id),
    INDEX idx_sequence (sequence_number)
);

-- 7. Add sample insurance company tokens (you can update these with actual UUIDs)
-- UPDATE insurancers SET token = UUID() WHERE name = 'GEICO';
-- UPDATE insurancers SET token = UUID() WHERE name = 'State Farm';
-- UPDATE insurancers SET token = UUID() WHERE name = 'Allstate';

-- 8. Create directories for insurance document storage
-- Note: These directories need to be created manually on the file system
-- C:\Projects\images\insurance\documents\
-- C:\Projects\images\insurance\resize\

-- 9. Add comments to existing tables for documentation
ALTER TABLE insurancers COMMENT = 'Insurance companies with UUID tokens for routing';
ALTER TABLE vehicle_histories COMMENT = 'Vehicle activity history with insurance company tracking';

-- 10. Verify the migration
SELECT 'Migration completed successfully' as status;
SELECT COUNT(*) as insurancers_count FROM insurancers;
SELECT COUNT(*) as vehicle_histories_count FROM vehicle_histories;
SELECT COUNT(*) as insurance_access_count FROM insurance_access;
SELECT COUNT(*) as insurance_claims_count FROM insurance_claims;
SELECT COUNT(*) as insurance_activity_logs_count FROM insurance_activity_logs;
SELECT COUNT(*) as insurance_documents_count FROM insurance_documents;
