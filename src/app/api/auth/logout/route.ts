import { deleteCustomerAccessToken } from "@/lib/services/store-front/auth";
import { getCustomerAccessToken } from "@/utils/shared/getters/getCustomerAccessToken";
import { deleteCookie } from "@/utils/shared/setters/shared/setServerCookie";
import { NextResponse } from "next/server";

export async function POST() {
  const customerAccessToken = await getCustomerAccessToken();
  if (customerAccessToken) await deleteCustomerAccessToken(customerAccessToken);

  deleteCookie("customer_access_token");

  return NextResponse.json({ success: true });
}