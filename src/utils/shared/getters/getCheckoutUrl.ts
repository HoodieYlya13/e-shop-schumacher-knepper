import { cookies } from "next/headers";

export async function getCheckoutUrl(): Promise<string | undefined> {
  return (await cookies()).get("checkout_url")?.value;
}