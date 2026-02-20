-- Create autopart_histories table
CREATE TABLE IF NOT EXISTS autopart_histories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    value TEXT,
    user_id BIGINT,
    employee_id BIGINT,
    autopart_id BIGINT,
    object_key BIGINT DEFAULT 0,
    type INT DEFAULT 0, -- 0: add, 1: update, 2: delete
    company_uuid VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create job_histories table
CREATE TABLE IF NOT EXISTS job_histories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    value TEXT,
    user_id BIGINT,
    employee_id BIGINT,
    job_id BIGINT,
    object_key BIGINT DEFAULT 0,
    type INT DEFAULT 0, -- 0: add, 1: update, 2: delete
    company_uuid VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Add indexes for better performance
CREATE INDEX idx_autopart_histories_autopart_id ON autopart_histories(autopart_id);
CREATE INDEX idx_job_histories_job_id ON job_histories(job_id);
CREATE INDEX idx_autopart_histories_created_at ON autopart_histories(created_at);
CREATE INDEX idx_job_histories_created_at ON job_histories(created_at);