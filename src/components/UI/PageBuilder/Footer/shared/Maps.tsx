import { getShopLocationUrl } from "@/lib/services/store-front/shop";

export default async function Maps() {
  const embedUrl = await getShopLocationUrl();

  return (
    <div className="hidden md:flex flex-1 rounded-lg shadow-lg shadow-accent-dark hover:scale-101 transition-transform duration-300 ease-in-out">
      <iframe
        title="Winery Location"
        className="size-full rounded-lg shadow-lg shadow-ultra-dark"
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={embedUrl}
      />
    </div>
  );
}