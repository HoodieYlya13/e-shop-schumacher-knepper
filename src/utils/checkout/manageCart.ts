import { Cart, Product } from "@shopify/hydrogen-react/storefront-api-types";
import { updateCartLinesClient, deleteCheckout } from "./updateCheckout";
import { CartItem } from "@/components/UI/PageBuilder/NavBar/shared/CartContent";

export const addProductToCart = async (
  variantId: string,
  product?: Product,
  quantity?: number
) => {
  if (typeof window === "undefined") return;

  const storedCart = localStorage.getItem("cart");
  const cart = storedCart ? JSON.parse(storedCart) : [];

  const existingItemIndex = cart.findIndex(
    (item: { variantId: string }) => item.variantId === variantId
  );

  const qty = quantity ?? 1;

  const productData = product
    ? {
        id: product.id,
        title: product.title,
        featuredImage: product.featuredImage
          ? {
              url: product.featuredImage.url,
              altText: product.featuredImage.altText,
            }
          : null,
        price: product.variants.edges[0]?.node.price.amount,
        currencyCode: product.variants.edges[0]?.node.price.currencyCode,
      }
    : undefined;

  if (existingItemIndex > -1) cart[existingItemIndex].quantity += qty;
  else if (productData)
    cart.push({
      variantId,
      quantity: qty,
      product: productData,
      lineId: null,
    });

  localStorage.setItem("cart", JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));

  try {
    const updatedShopifyCart = await updateCartLinesClient({
      type: "add",
      variantId,
      quantity: qty,
    });

    if (updatedShopifyCart === null) return;

    const updatedLocalCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const localItemIndex = updatedLocalCart.findIndex(
      (item: CartItem) => item.variantId === variantId
    );

    if (localItemIndex > -1) {
      const shopifyLine = updatedShopifyCart.lines.edges.find(
        (edge: Cart["lines"]["edges"][number]) =>
          edge.node.merchandise.id === variantId
      );

      if (shopifyLine) {
        updatedLocalCart[localItemIndex].lineId = shopifyLine.node.id;
        localStorage.setItem("cart", JSON.stringify(updatedLocalCart));
      }
    }
  } catch (error) {
    console.error("Failed to add item to Shopify cart:", error);
  }
};

export const removeProductQuantity = async (variantId: string, quantity?: number) => {
  if (typeof window === "undefined") return;

  const storedCart = localStorage.getItem("cart");
  if (!storedCart) return;

  const cart = JSON.parse(storedCart);
  const existingItemIndex = cart.findIndex(
    (item: { variantId: string }) => item.variantId === variantId
  );

  if (existingItemIndex === -1) return;

  const item = cart[existingItemIndex];
  const delta = quantity ?? -1;
  const newQuantity = item.quantity + delta;
  const lineId = item.lineId;

  if (newQuantity <= 0) cart.splice(existingItemIndex, 1);
  else cart[existingItemIndex].quantity = newQuantity;

  localStorage.setItem("cart", JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));

  if (lineId) {
    try {
      if (newQuantity <= 0)
        await updateCartLinesClient({
          type: "remove",
          lineId: lineId,
        });
      else
        await updateCartLinesClient({
          type: "update",
          lineId: lineId,
          quantity: newQuantity,
        });
    } catch (error) {
      console.error("Failed to update quantity in Shopify:", error);
    }
  }
};

export const deleteProductFromCart = async (variantId: string) => {
  if (typeof window === "undefined") return;

  const storedCart = localStorage.getItem("cart");
  if (!storedCart) return;

  const cart = JSON.parse(storedCart);

  const itemToDelete = cart.find(
    (item: { variantId: string }) => item.variantId === variantId
  );

  const updatedCart = cart.filter(
    (item: { variantId: string }) => item.variantId !== variantId
  );

  localStorage.setItem("cart", JSON.stringify(updatedCart));
  window.dispatchEvent(new Event("cartUpdated"));

  if (itemToDelete?.lineId) {
    try {
      await updateCartLinesClient({
        type: "remove",
        lineId: itemToDelete.lineId,
      });
    } catch (error) {
      console.error("Failed to remove item from Shopify:", error);
    }
  }

  if (updatedCart.length === 0) {
    try {
      await deleteCheckout();
    } catch (error) {
      console.error("Failed to delete checkout:", error);
    }
  }
};