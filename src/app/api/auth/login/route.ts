import { NextRequest, NextResponse } from "next/server";
import { getCheckoutId } from "@/utils/shared/getters/getCheckoutId";
import { updateBuyerIdentity } from "@/lib/services/store-front/checkout";
import { setServerCookie } from "@/utils/shared/setters/setServerCookie";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { customerAccessToken, tokenExpiry, redirectTo, checkoutUrlPath } = body;

  console.log("checkoutUrlPath", checkoutUrlPath);  

  if (!customerAccessToken || !tokenExpiry) return NextResponse.json({ error: "Missing token or expiry" }, { status: 400 });

  const expires = new Date(tokenExpiry);

  if (expires.getTime() <= Date.now()) return NextResponse.json({ error: "Token expiry must be in the future" }, { status: 400 });

  let checkoutUrl = null;
  
  if (checkoutUrlPath) {
    checkoutUrl = `https://i621t2-yy.myshopify.com${decodeURIComponent(checkoutUrlPath)}`;
    const checkoutId = await getCheckoutId();
    if (checkoutId)
      await updateBuyerIdentity(checkoutId, { customerAccessToken });
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