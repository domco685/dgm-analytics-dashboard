// Meta Ads Types
export interface Campaign {
  id: string;
  name: string;
  status: 'ACTIVE' | 'PAUSED' | 'DELETED' | 'ARCHIVED';
  daily_budget?: string;
  lifetime_budget?: string;
  objective?: string;
  created_time?: string;
}

export interface AdSet {
  id: string;
  name: string;
  campaign_id: string;
  status: 'ACTIVE' | 'PAUSED' | 'DELETED' | 'ARCHIVED';
  daily_budget?: string;
  lifetime_budget?: string;
  targeting?: any;
}

export interface Ad {
  id: string;
  name: string;
  adset_id: string;
  status: 'ACTIVE' | 'PAUSED' | 'DELETED' | 'ARCHIVED';
  creative?: {
    id: string;
    title?: string;
    body?: string;
    image_url?: string;
  };
}

export interface AdInsights {
  campaign_id?: string;
  campaign_name?: string;
  spend: string;
  impressions: string;
  clicks: string;
  ctr: string;
  cpc: string;
  cpm: string;
  conversions?: string;
  cost_per_conversion?: string;
  purchase_roas?: string;
  date_start?: string;
  date_stop?: string;
}

// Klaviyo Types
export interface KlaviyoProfile {
  id: string;
  type: string;
  attributes: {
    email: string;
    first_name?: string;
    last_name?: string;
    created?: string;
    updated?: string;
    properties?: {
      source_page?: string;
      [key: string]: any;
    };
  };
}

export interface EmailMetrics {
  totalSignups: number;
  dailySignups: number;
  weeklySignups: number;
  listSize: number;
  recentSignups: KlaviyoProfile[];
}

// Dashboard Types
export interface MetricCard {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export interface ChartDataPoint {
  date: string;
  spend: number;
  conversions: number;
  signups?: number;
}
