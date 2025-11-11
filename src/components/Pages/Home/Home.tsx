import CountUp from "@/components/UI/shared/elements/CountUp";
import RecommendedProductsButton from "./shared/RecommendedProductsButton";
import { getHomeImageUrl, getShopName } from "@/lib/services/store-front/shop";
import { getTranslations } from "next-intl/server";
import { LocaleLanguages, LocaleLanguagesUpperCase } from "@/i18n/utils";
import { getAllProducts, getCollectionByHandle, getProductsByCollectionHandle } from "@/lib/services/store-front/products";
import RecommendedProducts from "./shared/RecommendedProducts";
import RecommendedCollection from "./shared/RecommendedCollection";
import SeeAllProductsButton from "./shared/SeeAllProductsButton";

export default async function Home({ locale }: { locale: LocaleLanguages }) {
  const t = await getTranslations({ locale, namespace: 'HOME_PAGE' });
  const shopName = await getShopName();
  const homeImageUrl = await getHomeImageUrl();

  const homeSectionStyle = {
    backgroundImage: `url('${homeImageUrl || "/img/barrel.jpg"}')`,
  };

  const language = locale.toUpperCase() as LocaleLanguagesUpperCase;
  
  // FIXME: all the calls with language
  const collection = await getCollectionByHandle("supertype_recommandations__Supertype_Recommandations", language);
  let products = await getProductsByCollectionHandle("supertype_recommandations__Supertype_Recommandations", language); // FIXME: temporary solution
  const areRecommendedProducts = products && products.length > 0;
  if (!areRecommendedProducts) products = await getAllProducts(language);
  products = products.slice(0, 10);

  const carouselDuration = products.length * 4;

  return (
    <>
      <section
        className="h-screen w-full bg-cover bg-center relative shadow-2xl text-primary"
        style={homeSectionStyle}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-ultra-dark to-light opacity-20"></div>

        <div className="flex flex-col gap-8 justify-center items-center text-8xl xs:text-9xl h-screen break-words">
          <div className="flex flex-col items-center">
            <p className="text-xl sm:text-5xl justify-center text-center">
              {t("WELCOME", { shopName })}
            </p>
            <p>{t("SINCE")}</p>
            <CountUp
              from={new Date().getFullYear()}
              to={1714}
              separator=""
              direction="up"
              duration={1}
              className="count-up-text"
            />
          </div>

          {products.length > 0 && (
            <RecommendedProductsButton
              areRecommendedProducts={areRecommendedProducts}
            />
          )}
        </div>
      </section>

      {products.length > 0 && (
        <section
          id="best-sellers"
          className="bg-primary flex flex-col py-8 justify-center items-center min-h-screen gap-2"
          style={
            {
              "--carousel-duration": `${carouselDuration}s`,
            } as React.CSSProperties
          }
        >
          <RecommendedCollection
            collection={collection}
            areRecommendedProducts={areRecommendedProducts}
          />
          <RecommendedProducts locale={locale} products={products} />
          <SeeAllProductsButton />
        </section>
      )}
    </>
  );
}