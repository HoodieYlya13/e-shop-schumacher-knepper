import { deleteCustomerAccessToken } from "@/lib/services/store-front/auth";
import { getCustomerAccessToken } from "@/utils/shared/getters/getCustomerAccessToken";
import { NextResponse } from "next/server";

export async function POST() {
  const customerAccessToken = await getCustomerAccessToken();
  if (customerAccessToken) await deleteCustomerAccessToken(customerAccessToken);

  const response = NextResponse.json({ success: true });
  response.cookies.set("customer_access_token", "", { path: "/", maxAge: 0 });

  return response;
}