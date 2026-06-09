-- Migration: Create premium infrastructure tables and RPCs
-- Run this in Supabase SQL Editor or via `supabase migration up`

-- ── 1. user_profiles ──
-- Mirrors local SQLite schema for premium status caching
CREATE TABLE IF NOT EXISTS user_profiles (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email             TEXT,
  full_name         TEXT,
  subscription_tier TEXT NOT NULL DEFAULT 'free',
  is_premium        BOOLEAN NOT NULL DEFAULT FALSE,
  premium_expires_at TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ── 2. premium_purchases ──
-- Audit trail for all premium purchases
CREATE TABLE IF NOT EXISTS premium_purchases (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id    TEXT NOT NULL,
  order_id      TEXT NOT NULL,
  purchase_time BIGINT NOT NULL,
  platform      TEXT NOT NULL DEFAULT 'ios',
  acknowledged  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 3. RPC: get_premium_status ──
-- Returns premium info for a user. Creates profile if missing.
CREATE OR REPLACE FUNCTION get_premium_status(p_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_profile user_profiles%ROWTYPE;
BEGIN
  -- Try to find existing profile
  SELECT * INTO v_profile FROM user_profiles WHERE user_id = p_user_id;

  -- If no profile exists, create default
  IF NOT FOUND THEN
    INSERT INTO user_profiles (user_id)
    VALUES (p_user_id)
    RETURNING * INTO v_profile;
  END IF;

  RETURN json_build_object(
    'subscription_tier', v_profile.subscription_tier,
    'is_premium', v_profile.is_premium,
    'premium_expires_at', v_profile.premium_expires_at,
    'email', v_profile.email,
    'full_name', v_profile.full_name
  );
END;
$$;

-- ── 4. RPC: activate_premium ──
-- Grants premium status to a user and logs the purchase
CREATE OR REPLACE FUNCTION activate_premium(
  p_user_id       UUID,
  p_product_id    TEXT,
  p_order_id      TEXT,
  p_purchase_time BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000,
  p_platform      TEXT DEFAULT 'ios'
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_profile user_profiles%ROWTYPE;
BEGIN
  -- Upsert user profile to premium
  INSERT INTO user_profiles (user_id, subscription_tier, is_premium)
  VALUES (p_user_id, 'premium', TRUE)
  ON CONFLICT (user_id)
  DO UPDATE SET
    subscription_tier = 'premium',
    is_premium = TRUE,
    updated_at = NOW()
  RETURNING * INTO v_profile;

  -- Log purchase
  INSERT INTO premium_purchases (user_id, product_id, order_id, purchase_time, platform)
  VALUES (p_user_id, p_product_id, p_order_id, p_purchase_time, p_platform);

  RETURN json_build_object(
    'subscription_tier', v_profile.subscription_tier,
    'is_premium', v_profile.is_premium,
    'updated_at', v_profile.updated_at
  );
END;
$$;

-- ── 5. RLS Policies ──
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE premium_purchases ENABLE ROW LEVEL SECURITY;

-- user_profiles: user can only read/update own profile
DROP POLICY IF EXISTS user_profiles_select ON user_profiles;
CREATE POLICY user_profiles_select ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS user_profiles_update ON user_profiles;
CREATE POLICY user_profiles_update ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- premium_purchases: user can only read own purchases
DROP POLICY IF EXISTS premium_purchases_select ON premium_purchases;
CREATE POLICY premium_purchases_select ON premium_purchases
  FOR SELECT USING (auth.uid() = user_id);

-- Allow authenticated users to call RPCs
GRANT EXECUTE ON FUNCTION get_premium_status(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION activate_premium(UUID, TEXT, TEXT, BIGINT, TEXT) TO authenticated;
