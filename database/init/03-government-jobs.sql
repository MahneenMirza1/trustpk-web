-- 03-government-jobs.sql
-- Government Jobs module schema for TrustPK

CREATE TABLE IF NOT EXISTS government_jobs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    organization VARCHAR(255) NOT NULL,
    department VARCHAR(255),
    province VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    qualification TEXT,
    degree_level VARCHAR(100),
    required_field VARCHAR(255),
    age_min INTEGER,
    age_max INTEGER,
    gender VARCHAR(50),
    domicile VARCHAR(255),
    quota VARCHAR(255),
    experience VARCHAR(255),
    pay_scale VARCHAR(50),
    vacancies INTEGER,
    location VARCHAR(255),
    fee_amount VARCHAR(50),
    case_number VARCHAR(100),
    application_start_date DATE,
    application_deadline DATE,
    deadline_str VARCHAR(100),
    description TEXT,
    requirements TEXT,
    required_documents TEXT,
    official_source VARCHAR(200) NOT NULL,
    official_source_code VARCHAR(50) NOT NULL,
    source_website VARCHAR(500) NOT NULL,
    official_advertisement_url VARCHAR(500),
    official_application_url VARCHAR(500) NOT NULL,
    external_reference_id VARCHAR(255) UNIQUE,
    last_verified_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL DEFAULT 'Active',
    is_verified_source BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_gov_jobs_title ON government_jobs(title);
CREATE INDEX IF NOT EXISTS idx_gov_jobs_org ON government_jobs(organization);
CREATE INDEX IF NOT EXISTS idx_gov_jobs_province ON government_jobs(province);
CREATE INDEX IF NOT EXISTS idx_gov_jobs_category ON government_jobs(category);
CREATE INDEX IF NOT EXISTS idx_gov_jobs_deadline ON government_jobs(application_deadline);
CREATE INDEX IF NOT EXISTS idx_gov_jobs_status ON government_jobs(status);
CREATE INDEX IF NOT EXISTS idx_gov_jobs_source_code ON government_jobs(official_source_code);

CREATE TABLE IF NOT EXISTS job_sync_logs (
    id SERIAL PRIMARY KEY,
    source_code VARCHAR(50) NOT NULL,
    source_name VARCHAR(200) NOT NULL,
    jobs_found INTEGER NOT NULL DEFAULT 0,
    jobs_added INTEGER NOT NULL DEFAULT 0,
    jobs_updated INTEGER NOT NULL DEFAULT 0,
    jobs_expired INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL,
    error_message TEXT,
    started_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_sync_source_code ON job_sync_logs(source_code);
