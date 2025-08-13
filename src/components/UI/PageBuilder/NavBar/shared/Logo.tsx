'use client';

import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/">
      <Image
        src={"/img/logo.png"}
        width={30}
        height={30}
        alt="Schumacher Knepper Logo"
        className="h-8 w-auto cursor-pointer opacity-80 hover:opacity-100 transition hover:scale-110 duration-300"
      />
    </Link>
  );
}