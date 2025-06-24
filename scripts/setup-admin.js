const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local if it exists
try {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
  }
} catch (error) {
  console.error('Error loading .env.local file:', error);
}

// Initialize Supabase client with admin privileges
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  console.error('Please make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function setupAdminSettings() {
  try {
    console.log('Setting up admin settings table...');
    
    const sqlFilePath = path.join(process.cwd(), 'scripts', 'create-admin-settings-table.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Execute the SQL
    const { error } = await supabaseAdmin.rpc('execute_sql', {
      sql: sqlContent
    });
    
    if (error) {
      throw error;
    }
    
    console.log('Admin settings table created successfully!');
    
    // Verify table was created
    const { data: tables, error: tablesError } = await supabaseAdmin
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', 'admin_settings');
    
    if (tablesError) {
      throw tablesError;
    }
    
    console.log('Table verified:', tables);
    
  } catch (error) {
    console.error('Error setting up admin settings table:', error);
    process.exit(1);
  }
}

// Run the setup
setupAdminSettings(); 