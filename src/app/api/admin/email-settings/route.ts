import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with admin privileges
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  try {
    // Check if user is authenticated as admin
    // In a real app, you would check the session here
    
    // Get email settings from database
    const { data, error } = await supabaseAdmin
      .from('admin_settings')
      .select('*')
      .eq('key', 'email_settings')
      .single();

    if (error) {
      // If settings don't exist yet, return default values
      if (error.code === 'PGRST116') {
        return NextResponse.json({
          host: '',
          port: '',
          secure: false,
          user: '',
          password: '',
          fromEmail: '',
          apiKey: ''
        });
      }
      throw error;
    }

    return NextResponse.json(data.value);
  } catch (error) {
    console.error('Error fetching email settings:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Check if user is authenticated as admin
    // In a real app, you would check the session here
    
    const settings = await request.json();
    
    // Validate required fields
    if (!settings.host || !settings.port || !settings.user || !settings.password || !settings.fromEmail || !settings.apiKey) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Check if settings already exist
    const { data, error: fetchError } = await supabaseAdmin
      .from('admin_settings')
      .select('*')
      .eq('key', 'email_settings')
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    let result;
    
    if (data) {
      // Update existing settings
      result = await supabaseAdmin
        .from('admin_settings')
        .update({ value: settings })
        .eq('key', 'email_settings');
    } else {
      // Create new settings
      result = await supabaseAdmin
        .from('admin_settings')
        .insert({ key: 'email_settings', value: settings });
    }

    if (result.error) {
      throw result.error;
    }

    // Update environment variables for the current session
    process.env.EMAIL_SERVER_HOST = settings.host;
    process.env.EMAIL_SERVER_PORT = settings.port;
    process.env.EMAIL_SERVER_USER = settings.user;
    process.env.EMAIL_SERVER_PASSWORD = settings.password;
    process.env.EMAIL_FROM = settings.fromEmail;
    process.env.NEWSLETTER_API_KEY = settings.apiKey;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving email settings:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 