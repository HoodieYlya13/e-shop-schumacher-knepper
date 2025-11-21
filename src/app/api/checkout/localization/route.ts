import { updateCartLocalization } from "@/lib/services/store-front/checkout";
import { NextResponse } from "next/server";
import { getCustomerCountryServer } from "@/utils/shared/getters/getCustomerCountryServer";
import { getPreferredLocale } from "@/utils/shared/getters/getPreferredLocale";
import { LocaleLanguagesUpperCase } from "@/i18n/utils";
import { getCheckoutId } from "@/utils/shared/getters/getCheckoutId";
import { setServerCookie } from "@/utils/shared/setters/shared/setServerCookie";

export async function POST() {
  const checkoutId = await getCheckoutId();
  if (!checkoutId) return NextResponse.json({ success: true });

  const country = await getCustomerCountryServer();
  const language = (await getPreferredLocale(true)) as LocaleLanguagesUpperCase;
  if (!country && !language) return NextResponse.json({ success: true });
  const options = { country, language };

  try {
    const url = await updateCartLocalization(checkoutId, options);

    if (!url) throw new Error("Failed to update cart localization");

    const response = NextResponse.json({ url });

    setServerCookie({
      name: "checkout_url",
      value: url,
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