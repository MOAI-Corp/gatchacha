-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create gacha_templates table
CREATE TABLE public.gacha_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  theme TEXT NOT NULL,
  tier1_count INTEGER NOT NULL DEFAULT 1,
  tier2_count INTEGER NOT NULL DEFAULT 3,
  tier3_count INTEGER NOT NULL DEFAULT 16,
  tier4_count INTEGER NOT NULL DEFAULT 80,
  tier5_count INTEGER NOT NULL DEFAULT 200,
  is_public BOOLEAN NOT NULL DEFAULT false,
  is_system BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on gacha_templates
ALTER TABLE public.gacha_templates ENABLE ROW LEVEL SECURITY;

-- Create policies for gacha_templates
CREATE POLICY "Users can view their own templates, public templates, and system templates" 
ON public.gacha_templates 
FOR SELECT 
USING (auth.uid() = user_id OR is_public = true OR is_system = true);

CREATE POLICY "Users can create their own templates" 
ON public.gacha_templates 
FOR INSERT 
WITH CHECK (auth.uid() = user_id AND is_system = false);

CREATE POLICY "Users can update their own templates" 
ON public.gacha_templates 
FOR UPDATE 
USING (auth.uid() = user_id AND is_system = false);

CREATE POLICY "Users can delete their own templates" 
ON public.gacha_templates 
FOR DELETE 
USING (auth.uid() = user_id AND is_system = false);

-- Create gacha_results table for storing draw history
CREATE TABLE public.gacha_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id UUID REFERENCES public.gacha_templates(id) ON DELETE SET NULL,
  template_name TEXT NOT NULL,
  item_name TEXT NOT NULL,
  tier INTEGER NOT NULL CHECK (tier BETWEEN 1 AND 5),
  drawn_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on gacha_results
ALTER TABLE public.gacha_results ENABLE ROW LEVEL SECURITY;

-- Create policies for gacha_results
CREATE POLICY "Users can view their own results" 
ON public.gacha_results 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own results" 
ON public.gacha_results 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_gacha_templates_updated_at
  BEFORE UPDATE ON public.gacha_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'username');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Insert system default templates (no user_id required)
INSERT INTO public.gacha_templates (id, user_id, name, theme, tier1_count, tier2_count, tier3_count, tier4_count, tier5_count, is_public, is_system)
VALUES 
  ('00000000-0000-0000-0000-000000000001', NULL, '기본 뽑기', 'classic', 1, 3, 16, 80, 200, true, true),
  ('00000000-0000-0000-0000-000000000002', NULL, '프리미엄 뽑기', 'golden', 2, 5, 20, 73, 200, true, true),
  ('00000000-0000-0000-0000-000000000003', NULL, '판타지 뽑기', 'magical', 1, 4, 15, 80, 200, true, true),
  ('00000000-0000-0000-0000-000000000004', NULL, '사이버 뽑기', 'neon', 1, 2, 17, 80, 200, true, true),
  ('00000000-0000-0000-0000-000000000005', NULL, '레트로 뽑기', 'vintage', 1, 3, 16, 70, 210, true, true),
  ('00000000-0000-0000-0000-000000000006', NULL, '우주 뽑기', 'cosmic', 1, 4, 18, 77, 200, true, true);