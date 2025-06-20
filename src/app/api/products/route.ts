
import { NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/services/products';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const lang = url.searchParams.get('lang')?.toUpperCase() as 'EN' | 'FR' | 'DE' || 'EN';

  try {
    const products = await getAllProducts(lang);
    return NextResponse.json(products);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}