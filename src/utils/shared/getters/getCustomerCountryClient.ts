import { getClientCookie } from "./shared/getClientCookie";
import { CountryCode } from "@shopify/hydrogen-react/storefront-api-types";

export function getCustomerCountryClient() {
  const country = getClientCookie("customer_country");

  if (!country || country === "unknown") return undefined;

  return country as CountryCode;
}