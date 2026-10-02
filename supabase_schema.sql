-- =========================================================================
-- SMS SOLAIRE — SUPABASE DATABASE SCHEMA & MIGRATION
-- Safe to run multiple times (uses IF NOT EXISTS + ADD COLUMN IF NOT EXISTS)
-- Execute in: https://supabase.com/dashboard → SQL Editor
-- =========================================================================

-- =========================================================================
-- SECTION 1: TABLES
-- =========================================================================

-- 1. Quotes Table (Devis Leads)
CREATE TABLE IF NOT EXISTS public.quotes (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    install_type        VARCHAR(50)  NOT NULL,
    surface_m2          DECIMAL(10, 2) NOT NULL,
    steg_monthly_bill   DECIMAL(10, 2) NOT NULL,
    gouvernorat         VARCHAR(100) NOT NULL,
    full_name           VARCHAR(150) NOT NULL,
    phone_number        VARCHAR(30)  NOT NULL,
    email               VARCHAR(150) NOT NULL,
    steg_file_url       VARCHAR(500),
    status              VARCHAR(50)  DEFAULT 'NEW',
    ip_address          VARCHAR(45)  DEFAULT '127.0.0.1',
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Migration: add ip_address if table already existed without it
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS ip_address VARCHAR(45) DEFAULT '127.0.0.1';
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'NEW';


-- 2. Contact Messages Table
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name    VARCHAR(150) NOT NULL,
    email        VARCHAR(150) NOT NULL,
    phone_number VARCHAR(30)  NOT NULL,
    message      TEXT         NOT NULL,
    status       VARCHAR(50)  DEFAULT 'UNREAD',
    ip_address   VARCHAR(45)  DEFAULT '127.0.0.1',
    created_at   TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Migration: add ip_address if table already existed without it
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS ip_address VARCHAR(45) DEFAULT '127.0.0.1';
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'UNREAD';


-- 3. Solar Projects / Réalisations Gallery Table
CREATE TABLE IF NOT EXISTS public.projects (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title           VARCHAR(250) NOT NULL,
    category        VARCHAR(50)  NOT NULL,
    gouvernorat     VARCHAR(100) NOT NULL,
    power_capacity  VARCHAR(50)  NOT NULL,
    metric_label    VARCHAR(50)  DEFAULT 'Puissance',
    description     TEXT         NOT NULL,
    image_url       VARCHAR(500) NOT NULL,
    before_after    BOOLEAN      DEFAULT FALSE,
    published       BOOLEAN      DEFAULT TRUE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Migration: add columns if table already existed without them
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS metric_label VARCHAR(50) DEFAULT 'Puissance';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS before_after BOOLEAN DEFAULT FALSE;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT TRUE;


-- 4. Admin Authentication Audit Logs Table
--    Stores every login attempt (success or failure) with IP + user-agent
CREATE TABLE IF NOT EXISTS public.admin_login_logs (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email      VARCHAR(150) NOT NULL,
    ip_address VARCHAR(45)  NOT NULL,
    success    BOOLEAN      DEFAULT FALSE,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast IP-based lookups (used by brute-force detector)
CREATE INDEX IF NOT EXISTS idx_admin_login_logs_ip
    ON public.admin_login_logs (ip_address, success, created_at DESC);


-- 5. Blocked IPs Table (Automated Anti-Brute-Force Ban System)
--    Auto-populated after 5 failed login attempts in 15 minutes.
--    Also supports manual bans by the admin.
CREATE TABLE IF NOT EXISTS public.blocked_ips (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ip_address     VARCHAR(45)  UNIQUE NOT NULL,
    reason         TEXT         DEFAULT 'Excessive failed login attempts',
    attempts_count INT          DEFAULT 1,
    expires_at     TIMESTAMP WITH TIME ZONE,           -- NULL = permanent ban
    created_at     TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast IP lookup on each login request
CREATE INDEX IF NOT EXISTS idx_blocked_ips_address
    ON public.blocked_ips (ip_address);


-- =========================================================================
-- SECTION 2: ROW LEVEL SECURITY (RLS)
-- Public visitors can ONLY submit (INSERT). All reads & admin ops use
-- SUPABASE_SERVICE_ROLE_KEY server-side — never the anon key.
-- =========================================================================

ALTER TABLE public.quotes             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_login_logs   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_ips        ENABLE ROW LEVEL SECURITY;


-- ── quotes ────────────────────────────────────────────────────────────────
-- Public: INSERT only (submit a quote/devis request)
DROP POLICY IF EXISTS "Allow public insert to quotes" ON public.quotes;
CREATE POLICY "Allow public insert to quotes"
ON public.quotes FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Block public SELECT / UPDATE / DELETE on quotes
DROP POLICY IF EXISTS "Block public read quotes" ON public.quotes;
CREATE POLICY "Block public read quotes"
ON public.quotes FOR SELECT
TO anon, authenticated
USING (false);


-- ── contact_messages ──────────────────────────────────────────────────────
-- Public: INSERT only (submit a contact message)
DROP POLICY IF EXISTS "Allow public insert to contact_messages" ON public.contact_messages;
CREATE POLICY "Allow public insert to contact_messages"
ON public.contact_messages FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Block public SELECT on contact messages
DROP POLICY IF EXISTS "Block public read contact_messages" ON public.contact_messages;
CREATE POLICY "Block public read contact_messages"
ON public.contact_messages FOR SELECT
TO anon, authenticated
USING (false);


-- ── projects ──────────────────────────────────────────────────────────────
-- Public: SELECT only published projects (for the Réalisations page)
DROP POLICY IF EXISTS "Allow public read published projects" ON public.projects;
CREATE POLICY "Allow public read published projects"
ON public.projects FOR SELECT
TO anon, authenticated
USING (published = true);


-- ── admin_login_logs ──────────────────────────────────────────────────────
-- NO public access at all — service role key only
DROP POLICY IF EXISTS "Block public access to admin logs" ON public.admin_login_logs;
CREATE POLICY "Block public access to admin logs"
ON public.admin_login_logs FOR ALL
TO anon, authenticated
USING (false);


-- ── blocked_ips ───────────────────────────────────────────────────────────
-- NO public access at all — service role key only
DROP POLICY IF EXISTS "Block public access to blocked_ips" ON public.blocked_ips;
CREATE POLICY "Block public access to blocked_ips"
ON public.blocked_ips FOR ALL
TO anon, authenticated
USING (false);


-- =========================================================================
-- SECTION 3: UTILITY — OPTIONAL CLEANUP FUNCTION
-- Auto-delete expired IP bans (can be scheduled via pg_cron if needed)
-- Run manually: SELECT cleanup_expired_ip_bans();
-- =========================================================================

CREATE OR REPLACE FUNCTION cleanup_expired_ip_bans()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.blocked_ips
  WHERE expires_at IS NOT NULL AND expires_at < NOW();

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;
