'use client';

import { logout } from '@/utils/account/logout';
import Image from 'next/image';

export default function Logout() {
  return (
    <button onClick={() => logout()}>
      <Image
        src={`/img/icons/logout.svg`}
        width={24}
        height={24}
        alt="logout"
        className="cursor-pointer opacity-80 hover:opacity-100 transition hover:scale-110 duration-300"
      />
    </button>
  );
}