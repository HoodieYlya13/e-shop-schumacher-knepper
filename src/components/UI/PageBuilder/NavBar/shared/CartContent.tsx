'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { openCheckout } from "@/utils/checkout/openCheckout";

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading cart...</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 flex-col space-y-4">
        <p className="text-2xl font-semibold">{t('EMPTY')}</p>
        <p className="text-gray-500">{t('EMPTY_CART_MESSAGE')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-bold mb-8">{t("TITLE")}</h1>

      <div className="space-y-6">
        {cart.map((item) => (
          <div
            key={item.variantId}
            className="flex items-center space-x-4 border-b pb-4"
          >
            <div className="relative w-24 h-24 flex-shrink-0">
              <Image
                src={item.product.featuredImage.url}
                alt={item.product.featuredImage.altText || item.product.title}
                fill
                style={{ objectFit: "cover" }}
                className="rounded-lg"
              />
            </div>

            <div className="flex-1">
              <h2 className="font-semibold text-lg">{item.product.title}</h2>
              <p className="text-gray-600">
                {parseFloat(item.product.price).toFixed(2)}{" "}
                {item.product.currencyCode}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() =>
                  handleQuantityChange(item.variantId, item.quantity - 1)
                }
                className="w-8 h-8 flex items-center justify-center border rounded-md hover:bg-gray-100"
              >
                -
              </button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button
                onClick={() =>
                  handleQuantityChange(item.variantId, item.quantity + 1)
                }
                className="w-8 h-8 flex items-center justify-center border rounded-md hover:bg-gray-100"
              >
                +
              </button>
            </div>

            <button onClick={() => handleRemoveItem(item.variantId)}>
              <Image
                src="/img/icons/trash.svg"
                width={24}
                height={24}
                alt="phone"
                className="cursor-pointer opacity-80 hover:opacity-100 transition hover:scale-110 duration-300"
              />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <div className="w-full md:w-1/3 p-4 bg-secondary rounded-lg shadow-md">
          <div className="flex justify-between font-bold text-xl mb-4">
            <span>{t("SUBTOTAL")}:</span>
            <span>{subtotal.toFixed(2)} EUR</span>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full py-3 bg-blue-600 font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300"
            disabled={isCheckingOut || cart.length === 0}
          >
            {isCheckingOut ? t("CHECKOUT_LOADING") : t("CHECKOUT")}
          </button>
        </div>
      </div>
    </div>
  );
}