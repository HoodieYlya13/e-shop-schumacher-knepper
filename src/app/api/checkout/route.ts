import { createCheckout } from '@/lib/services/store-front/checkout';
import { getCustomerAccessToken } from '@/utils/shared/getters/getCustomerAccessToken';
import { getCheckoutUrl } from '@/utils/shared/getters/getCheckoutUrl';
import { NextRequest, NextResponse } from 'next/server';
import { setServerCookie } from '@/utils/shared/setters/shared/setServerCookie';

export async function POST(req: NextRequest) {
  const { lineItems } = await req.json();
  const customerAccessToken = await getCustomerAccessToken();
  const checkoutUrl = await getCheckoutUrl();
  
  if (checkoutUrl) return NextResponse.json({ url: checkoutUrl });

  try {
    if (!lineItems || !Array.isArray(lineItems) || lineItems.length === 0)
      return NextResponse.json(
        { error: "Missing or invalid lineItems" },
        { status: 400 }
      );

    const { id, checkoutUrl } = await createCheckout({ lineItems, customerAccessToken });

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