# API Usage Guide

Complete reference for extending and maintaining the DGM Analytics Dashboard APIs.

---

## Table of Contents

1. [Meta Ads API](#meta-ads-api)
2. [Klaviyo API](#klaviyo-api)
3. [Adding New Integrations](#adding-new-integrations)
4. [Rate Limits & Best Practices](#rate-limits--best-practices)
5. [Error Handling](#error-handling)
6. [Testing](#testing)

---

## Meta Ads API

### Base Configuration

```typescript
import { MetaAdsAPI } from '@/lib/meta-api';

const api = new MetaAdsAPI(
  process.env.META_ACCESS_TOKEN!,
  process.env.META_AD_ACCOUNT_ID!
);
```

### Available Methods

#### Get Campaigns
```typescript
const campaigns = await api.getCampaigns();
// Returns: Campaign[]
```

#### Get Insights
```typescript
// Last 7 days
const insights = await api.getInsights('last_7d');

// Custom date range
const insights = await api.getInsightsDateRange('2026-01-01', '2026-01-31');
// Returns: AdInsights[]
```

#### Get Ad Sets
```typescript
// All ad sets
const adsets = await api.getAdSets();

// Ad sets for specific campaign
const adsets = await api.getAdSets(campaignId);
// Returns: AdSet[]
```

#### Create Campaign
```typescript
const campaign = await api.createCampaign(
  'Campaign Name',
  'OUTCOME_TRAFFIC', // objective
  'PAUSED' // initial status
);
// Returns: Campaign
```

#### Create Ad Set
```typescript
const adset = await api.createAdSet(
  campaignId,
  'Ad Set Name',
  50, // daily budget in dollars
  {
    geo_locations: { countries: ['US'] },
    age_min: 25,
    age_max: 65,
  }, // targeting
  new Date().toISOString() // start time
);
// Returns: AdSet
```

#### Update Campaign Status
```typescript
await api.updateCampaignStatus(campaignId, 'ACTIVE' | 'PAUSED');
// Returns: boolean
```

#### Update Ad Set Budget
```typescript
await api.updateAdSetBudget(adsetId, 75); // $75/day
// Returns: boolean
```

### Date Presets

- `today`
- `yesterday`
- `this_month`
- `last_month`
- `this_quarter`
- `last_3d`
- `last_7d`
- `last_14d`
- `last_28d`
- `last_30d`
- `last_90d`
- `last_week_mon_sun`
- `last_week_sun_sat`
- `last_quarter`
- `last_year`
- `this_week_mon_today`
- `this_week_sun_today`
- `this_year`

### Insights Fields

Available fields for insights queries:

- `spend` - Total amount spent
- `impressions` - Number of times ads were shown
- `clicks` - Number of clicks
- `ctr` - Click-through rate (%)
- `cpc` - Cost per click
- `cpm` - Cost per 1000 impressions
- `reach` - Number of unique people reached
- `frequency` - Average times each person saw ads
- `actions` - Array of conversion actions
- `action_values` - Values associated with actions
- `purchase_roas` - Return on ad spend

### Campaign Objectives

Valid objectives for campaign creation:

- `OUTCOME_AWARENESS` - Brand awareness
- `OUTCOME_TRAFFIC` - Link clicks, landing page views
- `OUTCOME_ENGAGEMENT` - Post engagement, page likes
- `OUTCOME_LEADS` - Lead generation
- `OUTCOME_APP_PROMOTION` - App installs
- `OUTCOME_SALES` - Conversions, catalog sales

---

## Klaviyo API

### Base Configuration

```typescript
import { KlaviyoAPI } from '@/lib/klaviyo-api';

const api = new KlaviyoAPI(
  process.env.KLAVIYO_API_KEY!,
  process.env.KLAVIYO_LIST_ID!
);
```

### Available Methods

#### Get Email Metrics
```typescript
const metrics = await api.getEmailMetrics();
// Returns: EmailMetrics
// {
//   totalSignups: number,
//   dailySignups: number,
//   weeklySignups: number,
//   listSize: number,
//   recentSignups: KlaviyoProfile[]
// }
```

#### Get Profiles
```typescript
const profiles = await api.getProfiles(100); // limit
// Returns: KlaviyoProfile[]
```

#### Get Signups by Page
```typescript
const signupsByPage = await api.getSignupsByPage();
// Returns: { [pageName: string]: number }
// Example: { "burnout-my-story": 150, "identity-shift": 120 }
```

#### Get List Details
```typescript
const listDetails = await api.getListDetails();
// Returns list metadata including profile count
```

---

## Adding New Integrations

### Example: Adding Shopify Integration

1. **Create API utility file:**
```typescript
// lib/shopify-api.ts
import axios from 'axios';

export class ShopifyAPI {
  private apiKey: string;
  private shopDomain: string;

  constructor(apiKey: string, shopDomain: string) {
    this.apiKey = apiKey;
    this.shopDomain = shopDomain;
  }

  async getOrders() {
    const response = await axios.get(
      `https://${this.shopDomain}/admin/api/2024-01/orders.json`,
      {
        headers: {
          'X-Shopify-Access-Token': this.apiKey,
        },
      }
    );
    return response.data.orders;
  }
}
```

2. **Create API route:**
```typescript
// app/api/shopify/orders/route.ts
import { NextResponse } from 'next/server';
import { ShopifyAPI } from '@/lib/shopify-api';

export async function GET() {
  try {
    const api = new ShopifyAPI(
      process.env.SHOPIFY_API_KEY!,
      process.env.SHOPIFY_SHOP_DOMAIN!
    );
    
    const orders = await api.getOrders();
    return NextResponse.json({ orders });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

3. **Add environment variables:**
```env
SHOPIFY_API_KEY=your_api_key
SHOPIFY_SHOP_DOMAIN=your-store.myshopify.com
```

4. **Use in frontend:**
```typescript
const response = await fetch('/api/shopify/orders');
const { orders } = await response.json();
```

---

## Rate Limits & Best Practices

### Meta Ads API

**Rate Limits:**
- 200 calls per hour per user
- 200 calls per hour per app
- Some endpoints have stricter limits

**Best Practices:**
1. Cache responses where appropriate (e.g., campaigns list for 5 minutes)
2. Use batch requests when fetching multiple resources
3. Implement exponential backoff on rate limit errors
4. Use webhooks for real-time updates instead of polling

**Caching Example:**
```typescript
// Simple in-memory cache
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function getCachedCampaigns(api: MetaAdsAPI) {
  const cacheKey = 'campaigns';
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  const campaigns = await api.getCampaigns();
  cache.set(cacheKey, { data: campaigns, timestamp: Date.now() });
  return campaigns;
}
```

### Klaviyo API

**Rate Limits:**
- 10 requests per second per account
- 150 requests per minute per account

**Best Practices:**
1. Use pagination for large lists
2. Filter API responses to reduce payload size
3. Implement request queuing for burst traffic
4. Use webhooks for real-time profile updates

---

## Error Handling

### Standard Error Response Format

```typescript
{
  error: string;
  details?: any;
  code?: string;
}
```

### Common Error Scenarios

#### Invalid Access Token
```typescript
try {
  const campaigns = await api.getCampaigns();
} catch (error: any) {
  if (error.response?.status === 401) {
    // Token expired or invalid
    // Implement token refresh logic
  }
}
```

#### Rate Limit Exceeded
```typescript
try {
  const insights = await api.getInsights();
} catch (error: any) {
  if (error.response?.status === 429) {
    // Wait and retry
    await new Promise(resolve => setTimeout(resolve, 60000));
    return api.getInsights();
  }
}
```

#### Network Errors
```typescript
try {
  const metrics = await fetch('/api/klaviyo/metrics');
} catch (error) {
  // Show user-friendly error message
  alert('Network error. Please check your connection and try again.');
}
```

---

## Testing

### Testing API Routes Locally

```bash
# Start development server
npm run dev

# Test Meta campaigns endpoint
curl http://localhost:3000/api/meta/campaigns

# Test Klaviyo metrics
curl http://localhost:3000/api/klaviyo/metrics

# Test campaign creation
curl -X POST http://localhost:3000/api/meta/campaigns \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Campaign","objective":"OUTCOME_TRAFFIC","status":"PAUSED"}'
```

### Unit Testing Example

```typescript
// __tests__/lib/meta-api.test.ts
import { MetaAdsAPI } from '@/lib/meta-api';

describe('MetaAdsAPI', () => {
  const api = new MetaAdsAPI('test_token', 'act_123');
  
  it('should fetch campaigns', async () => {
    const campaigns = await api.getCampaigns();
    expect(Array.isArray(campaigns)).toBe(true);
  });
  
  it('should handle errors gracefully', async () => {
    const api = new MetaAdsAPI('invalid_token', 'act_123');
    await expect(api.getCampaigns()).rejects.toThrow();
  });
});
```

---

## Debugging Tips

### Enable Debug Logging

```typescript
// lib/meta-api.ts
async getCampaigns(): Promise<Campaign[]> {
  console.log('[MetaAPI] Fetching campaigns...');
  const response = await axios.get(/* ... */);
  console.log('[MetaAPI] Response:', response.data);
  return response.data.data;
}
```

### Inspect API Responses

Use browser DevTools Network tab to:
1. Check request/response headers
2. View response payloads
3. Identify slow endpoints
4. Debug CORS issues

### Common Issues

**Issue:** "CORS error when calling API"
**Solution:** API routes run server-side, CORS doesn't apply. Check if you're calling `/api/...` correctly.

**Issue:** "Environment variable undefined"
**Solution:** Restart dev server after adding new env vars.

**Issue:** "Meta API returns empty data"
**Solution:** Verify ad account ID format includes `act_` prefix.

---

## Next Steps

- [ ] Add Shopify integration for order tracking
- [ ] Implement Google Ads API
- [ ] Add TikTok Ads support
- [ ] Create webhook listeners for real-time updates
- [ ] Implement Redis caching for production
- [ ] Add automated tests for all API routes

---

**Need help?** Contact dom@dailygrowthmap.com
