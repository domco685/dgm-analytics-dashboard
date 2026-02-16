'use client';

import { useEffect, useState } from 'react';
import MetricCard from '@/components/MetricCard';
import { EmailMetrics } from '@/types';
import { format } from 'date-fns';

export default function EmailPage() {
  const [metrics, setMetrics] = useState<EmailMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/klaviyo/metrics');
      const data = await response.json();
      setMetrics(data.metrics);
    } catch (error) {
      console.error('Error fetching email metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dgm-gold mx-auto mb-4"></div>
          <p className="text-gray-400">Loading email metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Email Analytics</h1>
        <p className="text-gray-400">Track email signups and list growth from Klaviyo</p>
        <button
          onClick={fetchData}
          className="mt-4 px-4 py-2 bg-dgm-gray text-white rounded-lg hover:bg-dgm-gray-light transition-colors"
        >
          🔄 Refresh Data
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total List Size"
          value={metrics?.listSize || 0}
          icon="📊"
        />
        <MetricCard
          title="Total Signups"
          value={metrics?.totalSignups || 0}
          icon="✍️"
        />
        <MetricCard
          title="Signups (24h)"
          value={metrics?.dailySignups || 0}
          icon="📅"
        />
        <MetricCard
          title="Signups (7d)"
          value={metrics?.weeklySignups || 0}
          icon="📈"
        />
      </div>

      {/* Recent Signups Table */}
      <div className="bg-dgm-gray-dark border border-dgm-gray rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Recent Signups</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dgm-gray">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Email</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Name</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Source Page</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {metrics?.recentSignups?.map((profile) => (
                <tr key={profile.id} className="border-b border-dgm-gray hover:bg-dgm-gray transition-colors">
                  <td className="py-3 px-4 text-white">{profile.attributes.email}</td>
                  <td className="py-3 px-4 text-gray-400">
                    {profile.attributes.first_name || profile.attributes.last_name
                      ? `${profile.attributes.first_name || ''} ${profile.attributes.last_name || ''}`.trim()
                      : 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-gray-400">
                    {profile.attributes.properties?.source_page || 'Unknown'}
                  </td>
                  <td className="py-3 px-4 text-gray-400">
                    {profile.attributes.created
                      ? format(new Date(profile.attributes.created), 'MMM d, yyyy h:mm a')
                      : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {(!metrics?.recentSignups || metrics.recentSignups.length === 0) && (
          <div className="text-center py-8 text-gray-500">
            No recent signups found.
          </div>
        )}
      </div>
    </div>
  );
}
