import Footer from "./Footer/Footer";
import NavBar from "./NavBar/NavBar";
import CustomerGeoInfo from "./CustomerGeoInfo/CustomerGeoInfo";
import clsx from "clsx";
import Aurora from "./NavBar/shared/Aurora";
import LocaleMismatch from "./LocaleMismatch";
import { getServerCookie } from "@/utils/shared/getters/shared/getServerCookie";
import { getPreferredLocale } from "@/utils/shared/getters/getPreferredLocale";
import { LocaleLanguages } from "@/i18n/utils";

interface PageLayoutProps {
  children: React.ReactNode;
  padding?: boolean;
  showNavBar?: boolean;
  showFooter?: boolean;
  auroraBackground?: boolean;
}

export default async function PageLayout({
  children,
  padding = true,
  showNavBar = true,
  showFooter = true,
  auroraBackground = false,
}: PageLayoutProps) {
  const locale = await getPreferredLocale() as LocaleLanguages

  const localeMismatch = (await getServerCookie("locale_mismatch")) as
    | LocaleLanguages
    | undefined;

  return (
    <div className="flex flex-col bg-primary text-primary font-black">
      {showNavBar && <NavBar locale={locale} localeMismatch={localeMismatch} />}

      {auroraBackground && <Aurora speed={0.3} />}

      {localeMismatch && <LocaleMismatch locale={locale} localeMismatch={localeMismatch} />}

      <div className="flex flex-col z-10">
        <main
          className={clsx("grow text-secondary flex flex-col min-h-dvh", {
            "p-5 md:p-10 pt-26 md:pt-36": padding,
          })}
        >
          {children}
        </main>
        {showFooter && <Footer />}
      </div>

      <CustomerGeoInfo />
    </div>
  );
}
