import { cookies } from "next/headers";

export async function getAccessToken(): Promise<string | undefined> {
  return (await cookies()).get("shopify_token")?.value;
}