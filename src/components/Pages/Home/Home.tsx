import CountUp from "@/components/UI/shared/elements/CountUp";
import AllProductsButton from "./shared/AllProductsButton";
import { getHomeImageUrl, getShopName } from "@/lib/services/store-front/shop";
import { getTranslations } from "next-intl/server";
import { LocaleLanguages } from "@/i18n/utils";

export default async function Home({ locale }: { locale: LocaleLanguages }) {
  const t = await getTranslations({ locale, namespace: 'HOME_PAGE' });
  const shopName = await getShopName();
  const homeImageUrl = await getHomeImageUrl();

  const homeSectionStyle = {
    backgroundImage: `url('${homeImageUrl || "/img/barrel.jpg"}')`,
  };

  return (
    <>
      <section
        className="h-screen w-screen bg-cover bg-center relative shadow-2xl text-primary"
        style={homeSectionStyle}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-ultra-dark to-light opacity-20"></div>

        <div className="flex flex-col justify-center items-center text-9xl h-screen">
          <p className="text-5xl justify-center text-center">{t("WELCOME", { shopName })}</p>
          <p>{t("SINCE")}</p>
          <CountUp
            from={new Date().getFullYear()}
            to={1714}
            separator=""
            direction="up"
            duration={1}
            className="count-up-text"
          />

          <AllProductsButton />
        </div>
      </section>

      <section id="best-sellers" className="bg-primary h-screen">

      </section>
    </>
  );
}