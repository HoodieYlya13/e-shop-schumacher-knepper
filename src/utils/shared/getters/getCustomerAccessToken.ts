import { isCustomerAccessTokenValid } from "@/lib/services/store-front/auth";
import { deleteCookie } from "../setters/setServerCookie";
import { getCookie } from "./getCookie";

export async function getCustomerAccessToken(readonly = false): Promise<string | undefined> {;
  const customerAccessToken = await getCookie("customer_access_token")

  if (!customerAccessToken) return undefined;

  const isValid = await isCustomerAccessTokenValid(customerAccessToken);
  if (!isValid) {
    if (readonly) return undefined;
    
    deleteCookie("customer_access_token");
    return undefined;
  }

  return customerAccessToken;
}