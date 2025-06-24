const fs = require('fs');
const path = require('path');

console.log('Fixing UTF-8 encoding issues in admin pages...');

// Path to the files with encoding issues
const dashboardPagePath = path.join(process.cwd(), 'src', 'app', 'admin', 'dashboard', 'page.tsx');
const newsletterPagePath = path.join(process.cwd(), 'src', 'app', 'admin', 'newsletter', 'page.tsx');
const subscribersPagePath = path.join(process.cwd(), 'src', 'app', 'admin', 'subscribers', 'page.tsx');
const emailSettingsPagePath = path.join(process.cwd(), 'src', 'app', 'admin', 'email-settings', 'page.tsx');

// Create the fixed content for dashboard page with proper UTF-8 encoding
const fixedDashboardContent = `'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import Link from 'next/link';

interface DashboardStats {
  totalSubscribers: number;
  pendingNotifications: number;
  sentNotifications: number;
  recentSubscribers: Array<{
    id: string;
    email: string;
    subscribed_at: string;
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await fetch('/api/admin/dashboard', {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            {error}
          </div>
        )}
        
        {isLoading ? (
          <div className="flex justify-center p-12">
            <div className="text-emerald-600">Loading dashboard data...</div>
          </div>
        ) : stats ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-600">Total Subscribers</h3>
                <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.totalSubscribers}</p>
                <Link 
                  href="/admin/subscribers" 
                  className="text-sm text-emerald-600 hover:underline mt-4 inline-block"
                >
                  View all subscribers →
                </Link>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-600">Pending Notifications</h3>
                <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.pendingNotifications}</p>
                <Link 
                  href="/admin/newsletter" 
                  className="text-sm text-emerald-600 hover:underline mt-4 inline-block"
                >
                  Manage newsletter →
                </Link>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-600">Sent Notifications</h3>
                <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.sentNotifications}</p>
              </div>
            </div>
            
            {/* Recent Subscribers */}
            <div className="bg-white p-6 rounded-lg shadow mt-6">
              <h3 className="text-lg font-medium text-gray-600 mb-4">Recent Subscribers</h3>
              
              {stats.recentSubscribers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {stats.recentSubscribers.map((subscriber) => (
                        <tr key={subscriber.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{subscriber.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(subscriber.subscribed_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">No subscribers yet.</p>
              )}
              
              <div className="mt-4">
                <Link 
                  href="/admin/subscribers" 
                  className="text-sm text-emerald-600 hover:underline"
                >
                  View all subscribers →
                </Link>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </AdminLayout>
  );
}`;

// Create the fixed content for newsletter page with proper UTF-8 encoding
const fixedNewsletterContent = `'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import Link from 'next/link';

interface Notification {
  id: string;
  title: string;
  content: string;
  created_at: string;
  sent_at: string | null;
}

export default function AdminNewsletter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState('');

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const response = await fetch('/api/admin/notifications', {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }

        const data = await response.json();
        setNotifications(data.notifications || []);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError('Failed to load notifications');
      } finally {
        setIsLoading(false);
      }
    }

    fetchNotifications();
  }, []);

  const handleSendNotification = async (id: string) => {
    setIsSending(true);
    setSendSuccess('');
    setError('');
    
    try {
      const response = await fetch('/api/admin/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error('Failed to send notification');
      }

      // Update the notification status in the UI
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, sent_at: new Date().toISOString() } 
            : notification
        )
      );
      
      setSendSuccess('Notification sent successfully!');
    } catch (err) {
      console.error('Error sending notification:', err);
      setError('Failed to send notification');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Newsletter Management</h2>
          <Link 
            href="/admin/newsletter/create" 
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md"
          >
            Create New Newsletter
          </Link>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            {error}
          </div>
        )}
        
        {sendSuccess && (
          <div className="bg-green-50 text-green-600 p-4 rounded-lg">
            {sendSuccess}
          </div>
        )}
        
        {isLoading ? (
          <div className="flex justify-center p-12">
            <div className="text-emerald-600">Loading notifications...</div>
          </div>
        ) : notifications.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <tr key={notification.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{notification.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(notification.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={\`px-2 inline-flex text-xs leading-5 font-semibold rounded-full \${
                        notification.sent_at 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }\`}>
                        {notification.sent_at ? 'Sent' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link href={\`/admin/newsletter/\${notification.id}\`} className="text-emerald-600 hover:text-emerald-900 mr-4">
                        View
                      </Link>
                      {!notification.sent_at && (
                        <button
                          onClick={() => handleSendNotification(notification.id)}
                          disabled={isSending}
                          className="text-emerald-600 hover:text-emerald-900 disabled:opacity-50"
                        >
                          {isSending ? 'Sending...' : 'Send Now'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-gray-500 mb-4">No newsletter notifications found.</p>
            <p>
              <Link 
                href="/admin/newsletter/create" 
                className="text-emerald-600 hover:underline"
              >
                Create your first newsletter
              </Link>
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}`;

// Create the fixed content for subscribers page with proper UTF-8 encoding
const fixedSubscribersContent = `'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';

interface Subscriber {
  id: string;
  email: string;
  subscribed_at: string;
  status: 'active' | 'unsubscribed';
}

export default function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchSubscribers() {
      try {
        const response = await fetch('/api/admin/subscribers', {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch subscribers');
        }

        const data = await response.json();
        setSubscribers(data.subscribers || []);
      } catch (err) {
        console.error('Error fetching subscribers:', err);
        setError('Failed to load subscribers');
      } finally {
        setIsLoading(false);
      }
    }

    fetchSubscribers();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Subscribers Management</h2>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            {error}
          </div>
        )}
        
        {isLoading ? (
          <div className="flex justify-center p-12">
            <div className="text-emerald-600">Loading subscribers...</div>
          </div>
        ) : subscribers.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b">
              <p className="text-gray-500">Total subscribers: {subscribers.length}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subscribed Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {subscribers.map((subscriber) => (
                    <tr key={subscriber.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{subscriber.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(subscriber.subscribed_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={\`px-2 inline-flex text-xs leading-5 font-semibold rounded-full \${
                          subscriber.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }\`}>
                          {subscriber.status === 'active' ? 'Active' : 'Unsubscribed'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-gray-500">No subscribers found.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}`;

// Create the fixed content for email settings page with proper UTF-8 encoding
const fixedEmailSettingsContent = `'use client';

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
}`;

try {
  // Write the fixed content to the files with UTF-8 encoding
  fs.writeFileSync(dashboardPagePath, fixedDashboardContent, { encoding: 'utf8' });
  console.log('✅ Fixed UTF-8 encoding in dashboard page successfully!');
  
  fs.writeFileSync(newsletterPagePath, fixedNewsletterContent, { encoding: 'utf8' });
  console.log('✅ Fixed UTF-8 encoding in newsletter page successfully!');
  
  fs.writeFileSync(subscribersPagePath, fixedSubscribersContent, { encoding: 'utf8' });
  console.log('✅ Fixed UTF-8 encoding in subscribers page successfully!');
  
  fs.writeFileSync(emailSettingsPagePath, fixedEmailSettingsContent, { encoding: 'utf8' });
  console.log('✅ Fixed UTF-8 encoding in email-settings page successfully!');
  
  console.log('\nNext steps:');
  console.log('1. Restart your Next.js development server');
} catch (error) {
  console.error('❌ Error fixing UTF-8 encoding:', error);
}