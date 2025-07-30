import { deleteCustomerAccessToken } from "@/lib/services/store-front/auth";
import { getCustomerAccessToken } from "@/utils/shared/getters/getCustomerAccessToken";
import { setServerCookie } from "@/utils/shared/setters/setServerCookie";
import { NextResponse } from "next/server";

export async function POST() {
  const customerAccessToken = await getCustomerAccessToken();
  if (customerAccessToken) await deleteCustomerAccessToken(customerAccessToken);

  const response = NextResponse.json({ success: true });
  setServerCookie({
    name: "customer_access_token",
    value: "",
    response,
    options: {
      maxAge: 0,
    },
  });

  return response;
}