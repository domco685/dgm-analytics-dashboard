'use client';

import { useEffect, useState } from 'react';
import MetricCard from '@/components/MetricCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AdInsights, Campaign } from '@/types';

export default function OverviewPage() {
  const [insights, setInsights] = useState<AdInsights[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [emailMetrics, setEmailMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch Meta Ads insights
      const insightsRes = await fetch('/api/meta/insights?date_preset=last_7d');
      const insightsData = await insightsRes.json();

      // Fetch campaigns
      const campaignsRes = await fetch('/api/meta/campaigns');
      const campaignsData = await campaignsRes.json();

      // Fetch email metrics
      const emailRes = await fetch('/api/klaviyo/metrics');
      const emailData = await emailRes.json();

      setInsights(insightsData.insights || []);
      setCampaigns(campaignsData.campaigns || []);
      setEmailMetrics(emailData.metrics || null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate aggregate metrics
  const totalSpend = insights.reduce((sum, i) => sum + parseFloat(i.spend || '0'), 0);
  const totalImpressions = insights.reduce((sum, i) => sum + parseInt(i.impressions || '0'), 0);
  const totalClicks = insights.reduce((sum, i) => sum + parseInt(i.clicks || '0'), 0);
  const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions * 100).toFixed(2) : '0';
  const activeCampaigns = campaigns.filter(c => c.status === 'ACTIVE').length;

  // Prepare chart data
  const chartData = insights.map(insight => ({
    name: insight.campaign_name || 'Unknown',
    spend: parseFloat(insight.spend || '0'),
    clicks: parseInt(insight.clicks || '0'),
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dgm-gold mx-auto mb-4"></div>
          <p className="text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">❌ {error}</p>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-dgm-gold text-dgm-black rounded-lg font-medium hover:bg-yellow-500 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Overview</h1>
        <p className="text-gray-400">Real-time performance metrics across all channels</p>
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
          title="Total Ad Spend (7d)"
          value={`$${totalSpend.toFixed(2)}`}
          icon="💰"
        />
        <MetricCard
          title="Active Campaigns"
          value={activeCampaigns}
          icon="📊"
        />
        <MetricCard
          title="Total Clicks (7d)"
          value={totalClicks.toLocaleString()}
          icon="👆"
        />
        <MetricCard
          title="Email Signups (7d)"
          value={emailMetrics?.weeklySignups || 0}
          icon="📧"
        />
      </div>

      {/* Campaign Performance Chart */}
      <div className="bg-dgm-gray-dark border border-dgm-gray rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Campaign Performance</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
            <XAxis dataKey="name" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A' }}
              labelStyle={{ color: '#FDB813' }}
            />
            <Legend />
            <Line type="monotone" dataKey="spend" stroke="#FDB813" strokeWidth={2} name="Spend ($)" />
            <Line type="monotone" dataKey="clicks" stroke="#82ca9d" strokeWidth={2} name="Clicks" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Campaign Status Table */}
      <div className="bg-dgm-gray-dark border border-dgm-gray rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Campaign Status</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dgm-gray">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Campaign</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Objective</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Budget</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.slice(0, 10).map((campaign) => (
                <tr key={campaign.id} className="border-b border-dgm-gray hover:bg-dgm-gray transition-colors">
                  <td className="py-3 px-4 text-white">{campaign.name}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        campaign.status === 'ACTIVE'
                          ? 'bg-green-900 text-green-300'
                          : 'bg-gray-700 text-gray-300'
                      }`}
                    >
                      {campaign.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-400">{campaign.objective || 'N/A'}</td>
                  <td className="py-3 px-4 text-right text-white">
                    ${campaign.daily_budget ? (parseFloat(campaign.daily_budget) / 100).toFixed(2) : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
