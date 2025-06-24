import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

// Initialize Supabase client with admin privileges
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    // Check if user is authenticated as admin
    // In a real app, you would check the session here
    
    // Get notification ID from query params
    const { searchParams } = new URL(request.url);
    const notificationId = searchParams.get('id');
    
    if (!notificationId) {
      return NextResponse.json({ error: 'Notification ID is required' }, { status: 400 });
    }

    // Get notification details
    const { data: notification, error: notificationError } = await supabaseAdmin
      .from('content_notifications')
      .select('*')
      .eq('id', notificationId)
      .single();

    if (notificationError || !notification) {
      throw notificationError || new Error('Notification not found');
    }

    // Get email settings
    const { data: emailSettings, error: settingsError } = await supabaseAdmin
      .from('admin_settings')
      .select('*')
      .eq('key', 'email_settings')
      .single();

    if (settingsError) {
      // If settings don't exist yet, return an error
      return NextResponse.json({ error: 'Email settings not configured' }, { status: 400 });
    }

    const settings = emailSettings.value;

    // Configure email transporter
    const transporter = nodemailer.createTransport({
      host: settings.host,
      port: parseInt(settings.port || '587'),
      secure: settings.secure,
      auth: {
        user: settings.user,
        pass: settings.password,
      },
    });

    // Get subscribers based on content type
    const { data: subscribers, error: subscribersError } = await supabaseAdmin
      .from('newsletter_subscribers')
      .select('*')
      .contains('preferences', { 
        [notification.content_type + 's']: true 
      });

    if (subscribersError) {
      throw subscribersError;
    }

    if (!subscribers || subscribers.length === 0) {
      // Mark as sent even if no subscribers
      await supabaseAdmin
        .from('content_notifications')
        .update({ sent_at: new Date().toISOString() })
        .eq('id', notification.id);
      
      return NextResponse.json({
        success: true,
        recipientCount: 0,
        message: 'No subscribers for this content type',
      });
    }

    // Get content details
    let contentTable;
    switch (notification.content_type) {
      case 'article':
        contentTable = 'blog_posts';
        break;
      case 'recipe':
        contentTable = 'recipes';
        break;
      case 'recommendation':
        contentTable = 'affiliate_products';
        break;
      default:
        throw new Error(`Unknown content type: ${notification.content_type}`);
    }

    const { data: contentDetails, error: contentError } = await supabaseAdmin
      .from(contentTable)
      .select('*')
      .eq('id', notification.content_id)
      .single();

    if (contentError || !contentDetails) {
      throw contentError || new Error('Content not found');
    }

    // Send emails to subscribers
    const emailPromises = subscribers.map(async (subscriber) => {
      // Create email content
      const contentTypeReadable = notification.content_type.charAt(0).toUpperCase() + notification.content_type.slice(1);
      const contentUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/${notification.content_type === 'article' ? 'blog' : notification.content_type + 's'}/${contentDetails.slug}`;
      
      const emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669;">New ${contentTypeReadable} Published!</h2>
          <h3 style="margin-top: 20px;">${notification.title}</h3>
          ${notification.excerpt ? `<p style="color: #4B5563;">${notification.excerpt}</p>` : ''}
          <a href="${contentUrl}" style="display: inline-block; background-color: #059669; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px;">Read More</a>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #E5E7EB;" />
          <p style="color: #6B7280; font-size: 14px;">
            You're receiving this email because you subscribed to ${contentTypeReadable} updates from Health Life.
            <br><a href="${process.env.NEXT_PUBLIC_SITE_URL}/unsubscribe?email=${encodeURIComponent(subscriber.email)}" style="color: #059669;">Unsubscribe</a>
          </p>
        </div>
      `;

      // Send email
      return transporter.sendMail({
        from: `"Health Life" <${settings.fromEmail}>`,
        to: subscriber.email,
        subject: `New ${contentTypeReadable}: ${notification.title}`,
        html: emailContent,
      });
    });

    // Wait for all emails to be sent
    await Promise.all(emailPromises);

    // Mark notification as sent
    await supabaseAdmin
      .from('content_notifications')
      .update({ sent_at: new Date().toISOString() })
      .eq('id', notification.id);

    return NextResponse.json({
      success: true,
      recipientCount: subscribers.length,
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 