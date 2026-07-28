CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT NOT NULL DEFAULT 'free',
  preferred_generator TEXT NOT NULL DEFAULT 'universal',
  preferred_depth TEXT NOT NULL DEFAULT 'detailed',
  default_retain_source BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE TO authenticated USING (id = auth.uid());

CREATE TABLE public.analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  title TEXT,
  target_generator TEXT NOT NULL DEFAULT 'universal',
  prompt_depth TEXT NOT NULL DEFAULT 'detailed',
  use_case TEXT NOT NULL DEFAULT 'general',
  change_notes TEXT,
  retain_source BOOLEAN NOT NULL DEFAULT false,
  source_path TEXT,
  source_mime TEXT,
  source_bytes INTEGER,
  source_width INTEGER,
  source_height INTEGER,
  aspect_ratio TEXT,
  orientation TEXT,
  result JSONB,
  overall_confidence NUMERIC,
  error_code TEXT,
  model TEXT,
  duration_ms INTEGER,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX analyses_user_created_idx ON public.analyses (user_id, created_at DESC);
CREATE INDEX analyses_user_status_idx ON public.analyses (user_id, status);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.analyses TO authenticated;
GRANT ALL ON public.analyses TO service_role;
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "analyses_select_own" ON public.analyses FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "analyses_insert_own" ON public.analyses FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "analyses_update_own" ON public.analyses FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "analyses_delete_own" ON public.analyses FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE TABLE public.analysis_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  analysis_id UUID REFERENCES public.analyses(id) ON DELETE SET NULL,
  outcome TEXT NOT NULL DEFAULT 'started',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX analysis_attempts_user_created_idx ON public.analysis_attempts (user_id, created_at DESC);
CREATE INDEX analysis_attempts_created_idx ON public.analysis_attempts (created_at DESC);
GRANT SELECT ON public.analysis_attempts TO authenticated;
GRANT ALL ON public.analysis_attempts TO service_role;
ALTER TABLE public.analysis_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "attempts_select_own" ON public.analysis_attempts FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_set_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER analyses_set_updated_at BEFORE UPDATE ON public.analyses
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NULLIF(NEW.raw_user_meta_data ->> 'full_name', ''),
    NULLIF(NEW.raw_user_meta_data ->> 'avatar_url', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();