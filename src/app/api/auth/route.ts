import { NextRequest, NextResponse } from 'next/server';
import { registerCustomer, loginCustomer } from '@/lib/services/auth';

export async function POST(req: NextRequest) {
  const { mode, email, password, firstName, lastName, phone, acceptsMarketing } = await req.json();

  const forwardedFor = req.headers.get('x-forwarded-for');
  const buyerIp = forwardedFor?.split(',')[0]?.trim();

  try {
    if (mode === 'REGISTER') {
      const response = await registerCustomer(
        {
          email,
          password,
          firstName,
          lastName,
          phone,
          acceptsMarketing,
        },
        buyerIp
      );
      return NextResponse.json(response);
    }

    if (mode === 'LOGIN') {
      const response = await loginCustomer({ email, password }, buyerIp);
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