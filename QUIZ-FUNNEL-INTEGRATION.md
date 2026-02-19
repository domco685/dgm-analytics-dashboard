# Quiz Funnel Integration Guide

## Overview

The Quiz Funnel page tracks user progression through the ambition quiz from landing to purchase.

**Current Status:** 🟡 Mock data (UI complete, needs real data integration)

## Funnel Steps

1. **Landing** - User lands on quiz page (`/ambition-quiz`)
2. **Q1-Q5** - User answers each question
3. **Email Submit** - User submits email on results page
4. **Lovable View** - User redirects to `/identity-shift/quit-drinking?from=signup`
5. **Checkout Init** - User clicks CTA on Lovable page
6. **Purchase** - User completes Shopify checkout

## Data Sources Needed

### 1. Meta Pixel Events (Quiz Progression)

The quiz already tracks these events via Meta Pixel:

```javascript
// Landing
fbq('track', 'Lead');  // When quiz starts

// Quiz completion
fbq('track', 'CompleteRegistration');  // When Q5 answered

// Email capture
fbq('track', 'Lead', {content_name: 'Identity Map - [tier]'});
```

**To implement:**
- Use Meta Conversions API to query these events
- Match by `fbclid` or `utm_campaign` to tie to specific ads
- Count events by campaign/ad set/ad name

### 2. GA4 (Page Views)

Track page views for:
- Quiz landing: `/ambition-quiz`
- Lovable page: `/identity-shift/quit-drinking`

**To implement:**
- Use GA4 Data API to query page views
- Filter by page path
- Match by `utm_campaign`/`utm_source`/`utm_medium`

### 3. Shopify (Checkout & Purchase)

Track:
- Checkout initiated (user clicks CTA)
- Purchase completed

**To implement:**
- Query Shopify Admin API for orders
- Match by UTM params stored in order metadata
- Count by campaign/ad set/ad name

## API Endpoint Implementation

**File:** `/app/api/funnel/quiz/route.ts`

**Current state:** Returns mock data

**To implement:**

```typescript
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const campaign = searchParams.get('campaign');
  const adSet = searchParams.get('adSet');
  const adName = searchParams.get('adName');

  // 1. Fetch Meta Pixel events
  const metaEvents = await fetchMetaPixelEvents({
    events: ['Lead', 'CompleteRegistration'],
    campaign,
    adSet,
    adName,
  });

  // 2. Fetch GA4 page views
  const ga4Data = await fetchGA4PageViews({
    paths: ['/ambition-quiz', '/identity-shift/quit-drinking'],
    campaign,
  });

  // 3. Fetch Shopify orders
  const shopifyData = await fetchShopifyOrders({
    campaign,
  });

  // 4. Join data and calculate funnel
  const funnelData = calculateFunnel({
    metaEvents,
    ga4Data,
    shopifyData,
  });

  return NextResponse.json({
    funnel: funnelData,
    campaigns: [...],
    adSets: [...],
    adNames: [...],
  });
}
```

## Required Environment Variables

Add to `.env.local`:

```bash
# Meta Conversions API (for pixel event data)
NEXT_PUBLIC_META_PIXEL_ID=1040360674700004
META_CONVERSIONS_API_TOKEN=<your_token>

# GA4 Data API
GA4_PROPERTY_ID=G-6ZNWXLTWZK
GA4_SERVICE_ACCOUNT_KEY=<base64_encoded_json>

# Shopify Admin API
SHOPIFY_STORE_URL=dailygrowthmap.myshopify.com
SHOPIFY_ADMIN_ACCESS_TOKEN=<your_token>
```

## Tracking Setup Checklist

- [x] Meta Pixel installed on quiz page
- [x] Quiz events firing (Lead, CompleteRegistration)
- [x] GA4 tracking code on quiz + Lovable pages
- [ ] Shopify checkout tracking UTM params
- [ ] Meta Conversions API access token
- [ ] GA4 Data API service account
- [ ] Shopify Admin API access token
- [ ] API endpoint implemented
- [ ] Mock data replaced with real data

## Testing

**Local testing:**
```bash
cd /Users/hydi/.openclaw/workspace/dgm-analytics-dashboard
npm run dev
```

Navigate to: `http://localhost:3000/quiz`

**Expected behavior:**
- Filters load (campaigns, ad sets, ad names)
- Funnel displays with counts for each step
- Dropoff percentages calculated correctly
- Overall conversion rate shown

## Next Steps

1. **Get API tokens** (Meta Conversions, GA4, Shopify)
2. **Implement data fetching** in `/app/api/funnel/quiz/route.ts`
3. **Test with real data** (run small test campaign)
4. **Validate numbers** against Meta Ads Manager
5. **Deploy** to production

---

**Note:** Currently showing mock data. Replace with real integration once API tokens are available.
