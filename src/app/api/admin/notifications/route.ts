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
    
    // Get pending notifications
    const { data: pendingNotifications, error: pendingError } = await supabaseAdmin
      .from('content_notifications')
      .select('*')
      .is('sent_at', null)
      .order('created_at', { ascending: false });

    if (pendingError) {
      throw pendingError;
    }

    // Get sent notifications
    const { data: sentNotifications, error: sentError } = await supabaseAdmin
      .from('content_notifications')
      .select('*')
      .not('sent_at', 'is', null)
      .order('sent_at', { ascending: false })
      .limit(20);

    if (sentError) {
      throw sentError;
    }

    return NextResponse.json({
      pending: pendingNotifications || [],
      sent: sentNotifications || []
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 