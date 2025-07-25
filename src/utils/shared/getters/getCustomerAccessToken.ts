import { cookies } from "next/headers";

export async function getCustomerAccessToken(): Promise<string | undefined> {
  return (await cookies()).get("customer_access_token")?.value;
}