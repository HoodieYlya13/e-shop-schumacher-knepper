import { getClientCookie } from "./shared/getClientCookie";

export function getCustomerCountryClient() {
  return getClientCookie("customer_country");
}