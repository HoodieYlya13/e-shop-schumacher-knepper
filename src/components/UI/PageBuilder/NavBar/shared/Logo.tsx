'use client';

import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  logoUrl?: string;
}

export default function Logo({ logoUrl }: LogoProps) {
  return (
    <Link href="/">
      <Image
        src={logoUrl || "/img/logo.png"}
        width={32}
        height={32}
        alt="Schumacher Knepper Logo"
        className="h-8 w-auto cursor-pointer opacity-80 hover:opacity-100 transition hover:scale-110 duration-300"
      />
    </Link>
  );
}