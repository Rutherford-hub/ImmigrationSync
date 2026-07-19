-- =========================================================================
-- DATABASE CREATION (Runs on default 'postgres' database connection)
-- =========================================================================
CREATE DATABASE immigrationsync_users;
CREATE DATABASE immigrationsync_applications;
CREATE DATABASE immigrationsync_authentication;
CREATE DATABASE immigrationsync_documents;
CREATE DATABASE immigrationsync_notifications;

-- =========================================================================
-- 1. AUTHENTICATION / USER SERVICE TABLES
-- =========================================================================
\c immigrationsync_users;

CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    role_id INT REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- Seed mandatory default roles
INSERT INTO roles (name) 
VALUES ('ROLE_APPLICANT'), ('ROLE_OFFICER'), ('ROLE_ADMIN')
ON CONFLICT (name) DO NOTHING;


-- =========================================================================
-- 2. CASE APPLICATION SERVICE TABLES
-- =========================================================================
\c immigrationsync_applications;

CREATE TABLE IF NOT EXISTS applications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    visa_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'DRAFT' NOT NULL,
    form_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================================
-- 3. DOCUMENT SERVICE TABLES
-- =========================================================================
\c immigrationsync_documents;

CREATE TABLE IF NOT EXISTS documents (
    id BIGSERIAL PRIMARY KEY,
    application_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    storage_path VARCHAR(500) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================================
-- 4. NOTIFICATION SERVICE TABLES
-- =========================================================================
\c immigrationsync_notifications;

CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    recipient_email VARCHAR(100) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    notification_type VARCHAR(50) DEFAULT 'EMAIL' NOT NULL,
    sent BOOLEAN DEFAULT FALSE NOT NULL,
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);