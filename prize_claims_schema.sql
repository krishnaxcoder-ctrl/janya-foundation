-- Supabase SQL Schema for Prize Claims
-- Run this in Supabase SQL Editor to create the required table and storage bucket

-- Create the prize_claims table
CREATE TABLE IF NOT EXISTS prize_claims (
    id SERIAL PRIMARY KEY,
    claim_id VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    race_category VARCHAR(50) NOT NULL,
    age INTEGER NOT NULL,
    age_proof_url TEXT NOT NULL,
    aadhar_card_url TEXT NOT NULL,
    pan_card_url TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    admin_notes TEXT,
    prize_amount DECIMAL(10, 2),
    payment_date TIMESTAMP,
    payment_reference VARCHAR(100),
    verified_at TIMESTAMP,
    verified_by VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_prize_claims_phone ON prize_claims(phone);
CREATE INDEX IF NOT EXISTS idx_prize_claims_email ON prize_claims(email);
CREATE INDEX IF NOT EXISTS idx_prize_claims_status ON prize_claims(status);
CREATE INDEX IF NOT EXISTS idx_prize_claims_claim_id ON prize_claims(claim_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_prize_claims_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_prize_claims_updated_at
    BEFORE UPDATE ON prize_claims
    FOR EACH ROW
    EXECUTE FUNCTION update_prize_claims_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE prize_claims ENABLE ROW LEVEL SECURITY;

-- Policy to allow service role to do everything
CREATE POLICY "Service role can manage prize claims"
    ON prize_claims
    FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

-- =====================================================
-- STORAGE BUCKET SETUP (Run this in Supabase Dashboard)
-- =====================================================
-- 1. Go to Storage in Supabase Dashboard
-- 2. Create a new bucket named "documents"
-- 3. Set it to "Public" if you want direct URL access
-- 4. Or keep it "Private" and use signed URLs

-- If you want to create the bucket via SQL (requires storage extension):
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('documents', 'documents', true);

-- Storage policies for the documents bucket:
-- Allow service role to upload files
-- CREATE POLICY "Service role can upload documents"
--     ON storage.objects
--     FOR INSERT
--     WITH CHECK (bucket_id = 'documents' AND auth.role() = 'service_role');

-- Allow public read access (if bucket is public)
-- CREATE POLICY "Public can read documents"
--     ON storage.objects
--     FOR SELECT
--     USING (bucket_id = 'documents');

-- =====================================================
-- SAMPLE QUERIES
-- =====================================================

-- Get all pending claims
-- SELECT * FROM prize_claims WHERE status = 'pending' ORDER BY created_at DESC;

-- Update claim status to verified
-- UPDATE prize_claims SET status = 'verified', verified_at = NOW(), verified_by = 'admin@example.com' WHERE claim_id = 'PRIZE-xxx';

-- Update claim status to paid
-- UPDATE prize_claims SET status = 'paid', payment_date = NOW(), payment_reference = 'TXN123', prize_amount = 5000.00 WHERE claim_id = 'PRIZE-xxx';

-- Status values: 'pending', 'under_review', 'verified', 'rejected', 'paid'
