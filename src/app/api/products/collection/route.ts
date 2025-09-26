import { getCollectionByHandle } from '@/lib/services/store-front/products';
import { Collection } from '@shopify/hydrogen-react/storefront-api-types';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { handle, language } = await req.json();

  try {
    if (!handle) return NextResponse.json({ error: 'Missing handle' }, { status: 400 });

    const collection: Collection = await getCollectionByHandle(handle, language);

    const response = NextResponse.json(collection);

    return response;
  } catch (error: unknown) {
    if (error instanceof Error) return NextResponse.json({ error: error.message }, { status: 500 });
    
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}