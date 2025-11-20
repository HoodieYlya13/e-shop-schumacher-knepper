import { Cart } from "@shopify/hydrogen-react/storefront-api-types";

export async function openCheckout(
  lineItems: Array<{ variantId: string; quantity: number }>
) {
  const response = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lineItems }),
  });

  const data = await response.json();
  
  const cart = data.cart || data; 

  if (cart && cart.url) {
    if (typeof window !== "undefined" && cart.lines?.edges) {
      try {
        const storedCartRaw = localStorage.getItem("cart");
        const localCart = storedCartRaw ? JSON.parse(storedCartRaw) : [];
        let hasChanges = false;

        cart.lines.edges.forEach((edge: Cart["lines"]["edges"][number]) => {
          const shopifyLine = edge.node;
          const shopifyVariantId = shopifyLine.merchandise?.id;
          const shopifyLineId = shopifyLine.id;

          const localItemIndex = localCart.findIndex(
            (item: { variantId: string }) => item.variantId === shopifyVariantId
          );

          if (localItemIndex > -1 && localCart[localItemIndex].lineId !== shopifyLineId) {
            localCart[localItemIndex].lineId = shopifyLineId;
            hasChanges = true;
          }
        });

        if (hasChanges) {
          localStorage.setItem("cart", JSON.stringify(localCart));
          window.dispatchEvent(new Event("cartUpdated")); 
        }
        
        if (cart.id) localStorage.setItem("cartId", cart.id);

      } catch (e) {
        console.error("Failed to sync cart lines:", e);
      }
    }

    window.location.href = cart.url;
    
  } else console.error("Checkout URL not found in response.", data);
}