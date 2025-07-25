import { NextRequest, NextResponse } from 'next/server';
import { getPreferredLocale } from '@/utils/shared/getters/getPreferredLocale';
import { customerUpdateLocale } from '@/lib/services/admin/customer';
import { getBuyerCountry } from '@/utils/shared/getters/getBuyerCountry';

export async function POST(req: NextRequest) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 });

  const locale = await getPreferredLocale() as "en" | "fr" | "de";

  try {
    const customer = await customerUpdateLocale(id, locale);

    return NextResponse.json({ success: true, customer });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}