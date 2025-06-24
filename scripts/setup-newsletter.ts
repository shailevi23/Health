import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function setupNewsletterTables() {
  try {
    console.log('Setting up newsletter tables...');
    
    const sqlFilePath = path.join(process.cwd(), 'scripts', 'create-newsletter-table.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Execute the SQL
    const { error } = await supabaseAdmin.rpc('execute_sql', {
      sql: sqlContent
    });
    
    if (error) {
      throw error;
    }
    
    console.log('Newsletter tables created successfully!');
    
    // Verify tables were created
    const { data: tables, error: tablesError } = await supabaseAdmin
      .from('information_schema.tables')
      .select('table_name')
      .in('table_name', ['newsletter_subscribers', 'content_notifications']);
    
    if (tablesError) {
      throw tablesError;
    }
    
    console.log('Tables verified:', tables);
    
  } catch (error) {
    console.error('Error setting up newsletter tables:', error);
  }
}

// Run the setup
setupNewsletterTables(); 