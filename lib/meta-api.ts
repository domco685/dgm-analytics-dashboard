import axios from 'axios';
import { Campaign, AdSet, Ad, AdInsights } from '@/types';

const META_API_VERSION = 'v21.0';
const META_API_BASE = `https://graph.facebook.com/${META_API_VERSION}`;

export class MetaAdsAPI {
  private accessToken: string;
  private adAccountId: string;

  constructor(accessToken: string, adAccountId: string) {
    this.accessToken = accessToken;
    this.adAccountId = adAccountId;
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    };
  }

  // Get all campaigns
  async getCampaigns(): Promise<Campaign[]> {
    try {
      const response = await axios.get(
        `${META_API_BASE}/${this.adAccountId}/campaigns`,
        {
          headers: this.getHeaders(),
          params: {
            fields: 'id,name,status,daily_budget,lifetime_budget,objective,created_time',
            limit: 100,
          },
        }
      );
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      throw error;
    }
  }

  // Get ad sets for a campaign
  async getAdSets(campaignId?: string): Promise<AdSet[]> {
    try {
      const endpoint = campaignId
        ? `${META_API_BASE}/${campaignId}/adsets`
        : `${META_API_BASE}/${this.adAccountId}/adsets`;

      const response = await axios.get(endpoint, {
        headers: this.getHeaders(),
        params: {
          fields: 'id,name,campaign_id,status,daily_budget,lifetime_budget,targeting',
          limit: 100,
        },
      });
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching ad sets:', error);
      throw error;
    }
  }

  // Get ads for an ad set
  async getAds(adSetId?: string): Promise<Ad[]> {
    try {
      const endpoint = adSetId
        ? `${META_API_BASE}/${adSetId}/ads`
        : `${META_API_BASE}/${this.adAccountId}/ads`;

      const response = await axios.get(endpoint, {
        headers: this.getHeaders(),
        params: {
          fields: 'id,name,adset_id,status,creative{id,title,body,image_url}',
          limit: 100,
        },
      });
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching ads:', error);
      throw error;
    }
  }

  // Get insights for the account
  async getInsights(datePreset: string = 'last_7d'): Promise<AdInsights[]> {
    try {
      const response = await axios.get(
        `${META_API_BASE}/${this.adAccountId}/insights`,
        {
          headers: this.getHeaders(),
          params: {
            fields: 'campaign_id,campaign_name,spend,impressions,clicks,ctr,cpc,cpm,actions,action_values,purchase_roas',
            date_preset: datePreset,
            level: 'campaign',
            limit: 100,
          },
        }
      );
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching insights:', error);
      throw error;
    }
  }

  // Get insights with custom date range
  async getInsightsDateRange(since: string, until: string): Promise<AdInsights[]> {
    try {
      const response = await axios.get(
        `${META_API_BASE}/${this.adAccountId}/insights`,
        {
          headers: this.getHeaders(),
          params: {
            fields: 'campaign_id,campaign_name,spend,impressions,clicks,ctr,cpc,cpm,actions,action_values,purchase_roas',
            time_range: JSON.stringify({ since, until }),
            level: 'campaign',
            time_increment: 1,
            limit: 1000,
          },
        }
      );
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching insights:', error);
      throw error;
    }
  }

  // Update campaign status
  async updateCampaignStatus(campaignId: string, status: 'ACTIVE' | 'PAUSED'): Promise<boolean> {
    try {
      await axios.post(
        `${META_API_BASE}/${campaignId}`,
        { status },
        { headers: this.getHeaders() }
      );
      return true;
    } catch (error) {
      console.error('Error updating campaign status:', error);
      throw error;
    }
  }

  // Update ad set budget
  async updateAdSetBudget(adSetId: string, dailyBudget: number): Promise<boolean> {
    try {
      await axios.post(
        `${META_API_BASE}/${adSetId}`,
        { daily_budget: dailyBudget * 100 }, // Meta expects cents
        { headers: this.getHeaders() }
      );
      return true;
    } catch (error) {
      console.error('Error updating ad set budget:', error);
      throw error;
    }
  }

  // Create a campaign
  async createCampaign(name: string, objective: string, status: string = 'PAUSED'): Promise<Campaign> {
    try {
      const response = await axios.post(
        `${META_API_BASE}/${this.adAccountId}/campaigns`,
        {
          name,
          objective,
          status,
          special_ad_categories: [],
        },
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  }

  // Create an ad set
  async createAdSet(
    campaignId: string,
    name: string,
    dailyBudget: number,
    targeting: any,
    startTime?: string
  ): Promise<AdSet> {
    try {
      const response = await axios.post(
        `${META_API_BASE}/${this.adAccountId}/adsets`,
        {
          name,
          campaign_id: campaignId,
          daily_budget: dailyBudget * 100, // Meta expects cents
          billing_event: 'IMPRESSIONS',
          optimization_goal: 'REACH',
          targeting,
          status: 'PAUSED',
          start_time: startTime || new Date().toISOString(),
        },
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating ad set:', error);
      throw error;
    }
  }
}
