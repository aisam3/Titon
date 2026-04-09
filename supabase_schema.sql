-- Use this SQL to initialize your Supabase database.
-- Run this in the Supabase SQL Editor.

-- 1. Create sops table
CREATE TABLE IF NOT EXISTS sops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create sop_logs table
CREATE TABLE IF NOT EXISTS sop_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sop_id UUID NOT NULL REFERENCES sops(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  time_taken NUMERIC NOT NULL CHECK (time_taken > 0),
  output NUMERIC NOT NULL CHECK (output >= 0),
  errors NUMERIC NOT NULL CHECK (errors >= 0),
  efficiency NUMERIC NOT NULL,
  error_rate NUMERIC NOT NULL,
  score NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT errors_less_than_output CHECK (errors <= output)
);

-- 3. Enable RLS
ALTER TABLE sops ENABLE ROW LEVEL SECURITY;
ALTER TABLE sop_logs ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for sops
-- Users can only see and modify their own SOPs
CREATE POLICY "Users can only access their own sops" ON sops
  FOR ALL USING (auth.uid() = user_id);

-- 5. RLS Policies for sop_logs
-- Users can only see and modify their own logs
CREATE POLICY "Users can only access their own logs" ON sop_logs
  FOR ALL USING (auth.uid() = user_id);

-- 6. Metrics Engine: Function to insert log with automatic calculations (Option A)
CREATE OR REPLACE FUNCTION insert_sop_log(
  p_sop_id UUID,
  p_time_taken NUMERIC,
  p_output NUMERIC,
  p_errors NUMERIC
) RETURNS JSON AS $$
DECLARE
  v_user_id UUID;
  v_efficiency NUMERIC;
  v_error_rate NUMERIC;
  v_score NUMERIC;
  v_new_log_id UUID;
BEGIN
  -- Get current user ID from auth contexts
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Unauthorized: Must be logged in to create logs';
  END IF;

  -- Data Validation (CRITICAL)
  IF p_time_taken <= 0 THEN
    RAISE EXCEPTION 'time_taken must be greater than zero';
  END IF;
  
  IF p_output < 0 THEN
    RAISE EXCEPTION 'output must be non-negative';
  END IF;
  
  IF p_errors < 0 THEN
    RAISE EXCEPTION 'errors must be non-negative';
  END IF;
  
  IF p_errors > p_output THEN
    RAISE EXCEPTION 'errors cannot exceed output';
  END IF;

  -- Automatic Calculations
  -- efficiency = output / time_taken
  v_efficiency := p_output / p_time_taken;
  
  -- error_rate = errors / output (handle division by zero if output is 0)
  IF p_output > 0 THEN
    v_error_rate := p_errors / p_output;
  ELSE
    v_error_rate := 0;
  END IF;
  
  -- score = efficiency * (1 - error_rate)
  v_score := v_efficiency * (1 - v_error_rate);

  -- Insert log
  INSERT INTO sop_logs (
    sop_id, user_id, time_taken, output, errors, efficiency, error_rate, score
  ) VALUES (
    p_sop_id, v_user_id, p_time_taken, p_output, p_errors, v_efficiency, v_error_rate, v_score
  ) RETURNING id INTO v_new_log_id;

  -- Return the created log data
  RETURN json_build_object(
    'id', v_new_log_id,
    'efficiency', v_efficiency,
    'error_rate', v_error_rate,
    'score', v_score,
    'created_at', now()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
