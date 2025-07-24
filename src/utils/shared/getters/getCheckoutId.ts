import { cookies } from "next/headers";

export async function getCheckoutId(): Promise<string | undefined> {
  return (await cookies()).get("checkout_id")?.value;
}