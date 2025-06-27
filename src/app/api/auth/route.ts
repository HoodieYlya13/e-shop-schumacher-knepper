import { NextRequest, NextResponse } from 'next/server';
import { createCustomerAccount, createCustomerAccessToken, recoverCustomerAccount } from '@/lib/services/auth';

export async function POST(req: NextRequest) {
  const { mode, email, password, firstName, lastName, phone, acceptsMarketing } = await req.json();

  const forwardedFor = req.headers.get('x-forwarded-for');
  const buyerIp = forwardedFor?.split(',')[0]?.trim();

  try {
    let response;
    
    if (!mode || !['REGISTER', 'LOGIN', 'PASSWORD_RECOVERY'].includes(mode)) {
      return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });
    }

    if (mode === 'REGISTER') {
      response = await createCustomerAccount(
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
    }

    if (mode === 'LOGIN') {
      response = await createCustomerAccessToken({ email, password }, buyerIp);
    }

    if (mode === 'PASSWORD_RECOVERY') {
      response = await recoverCustomerAccount(email, buyerIp);
    }

    return NextResponse.json(response);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}