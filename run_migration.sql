-- Run this SQL in your Supabase dashboard SQL editor
-- or use supabase db push if using local development

ALTER TABLE insights ADD COLUMN IF NOT EXISTS cover_image_url TEXT;

-- Add comment for documentation  
COMMENT ON COLUMN insights.cover_image_url IS 'URL for the article cover image';

-- =====================================================
-- TGD COURSES & FREE RESOURCES MIGRATIONS
-- =====================================================

-- Add missing columns to courses table
ALTER TABLE courses ADD COLUMN IF NOT EXISTS enrollment_url TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS badge_text TEXT;

-- Create free_resources table
CREATE TABLE IF NOT EXISTS free_resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  resource_url TEXT NOT NULL,
  resource_type TEXT DEFAULT 'Guide',
  is_published BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE free_resources ENABLE ROW LEVEL SECURITY;

-- Create policies for free_resources
CREATE POLICY "public_read_free_resources" ON free_resources 
FOR SELECT TO public USING (is_published = true);

CREATE POLICY "auth_insert_free_resources" ON free_resources 
FOR INSERT TO authenticated 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "auth_update_free_resources" ON free_resources 
FOR UPDATE TO authenticated 
USING (auth.role() = 'authenticated') 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "auth_delete_free_resources" ON free_resources 
FOR DELETE TO authenticated 
USING (auth.role() = 'authenticated');

CREATE POLICY "auth_select_free_resources" ON free_resources 
FOR SELECT TO authenticated 
USING (auth.role() = 'authenticated');
