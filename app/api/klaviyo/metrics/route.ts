import { NextResponse } from 'next/server';
import { KlaviyoAPI } from '@/lib/klaviyo-api';

export async function GET() {
  try {
    const api = new KlaviyoAPI(
      process.env.KLAVIYO_API_KEY!,
      process.env.KLAVIYO_LIST_ID!
    );

    const metrics = await api.getEmailMetrics();
    return NextResponse.json({ metrics });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch email metrics' },
      { status: 500 }
    );
  }
}
