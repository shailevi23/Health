import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with admin privileges for server-side operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if email exists
    const { data: existingSubscriber, error: lookupError } = await supabaseAdmin
      .from('newsletter_subscribers')
      .select('id')
      .eq('email', email)
      .single();

    if (lookupError && lookupError.code !== 'PGRST116') {
      console.error('Error checking for existing subscriber:', lookupError);
      return NextResponse.json(
        { success: false, message: 'Database error while checking subscription' },
        { status: 500 }
      );
    }

    if (!existingSubscriber) {
      // Already unsubscribed or never subscribed
      return NextResponse.json({
        success: true,
        message: 'Email not found in subscription list',
        alreadyUnsubscribed: true
      });
    }

    // Delete the subscriber
    const { error: deleteError } = await supabaseAdmin
      .from('newsletter_subscribers')
      .delete()
      .eq('email', email);

    if (deleteError) {
      console.error('Error unsubscribing:', deleteError);
      return NextResponse.json(
        { success: false, message: 'Failed to unsubscribe' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed'
    });
  } catch (error) {
    console.error('Error in newsletter unsubscribe API:', error);
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 