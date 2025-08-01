import { getCookie } from "./getCookie";

export async function getCheckoutId(): Promise<string | undefined> {
  return getCookie("checkout_id");
}