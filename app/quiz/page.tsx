'use client';

import { useEffect, useState } from 'react';
import MetricCard from '@/components/MetricCard';

interface FunnelStep {
  step: string;
  count: number;
  dropoff?: number;
}

interface FunnelData {
  campaign: string;
  adSet: string;
  adName: string;
  steps: FunnelStep[];
}

export default function QuizFunnelPage() {
  const [funnelData, setFunnelData] = useState<FunnelData[]>([]);
  const [campaigns, setCampaigns] = useState<string[]>([]);
  const [adSets, setAdSets] = useState<string[]>([]);
  const [adNames, setAdNames] = useState<string[]>([]);
  
  const [selectedCampaign, setSelectedCampaign] = useState<string>('all');
  const [selectedAdSet, setSelectedAdSet] = useState<string>('all');
  const [selectedAdName, setSelectedAdName] = useState<string>('all');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFunnelData();
  }, [selectedCampaign, selectedAdSet, selectedAdName]);

  const fetchFunnelData = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (selectedCampaign !== 'all') params.set('campaign', selectedCampaign);
      if (selectedAdSet !== 'all') params.set('adSet', selectedAdSet);
      if (selectedAdName !== 'all') params.set('adName', selectedAdName);

      const res = await fetch(`/api/funnel/quiz?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to fetch funnel data');

      setFunnelData(data.funnel || []);
      setCampaigns(data.campaigns || []);
      setAdSets(data.adSets || []);
      setAdNames(data.adNames || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch funnel data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate aggregate funnel
  const aggregateFunnel = funnelData.length > 0 ? {
    landing: funnelData.reduce((sum, f) => sum + (f.steps.find(s => s.step === 'landing')?.count || 0), 0),
    q1: funnelData.reduce((sum, f) => sum + (f.steps.find(s => s.step === 'q1')?.count || 0), 0),
    q2: funnelData.reduce((sum, f) => sum + (f.steps.find(s => s.step === 'q2')?.count || 0), 0),
    q3: funnelData.reduce((sum, f) => sum + (f.steps.find(s => s.step === 'q3')?.count || 0), 0),
    q4: funnelData.reduce((sum, f) => sum + (f.steps.find(s => s.step === 'q4')?.count || 0), 0),
    q5: funnelData.reduce((sum, f) => sum + (f.steps.find(s => s.step === 'q5')?.count || 0), 0),
    emailSubmit: funnelData.reduce((sum, f) => sum + (f.steps.find(s => s.step === 'email_submit')?.count || 0), 0),
    lovable: funnelData.reduce((sum, f) => sum + (f.steps.find(s => s.step === 'lovable_view')?.count || 0), 0),
    checkoutInit: funnelData.reduce((sum, f) => sum + (f.steps.find(s => s.step === 'checkout_init')?.count || 0), 0),
    purchase: funnelData.reduce((sum, f) => sum + (f.steps.find(s => s.step === 'purchase')?.count || 0), 0),
  } : null;

  const calculateConversion = (current: number, previous: number) => {
    if (previous === 0) return '0%';
    return ((current / previous) * 100).toFixed(1) + '%';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dgm-gold mx-auto mb-4"></div>
          <p className="text-gray-400">Loading quiz funnel data...</p>
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
            onClick={fetchFunnelData}
            className="px-4 py-2 bg-dgm-gold text-dgm-black rounded-lg font-medium hover:bg-yellow-500 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Quiz Funnel</h1>
          <p className="text-gray-400">Track quiz progression from landing to purchase</p>
        </div>
        <button
          onClick={fetchFunnelData}
          className="px-4 py-2 bg-dgm-gold text-dgm-black rounded-lg font-medium hover:bg-yellow-500 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Campaign</label>
          <select
            value={selectedCampaign}
            onChange={(e) => setSelectedCampaign(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-dgm-gold"
          >
            <option value="all">All Campaigns</option>
            {campaigns.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Ad Set</label>
          <select
            value={selectedAdSet}
            onChange={(e) => setSelectedAdSet(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-dgm-gold"
          >
            <option value="all">All Ad Sets</option>
            {adSets.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Ad Name</label>
          <select
            value={selectedAdName}
            onChange={(e) => setSelectedAdName(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-dgm-gold"
          >
            <option value="all">All Ads</option>
            {adNames.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Funnel Overview */}
      {aggregateFunnel && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Funnel Overview</h2>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="space-y-4">
              {/* Landing */}
              <div className="flex items-center justify-between border-b border-gray-700 pb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-32 text-gray-400 font-medium">Landing</div>
                  <div className="text-2xl font-bold text-white">{aggregateFunnel.landing.toLocaleString()}</div>
                </div>
                <div className="text-sm text-gray-400">100%</div>
              </div>

              {/* Q1 */}
              <div className="flex items-center justify-between border-b border-gray-700 pb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-32 text-gray-400 font-medium">Question 1</div>
                  <div className="text-2xl font-bold text-white">{aggregateFunnel.q1.toLocaleString()}</div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-400">{calculateConversion(aggregateFunnel.q1, aggregateFunnel.landing)}</div>
                  <div className="text-sm text-red-400">-{(aggregateFunnel.landing - aggregateFunnel.q1).toLocaleString()}</div>
                </div>
              </div>

              {/* Q2 */}
              <div className="flex items-center justify-between border-b border-gray-700 pb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-32 text-gray-400 font-medium">Question 2</div>
                  <div className="text-2xl font-bold text-white">{aggregateFunnel.q2.toLocaleString()}</div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-400">{calculateConversion(aggregateFunnel.q2, aggregateFunnel.q1)}</div>
                  <div className="text-sm text-red-400">-{(aggregateFunnel.q1 - aggregateFunnel.q2).toLocaleString()}</div>
                </div>
              </div>

              {/* Q3 */}
              <div className="flex items-center justify-between border-b border-gray-700 pb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-32 text-gray-400 font-medium">Question 3</div>
                  <div className="text-2xl font-bold text-white">{aggregateFunnel.q3.toLocaleString()}</div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-400">{calculateConversion(aggregateFunnel.q3, aggregateFunnel.q2)}</div>
                  <div className="text-sm text-red-400">-{(aggregateFunnel.q2 - aggregateFunnel.q3).toLocaleString()}</div>
                </div>
              </div>

              {/* Q4 */}
              <div className="flex items-center justify-between border-b border-gray-700 pb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-32 text-gray-400 font-medium">Question 4</div>
                  <div className="text-2xl font-bold text-white">{aggregateFunnel.q4.toLocaleString()}</div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-400">{calculateConversion(aggregateFunnel.q4, aggregateFunnel.q3)}</div>
                  <div className="text-sm text-red-400">-{(aggregateFunnel.q3 - aggregateFunnel.q4).toLocaleString()}</div>
                </div>
              </div>

              {/* Q5 */}
              <div className="flex items-center justify-between border-b border-gray-700 pb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-32 text-gray-400 font-medium">Question 5</div>
                  <div className="text-2xl font-bold text-white">{aggregateFunnel.q5.toLocaleString()}</div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-400">{calculateConversion(aggregateFunnel.q5, aggregateFunnel.q4)}</div>
                  <div className="text-sm text-red-400">-{(aggregateFunnel.q4 - aggregateFunnel.q5).toLocaleString()}</div>
                </div>
              </div>

              {/* Email Submit */}
              <div className="flex items-center justify-between border-b border-gray-700 pb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-32 text-gray-400 font-medium">Email Submit</div>
                  <div className="text-2xl font-bold text-white">{aggregateFunnel.emailSubmit.toLocaleString()}</div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-400">{calculateConversion(aggregateFunnel.emailSubmit, aggregateFunnel.q5)}</div>
                  <div className="text-sm text-red-400">-{(aggregateFunnel.q5 - aggregateFunnel.emailSubmit).toLocaleString()}</div>
                </div>
              </div>

              {/* Lovable Page View */}
              <div className="flex items-center justify-between border-b border-gray-700 pb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-32 text-gray-400 font-medium">Lovable View</div>
                  <div className="text-2xl font-bold text-white">{aggregateFunnel.lovable.toLocaleString()}</div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-400">{calculateConversion(aggregateFunnel.lovable, aggregateFunnel.emailSubmit)}</div>
                  <div className="text-sm text-red-400">-{(aggregateFunnel.emailSubmit - aggregateFunnel.lovable).toLocaleString()}</div>
                </div>
              </div>

              {/* Checkout Initiated */}
              <div className="flex items-center justify-between border-b border-gray-700 pb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-32 text-gray-400 font-medium">Checkout Init</div>
                  <div className="text-2xl font-bold text-white">{aggregateFunnel.checkoutInit.toLocaleString()}</div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-400">{calculateConversion(aggregateFunnel.checkoutInit, aggregateFunnel.lovable)}</div>
                  <div className="text-sm text-red-400">-{(aggregateFunnel.lovable - aggregateFunnel.checkoutInit).toLocaleString()}</div>
                </div>
              </div>

              {/* Purchase */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-32 text-gray-400 font-medium">Purchase</div>
                  <div className="text-2xl font-bold text-dgm-gold">{aggregateFunnel.purchase.toLocaleString()}</div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-dgm-gold">{calculateConversion(aggregateFunnel.purchase, aggregateFunnel.checkoutInit)}</div>
                  <div className="text-sm text-red-400">-{(aggregateFunnel.checkoutInit - aggregateFunnel.purchase).toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Overall Conversion */}
            <div className="mt-6 pt-6 border-t border-gray-700">
              <div className="flex justify-between items-center">
                <div className="text-gray-400 font-medium">Overall Conversion (Landing → Purchase)</div>
                <div className="text-2xl font-bold text-dgm-gold">
                  {calculateConversion(aggregateFunnel.purchase, aggregateFunnel.landing)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No Data */}
      {!aggregateFunnel && (
        <div className="bg-gray-800 rounded-lg p-12 text-center">
          <p className="text-gray-400 text-lg">No funnel data available for selected filters</p>
        </div>
      )}
    </div>
  );
}
