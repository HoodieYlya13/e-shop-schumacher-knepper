'use client';

import Image from "next/image";

export default function Phone() {
  return (
    <a href="tel:+352236045" className="flex flex-row transition hover:scale-110 duration-300">
      <Image
        src="/img/icons/phone.svg"
        width={24}
        height={24}
        alt="phone"
        className="cursor-pointer opacity-80 hover:opacity-100"
      />
      <span className="ml-1 text-outline flex md:hidden">+352 23 60 45</span>
    </a>
  );
}