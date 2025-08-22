import { getCustomerAccessToken } from "@/utils/shared/getters/getCustomerAccessToken";
import { getPreferredLocale } from "@/utils/shared/getters/getPreferredLocale";
import { LocaleLanguages } from "@/i18n/utils";
import NavBarClient from "./shared/NavBarClient";
import { getLogoUrl } from "@/lib/services/store-front/shop";

export default async function NavBar() {
  const customerAccessToken = await getCustomerAccessToken(true);
  const storedLocale = await getPreferredLocale() as LocaleLanguages;
  const logoUrl = await getLogoUrl();
  
  return (
    <header className="fixed w-full z-10 p-5 md:p-10">
      <NavBarClient
        customerAccessToken={customerAccessToken}
        storedLocale={storedLocale}
        logoUrl={logoUrl}
      />
    </header>
  );
}