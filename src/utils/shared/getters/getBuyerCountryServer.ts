import { getServerCookie } from "./getServerCookie";

export function getBuyerCountryServer() {
  return getServerCookie("buyer_country");
}