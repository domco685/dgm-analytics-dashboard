import { NextResponse } from 'next/server';
import { MetaAdsAPI } from '@/lib/meta-api';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status } = body;

    const api = new MetaAdsAPI(
      process.env.META_ACCESS_TOKEN!,
      process.env.META_AD_ACCOUNT_ID!
    );

    await api.updateCampaignStatus(params.id, status);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update campaign' },
      { status: 500 }
    );
  }
}
