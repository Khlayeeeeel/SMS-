-- =========================================================================
-- SMS SOLAIRE - SUPABASE DATABASE SCHEMA & ROW LEVEL SECURITY (RLS) POLICIES
-- Execute this script inside the Supabase SQL Editor (https://supabase.com/dashboard)
-- =========================================================================

-- 1. Create Quotes Table (Devis Leads)
CREATE TABLE IF NOT EXISTS public.quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    install_type VARCHAR(50) NOT NULL,
    surface_m2 DECIMAL(10, 2) NOT NULL,
    steg_monthly_bill DECIMAL(10, 2) NOT NULL,
    gouvernorat VARCHAR(100) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone_number VARCHAR(30) NOT NULL,
    email VARCHAR(150) NOT NULL,
    steg_file_url VARCHAR(500),
    status VARCHAR(50) DEFAULT 'NEW',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Contact Messages Table
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone_number VARCHAR(30) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'UNREAD',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Solar Projects Gallery Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(250) NOT NULL,
    category VARCHAR(50) NOT NULL,
    gouvernorat VARCHAR(100) NOT NULL,
    power_capacity VARCHAR(50) NOT NULL,
    metric_label VARCHAR(50) DEFAULT 'Puissance',
    description TEXT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    before_after BOOLEAN DEFAULT FALSE,
    published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Ensure simple public website visitors can ONLY submit leads (INSERT)
-- Public users CANNOT read (SELECT), edit (UPDATE), or delete (DELETE) data.
-- =========================================================================

-- Enable RLS on all tables
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Quotes RLS: Allow anonymous public users to INSERT quote leads
CREATE POLICY "Allow public insert to quotes"
ON public.quotes
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Contact Messages RLS: Allow anonymous public users to INSERT messages
CREATE POLICY "Allow public insert to contact_messages"
ON public.contact_messages
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Projects RLS: Allow public visitors to SELECT/READ published solar projects
CREATE POLICY "Allow public read published projects"
ON public.projects
FOR SELECT
TO anon, authenticated
USING (published = true);
