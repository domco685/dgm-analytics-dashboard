import { NextRequest, NextResponse } from 'next/server';

/**
 * Quiz Funnel API
 * 
 * Tracks quiz progression through these steps:
 * 1. Landing (page view)
 * 2. Q1-Q5 (question progression)
 * 3. Email Submit
 * 4. Lovable Page View
 * 5. Checkout Initiated
 * 6. Purchase
 * 
 * Data sources:
 * - Meta Pixel events (quiz progression)
 * - GA4 (page views)
 * - Shopify (checkout/purchase)
 * 
 * Filters:
 * - campaign: FB campaign name
 * - adSet: FB ad set name
 * - adName: FB ad name
 */

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const campaign = searchParams.get('campaign');
    const adSet = searchParams.get('adSet');
    const adName = searchParams.get('adName');

    // TODO: Implement actual data fetching
    // For now, returning mock data structure
    
    // In production, this would:
    // 1. Query Meta Pixel events for quiz progression
    // 2. Query GA4 for page views (quiz landing, Lovable page)
    // 3. Query Shopify for checkout/purchase events
    // 4. Join data by utm_campaign/utm_source/fbclid
    // 5. Filter by campaign/adSet/adName if provided

    const mockFunnelData = [
      {
        campaign: 'Test Campaign',
        adSet: 'Test Ad Set',
        adName: 'Test Ad',
        steps: [
          { step: 'landing', count: 1000 },
          { step: 'q1', count: 850 },
          { step: 'q2', count: 720 },
          { step: 'q3', count: 650 },
          { step: 'q4', count: 600 },
          { step: 'q5', count: 550 },
          { step: 'email_submit', count: 500 },
          { step: 'lovable_view', count: 480 },
          { step: 'checkout_init', count: 120 },
          { step: 'purchase', count: 45 },
        ],
      },
    ];

    // Extract unique values for filters
    const campaigns = Array.from(new Set(mockFunnelData.map(f => f.campaign)));
    const adSets = Array.from(new Set(mockFunnelData.map(f => f.adSet)));
    const adNames = Array.from(new Set(mockFunnelData.map(f => f.adName)));

    // Filter data if needed
    let filteredData = mockFunnelData;
    if (campaign && campaign !== 'all') {
      filteredData = filteredData.filter(f => f.campaign === campaign);
    }
    if (adSet && adSet !== 'all') {
      filteredData = filteredData.filter(f => f.adSet === adSet);
    }
    if (adName && adName !== 'all') {
      filteredData = filteredData.filter(f => f.adName === adName);
    }

    return NextResponse.json({
      funnel: filteredData,
      campaigns,
      adSets,
      adNames,
    });
  } catch (error: any) {
    console.error('Quiz funnel API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch quiz funnel data' },
      { status: 500 }
    );
  }
}
