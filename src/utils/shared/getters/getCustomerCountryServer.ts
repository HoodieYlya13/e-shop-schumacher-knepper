import { getServerCookie } from "./shared/getServerCookie";
import { CountryCode } from "@shopify/hydrogen-react/storefront-api-types";

export async function getCustomerCountryServer() {
  const country = await getServerCookie("customer_country");

  if (!country || country === "unknown") return undefined;

  return country as CountryCode;
}