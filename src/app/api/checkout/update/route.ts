import { NextRequest, NextResponse } from 'next/server';
import { LocaleLanguagesUpperCase } from '@/i18n/utils';
import { CartOperation, updateCheckoutLines } from '@/lib/services/store-front/checkout';
import { getCheckoutId } from '@/utils/shared/getters/getCheckoutId';
import { getCustomerCountryServer } from '@/utils/shared/getters/getCustomerCountryServer';
import { getPreferredLocale } from '@/utils/shared/getters/getPreferredLocale';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    type,
    variantId,
    lineId,
    lineIds,
    quantity,
  } = body;

  const cartId = await getCheckoutId();

  if (!cartId) return NextResponse.json({ cart: null });

  if (!type)
    return NextResponse.json(
      { error: "Operation type" },
      { status: 400 }
    );

  const country = await getCustomerCountryServer();
  const language = await getPreferredLocale(true) as LocaleLanguagesUpperCase;

  try {
    let operation: CartOperation;

    switch (type) {
      case 'add':
        if (!variantId || !quantity)
          return NextResponse.json(
            { error: "Missing variantId or quantity for add" },
            { status: 400 }
          );
        operation = { type: 'add', variantId, quantity };
        break;

      case 'update':
        if (!lineId || !quantity)
          return NextResponse.json(
            { error: "Missing lineId or quantity for update" },
            { status: 400 }
          );
        operation = { type: 'update', lineId, quantity };
        break;

      case 'remove':
        const idsToRemove = lineIds || (lineId ? [lineId] : []);
        if (idsToRemove.length === 0)
          return NextResponse.json(
            { error: "Missing lineIds for remove" },
            { status: 400 }
          );
        operation = { type: 'remove', lineIds: idsToRemove };
        break;

      default:
        return NextResponse.json(
          { error: "Invalid operation type" },
          { status: 400 }
        );
    }

    const updatedCart = await updateCheckoutLines(cartId, operation, {
      country,
      language,
    });

    return NextResponse.json({ cart: updatedCart });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}