import { supabase } from './supabase';

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribed_at: string;
  preferences: {
    articles: boolean;
    recipes: boolean;
    recommendations: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface ContentNotification {
  id: string;
  content_type: 'article' | 'recipe' | 'recommendation';
  content_id: string;
  title: string;
  excerpt?: string;
  sent_at?: string;
  created_at: string;
}

export async function subscribeToNewsletter(email: string, preferences?: {
  articles?: boolean;
  recipes?: boolean;
  recommendations?: boolean;
}) {
  try {
    // Use the API endpoint instead of direct Supabase calls
    const response = await fetch('/api/newsletter/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, preferences }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to subscribe');
    }

    return await response.json();
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to subscribe'
    };
  }
}

export async function unsubscribeFromNewsletter(email: string) {
  try {
    const response = await fetch('/api/newsletter/unsubscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to unsubscribe');
    }

    return await response.json();
  } catch (error) {
    console.error('Error unsubscribing from newsletter:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to unsubscribe'
    };
  }
}

export async function updateSubscriptionPreferences(email: string, preferences: {
  articles?: boolean;
  recipes?: boolean;
  recommendations?: boolean;
}) {
  try {
    // Use the API endpoint for consistency
    const response = await fetch('/api/newsletter/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, preferences }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update preferences');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating subscription preferences:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to update preferences'
    };
  }
}

export async function getPendingNotifications() {
  try {
    const { data, error } = await supabase
      .from('content_notifications')
      .select('*')
      .is('sent_at', null)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return data as ContentNotification[];
  } catch (error) {
    console.error('Error fetching pending notifications:', error);
    return [];
  }
}

export async function markNotificationAsSent(notificationId: string) {
  try {
    const { error } = await supabase
      .from('content_notifications')
      .update({ sent_at: new Date().toISOString() })
      .eq('id', notificationId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error marking notification as sent:', error);
    return { success: false, error };
  }
}

export async function getActiveSubscribers(contentType?: 'article' | 'recipe' | 'recommendation') {
  try {
    let query = supabase
      .from('newsletter_subscribers')
      .select('*');
    
    if (contentType) {
      query = query.contains('preferences', { [contentType + 's']: true });
    }
    
    const { data, error } = await query;

    if (error) throw error;

    return data as NewsletterSubscriber[];
  } catch (error) {
    console.error('Error fetching active subscribers:', error);
    return [];
  }
} 