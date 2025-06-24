const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: '.env.local' });

async function main() {
  console.log('\n🗃️  Running database migrations...\n');

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing Supabase environment variables. Please run:');
    console.error('   npm run setup:env');
    process.exit(1);
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  try {
    // Get all migration files
    const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    console.log('Found migrations:', migrationFiles);

    // Run each migration
    for (const file of migrationFiles) {
      console.log(`\n📄 Running migration: ${file}`);
      
      const migration = fs.readFileSync(
        path.join(migrationsDir, file),
        'utf8'
      );

      // Execute the migration
      const { error } = await supabase.rpc('exec_sql', {
        sql: migration
      });

      if (error) {
        console.error(`\n❌ Error in ${file}:`, error.message);
        if (error.message.includes('function "exec_sql" does not exist')) {
          console.log('\nℹ️  Please create the exec_sql function in your Supabase dashboard:');
          console.log(`
CREATE OR REPLACE FUNCTION exec_sql(sql text) 
RETURNS void AS $$
BEGIN
  EXECUTE sql;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;`);
        }
        process.exit(1);
      }

      console.log(`✅ Migration ${file} completed successfully`);
    }

    console.log('\n✨ All migrations completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Error running migrations:', error);
    process.exit(1);
  }
}

main(); 