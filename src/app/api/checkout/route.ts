import { createCheckout } from '@/lib/services/store-front/checkout';
import { getCustomerAccessToken } from '@/utils/shared/getters/getCustomerAccessToken';
import { getCheckoutUrl } from '@/utils/shared/getters/getCheckoutUrl';
import { NextRequest, NextResponse } from 'next/server';
import { setServerCookie } from '@/utils/shared/setters/setServerCookie';

export async function POST(req: NextRequest) {
  const { variantId, quantity } = await req.json();
  const customerAccessToken = await getCustomerAccessToken();
  const checkoutUrl = await getCheckoutUrl();
  
  if (checkoutUrl) return NextResponse.json({ url: checkoutUrl });

  try {
    if (!variantId) return NextResponse.json({ error: 'Missing variantId' }, { status: 400 });

    const { id, checkoutUrl } = await createCheckout({ variantId, quantity, customerAccessToken });

    const response = NextResponse.json({ url: checkoutUrl });

    setServerCookie({
      name: "checkout_id",
      value: id,
      response,
      options: {
        expires: new Date(Date.now() + 60 * 60 * 24 * 1000),
      },
    });

    setServerCookie({
      name: "checkout_url",
      value: checkoutUrl,
      response,
      options: {
        expires: new Date(Date.now() + 60 * 60 * 24 * 1000),
      },
    });

    return response;
  } catch (error: unknown) {
    if (error instanceof Error) return NextResponse.json({ error: error.message }, { status: 500 });
    
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}