'use client';

import MetricCard from '@/components/MetricCard';

const landingPages = [
  { name: 'burnout-my-story', url: 'https://pages.dailygrowthmap.com/burnout-my-story' },
  { name: 'burnout-case-study', url: 'https://pages.dailygrowthmap.com/burnout-case-study' },
  { name: 'identity-shift', url: 'https://pages.dailygrowthmap.com/identity-shift' },
  { name: 'founders-guide', url: 'https://pages.dailygrowthmap.com/founders-guide' },
];

export default function PagesPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Landing Pages</h1>
        <p className="text-gray-400">Track performance of your advertorial and landing pages</p>
        <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg">
          <p className="text-yellow-300 text-sm">
            🚧 <strong>Google Analytics 4 Integration Coming Soon</strong>
            <br />
            To enable real-time landing page analytics, please provide your GA4 Property ID.
          </p>
        </div>
      </div>

      {/* Placeholder Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard title="Total Page Views" value="--" icon="👁️" />
        <MetricCard title="Avg. Time on Page" value="--" icon="⏱️" />
        <MetricCard title="Bounce Rate" value="--%" icon="↩️" />
        <MetricCard title="Conversion Rate" value="--%" icon="✅" />
      </div>

      {/* Landing Pages List */}
      <div className="bg-dgm-gray-dark border border-dgm-gray rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Your Landing Pages</h2>
        <div className="space-y-4">
          {landingPages.map((page) => (
            <div
              key={page.name}
              className="flex items-center justify-between p-4 bg-dgm-gray rounded-lg border border-dgm-gray-light hover:border-dgm-gold transition-colors"
            >
              <div>
                <h3 className="text-white font-medium mb-1">{page.name}</h3>
                <a
                  href={page.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-dgm-gold hover:underline"
                >
                  {page.url} ↗
                </a>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">--</p>
                <p className="text-xs text-gray-500">views (7d)</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Setup Instructions */}
      <div className="mt-8 bg-dgm-gray-dark border border-dgm-gray rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-3">📋 Setup Instructions</h3>
        <div className="space-y-2 text-gray-400">
          <p>1. Log in to Google Analytics 4 and find your Property ID</p>
          <p>2. Add the Property ID to your environment variables as <code className="text-dgm-gold">GA4_PROPERTY_ID</code></p>
          <p>3. Set up a service account or OAuth credentials for API access</p>
          <p>4. Refresh this page to see real-time analytics</p>
        </div>
      </div>
    </div>
  );
}
