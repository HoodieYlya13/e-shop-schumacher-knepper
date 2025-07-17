export async function openCheckout(variantId: string, quantity?: string) {
  const url = (await (await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ variantId, quantity }),
  })).json())?.url;

  if (url) {
    window.location.href = url;
  } else {
    console.error("Checkout URL not found in response.");
  }
}