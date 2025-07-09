import { NextRequest, NextResponse } from 'next/server';
import { createCustomerAccount, createCustomerAccessToken, recoverCustomerAccount, resetCustomerPasswordByUrl } from '@/lib/services/auth';

export async function POST(req: NextRequest) {
  const { mode, email, password, firstName, lastName, phone, acceptsMarketing, resetUrl } = await req.json();

  try {
    let response;
    
    if (!mode || !['REGISTER', 'LOGIN', 'PASSWORD_RECOVERY', 'RESET_PASSWORD'].includes(mode)) {
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
      );
    }

    if (mode === 'LOGIN') {
      response = await createCustomerAccessToken({ email, password });
    }

    if (mode === 'PASSWORD_RECOVERY') {
      response = await recoverCustomerAccount(email);
    }

    if (mode === 'RESET_PASSWORD') {
      response = await resetCustomerPasswordByUrl(password, resetUrl);
    }

    return NextResponse.json(response);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}