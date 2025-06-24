'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface NewsletterSubscribeProps {
  buttonText?: string;
  className?: string;
}

export default function NewsletterSubscribe({ 
  buttonText = "Subscribe", 
  className = "justify-center max-w-lg mx-auto"
}: NewsletterSubscribeProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email }]);

      if (error) throw error;

      setStatus('success');
      setMessage('Thank you for subscribing!');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
      console.error('Newsletter subscription error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row gap-4 ${className}`}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="flex-grow px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
        required
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="px-6 py-2 bg-white text-primary-600 font-semibold rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50"
      >
        {status === 'loading' ? 'Subscribing...' : buttonText}
      </button>
      {message && (
        <p className={`mt-2 text-sm ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
    </form>
  );
} 