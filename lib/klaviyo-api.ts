import axios from 'axios';
import { KlaviyoProfile, EmailMetrics } from '@/types';

const KLAVIYO_API_BASE = 'https://a.klaviyo.com/api';

export class KlaviyoAPI {
  private apiKey: string;
  private listId: string;

  constructor(apiKey: string, listId: string) {
    this.apiKey = apiKey;
    this.listId = listId;
  }

  private getHeaders() {
    return {
      'Authorization': `Klaviyo-API-Key ${this.apiKey}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'revision': '2024-10-15',
    };
  }

  // Get profiles from the list
  async getProfiles(limit: number = 100): Promise<KlaviyoProfile[]> {
    try {
      const response = await axios.get(
        `${KLAVIYO_API_BASE}/lists/${this.listId}/profiles`,
        {
          headers: this.getHeaders(),
          params: {
            'page[size]': limit,
            'sort': '-created',
          },
        }
      );
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching Klaviyo profiles:', error);
      throw error;
    }
  }

  // Get list details
  async getListDetails() {
    try {
      const response = await axios.get(
        `${KLAVIYO_API_BASE}/lists/${this.listId}`,
        {
          headers: this.getHeaders(),
          params: {
            'fields[list]': 'name,created,updated,profile_count',
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching list details:', error);
      throw error;
    }
  }

  // Get email metrics
  async getEmailMetrics(): Promise<EmailMetrics> {
    try {
      const profiles = await this.getProfiles(1000);
      const listDetails = await this.getListDetails();

      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const dailySignups = profiles.filter(profile => {
        const created = new Date(profile.attributes.created || '');
        return created >= oneDayAgo;
      }).length;

      const weeklySignups = profiles.filter(profile => {
        const created = new Date(profile.attributes.created || '');
        return created >= oneWeekAgo;
      }).length;

      return {
        totalSignups: profiles.length,
        dailySignups,
        weeklySignups,
        listSize: listDetails.attributes.profile_count || profiles.length,
        recentSignups: profiles.slice(0, 20), // Get 20 most recent
      };
    } catch (error) {
      console.error('Error calculating email metrics:', error);
      throw error;
    }
  }

  // Get signups by source page
  async getSignupsByPage(): Promise<{ [key: string]: number }> {
    try {
      const profiles = await this.getProfiles(1000);
      const signupsByPage: { [key: string]: number } = {};

      profiles.forEach(profile => {
        const sourcePage = profile.attributes.properties?.source_page || 'unknown';
        signupsByPage[sourcePage] = (signupsByPage[sourcePage] || 0) + 1;
      });

      return signupsByPage;
    } catch (error) {
      console.error('Error fetching signups by page:', error);
      throw error;
    }
  }
}
