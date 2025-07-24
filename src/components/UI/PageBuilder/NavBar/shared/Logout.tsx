'use client';

import { logout } from '@/utils/account/logout';

export default function Logout() {
return (
  <button
    onClick={() => logout()}
    className="text-sm text-red-600 underline hover:text-red-800"
  >
    Log out
  </button>
);
}