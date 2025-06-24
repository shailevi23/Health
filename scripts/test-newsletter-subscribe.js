require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Test email address
const testEmail = 'test@example.com';

async function testSubscription() {
  try {
    console.log(`Testing subscription for ${testEmail}...`);
    
    // First, check if the newsletter_subscribers table exists
    const { data: tables, error: tablesError } = await supabaseAdmin
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', 'newsletter_subscribers');
    
    if (tablesError) {
      throw tablesError;
    }
    
    if (!tables || tables.length === 0) {
      console.error('❌ newsletter_subscribers table does not exist!');
      console.log('Please run: npm run newsletter:setup');
      process.exit(1);
    }
    
    console.log('✅ newsletter_subscribers table exists');
    
    // Check if test email already exists
    const { data: existingSubscriber, error: lookupError } = await supabaseAdmin
      .from('newsletter_subscribers')
      .select('*')
      .eq('email', testEmail)
      .maybeSingle();
    
    if (lookupError) {
      throw lookupError;
    }
    
    if (existingSubscriber) {
      console.log('✅ Test subscriber already exists, deleting for fresh test...');
      
      // Delete the existing subscriber
      const { error: deleteError } = await supabaseAdmin
        .from('newsletter_subscribers')
        .delete()
        .eq('email', testEmail);
      
      if (deleteError) {
        throw deleteError;
      }
      
      console.log('✅ Existing test subscriber deleted');
    }
    
    // Insert test subscriber
    console.log('Inserting test subscriber...');
    const { error: insertError } = await supabaseAdmin
      .from('newsletter_subscribers')
      .insert([
        { 
          email: testEmail,
          subscribed_at: new Date().toISOString(),
          preferences: {
            articles: true,
            recipes: true,
            recommendations: true
          }
        }
      ]);
    
    if (insertError) {
      throw insertError;
    }
    
    console.log('✅ Test subscriber inserted successfully');
    
    // Verify the subscriber was inserted
    const { data: verifySubscriber, error: verifyError } = await supabaseAdmin
      .from('newsletter_subscribers')
      .select('*')
      .eq('email', testEmail)
      .single();
    
    if (verifyError) {
      throw verifyError;
    }
    
    console.log('✅ Subscriber verification successful');
    console.log('Subscriber data:', verifySubscriber);
    
    // Clean up - delete the test subscriber
    console.log('Cleaning up - deleting test subscriber...');
    const { error: cleanupError } = await supabaseAdmin
      .from('newsletter_subscribers')
      .delete()
      .eq('email', testEmail);
    
    if (cleanupError) {
      throw cleanupError;
    }
    
    console.log('✅ Test subscriber deleted');
    console.log('✅ All tests passed! Newsletter subscription is working correctly.');
    
  } catch (error) {
    console.error('❌ Error testing newsletter subscription:', error);
    process.exit(1);
  }
}

testSubscription(); 