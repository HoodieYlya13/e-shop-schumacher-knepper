export interface ProductSuggestion {
  handle: string;
  title: string;
  image: {
    url: string;
    altText: string | null;
  } | null;
}

export async function getProductsSearchSuggestions(
  title: string
): Promise<ProductSuggestion[]> {
  const response = await fetch("/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  });

  if (!response.ok) throw new Error("Failed to fetch product suggestions.");

  const products: ProductSuggestion[] = await response.json();

  return products;
}