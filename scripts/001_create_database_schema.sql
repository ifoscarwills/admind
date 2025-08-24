-- ADMIND Database Schema
-- Creates all required tables with proper RLS policies

-- 1. Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  company TEXT,
  position TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for profiles
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- 2. Ads table
CREATE TABLE IF NOT EXISTS public.ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  platform TEXT NOT NULL, -- 'facebook', 'google', 'instagram', etc.
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'active', 'paused', 'completed'
  budget DECIMAL(10,2),
  spent DECIMAL(10,2) DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  ctr DECIMAL(5,4) DEFAULT 0, -- Click-through rate
  cpc DECIMAL(10,2) DEFAULT 0, -- Cost per click
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on ads
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;

-- RLS policies for ads
CREATE POLICY "ads_select_own" ON public.ads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "ads_insert_own" ON public.ads FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ads_update_own" ON public.ads FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "ads_delete_own" ON public.ads FOR DELETE USING (auth.uid() = user_id);

-- 3. Growth Metrics table
CREATE TABLE IF NOT EXISTS public.growth_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  metric_name TEXT NOT NULL, -- 'revenue', 'users', 'conversions', etc.
  metric_value DECIMAL(15,2) NOT NULL,
  metric_date DATE NOT NULL,
  metric_type TEXT DEFAULT 'daily', -- 'daily', 'weekly', 'monthly'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on growth_metrics
ALTER TABLE public.growth_metrics ENABLE ROW LEVEL SECURITY;

-- RLS policies for growth_metrics
CREATE POLICY "growth_metrics_select_own" ON public.growth_metrics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "growth_metrics_insert_own" ON public.growth_metrics FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "growth_metrics_update_own" ON public.growth_metrics FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "growth_metrics_delete_own" ON public.growth_metrics FOR DELETE USING (auth.uid() = user_id);

-- 4. Meetings table
CREATE TABLE IF NOT EXISTS public.meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  meeting_type TEXT DEFAULT 'consultation', -- 'consultation', 'strategy', 'review'
  status TEXT DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled', 'no-show'
  jitsi_room_id TEXT, -- For Jitsi integration
  attendee_email TEXT,
  attendee_name TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on meetings
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;

-- RLS policies for meetings
CREATE POLICY "meetings_select_own" ON public.meetings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "meetings_insert_own" ON public.meetings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "meetings_update_own" ON public.meetings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "meetings_delete_own" ON public.meetings FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ads_user_id ON public.ads(user_id);
CREATE INDEX IF NOT EXISTS idx_ads_status ON public.ads(status);
CREATE INDEX IF NOT EXISTS idx_ads_platform ON public.ads(platform);
CREATE INDEX IF NOT EXISTS idx_growth_metrics_user_id ON public.growth_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_growth_metrics_date ON public.growth_metrics(metric_date);
CREATE INDEX IF NOT EXISTS idx_meetings_user_id ON public.meetings(user_id);
CREATE INDEX IF NOT EXISTS idx_meetings_date ON public.meetings(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_meetings_status ON public.meetings(status);
