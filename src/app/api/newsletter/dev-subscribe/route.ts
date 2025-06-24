import { NextResponse } from 'next/server';

// In-memory storage for development only
const subscribers = new Map<string, {
  email: string;
  subscribed_at: string;
  preferences: {
    articles: boolean;
    recipes: boolean;
    recommendations: boolean;
  };
}>();

export async function POST(request: Request) {
  console.log('Development newsletter subscription API called');
  
  try {
    // Parse the request body
    let email, preferences;
    try {
      const body = await request.json();
      email = body.email;
      preferences = body.preferences;
      console.log('Received subscription request for:', email);
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json(
        { success: false, message: 'Invalid request format' },
        { status: 400 }
      );
    }

    if (!email) {
      console.error('Missing email in request');
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingSubscriber = subscribers.get(email);

    if (existingSubscriber) {
      console.log('Subscriber already exists, updating preferences if provided');
      // Update preferences if provided
      if (preferences) {
        subscribers.set(email, {
          ...existingSubscriber,
          preferences: {
            ...existingSubscriber.preferences,
            ...preferences
          }
        });
      }
      
      return NextResponse.json({
        success: true,
        message: 'Subscription updated',
        isNew: false
      });
    }

    // Insert new subscriber
    console.log('Inserting new subscriber');
    subscribers.set(email, {
      email,
      subscribed_at: new Date().toISOString(),
      preferences: {
        articles: preferences?.articles ?? true,
        recipes: preferences?.recipes ?? true,
        recommendations: preferences?.recommendations ?? true
      }
    });

    console.log('Subscription successful');
    console.log('Current subscribers:', Array.from(subscribers.keys()));
    
    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed',
      isNew: true
    });
  } catch (error) {
    console.error('Unhandled error in development newsletter subscription API:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'An unexpected error occurred',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 