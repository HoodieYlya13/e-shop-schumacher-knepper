import { convertGoogleMapsUrl } from "@/utils/shared/convertGoogleMapsUrl";

export default function Maps() {
  const embedUrl = convertGoogleMapsUrl(
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d10364.189363249656!2d6.35322!3d49.5025!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4795155944acdcb7%3A0xc23fde4d449060d4!2sDomaine%20viticole%20Schumacher-Knepper!5e0!3m2!1sfr!2sus!4v1763323542825!5m2!1sfr!2sus"
  );

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