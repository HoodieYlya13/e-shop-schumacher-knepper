export function convertGoogleMapsUrl(url: string): string {
  if (url.includes("/embed?pb=")) return url;

  const nameMatch = url.match(/\/place\/([^/]+)/);
  const placeName = nameMatch ? decodeURIComponent(nameMatch[1].replace(/\+/g, ' ')) : "";

  const match = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (!match) 
    return "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d10364.189363249656!2d6.35322!3d49.5025!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4795155944acdcb7%3A0xc23fde4d449060d4!2sDomaine%20viticole%20Schumacher-Knepper!5e0!3m2!1sfr!2sus!4v1763323542825!5m2!1sfr!2sus";

  const lat = match[1];
  const lng = match[2];
  const encodedName = encodeURIComponent(placeName);

  return `https://www.google.com/maps?q=${encodedName}+@${lat},${lng}&z=15&output=embed`;
}