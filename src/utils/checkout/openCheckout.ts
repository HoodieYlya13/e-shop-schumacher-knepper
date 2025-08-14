export async function openCheckout(
  lineItems: Array<{ variantId: string; quantity: number }>
) {
  const url = (
    await (
      await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lineItems }),
      })
    ).json()
  )?.url;

  if (url) window.location.href = url;
  else console.error("Checkout URL not found in response.");
}