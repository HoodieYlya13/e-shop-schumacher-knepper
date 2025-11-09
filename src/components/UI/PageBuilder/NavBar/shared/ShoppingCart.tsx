'use client';

import React, { useEffect, useState } from 'react';

function ShoppingCartIcon() {
  return (
    <svg
      fill="currentColor"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 902.86 902.86"
    >
      <g>
        <g>
          <path
            d="M671.504,577.829l110.485-432.609H902.86v-68H729.174L703.128,179.2L0,178.697l74.753,399.129h596.751V577.829z
            M685.766,247.188l-67.077,262.64H131.199L81.928,246.756L685.766,247.188z"
          />
          <path
            d="M578.418,825.641c59.961,0,108.743-48.783,108.743-108.744s-48.782-108.742-108.743-108.742H168.717
            c-59.961,0-108.744,48.781-108.744,108.742s48.782,108.744,108.744,108.744c59.962,0,108.743-48.783,108.743-108.744
            c0-14.4-2.821-28.152-7.927-40.742h208.069c-5.107,12.59-7.928,26.342-7.928,40.742
            C469.675,776.858,518.457,825.641,578.418,825.641z M209.46,716.897c0,22.467-18.277,40.744-40.743,40.744
            c-22.466,0-40.744-18.277-40.744-40.744c0-22.465,18.277-40.742,40.744-40.742C191.183,676.155,209.46,694.432,209.46,716.897z
            M619.162,716.897c0,22.467-18.277,40.744-40.743,40.744s-40.743-18.277-40.743-40.744c0-22.465,18.277-40.742,40.743-40.742
            S619.162,694.432,619.162,716.897z"
          />
        </g>
      </g>
    </svg>
  );
}

interface ShoppingCartProps {
  showCart: boolean;
  setShowCart: React.Dispatch<React.SetStateAction<boolean>>;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ShoppingCart({ showCart, setShowCart, setShowMenu }: ShoppingCartProps) {
  const [cartCount, setCartCount] = useState<number>(0);

  useEffect(() => {
    const updateCartCount = () => {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        try {
          const parsedCart = JSON.parse(storedCart);
          const totalQuantity = parsedCart.reduce(
            (sum: number, item: { quantity: number }) => sum + item.quantity,
            0
          );
          setCartCount(totalQuantity);
        } catch (error) {
          console.error("Error parsing cart data:", error);
          setCartCount(0);
        }
      } else setCartCount(0);
    };

    updateCartCount();

    window.addEventListener("storage", updateCartCount);
    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  return (
    <button
      onClick={() => {
        setShowCart(!showCart);
        setShowMenu(false);
      }}
      className="relative cursor-pointer opacity-80 hover:opacity-100 transition hover:scale-110 duration-300"
    >
      <ShoppingCartIcon />

      {cartCount > 0 && (
        <div className="absolute -top-1/2 left-0 text-xs w-5 h-5 flex justify-center items-center">
          {cartCount > 9 ? "9+" : cartCount}
        </div>
      )}
    </button>
  );
}