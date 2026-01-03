import { getCustomerAccessToken } from "@/utils/shared/getters/getCustomerAccessToken";
import { LocaleLanguages } from "@/i18n/utils";
import NavBarClient from "./shared/NavBarClient";
import { getShopPhone } from "@/lib/services/store-front/shop";

interface NavBarProps {
  locale: LocaleLanguages;
  localeMismatch?: LocaleLanguages;
}

export default async function NavBar({ locale, localeMismatch }: NavBarProps) {
  const phone = await getShopPhone();
  const customerAccessToken = await getCustomerAccessToken(true);
  
  return (
    <header className="fixed w-full z-20 p-5 md:p-10">
      <NavBarClient
        phone={phone}
        storedLocale={locale}
        localeMismatch={localeMismatch}
        customerAccessToken={customerAccessToken}
      />
    </header>
  );
}