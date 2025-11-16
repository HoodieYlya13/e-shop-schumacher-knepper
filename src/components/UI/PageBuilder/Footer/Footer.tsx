import { getShopName } from "@/lib/services/store-front/shop";
import { getPreferredLocale } from "@/utils/shared/getters/getPreferredLocale";
import { getTranslations } from "next-intl/server";
import Button from "../../shared/elements/Button";
import DomainNavigation from "./shared/DomainNavigation";
import ContactUs from "./shared/ContactUs";

export default async function Footer() {
  const locale = await getPreferredLocale();
  const t = await getTranslations({ locale: locale || 'en', namespace: 'HOME_PAGE' });
  const shopName = await getShopName();

  const titleClassName = "w-fit text-2xl hover:underline";

  return (
    <footer className="w-full p-5 md:px-10 shadow-[0_-25px_50px_-12px_rgb(0_0_0/0.25)] bg-secondary">
      <div className="w-full max-w-7xl flex flex-col gap-5 justify-center mx-auto">
        <div className="flex flex-col sm:flex-row gap-5 sm:gap-0 md:gap-5 place-content-around">
          <div className="flex flex-col gap-4">
            <Button href={"/"} className={titleClassName} child="Le domaine" />
            <DomainNavigation />
          </div>

          <div className="inline-flex gap-4 md:w-full md:max-w-3xl">
            <div className="flex flex-col gap-4">
              <Button
                href={"/contact-us"}
                className={titleClassName}
                child="Nous contacter"
              />
              <ContactUs />
            </div>
            <div className="hidden md:flex border flex-1">map</div>
          </div>
        </div>

        <div className="flex flex-col gap-1 text-center">
          <p className="text-sm text-dark">
            &copy; {new Date().getFullYear()}{" "}
            <Button
              href="https://www.schumacher-knepper.lu"
              target="_blank"
              child={t("WELCOME", { shopName })}
              className="opacity-100"
              underline
            />
            . {t("ALL_RIGHTS_RESERVED")}
          </p>

          <p className="text-xs text-dark/80">
            {t("DEVELOPED_BY")}{" "}
            <Button
              href="https://hy13dev.com"
              target="_blank"
              child="HY13dev"
              className="opacity-100"
              underline
            />
          </p>
        </div>
      </div>
    </footer>
  );
}