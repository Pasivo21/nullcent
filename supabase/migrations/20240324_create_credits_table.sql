-- Create enum type for credit status
CREATE TYPE credit_status AS ENUM ('active', 'paid');

-- Create credits table
CREATE TABLE credits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    amount NUMERIC NOT NULL CHECK (amount > 0),
    interest_rate NUMERIC NOT NULL CHECK (interest_rate >= 0),
    monthly_rate NUMERIC NOT NULL CHECK (monthly_rate > 0),
    start_date DATE NOT NULL,
    status credit_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- Add indexes for better query performance
    CONSTRAINT credits_amount_positive CHECK (amount > 0),
    CONSTRAINT credits_monthly_rate_positive CHECK (monthly_rate > 0)
);

-- Add RLS (Row Level Security) policies
ALTER TABLE credits ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their own credits
CREATE POLICY "Users can view their own credits"
    ON credits
    FOR SELECT
    USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own credits
CREATE POLICY "Users can insert their own credits"
    ON credits
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own credits
CREATE POLICY "Users can update their own credits"
    ON credits
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to delete their own credits
CREATE POLICY "Users can delete their own credits"
    ON credits
    FOR DELETE
    USING (auth.uid() = user_id); 