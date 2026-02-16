import { NextResponse } from 'next/server';
import { MetaAdsAPI } from '@/lib/meta-api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const datePreset = searchParams.get('date_preset') || 'last_7d';
    const since = searchParams.get('since');
    const until = searchParams.get('until');

    const api = new MetaAdsAPI(
      process.env.META_ACCESS_TOKEN!,
      process.env.META_AD_ACCOUNT_ID!
    );

    let insights;
    if (since && until) {
      insights = await api.getInsightsDateRange(since, until);
    } else {
      insights = await api.getInsights(datePreset);
    }

    return NextResponse.json({ insights });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch insights' },
      { status: 500 }
    );
  }
}
