'use client';

import Image from "next/image";

interface ShoppingCartProps {
  showCart: boolean;
  setShowCart: React.Dispatch<React.SetStateAction<boolean>>;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ShoppingCart({ showCart, setShowCart, setShowMenu }: ShoppingCartProps) {
  return (
    <button onClick={() => {
      setShowCart(!showCart);
      setShowMenu(false);
    }}>
      <Image
        src="/img/icons/cart.svg"
        width={24}
        height={24}
        alt="cart"
        className="cursor-pointer opacity-80 hover:opacity-100 transition hover:scale-110 duration-300"
      />
    </button>
  );
}