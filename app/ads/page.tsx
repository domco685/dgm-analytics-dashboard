'use client';

import { useEffect, useState } from 'react';
import { Campaign, AdInsights } from '@/types';

export default function AdsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [insights, setInsights] = useState<{ [key: string]: AdInsights }>({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch campaigns
      const campaignsRes = await fetch('/api/meta/campaigns');
      const campaignsData = await campaignsRes.json();

      // Fetch insights
      const insightsRes = await fetch('/api/meta/insights?date_preset=last_7d');
      const insightsData = await insightsRes.json();

      setCampaigns(campaignsData.campaigns || []);

      // Map insights by campaign_id
      const insightsMap: { [key: string]: AdInsights } = {};
      insightsData.insights?.forEach((insight: AdInsights) => {
        if (insight.campaign_id) {
          insightsMap[insight.campaign_id] = insight;
        }
      });
      setInsights(insightsMap);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCampaignStatus = async (campaignId: string, currentStatus: string) => {
    try {
      setUpdating(campaignId);
      const newStatus = currentStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';

      const response = await fetch(`/api/meta/campaigns/${campaignId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Update local state
        setCampaigns(prev =>
          prev.map(c => (c.id === campaignId ? { ...c, status: newStatus as any } : c))
        );
      }
    } catch (error) {
      console.error('Error updating campaign:', error);
      alert('Failed to update campaign status');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dgm-gold mx-auto mb-4"></div>
          <p className="text-gray-400">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Ad Campaigns</h1>
        <p className="text-gray-400">Manage and monitor your Facebook ad campaigns</p>
        <button
          onClick={fetchData}
          className="mt-4 px-4 py-2 bg-dgm-gray text-white rounded-lg hover:bg-dgm-gray-light transition-colors"
        >
          🔄 Refresh Data
        </button>
      </div>

      {/* Campaigns Table */}
      <div className="bg-dgm-gray-dark border border-dgm-gray rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dgm-gray bg-dgm-gray">
                <th className="text-left py-4 px-4 text-gray-300 font-semibold">Campaign</th>
                <th className="text-center py-4 px-4 text-gray-300 font-semibold">Status</th>
                <th className="text-right py-4 px-4 text-gray-300 font-semibold">Spend (7d)</th>
                <th className="text-right py-4 px-4 text-gray-300 font-semibold">Impressions</th>
                <th className="text-right py-4 px-4 text-gray-300 font-semibold">Clicks</th>
                <th className="text-right py-4 px-4 text-gray-300 font-semibold">CTR</th>
                <th className="text-right py-4 px-4 text-gray-300 font-semibold">CPC</th>
                <th className="text-center py-4 px-4 text-gray-300 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => {
                const insight = insights[campaign.id];
                return (
                  <tr key={campaign.id} className="border-b border-dgm-gray hover:bg-dgm-gray transition-colors">
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-white font-medium">{campaign.name}</p>
                        <p className="text-xs text-gray-500">{campaign.id}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          campaign.status === 'ACTIVE'
                            ? 'bg-green-900 text-green-300'
                            : campaign.status === 'PAUSED'
                            ? 'bg-yellow-900 text-yellow-300'
                            : 'bg-gray-700 text-gray-300'
                        }`}
                      >
                        {campaign.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right text-white font-medium">
                      ${insight ? parseFloat(insight.spend).toFixed(2) : '0.00'}
                    </td>
                    <td className="py-4 px-4 text-right text-gray-400">
                      {insight ? parseInt(insight.impressions).toLocaleString() : '0'}
                    </td>
                    <td className="py-4 px-4 text-right text-gray-400">
                      {insight ? parseInt(insight.clicks).toLocaleString() : '0'}
                    </td>
                    <td className="py-4 px-4 text-right text-gray-400">
                      {insight ? parseFloat(insight.ctr).toFixed(2) : '0.00'}%
                    </td>
                    <td className="py-4 px-4 text-right text-gray-400">
                      ${insight ? parseFloat(insight.cpc).toFixed(2) : '0.00'}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => toggleCampaignStatus(campaign.id, campaign.status)}
                        disabled={updating === campaign.id}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          campaign.status === 'ACTIVE'
                            ? 'bg-yellow-900 text-yellow-300 hover:bg-yellow-800'
                            : 'bg-green-900 text-green-300 hover:bg-green-800'
                        } disabled:opacity-50`}
                      >
                        {updating === campaign.id ? '⏳' : campaign.status === 'ACTIVE' ? '⏸ Pause' : '▶️ Resume'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {campaigns.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No campaigns found. Create your first campaign in the Launcher.
        </div>
      )}
    </div>
  );
}
