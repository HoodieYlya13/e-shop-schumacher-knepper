import { NextRequest, NextResponse } from "next/server";
import { getCheckoutId } from "@/utils/shared/getters/getCheckoutId";
import { createCheckout, updateBuyerIdentity } from "@/lib/services/store-front/checkout";
import { setServerCookie } from "@/utils/shared/setters/setServerCookie";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { customerAccessToken, tokenExpiry, redirectTo, checkoutUrlPath } = body;

  if (!customerAccessToken || !tokenExpiry) return NextResponse.json({ error: "Missing token or expiry" }, { status: 400 });

  const expires = new Date(tokenExpiry);

  if (expires.getTime() <= Date.now()) return NextResponse.json({ error: "Token expiry must be in the future" }, { status: 400 });

  let checkoutUrl = null;

  if (checkoutUrlPath) {
    const checkoutId = await getCheckoutId();
    if (checkoutId)
      checkoutUrl = await updateBuyerIdentity(checkoutId, {
        customerAccessToken,
      });
    else
      checkoutUrl = (
        await createCheckout({
          variantId: "gid://shopify/ProductVariant/50446774370632",
          quantity: 1,
          customerAccessToken,
        })
      )?.checkoutUrl;
    
  }

  const redirectUrl = checkoutUrl || redirectTo || "account";

  const response = NextResponse.json({ redirectUrl });

  setServerCookie({
    name: "customer_access_token",
    value: customerAccessToken,
    response,
    options: { expires },
  });

  if (checkoutUrl) {
    setServerCookie({
      name: "checkout_url",
      value: checkoutUrl,
      response,
      options: { maxAge: 60 * 60 * 24 },
    });
  }

  return response;
}