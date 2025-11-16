import Button from "@/components/UI/shared/elements/Button";
import { getShopLocation } from "@/lib/services/store-front/shop";

function LocationIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="currentColor"
    >
      <path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z" />
    </svg>
  );
}

export default async function Location() {
  const location = await getShopLocation();

  return (
    <Button
      href="https://www.google.fr/maps/place/Domaine+viticole+Schumacher-Knepper/@49.5025,6.35322,1021m/data=!3m2!1e3!4b1!4m6!3m5!1s0x4795155944acdcb7:0xc23fde4d449060d4!8m2!3d49.5025!4d6.35322!16s%2Fg%2F1td0lz28?entry=ttu&g_ep=EgoyMDI1MTExMi4wIKXMDSoASAFQAw%3D%3D"
      target="_blank"
      className="opacity-80 hover:opacity-100 text-primary gap-1 w-fit"
    >
      <LocationIcon />
      <div className="flex flex-col">
        <p>{location.name}</p>
        <p>{location.street}</p>
        <p>{`${location.postalCode} ${location.city}`}</p>
        <p>{location.country}</p>
      </div>
    </Button>
  );
}