
import { NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/services/products';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const lang = url.searchParams.get('lang')?.toUpperCase() as 'EN' | 'FR' | 'DE' || 'EN';

  const forwardedFor =
    req.headers.get("x-forwarded-for") ??
    req.headers.get("x-real-ip") ??
    req.headers.get("forwarded");
  const buyerIp = forwardedFor?.split(',')[0]?.trim();

  try {
    const products = await getAllProducts(lang, buyerIp);
    return NextResponse.json(products);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}