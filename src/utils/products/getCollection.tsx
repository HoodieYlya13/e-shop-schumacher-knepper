import { Collection } from "@shopify/hydrogen-react/storefront-api-types";

export async function getCollection(handle: string): Promise<Collection> {
  const response = await fetch("/api/products/collection", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ handle }),
  });

  if (!response.ok) throw new Error("Failed to fetch the collection.");

  const collection: Collection = await response.json();

  return collection;
}