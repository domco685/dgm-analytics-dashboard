'use client';

import { useState } from 'react';

const advertorialPages = [
  'burnout-my-story',
  'burnout-case-study',
  'identity-shift',
  'founders-guide',
];

const objectives = [
  'OUTCOME_TRAFFIC',
  'OUTCOME_ENGAGEMENT',
  'OUTCOME_LEADS',
  'OUTCOME_SALES',
];

export default function LauncherPage() {
  const [campaignName, setCampaignName] = useState('');
  const [objective, setObjective] = useState('OUTCOME_TRAFFIC');
  const [dailyBudget, setDailyBudget] = useState('50');
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handlePageToggle = (page: string) => {
    setSelectedPages(prev =>
      prev.includes(page) ? prev.filter(p => p !== page) : [...prev, page]
    );
  };

  const handleLaunch = async () => {
    if (!campaignName.trim()) {
      alert('Please enter a campaign name');
      return;
    }

    if (selectedPages.length === 0) {
      alert('Please select at least one landing page');
      return;
    }

    try {
      setCreating(true);
      setResult(null);

      // Create campaign
      const campaignRes = await fetch('/api/meta/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: campaignName,
          objective: objective,
          status: 'PAUSED',
        }),
      });

      if (!campaignRes.ok) {
        throw new Error('Failed to create campaign');
      }

      const campaignData = await campaignRes.json();
      const campaignId = campaignData.campaign.id;

      // Create ad sets for each selected page
      const adSetPromises = selectedPages.map(page =>
        fetch('/api/meta/adsets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            campaign_id: campaignId,
            name: `${campaignName} - ${page}`,
            daily_budget: parseFloat(dailyBudget),
            targeting: {
              geo_locations: { countries: ['US'] },
              age_min: 25,
              age_max: 65,
            },
          }),
        })
      );

      await Promise.all(adSetPromises);

      setResult({
        success: true,
        message: `✅ Campaign "${campaignName}" created successfully with ${selectedPages.length} ad sets!`,
      });

      // Reset form
      setCampaignName('');
      setSelectedPages([]);
      setDailyBudget('50');
    } catch (error: any) {
      setResult({
        success: false,
        message: `❌ Error: ${error.message}`,
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Campaign Launcher 🚀</h1>
        <p className="text-gray-400">Create new ad campaigns with multiple ad sets in one click</p>
      </div>

      {/* Form */}
      <div className="bg-dgm-gray-dark border border-dgm-gray rounded-lg p-6 mb-6">
        {/* Campaign Name */}
        <div className="mb-6">
          <label className="block text-white font-medium mb-2">Campaign Name</label>
          <input
            type="text"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            placeholder="e.g., DGM Launch - Q1 2026"
            className="w-full px-4 py-3 bg-dgm-gray border border-dgm-gray-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-dgm-gold"
          />
        </div>

        {/* Objective */}
        <div className="mb-6">
          <label className="block text-white font-medium mb-2">Campaign Objective</label>
          <select
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            className="w-full px-4 py-3 bg-dgm-gray border border-dgm-gray-light rounded-lg text-white focus:outline-none focus:border-dgm-gold"
          >
            {objectives.map(obj => (
              <option key={obj} value={obj}>
                {obj.replace('OUTCOME_', '')}
              </option>
            ))}
          </select>
        </div>

        {/* Daily Budget */}
        <div className="mb-6">
          <label className="block text-white font-medium mb-2">Daily Budget per Ad Set ($)</label>
          <input
            type="number"
            value={dailyBudget}
            onChange={(e) => setDailyBudget(e.target.value)}
            placeholder="50"
            min="1"
            className="w-full px-4 py-3 bg-dgm-gray border border-dgm-gray-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-dgm-gold"
          />
          <p className="text-xs text-gray-500 mt-1">
            Total daily budget: ${parseFloat(dailyBudget || '0') * selectedPages.length}
          </p>
        </div>

        {/* Landing Pages */}
        <div className="mb-6">
          <label className="block text-white font-medium mb-2">Select Landing Pages</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {advertorialPages.map(page => (
              <label
                key={page}
                className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedPages.includes(page)
                    ? 'border-dgm-gold bg-dgm-gray'
                    : 'border-dgm-gray-light bg-dgm-gray hover:border-dgm-gray'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedPages.includes(page)}
                  onChange={() => handlePageToggle(page)}
                  className="w-5 h-5 text-dgm-gold focus:ring-dgm-gold"
                />
                <span className="text-white">{page}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Launch Button */}
        <button
          onClick={handleLaunch}
          disabled={creating}
          className="w-full py-4 bg-dgm-gold text-dgm-black rounded-lg font-bold text-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {creating ? '⏳ Creating Campaign...' : '🚀 Launch Campaign'}
        </button>
      </div>

      {/* Result Message */}
      {result && (
        <div
          className={`p-4 rounded-lg ${
            result.success ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
          }`}
        >
          {result.message}
        </div>
      )}

      {/* Preview */}
      {selectedPages.length > 0 && (
        <div className="bg-dgm-gray-dark border border-dgm-gray rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-3">Campaign Preview</h3>
          <div className="space-y-2">
            <p className="text-gray-400">
              <span className="text-white font-medium">Campaign:</span> {campaignName || 'Untitled'}
            </p>
            <p className="text-gray-400">
              <span className="text-white font-medium">Ad Sets:</span> {selectedPages.length}
            </p>
            <p className="text-gray-400">
              <span className="text-white font-medium">Total Daily Budget:</span> $
              {parseFloat(dailyBudget || '0') * selectedPages.length}
            </p>
            <div className="mt-3">
              <p className="text-white font-medium mb-2">Ad Sets to be created:</p>
              <ul className="list-disc list-inside text-gray-400 space-y-1">
                {selectedPages.map(page => (
                  <li key={page}>
                    {campaignName || 'Untitled'} - {page} (${dailyBudget}/day)
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
