'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase-client';
import { unsubscribeFromNewsletter, updateSubscriptionPreferences } from '@/lib/newsletter-service';

export default function UnsubscribePage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'idle'>('idle');
  const [preferences, setPreferences] = useState({
    articles: true,
    recipes: true,
    recommendations: true
  });
  const [unsubscribeAll, setUnsubscribeAll] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  useEffect(() => {
    if (email) {
      setStatus('loading');
      
      // Fetch current preferences
      const fetchPreferences = async () => {
        try {
          const { data, error } = await supabase
            .from('newsletter_subscribers')
            .select('preferences')
            .eq('email', email)
            .single();
          
          if (error) throw error;
          
          if (data?.preferences) {
            setPreferences(data.preferences);
          }
          
          setStatus('idle');
        } catch (error) {
          console.error('Error fetching preferences:', error);
          setStatus('error');
          setErrorMessage('Could not find your subscription. Please check your email address.');
        }
      };
      
      fetchPreferences();
    }
  }, [email]);
  
  const handleUnsubscribe = async () => {
    if (!email) return;
    
    setStatus('loading');
    
    try {
      if (unsubscribeAll) {
        // Unsubscribe from all
        const result = await unsubscribeFromNewsletter(email);
        
        if (!result.success) {
          throw new Error(result.message);
        }
      } else {
        // Update preferences
        const result = await updateSubscriptionPreferences(email, preferences);
        
        if (!result.success) {
          throw new Error(result.message);
        }
      }
      
      setStatus('success');
    } catch (error) {
      console.error('Error updating subscription:', error);
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again later.');
    }
  };
  
  const handlePreferenceChange = (key: keyof typeof preferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  if (!email) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Subscription</h1>
          <p className="text-gray-600 mb-6">
            To manage your subscription, please use the link in your email.
          </p>
          <Link href="/" className="block text-center w-full py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
        {status === 'success' ? (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              {unsubscribeAll ? 'Successfully Unsubscribed' : 'Preferences Updated'}
            </h1>
            <p className="text-gray-600 mb-8 text-center">
              {unsubscribeAll 
                ? 'You have been unsubscribed from all Health Life newsletters.' 
                : 'Your newsletter preferences have been updated successfully.'}
            </p>
            <Link href="/" className="block text-center w-full py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
              Return to Home
            </Link>
          </>
        ) : status === 'error' ? (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">Error</h1>
            <p className="text-gray-600 mb-8 text-center">{errorMessage}</p>
            <Link href="/" className="block text-center w-full py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
              Return to Home
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Your Subscription</h1>
            <p className="text-gray-600 mb-6">
              You can choose which types of content you'd like to receive or unsubscribe from all.
            </p>
            
            <div className="mb-8">
              <div className="space-y-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.articles}
                    onChange={() => handlePreferenceChange('articles')}
                    disabled={unsubscribeAll || status === 'loading'}
                    className="h-5 w-5 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span className="text-gray-700">Articles & Blog Posts</span>
                </label>
                
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.recipes}
                    onChange={() => handlePreferenceChange('recipes')}
                    disabled={unsubscribeAll || status === 'loading'}
                    className="h-5 w-5 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span className="text-gray-700">Recipes</span>
                </label>
                
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.recommendations}
                    onChange={() => handlePreferenceChange('recommendations')}
                    disabled={unsubscribeAll || status === 'loading'}
                    className="h-5 w-5 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span className="text-gray-700">Product Recommendations</span>
                </label>
                
                <div className="pt-4 border-t border-gray-200 mt-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={unsubscribeAll}
                      onChange={() => setUnsubscribeAll(!unsubscribeAll)}
                      disabled={status === 'loading'}
                      className="h-5 w-5 text-red-600 rounded focus:ring-red-500"
                    />
                    <span className="text-red-600 font-medium">Unsubscribe from all emails</span>
                  </label>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleUnsubscribe}
              disabled={status === 'loading'}
              className={`w-full py-3 rounded-lg font-medium transition-colors ${
                status === 'loading'
                  ? 'bg-gray-400 text-white cursor-wait'
                  : unsubscribeAll
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {status === 'loading'
                ? 'Processing...'
                : unsubscribeAll
                ? 'Unsubscribe'
                : 'Update Preferences'}
            </button>
          </>
        )}
      </div>
    </div>
  );
} 