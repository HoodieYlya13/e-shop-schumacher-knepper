import { NextRequest, NextResponse } from "next/server";
import { getPreferredLocale } from "@/utils/shared/getters/getPreferredLocale";
import { customerUpdateLocale } from "@/lib/services/admin/customer";
import { LocaleLanguages } from "@/i18n/utils";

export async function POST(req: NextRequest) {
  const { id } = await req.json();
  if (!id)
    return NextResponse.json(
      { error: "Customer ID is required" },
      { status: 400 }
    );

  const locale = await getPreferredLocale() as LocaleLanguages;

  try {
    const customer = await customerUpdateLocale(id, locale);

    return NextResponse.json({ customer });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}