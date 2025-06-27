"use client";

import { Customer } from "@shopify/hydrogen-react/storefront-api-types";

export async function fetchCustomerData(token: string): Promise<Customer> {
  const response = await fetch("/api/customer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token,
      identifiers: [
        { namespace: "Membership", key: "VIP level" },
        { namespace: "Membership", key: "startDate" },
        { namespace: "note", key: "preference" },
      ],
    }),
  });

  const json = await response.json();  

  if (!response.ok || !json) {
    throw new Error("Failed to fetch customer");
  }

  return json;
}