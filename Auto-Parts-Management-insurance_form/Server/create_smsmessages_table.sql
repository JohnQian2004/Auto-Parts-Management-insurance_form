-- Create smsmessages table for SMS messaging system
CREATE TABLE IF NOT EXISTS smsmessages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    vehicle_id BIGINT DEFAULT 0,
    user_id BIGINT DEFAULT 0,
    phone_number VARCHAR(20),
    message VARCHAR(1600),
    direction VARCHAR(20),
    status VARCHAR(50),
    twilio_sid VARCHAR(100),
    vehicle_status VARCHAR(255),
    error_message VARCHAR(500),
    INDEX idx_vehicle_id (vehicle_id),
    INDEX idx_phone_number (phone_number),
    INDEX idx_direction (direction),
    INDEX idx_created_at (created_at)
);
