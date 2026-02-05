-- Migration: Create user_profiles table and avatar storage
-- Description: Adds user profile functionality with preferences and avatar support

-- 1. Create user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    travel_preferences JSONB DEFAULT '{
        "budget_default": "Medium",
        "travel_style_default": "adventure",
        "preferred_pace": "moderate",
        "food_preferences": [],
        "accessibility_needs": [],
        "interests": [],
        "avoid": []
    }'::jsonb,
    dietary_restrictions TEXT[],
    preferred_languages TEXT[] DEFAULT ARRAY['en'],
    currency_preference TEXT DEFAULT 'USD',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- 2. Create index for faster lookups
CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(user_id);

-- 3. Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies
-- Allow users to read their own profile
CREATE POLICY "Users can view own profile"
    ON public.user_profiles
    FOR SELECT
    USING (auth.uid() = user_id);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert own profile"
    ON public.user_profiles
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
    ON public.user_profiles
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own profile
CREATE POLICY "Users can delete own profile"
    ON public.user_profiles
    FOR DELETE
    USING (auth.uid() = user_id);

-- 5. Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Create trigger for updated_at
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- 7. Create function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (user_id, full_name, preferred_languages)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        ARRAY['en']
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Create trigger to auto-create profile
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 9. Grant permissions
GRANT ALL ON public.user_profiles TO authenticated;
GRANT ALL ON public.user_profiles TO service_role;

-- Note: For avatar storage, you need to create a bucket via Supabase Dashboard:
-- 1. Go to Storage in Supabase Dashboard
-- 2. Create a new bucket named "avatars"
-- 3. Make it public or set appropriate policies
-- 4. RLS policy example for avatars bucket:
--    - Allow authenticated users to upload: bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
--    - Allow public read: bucket_id = 'avatars'
