import { createCheckout } from '@/lib/services/checkout';
import { getAccessToken } from '@/utils/shared/getters/getAccessToken';
import { getCheckoutUrl } from '@/utils/shared/getters/getCheckoutUrl';
import { serialize } from 'cookie';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { variantId, quantity } = await req.json();
  const token = await getAccessToken();
  const checkoutUrl = await getCheckoutUrl();
  
  if (checkoutUrl) return NextResponse.json({ url: checkoutUrl });

  try {
    if (!variantId) return NextResponse.json({ error: 'Missing variantId' }, { status: 400 });

    const { id, checkoutUrl } = await createCheckout(variantId, token, quantity);

    const response = NextResponse.json({ url: checkoutUrl });

    response.headers.append(
      "Set-Cookie",
      serialize("checkout_id", id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: new Date(Date.now() + 60 * 60 * 24 * 1000),
      })
    );

    response.headers.append(
      "Set-Cookie",
      serialize("checkout_url", checkoutUrl, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: new Date(Date.now() + 60 * 60 * 24 * 1000),
      })
    );

    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}