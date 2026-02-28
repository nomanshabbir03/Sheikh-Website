-- Add cover_image_url column to insights table
ALTER TABLE insights ADD COLUMN IF NOT EXISTS cover_image_url TEXT;

-- Add comment for documentation
COMMENT ON COLUMN insights.cover_image_url IS 'URL for the article cover image';
