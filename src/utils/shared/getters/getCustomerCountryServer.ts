import { LocaleLanguagesUpperCase } from "@/i18n/utils";
import { getServerCookie } from "./shared/getServerCookie";

export async function getCustomerCountryServer() {
  return (await getServerCookie("customer_country")) as LocaleLanguagesUpperCase | undefined;
}