import { getServerCookie } from "./shared/getServerCookie";

export async function getCheckoutId(): Promise<string | undefined> {
  return getServerCookie("checkout_id");
}