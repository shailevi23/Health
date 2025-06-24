'use client';

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
}