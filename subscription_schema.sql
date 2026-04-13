-- subscription_schema.sql
-- Run this in the Supabase SQL Editor to implement subscription limits.

-- 1. Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'free',
  sop_limit INTEGER NOT NULL DEFAULT 3,
  log_limit INTEGER NOT NULL DEFAULT 3,
  subscription_status TEXT NOT NULL DEFAULT 'active',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- UPDATE EXISTING FREE USERS IF NECESSARY
UPDATE public.profiles SET log_limit = 3 WHERE plan = 'free';

-- 2. Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can manage their own profile" 
  ON public.profiles FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 4. Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (user_id, plan, sop_limit, log_limit, subscription_status)
  VALUES (new.id, 'free', 3, 3, 'active');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Trigger for automatic profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 6. Optional: Backfill profiles for existing users
INSERT INTO public.profiles (user_id, plan, sop_limit, log_limit, subscription_status)
SELECT id, 'free', 3, 3, 'active'
FROM auth.users
ON CONFLICT (user_id) DO NOTHING;
