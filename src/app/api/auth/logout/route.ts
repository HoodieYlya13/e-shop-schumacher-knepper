import { deleteCustomerAccessToken } from "@/lib/services/auth";
import { getAccessToken } from "@/utils/shared/getters/getAccessToken";
import { getCheckoutId } from "@/utils/shared/getters/getCheckoutId";
import { NextResponse } from "next/server";

export async function POST() {
  const token = await getAccessToken();
  const checkoutId = await getCheckoutId();

  if (token) await deleteCustomerAccessToken(token);

  const response = NextResponse.json({ success: true });
  response.cookies.set("shopify_token", "", { path: "/", maxAge: 0 });

  if (checkoutId) response.cookies.set("checkout_id", "", { path: "/", maxAge: 0 });

  return response;
}