import { getCustomerAccessToken } from "@/utils/shared/getters/getCustomerAccessToken";
import Navigation from "./shared/Navigation";
import Logout from "./shared/Logout";
import LanguageSwitcher from "./shared/LanguageSwitcher";
import ShoppingCart from "./shared/ShoppingCart";
import { getPreferredLocale } from "@/utils/shared/getters/getPreferredLocale";
import { LocaleLanguages } from "@/i18n/utils";

export default async function NavBar() {
  const customerAccessToken = await getCustomerAccessToken(true);
  const storedLocale = await getPreferredLocale() as LocaleLanguages;
  
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-white shadow-sm">
      <Navigation customerAccessToken={customerAccessToken} />
      {customerAccessToken && <Logout />}
      <LanguageSwitcher storedLocale={storedLocale} />
      <ShoppingCart />
    </header>
  );
}