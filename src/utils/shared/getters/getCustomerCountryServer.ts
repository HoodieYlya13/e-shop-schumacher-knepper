import { getServerCookie } from "./shared/getServerCookie";

export function getCustomerCountryServer() {
  return getServerCookie("customer_country");
}