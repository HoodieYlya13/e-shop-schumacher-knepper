import { defaultLocaleUpperCase, LocaleLanguagesUpperCase } from "@/i18n/utils";
import { Collection } from "@shopify/hydrogen-react/storefront-api-types";

export async function getCollection(
  handle: string,
  language: LocaleLanguagesUpperCase = defaultLocaleUpperCase
): Promise<Collection> {
  const response = await fetch("/api/products/collection", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ handle, language }),
  });

  if (!response.ok) throw new Error("Failed to fetch the collection.");

  const collection: Collection = await response.json();

  return collection;
}