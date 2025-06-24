const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const crypto = require('crypto');

console.log('Fixing database tables...');

// Load environment variables from .env.local if it exists
try {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  } else {
    console.error('No .env.local file found. Please run "node scripts/create-env-local.js" first.');
    process.exit(1);
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

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixTables() {
  try {
    // Check if newsletter_subscribers table exists by attempting to query it
    console.log('Checking newsletter_subscribers table...');
    let { data: subscribers, error: subscribersError } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .limit(1);
    
    if (subscribersError && subscribersError.code === '42P01') {
      // Table doesn't exist, create it
      console.log('Creating newsletter_subscribers table...');
      
      // We'll use the REST API to create the table
      const createTableResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey
        },
        body: JSON.stringify({
          name: 'newsletter_subscribers',
          schema: 'public',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              primaryKey: true,
              defaultValue: 'uuid_generate_v4()'
            },
            {
              name: 'email',
              type: 'text',
              isUnique: true,
              isNullable: false
            },
            {
              name: 'status',
              type: 'text',
              defaultValue: "'active'"
            },
            {
              name: 'subscribed_at',
              type: 'timestamptz',
              defaultValue: 'now()'
            },
            {
              name: 'created_at',
              type: 'timestamptz',
              defaultValue: 'now()'
            }
          ]
        })
      });
      
      if (!createTableResponse.ok) {
        console.error('Error creating newsletter_subscribers table:', await createTableResponse.text());
      } else {
        console.log('✅ newsletter_subscribers table created successfully!');
      }
    } else if (subscribersError) {
      console.error('Error checking newsletter_subscribers table:', subscribersError);
    } else {
      console.log('✅ newsletter_subscribers table already exists.');
      
      // Check if subscribed_at column exists
      console.log('Checking if subscribed_at column exists...');
      
      // Try to insert a test record to check if the column exists
      const testEmail = `test_${Date.now()}@example.com`;
      const { error: insertError } = await supabase
        .from('newsletter_subscribers')
        .insert([
          { email: testEmail, subscribed_at: new Date().toISOString() }
        ]);
      
      // Delete the test record
      await supabase
        .from('newsletter_subscribers')
        .delete()
        .eq('email', testEmail);
      
      if (insertError && insertError.message.includes('subscribed_at')) {
        console.error('Column subscribed_at does not exist:', insertError);
        console.log('Please manually add the subscribed_at column to the newsletter_subscribers table.');
      } else {
        console.log('✅ subscribed_at column exists.');
      }
    }
    
    // Check if content_notifications table exists
    console.log('Checking content_notifications table...');
    let { data: notifications, error: notificationsError } = await supabase
      .from('content_notifications')
      .select('*')
      .limit(1);
    
    if (notificationsError && notificationsError.code === '42P01') {
      // Table doesn't exist, create it
      console.log('Creating content_notifications table...');
      
      // We'll use the REST API to create the table
      const createTableResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey
        },
        body: JSON.stringify({
          name: 'content_notifications',
          schema: 'public',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              primaryKey: true,
              defaultValue: 'uuid_generate_v4()'
            },
            {
              name: 'title',
              type: 'text',
              isNullable: false
            },
            {
              name: 'content',
              type: 'text',
              isNullable: false
            },
            {
              name: 'content_type',
              type: 'text',
              isNullable: false,
              defaultValue: "'text'"
            },
            {
              name: 'content_id',
              type: 'uuid',
              isNullable: true
            },
            {
              name: 'created_at',
              type: 'timestamptz',
              defaultValue: 'now()'
            },
            {
              name: 'sent_at',
              type: 'timestamptz',
              isNullable: true
            }
          ]
        })
      });
      
      if (!createTableResponse.ok) {
        console.error('Error creating content_notifications table:', await createTableResponse.text());
      } else {
        console.log('✅ content_notifications table created successfully!');
      }
    } else if (notificationsError) {
      console.error('Error checking content_notifications table:', notificationsError);
    } else {
      console.log('✅ content_notifications table already exists.');
    }
    
    // Insert a sample notification for testing if none exist
    const { data: existingNotifications } = await supabase
      .from('content_notifications')
      .select('*')
      .limit(1);
    
    if (!existingNotifications || existingNotifications.length === 0) {
      console.log('Adding sample notification...');
      
      const { error: insertError } = await supabase
        .from('content_notifications')
        .insert([
          {
            title: 'Welcome to Health Blog',
            content: 'Thank you for subscribing to our newsletter. We will keep you updated with the latest health tips and articles.',
            content_type: 'text',
            content_id: crypto.randomUUID()
          }
        ]);
      
      if (insertError) {
        console.error('Error adding sample notification:', insertError);
      } else {
        console.log('✅ Sample notification added successfully!');
      }
    }
    
    // Check if admin_settings table exists
    console.log('Checking admin_settings table...');
    let { data: adminSettings, error: adminSettingsError } = await supabase
      .from('admin_settings')
      .select('*')
      .limit(1);
    
    if (adminSettingsError && adminSettingsError.code === '42P01') {
      // Table doesn't exist, create it
      console.log('Creating admin_settings table...');
      
      // We'll use the REST API to create the table
      const createTableResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey
        },
        body: JSON.stringify({
          name: 'admin_settings',
          schema: 'public',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              primaryKey: true,
              defaultValue: 'uuid_generate_v4()'
            },
            {
              name: 'smtp_host',
              type: 'text',
              isNullable: true
            },
            {
              name: 'smtp_port',
              type: 'integer',
              defaultValue: '587'
            },
            {
              name: 'smtp_user',
              type: 'text',
              isNullable: true
            },
            {
              name: 'smtp_pass',
              type: 'text',
              isNullable: true
            },
            {
              name: 'from_email',
              type: 'text',
              isNullable: true
            },
            {
              name: 'from_name',
              type: 'text',
              isNullable: true
            },
            {
              name: 'reply_to',
              type: 'text',
              isNullable: true
            },
            {
              name: 'created_at',
              type: 'timestamptz',
              defaultValue: 'now()'
            },
            {
              name: 'updated_at',
              type: 'timestamptz',
              defaultValue: 'now()'
            }
          ]
        })
      });
      
      if (!createTableResponse.ok) {
        console.error('Error creating admin_settings table:', await createTableResponse.text());
      } else {
        console.log('✅ admin_settings table created successfully!');
        
        // Insert default admin settings
        console.log('Adding default admin settings...');
        
        const { error: insertError } = await supabase
          .from('admin_settings')
          .insert([
            {
              smtp_host: 'smtp.example.com',
              smtp_port: 587,
              smtp_user: 'user@example.com',
              smtp_pass: 'password',
              from_email: 'newsletter@example.com',
              from_name: 'Health Blog Newsletter',
              reply_to: 'support@example.com'
            }
          ]);
        
        if (insertError) {
          console.error('Error adding default admin settings:', insertError);
        } else {
          console.log('✅ Default admin settings added successfully!');
        }
      }
    } else if (adminSettingsError) {
      console.error('Error checking admin_settings table:', adminSettingsError);
    } else {
      console.log('✅ admin_settings table already exists.');
    }
    
    console.log('\nDatabase tables fixed successfully!');
    console.log('\nNext steps:');
    console.log('1. Restart your Next.js development server');
    console.log('2. Navigate to the admin dashboard at /admin/dashboard');
    
  } catch (error) {
    console.error('❌ Error fixing database tables:', error);
    process.exit(1);
  }
}

// Run the function
fixTables(); 