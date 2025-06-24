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
    // For this example, we'll use the hardcoded admin credentials
    
    // Get total subscribers
    const { count: totalSubscribers, error: subscribersError } = await supabaseAdmin
      .from('newsletter_subscribers')
      .select('*', { count: 'exact', head: true });

    if (subscribersError) {
      throw subscribersError;
    }

    // Get pending notifications
    const { data: pendingNotifications, error: pendingError } = await supabaseAdmin
      .from('content_notifications')
      .select('*', { count: 'exact' })
      .is('sent_at', null);

    if (pendingError) {
      throw pendingError;
    }

    // Get sent notifications
    const { data: sentNotifications, error: sentError } = await supabaseAdmin
      .from('content_notifications')
      .select('*', { count: 'exact' })
      .not('sent_at', 'is', null);

    if (sentError) {
      throw sentError;
    }

    // Get recent subscribers
    const { data: recentSubscribers, error: recentError } = await supabaseAdmin
      .from('newsletter_subscribers')
      .select('id, email, subscribed_at')
      .order('subscribed_at', { ascending: false })
      .limit(5);

    if (recentError) {
      throw recentError;
    }

    return NextResponse.json({
      totalSubscribers: totalSubscribers || 0,
      pendingNotifications: pendingNotifications?.length || 0,
      sentNotifications: sentNotifications?.length || 0,
      recentSubscribers: recentSubscribers || []
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 