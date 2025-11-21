import { LocaleLanguagesUpperCase } from "@/i18n/utils";
import { getCollectionByHandle } from "@/lib/services/store-front/products";
import { getCustomerCountryServer } from "@/utils/shared/getters/getCustomerCountryServer";
import { getPreferredLocale } from "@/utils/shared/getters/getPreferredLocale";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { handle } = await req.json();
  const language = await getPreferredLocale(true) as LocaleLanguagesUpperCase;
  const country = await getCustomerCountryServer();

  try {
    if (!handle)
      return NextResponse.json({ error: "Missing handle" }, { status: 400 });

    const collection = await getCollectionByHandle(handle, language, country);

    if (!collection) {
      return NextResponse.json(
        { error: "Collection not found" },
        { status: 500 }
      );
    }

    const response = NextResponse.json(collection);

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}