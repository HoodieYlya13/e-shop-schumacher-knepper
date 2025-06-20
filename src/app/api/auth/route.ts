import { NextRequest, NextResponse } from 'next/server';
import { registerCustomer, loginCustomer } from '@/lib/data/auth';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { mode, email, password, firstName, lastName, phone, acceptsMarketing } = body;

  try {
    if (mode === 'REGISTER') {
      const response = await registerCustomer({
        email,
        password,
        firstName,
        lastName,
        phone,
        acceptsMarketing,
      });
      return NextResponse.json(response);
    }

    if (mode === 'LOGIN') {
      const response = await loginCustomer({ email, password });
      return NextResponse.json(response);
    }

    return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}