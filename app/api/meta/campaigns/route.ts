import { NextResponse } from 'next/server';
import { MetaAdsAPI } from '@/lib/meta-api';

export async function GET() {
  try {
    const api = new MetaAdsAPI(
      process.env.META_ACCESS_TOKEN!,
      process.env.META_AD_ACCOUNT_ID!
    );

    const campaigns = await api.getCampaigns();
    return NextResponse.json({ campaigns });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, objective, status } = body;

    const api = new MetaAdsAPI(
      process.env.META_ACCESS_TOKEN!,
      process.env.META_AD_ACCOUNT_ID!
    );

    const campaign = await api.createCampaign(name, objective, status);
    return NextResponse.json({ campaign });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create campaign' },
      { status: 500 }
    );
  }
}
