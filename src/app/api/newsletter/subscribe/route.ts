import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Check if email already exists
    const { data: existingSubscriber } = await supabase
      .from('newsletter_subscribers')
      .select('id, confirmed')
      .eq('email', email)
      .single();

    if (existingSubscriber) {
      if (existingSubscriber.confirmed) {
        return NextResponse.json(
          { message: 'You are already subscribed to our newsletter' },
          { status: 400 }
        );
      } else {
        // If not confirmed, allow resubscription
        await supabase
          .from('newsletter_subscribers')
          .update({ updated_at: new Date().toISOString() })
          .eq('email', email);

        return NextResponse.json({
          message: 'Please check your email to confirm your subscription'
        });
      }
    }

    // Insert new subscriber
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert([
        {
          email,
          confirmed: false,
          subscribed_at: new Date().toISOString(),
        },
      ]);

    if (error) {
      console.error('Error inserting subscriber:', error);
      throw new Error('Failed to subscribe');
    }

    // TODO: Send confirmation email (implement in a separate PR)

    return NextResponse.json({
      message: 'Please check your email to confirm your subscription'
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { message: 'Failed to subscribe to newsletter' },
      { status: 500 }
    );
  }
} 