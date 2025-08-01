'use client';

import { openCheckout } from "@/utils/checkout/openCheckout";

export default function ShoppingCart() {
  const variantId = "gid://shopify/ProductVariant/50446774370632";

  return (
    <button
      onClick={() => openCheckout(variantId)}
      className="text-sm p-4 text-red-600 underline hover:text-red-800"
    >
      Checkout
    </button>
  );
}