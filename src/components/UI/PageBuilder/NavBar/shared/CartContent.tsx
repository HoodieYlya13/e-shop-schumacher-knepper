'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { openCheckout } from "@/utils/checkout/openCheckout";
import clsx from 'clsx';

type CartItem = {
  variantId: string;
  quantity: number;
  product: {
    id: string;
    title: string;
    featuredImage: { url: string; altText?: string | null };
    price: string;
    currencyCode: string;
  };
};

function TrashIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="-3 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        id="Icon-Set-Filled"
        transform="translate(-261.000000, -205.000000)"
        fill="currentColor"
      >
        <path
          d="M268,220 C268,219.448 268.448,219 269,219 C269.552,219 270,219.448 270,220 L270,232 C270,232.553 269.552,233 269,233 C268.448,233 268,232.553 268,232 L268,220 L268,220 Z M273,220 C273,219.448 273.448,219 274,219 C274.552,219 275,219.448 275,220 L275,232 C275,232.553 274.552,233 274,233 C273.448,233 273,232.553 273,232 L273,220 L273,220 Z M278,220 C278,219.448 278.448,219 279,219 C279.552,219 280,219.448 280,220 L280,232 C280,232.553 279.552,233 279,233 C278.448,233 278,232.553 278,232 L278,220 L278,220 Z M263,233 C263,235.209 264.791,237 267,237 L281,237 C283.209,237 285,235.209 285,233 L285,217 L263,217 L263,233 L263,233 Z M277,209 L271,209 L271,208 C271,207.447 271.448,207 272,207 L276,207 C276.552,207 277,207.447 277,208 L277,209 L277,209 Z M285,209 L279,209 L279,207 C279,205.896 278.104,205 277,205 L271,205 C269.896,205 269,205.896 269,207 L269,209 L263,209 C261.896,209 261,209.896 261,211 L261,213 C261,214.104 261.895,214.999 262.999,215 L285.002,215 C286.105,214.999 287,214.104 287,213 L287,211 C287,209.896 286.104,209 285,209 L285,209 Z"
        ></path>
      </g>
    </svg>
  );
}

export default function CartContent() {
  const t = useTranslations('CART');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const updateCart = (newCart: CartItem[]) => {
    localStorage.setItem('cart', JSON.stringify(newCart));
    setCart(newCart);
  };

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      const initialCart: CartItem[] = JSON.parse(storedCart);
      setCart(initialCart);
    }
    setLoading(false);
  }, []);

  const handleRemoveItem = (variantId: string) => {
    const newCart = cart.filter(item => item.variantId !== variantId);
    updateCart(newCart);
  };

  const handleQuantityChange = (variantId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    const newCart = cart.map(item =>
      item.variantId === variantId ? { ...item, quantity: newQuantity } : item
    );
    updateCart(newCart as CartItem[]);
  };
  
  const handleCheckout = async () => {
    if (cart.length === 0) return;

    setIsCheckingOut(true);

    try {
      const lineItems = cart.map(item => ({
        variantId: item.variantId,
        quantity: item.quantity,
      }));
      
      await openCheckout(lineItems);

    } catch (error) {
      console.error("Checkout failed:", error);
    } finally {
      setIsCheckingOut(false);
    }
  };

  const subtotal = cart.reduce((acc, item) => {
    const price = parseFloat(item.product.price);
    return acc + (price * item.quantity);
  }, 0);

  if (loading) return (
    <div className="flex justify-center items-center size-full">
      <p>Loading cart...</p>
    </div>
  );

  if (cart.length === 0) return (
    <div className="flex justify-center items-center size-full flex-col space-y-4">
      <p className="text-2xl font-semibold">{t("EMPTY")}</p>
      <p className="text-dark">{t("EMPTY_CART_MESSAGE")}</p>
    </div>
  );

  return (
    <div className="size-full p-1 xs:p-2 sm:p-4 pt-0">
      <div className="relative size-full flex flex-col gap-4">
        <h1 className="text-3xl xs:text-4xl font-bold">{t("TITLE")}</h1>

        <div className="w-full grow flex flex-col overflow-y-auto px-1 border-y border-ultra-light">
          {cart.map((item, index) => (
            <div
              key={item.variantId}
              className={clsx(
                "flex shadow-md items-center space-x-2 sm:space-x-4 border-ultra-light/20 p-2 backdrop-blur-md liquid-glass-backdrop bg-ultra-light/10",
                { "border-t": index !== 0 }
              )}
            >
              <div className="relative size-6 xs:size-12 sm:size-24 shrink-0">
                <Image
                  src={item.product.featuredImage.url}
                  alt={item.product.featuredImage.altText || item.product.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: "cover" }}
                  className="rounded-lg"
                />
              </div>

              <div className="flex-1">
                <h2 className="font-semibold text-lg">{item.product.title}</h2>
                <p className="text-accent">
                  {parseFloat(item.product.price).toFixed(2)}{" "}
                  {item.product.currencyCode}
                </p>
              </div>

              <div className="flex items-center space-x-1 sm:space-x-2">
                <button
                  onClick={() =>
                    handleQuantityChange(item.variantId, item.quantity - 1)
                  }
                  className="size-6 sm:size-8 flex items-center justify-center border rounded-md hover:bg-ultra-light"
                >
                  -
                </button>
                <span className="min-w-fit w-6 sm:w-8 text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() =>
                    handleQuantityChange(item.variantId, item.quantity + 1)
                  }
                  className="size-6 sm:size-8 flex items-center justify-center border rounded-md hover:bg-ultra-light"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => handleRemoveItem(item.variantId)}
                className="text-invalid cursor-pointer opacity-80 hover:opacity-100 transition hover:scale-110 duration-300"
              >
                <TrashIcon />
              </button>
            </div>
          ))}
        </div>

        <div className="w-full flex flex-col justify-end bottom-0 p-4 bg-secondary rounded-lg shadow-md">
          <div className="flex justify-between font-bold text-xl mb-4">
            <span>{t("SUBTOTAL")}:</span>
            <span>{subtotal.toFixed(2)} EUR</span>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full py-3 bg-accent font-semibold rounded-lg hover:bg-accent-dark transition-colors duration-300"
            disabled={isCheckingOut || cart.length === 0}
          >
            {isCheckingOut ? t("CHECKOUT_LOADING") : t("CHECKOUT")}
          </button>
        </div>
      </div>
    </div>
  );
}