// This script provides instructions for setting up the database tables manually

console.log('Health Blog - Database Setup Instructions');
console.log('=======================================\n');

console.log('To set up the newsletter and admin tables, follow these steps:');
console.log('1. Navigate to your Supabase project dashboard');
console.log('2. Go to the SQL Editor');
console.log('3. Create a new query and paste the following SQL code:');
console.log('\n--- Newsletter Subscribers Table ---');
console.log(`
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  preferences JSONB DEFAULT '{"articles": true, "recipes": true, "recommendations": true}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_newsletter_subscribers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_newsletter_subscribers_updated_at
  BEFORE UPDATE ON newsletter_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION update_newsletter_subscribers_updated_at();
`);

console.log('\n--- Content Notifications Table ---');
console.log(`
CREATE TABLE IF NOT EXISTS content_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_type TEXT NOT NULL,
  content_id UUID NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
`);

console.log('\n--- Admin Settings Table ---');
console.log(`
CREATE TABLE IF NOT EXISTS admin_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_admin_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_admin_settings_updated_at
  BEFORE UPDATE ON admin_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_admin_settings_updated_at();

-- Insert default email settings
INSERT INTO admin_settings (key, value)
VALUES (
  'email_settings',
  '{"host":"","port":"","secure":false,"user":"","password":"","fromEmail":"","apiKey":""}'::jsonb
)
ON CONFLICT (key) DO NOTHING;
`);

console.log('\n4. Execute the SQL query');
console.log('5. Once the tables are created, you can access the admin panel at /admin');
console.log('   Username: admin');
console.log('   Password: admin');
console.log('\nNote: Make sure you have the required environment variables set up in your .env.local file:');
console.log('- NEXT_PUBLIC_SUPABASE_URL');
console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY');
console.log('- SUPABASE_SERVICE_ROLE_KEY'); 