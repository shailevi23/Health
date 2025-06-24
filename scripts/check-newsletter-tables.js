require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function checkAndCreateNewsletterTables() {
  try {
    console.log('Checking for newsletter tables...');
    
    // Check if newsletter_subscribers table exists
    const { data: existingTables, error: tablesError } = await supabaseAdmin
      .from('information_schema.tables')
      .select('table_name')
      .in('table_name', ['newsletter_subscribers', 'content_notifications']);
    
    if (tablesError) {
      throw tablesError;
    }
    
    const existingTableNames = existingTables.map(t => t.table_name);
    
    if (existingTableNames.includes('newsletter_subscribers') && 
        existingTableNames.includes('content_notifications')) {
      console.log('✅ Newsletter tables already exist');
      return;
    }
    
    console.log('Creating missing newsletter tables...');
    
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'create-newsletter-table.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Execute the SQL
    const { error } = await supabaseAdmin.rpc('execute_sql', {
      sql: sqlContent
    });
    
    if (error) {
      // If the function doesn't exist, we need to create it
      if (error.message.includes('function "execute_sql" does not exist')) {
        console.log('Creating execute_sql function...');
        
        // Create a function to execute arbitrary SQL
        const { error: functionError } = await supabaseAdmin.rpc('postgres_fdw_raw_statement', {
          statement: `
            CREATE OR REPLACE FUNCTION execute_sql(sql text)
            RETURNS void AS $$
            BEGIN
              EXECUTE sql;
            END;
            $$ LANGUAGE plpgsql SECURITY DEFINER;
          `
        });
        
        if (functionError) {
          // If postgres_fdw_raw_statement doesn't exist, we can't continue
          if (functionError.message.includes('function "postgres_fdw_raw_statement" does not exist')) {
            console.error('❌ Cannot create tables: postgres_fdw_raw_statement function not available');
            console.error('Please run the SQL script manually in the Supabase dashboard SQL editor');
            process.exit(1);
          }
          
          throw functionError;
        }
        
        // Try again with the new function
        const { error: retryError } = await supabaseAdmin.rpc('execute_sql', {
          sql: sqlContent
        });
        
        if (retryError) throw retryError;
      } else {
        throw error;
      }
    }
    
    console.log('✅ Newsletter tables created successfully!');
    
    // Verify tables were created
    const { data: verifyTables, error: verifyError } = await supabaseAdmin
      .from('information_schema.tables')
      .select('table_name')
      .in('table_name', ['newsletter_subscribers', 'content_notifications']);
    
    if (verifyError) {
      throw verifyError;
    }
    
    console.log('Tables verified:', verifyTables.map(t => t.table_name).join(', '));
    
  } catch (error) {
    console.error('❌ Error setting up newsletter tables:', error);
  }
}

// Run the check
checkAndCreateNewsletterTables(); 