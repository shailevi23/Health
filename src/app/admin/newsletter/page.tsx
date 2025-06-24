'use client';

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
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        notification.sent_at 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {notification.sent_at ? 'Sent' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link href={`/admin/newsletter/${notification.id}`} className="text-emerald-600 hover:text-emerald-900 mr-4">
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
}