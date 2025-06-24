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
    
    // Get custom notification data from request body
    const { title, content, recipients } = await request.json();
    
    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
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

    // Get subscribers based on preferences
    let query = supabaseAdmin
      .from('newsletter_subscribers')
      .select('*');
    
    if (recipients !== 'all') {
      // Filter by specific preference
      const preferenceType = recipients; // 'articles', 'recipes', or 'recommendations'
      query = query.contains('preferences', { [preferenceType]: true });
    }
    
    const { data: subscribers, error: subscribersError } = await query;

    if (subscribersError) {
      throw subscribersError;
    }

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({
        success: true,
        recipientCount: 0,
        message: 'No subscribers found for selected preferences',
      });
    }

    // Send emails to subscribers
    const emailPromises = subscribers.map(async (subscriber) => {
      // Create email content with the custom content
      const emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669;">${title}</h2>
          <div style="margin-top: 20px; color: #4B5563;">
            ${content}
          </div>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #E5E7EB;" />
          <p style="color: #6B7280; font-size: 14px;">
            You're receiving this email because you subscribed to updates from Health Life.
            <br><a href="${process.env.NEXT_PUBLIC_SITE_URL}/unsubscribe?email=${encodeURIComponent(subscriber.email)}" style="color: #059669;">Unsubscribe</a>
          </p>
        </div>
      `;

      // Send email
      return transporter.sendMail({
        from: `"Health Life" <${settings.fromEmail}>`,
        to: subscriber.email,
        subject: title,
        html: emailContent,
      });
    });

    // Wait for all emails to be sent
    await Promise.all(emailPromises);

    // Create a record of this custom newsletter
    await supabaseAdmin
      .from('content_notifications')
      .insert({
        content_type: 'custom',
        content_id: null,
        title,
        excerpt: content.substring(0, 200) + (content.length > 200 ? '...' : ''),
        sent_at: new Date().toISOString(),
      });

    return NextResponse.json({
      success: true,
      recipientCount: subscribers.length,
    });
  } catch (error) {
    console.error('Error sending custom newsletter:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 