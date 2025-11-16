import { getCustomerAccessToken } from "@/utils/shared/getters/getCustomerAccessToken";
import { getPreferredLocale } from "@/utils/shared/getters/getPreferredLocale";
import { LocaleLanguages } from "@/i18n/utils";
import NavBarClient from "./shared/NavBarClient";
import { getShopPhone } from "@/lib/services/store-front/shop";

export default async function NavBar() {
  const phone = await getShopPhone();
  const customerAccessToken = await getCustomerAccessToken(true);
  const storedLocale = await getPreferredLocale() as LocaleLanguages;
  
  return (
    <header className="fixed w-full z-20 p-5 md:p-10">
      <NavBarClient
        phone={phone}
        customerAccessToken={customerAccessToken}
        storedLocale={storedLocale}
      />
    </header>
  );
}