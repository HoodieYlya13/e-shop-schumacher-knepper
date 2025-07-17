'use client';

import { logout } from '@/utils/account/logout';
import { useRouter } from 'next/navigation';

export default function Logout() {
  const router = useRouter();

  return (
    <button
      onClick={() => logout(router)}
      className="text-sm text-red-600 underline hover:text-red-800"
    >
      Log out
    </button>
  );
}