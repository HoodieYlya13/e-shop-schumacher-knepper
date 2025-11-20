import { createCheckout } from '@/lib/services/store-front/checkout';
import { getCustomerAccessToken } from '@/utils/shared/getters/getCustomerAccessToken';
import { getCheckoutUrl } from '@/utils/shared/getters/getCheckoutUrl';
import { NextRequest, NextResponse } from 'next/server';
import { setServerCookie } from '@/utils/shared/setters/shared/setServerCookie';
import { getCustomerCountryServer } from '@/utils/shared/getters/getCustomerCountryServer';
import { getPreferredLocale } from '@/utils/shared/getters/getPreferredLocale';
import { LocaleLanguagesUpperCase } from '@/i18n/utils';

export async function POST(req: NextRequest) {
  const checkoutUrl = await getCheckoutUrl();
  if (checkoutUrl) return NextResponse.json({ url: checkoutUrl });
  
  const { lineItems } = await req.json();
  const customerAccessToken = await getCustomerAccessToken();
  const country = await getCustomerCountryServer();
  const language = await getPreferredLocale(true) as LocaleLanguagesUpperCase;

  try {
    if (!lineItems || !Array.isArray(lineItems) || lineItems.length === 0)
      return NextResponse.json(
        { error: "Missing or invalid lineItems" },
        { status: 400 }
      );

    const { id, checkoutUrl, lines } = await createCheckout({
      lineItems,
      customerAccessToken,
      country,
      language,
    });

    const response = NextResponse.json({ url: checkoutUrl, lines });

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
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}