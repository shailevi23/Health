'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';

interface EmailSettings {
  id: string;
  smtp_host: string;
  smtp_port: number;
  smtp_user: string;
  smtp_pass: string;
  from_email: string;
  from_name: string;
  reply_to: string;
}

export default function EmailSettingsPage() {
  const [settings, setSettings] = useState<EmailSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch('/api/admin/email-settings', {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch email settings');
        }

        const data = await response.json();
        setSettings(data.settings || {
          smtp_host: '',
          smtp_port: 587,
          smtp_user: '',
          smtp_pass: '',
          from_email: '',
          from_name: '',
          reply_to: '',
        });
      } catch (err) {
        console.error('Error fetching email settings:', err);
        setError('Failed to load email settings');
      } finally {
        setIsLoading(false);
      }
    }

    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [name]: name === 'smtp_port' ? parseInt(value, 10) : value,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/admin/email-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings }),
      });

      if (!response.ok) {
        throw new Error('Failed to save email settings');
      }

      setSuccess('Email settings saved successfully!');
    } catch (err) {
      console.error('Error saving email settings:', err);
      setError('Failed to save email settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Email Settings</h2>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 text-green-600 p-4 rounded-lg">
            {success}
          </div>
        )}
        
        {isLoading ? (
          <div className="flex justify-center p-12">
            <div className="text-emerald-600">Loading email settings...</div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">SMTP Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="smtp_host" className="block text-sm font-medium text-gray-700 mb-1">
                        SMTP Host
                      </label>
                      <input
                        type="text"
                        id="smtp_host"
                        name="smtp_host"
                        value={settings?.smtp_host || ''}
                        onChange={handleChange}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="smtp.example.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="smtp_port" className="block text-sm font-medium text-gray-700 mb-1">
                        SMTP Port
                      </label>
                      <input
                        type="number"
                        id="smtp_port"
                        name="smtp_port"
                        value={settings?.smtp_port || 587}
                        onChange={handleChange}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="587"
                      />
                    </div>
                    <div>
                      <label htmlFor="smtp_user" className="block text-sm font-medium text-gray-700 mb-1">
                        SMTP Username
                      </label>
                      <input
                        type="text"
                        id="smtp_user"
                        name="smtp_user"
                        value={settings?.smtp_user || ''}
                        onChange={handleChange}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="username@example.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="smtp_pass" className="block text-sm font-medium text-gray-700 mb-1">
                        SMTP Password
                      </label>
                      <input
                        type="password"
                        id="smtp_pass"
                        name="smtp_pass"
                        value={settings?.smtp_pass || ''}
                        onChange={handleChange}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Email Sender Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="from_email" className="block text-sm font-medium text-gray-700 mb-1">
                        From Email
                      </label>
                      <input
                        type="email"
                        id="from_email"
                        name="from_email"
                        value={settings?.from_email || ''}
                        onChange={handleChange}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="newsletter@example.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="from_name" className="block text-sm font-medium text-gray-700 mb-1">
                        From Name
                      </label>
                      <input
                        type="text"
                        id="from_name"
                        name="from_name"
                        value={settings?.from_name || ''}
                        onChange={handleChange}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Health Blog Newsletter"
                      />
                    </div>
                    <div>
                      <label htmlFor="reply_to" className="block text-sm font-medium text-gray-700 mb-1">
                        Reply-To Email
                      </label>
                      <input
                        type="email"
                        id="reply_to"
                        name="reply_to"
                        value={settings?.reply_to || ''}
                        onChange={handleChange}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="support@example.com"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}