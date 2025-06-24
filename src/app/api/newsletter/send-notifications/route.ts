import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

// Initialize Supabase client with admin privileges
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
  secure: process.env.EMAIL_SERVER_PORT === '465',
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function POST(request: Request) {
  try {
    // Verify API key for security
    const { searchParams } = new URL(request.url);
    const apiKey = searchParams.get('apiKey');
    
    if (apiKey !== process.env.NEWSLETTER_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get pending notifications
    const { data: notifications, error: notificationsError } = await supabaseAdmin
      .from('content_notifications')
      .select('*')
      .is('sent_at', null)
      .order('created_at', { ascending: true });

    if (notificationsError) {
      throw notificationsError;
    }

    if (!notifications || notifications.length === 0) {
      return NextResponse.json({ message: 'No pending notifications' });
    }

    // Process each notification
    const results = await Promise.all(
      notifications.map(async (notification) => {
        try {
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
            
            return {
              notificationId: notification.id,
              status: 'skipped',
              message: 'No subscribers for this content type',
            };
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
              from: `"Health Life" <${process.env.EMAIL_FROM}>`,
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

          return {
            notificationId: notification.id,
            status: 'sent',
            recipientCount: subscribers.length,
          };
        } catch (error) {
          console.error(`Error processing notification ${notification.id}:`, error);
          return {
            notificationId: notification.id,
            status: 'error',
            error: error instanceof Error ? error.message : String(error),
          };
        }
      })
    );

    return NextResponse.json({ 
      success: true, 
      processed: results.length,
      results 
    });
  } catch (error) {
    console.error('Error sending notifications:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 