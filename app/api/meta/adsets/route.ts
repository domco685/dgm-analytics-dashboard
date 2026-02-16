import { NextResponse } from 'next/server';
import { MetaAdsAPI } from '@/lib/meta-api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('campaign_id');

    const api = new MetaAdsAPI(
      process.env.META_ACCESS_TOKEN!,
      process.env.META_AD_ACCOUNT_ID!
    );

    const adsets = await api.getAdSets(campaignId || undefined);
    return NextResponse.json({ adsets });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch ad sets' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { campaign_id, name, daily_budget, targeting, start_time } = body;

    const api = new MetaAdsAPI(
      process.env.META_ACCESS_TOKEN!,
      process.env.META_AD_ACCOUNT_ID!
    );

    const adset = await api.createAdSet(
      campaign_id,
      name,
      daily_budget,
      targeting,
      start_time
    );
    return NextResponse.json({ adset });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create ad set' },
      { status: 500 }
    );
  }
}
