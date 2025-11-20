export async function updateCartLinesClient(payload: {
  type: 'add' | 'update' | 'remove';
  variantId?: string;
  lineId?: string;
  lineIds?: string[];
  quantity?: number;
}) {
  const response = await fetch('/api/checkout/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update cart');
  }

  const data = await response.json();
  return data.cart;
}

export async function deleteCheckout() {
  await fetch("/api/checkout/delete", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    }
  });
}