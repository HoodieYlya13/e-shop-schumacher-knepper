import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";
import { getCheckoutId } from "@/utils/shared/getters/getCheckoutId";
import { updateBuyerIdentity } from "@/lib/services/store-front/checkout";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { customerAccessToken, tokenExpiry, redirectTo, checkoutUrlPath } = body;

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

  response.headers.append("Set-Cookie", serialize("customer_access_token", customerAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires,
  }));

  if (checkoutUrl) {
    response.headers.append("Set-Cookie", serialize("checkout_url", checkoutUrl, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    }));
  }

  return response;
}