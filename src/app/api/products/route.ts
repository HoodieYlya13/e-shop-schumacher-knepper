
import { NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/services/products';
import { getPreferredLocale } from '@/utils/shared/getters/getPreferredLocale';

export async function GET() {
  const languageCode = getPreferredLocale()?.toUpperCase() as 'EN' | 'FR' | 'DE' | undefined;

  try {
    const products = await getAllProducts(languageCode);
    return NextResponse.json(products);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}