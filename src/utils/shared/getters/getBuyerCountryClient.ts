import { getClientCookie } from "./getClientCookie";

export function getBuyerCountryClient() {
  return getClientCookie("buyer_country");
}