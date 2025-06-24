-- Create extension if it doesn't exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Add created_at column to newsletter_subscribers if it doesn't exist
ALTER TABLE newsletter_subscribers 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Add subscribed_at column to newsletter_subscribers if it doesn't exist
ALTER TABLE newsletter_subscribers 
ADD COLUMN IF NOT EXISTS subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Set subscribed_at to current timestamp for existing records
UPDATE newsletter_subscribers 
SET subscribed_at = now() 
WHERE subscribed_at IS NULL;

-- Add content column to content_notifications if it doesn't exist
ALTER TABLE content_notifications 
ADD COLUMN IF NOT EXISTS content TEXT;

-- Add title column to content_notifications if it doesn't exist
ALTER TABLE content_notifications 
ADD COLUMN IF NOT EXISTS title TEXT;

-- Add content_type column to content_notifications if it doesn't exist
ALTER TABLE content_notifications 
ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'text';

-- Check if content_id column exists and if it's required
DO $$
DECLARE
  column_exists BOOLEAN;
  is_nullable BOOLEAN;
BEGIN
  -- Check if content_id column exists
  SELECT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'content_notifications'
    AND column_name = 'content_id'
  ) INTO column_exists;
  
  IF column_exists THEN
    -- Check if content_id is nullable
    SELECT is_nullable = 'YES'
    FROM information_schema.columns
    WHERE table_name = 'content_notifications'
    AND column_name = 'content_id'
    INTO is_nullable;
    
    IF NOT is_nullable THEN
      -- Make content_id nullable
      EXECUTE 'ALTER TABLE content_notifications ALTER COLUMN content_id DROP NOT NULL';
    END IF;
  END IF;
END $$;

-- Update existing records to set content_type
UPDATE content_notifications 
SET content_type = 'text' 
WHERE content_type IS NULL;

-- Insert a sample notification if none exist
INSERT INTO content_notifications (title, content, content_type, content_id)
SELECT 'Welcome to Health Blog', 'Thank you for subscribing to our newsletter. We will keep you updated with the latest health tips and articles.', 'text', uuid_generate_v4()
WHERE NOT EXISTS (SELECT 1 FROM content_notifications LIMIT 1);

-- Create admin_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  smtp_host TEXT,
  smtp_port INTEGER DEFAULT 587,
  smtp_user TEXT,
  smtp_pass TEXT,
  from_email TEXT,
  from_name TEXT,
  reply_to TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert default admin settings if none exist
INSERT INTO admin_settings (smtp_host, smtp_port, smtp_user, smtp_pass, from_email, from_name, reply_to)
SELECT 'smtp.example.com', 587, 'user@example.com', 'password', 'newsletter@example.com', 'Health Blog Newsletter', 'support@example.com'
WHERE NOT EXISTS (SELECT 1 FROM admin_settings LIMIT 1); 