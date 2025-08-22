import { getShopName } from "@/lib/services/store-front/shop";
import { getPreferredLocale } from "@/utils/shared/getters/getPreferredLocale";
import { getTranslations } from "next-intl/server";

export default async function Footer() {
  const locale = await getPreferredLocale();
  const t = await getTranslations({ locale: locale || 'en', namespace: 'HOME_PAGE' });
  const shopName = await getShopName();

  return (
    <footer className="w-full p-5 flex flex-col gap-4 justify-center shadow-[0_-25px_50px_-12px_rgb(0_0_0_/_0.25)] bg-secondary">
      <div className="flex flex-col md:flex-row gap-2 justify-center">
        <div className="max-w-4xl flex flex-col gap-1">
          <h1 className="text-xl">Le domaine</h1>
          <div>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry&#39;s standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
          </div>
        </div>

        <div className="max-w-4xl flex flex-col gap-1">
          <h1 className="text-xl">Nous contacter</h1>
          <div>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry&#39;s standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
          </div>
        </div>
      </div>

      <p className="text-sm text-dark text-center">
        &copy; {new Date().getFullYear()}{" "}
        <span>
          <a
            href="https://www.schumacher-knepper.lu/"
            target="blank"
            className="underline"
          >
            {t("WELCOME", { shopName })}
          </a>
        </span>
        . {t("ALL_RIGHTS_RESERVED")}
      </p>
    </footer>
  );
}