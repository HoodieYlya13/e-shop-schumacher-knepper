import { getServerCookie } from "./shared/getServerCookie";

export async function getCheckoutUrl(): Promise<string | undefined> {
  return getServerCookie("checkout_url");
}