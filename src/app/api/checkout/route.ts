import { createCheckout } from '@/lib/services/checkout';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { variantId, quantity } = await req.json();

  try {
    if (!variantId) {
      return NextResponse.json({ error: 'Missing variantId' }, { status: 400 });
    }

    const checkoutUrl = await createCheckout(variantId, quantity);
    return NextResponse.json({ url: checkoutUrl });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}