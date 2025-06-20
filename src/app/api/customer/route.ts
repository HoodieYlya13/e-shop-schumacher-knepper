import { NextRequest, NextResponse } from 'next/server';
import { fetchCustomerData } from '@/lib/data/customer';

export async function POST(req: NextRequest) {
  try {
    const { token, identifiers } = await req.json();

    if (!token) {
      return NextResponse.json({ error: 'Missing customer token' }, { status: 400 });
    }

    const customer = await fetchCustomerData(token, identifiers);
    return NextResponse.json(customer);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}