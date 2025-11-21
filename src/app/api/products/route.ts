import { LocaleLanguagesUpperCase } from "@/i18n/utils";
import { getProductsForLiveSearch } from "@/lib/services/store-front/products";
import { ProductSuggestion } from "@/utils/products/getProductsSearchSuggestions";
import { getCustomerCountryServer } from "@/utils/shared/getters/getCustomerCountryServer";
import { getPreferredLocale } from "@/utils/shared/getters/getPreferredLocale";
import { Product } from "@shopify/hydrogen-react/storefront-api-types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { title } = await req.json();
  const language = (await getPreferredLocale(true)) as LocaleLanguagesUpperCase;
  const country = await getCustomerCountryServer();

  try {
    if (!title)
      return NextResponse.json(
        { error: "Missing title" },
        { status: 400 }
      );

    const products: Product[] = await getProductsForLiveSearch(title, language, country);

    const simplifiedProducts: ProductSuggestion[] = products.map((product) => ({
      handle: product.handle,
      title: product.title,
      image: product.images.edges[0]?.node
        ? {
            url: product.images.edges[0].node.url,
            altText: product.images.edges[0].node.altText ?? null,
          }
        : null,
    }));

    const response = NextResponse.json(simplifiedProducts);

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}