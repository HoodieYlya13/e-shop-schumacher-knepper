import Button from "@/components/UI/shared/elements/Button";
import { getShopMail } from "@/lib/services/store-front/shop";

function MailIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="currentColor"
    >
      <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z" />
    </svg>
  );
}

export default async function Mail() {
  const mail = await getShopMail();

  return (
    <Button
      href={`mailto:${mail}`}
      className="opacity-80 hover:opacity-100 gap-1 w-fit"
    >
      <MailIcon />
      {mail}
    </Button>
  );
}