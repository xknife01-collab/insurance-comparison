-- Phone Verification Table Schema for SMS Authentication
CREATE TABLE IF NOT EXISTS public.phone_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(50) NOT NULL,
    code VARCHAR(10) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookup by phone and code
CREATE INDEX IF NOT EXISTS idx_phone_verifications_lookup 
ON public.phone_verifications (phone, code, expires_at);

-- Row Level Security (RLS) Configuration
ALTER TABLE public.phone_verifications ENABLE ROW LEVEL SECURITY;

-- Block public access (Edge functions use Service Role key to bypass RLS)
CREATE POLICY "Block public read access to phone verifications"
ON public.phone_verifications
FOR SELECT
TO public
USING (false);

CREATE POLICY "Block public write access to phone verifications"
ON public.phone_verifications
FOR INSERT
TO public
WITH CHECK (false);
