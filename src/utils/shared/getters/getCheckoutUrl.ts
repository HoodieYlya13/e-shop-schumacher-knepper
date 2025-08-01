import { getCookie } from "./getCookie";

export async function getCheckoutUrl(): Promise<string | undefined> {
  return getCookie("checkout_url");
}