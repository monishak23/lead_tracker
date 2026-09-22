-- ============================================================
-- Lead Generation Application - Foundational Database Schema
-- Database: PostgreSQL
-- Scope: leads table only, matching the exact required fields
--        (Name, Email, Phone, Status, Created At) and the
--        exact required methods (Create, Update Status,
--        Search, List).
-- ============================================================

-- ------------------------------------------------------------
-- Extension: needed for gen_random_uuid() used as the primary key.
-- ------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ------------------------------------------------------------
-- Enum type for Status
-- ------------------------------------------------------------
CREATE TYPE lead_status AS ENUM (
    'NEW',
    'CONTACTED',
    'QUALIFIED',
    'LOST'
);

-- ------------------------------------------------------------
-- Table: leads
-- ------------------------------------------------------------
CREATE TABLE leads (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(255) NOT NULL,
    email       VARCHAR(255) NOT NULL,
    phone       VARCHAR(20)  NOT NULL,
    status      lead_status  NOT NULL DEFAULT 'NEW',
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),

    CONSTRAINT uq_leads_email UNIQUE (email),
    CONSTRAINT uq_leads_phone UNIQUE (phone)
);

-- ------------------------------------------------------------
-- Indexes to support the required methods:
--   - Search Leads (by name / email / phone)
--   - List Leads (paginated, ordered by created_at)
--   - Update Lead Status (lookups by status)
-- ------------------------------------------------------------

-- Speeds up "List Leads" ordered by newest first
CREATE INDEX idx_leads_created_at ON leads (created_at DESC);

-- Speeds up "Search Leads" text lookups on name
CREATE INDEX idx_leads_name ON leads (name);

-- Speeds up filtering/searching by status
CREATE INDEX idx_leads_status ON leads (status);
