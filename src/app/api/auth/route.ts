import { NextRequest, NextResponse } from 'next/server';
import { createCustomerAccount, createCustomerAccessToken, recoverCustomerAccount, resetCustomerPasswordByUrl } from '@/lib/services/auth';

export async function POST(req: NextRequest) {
  const { mode, email, password, firstName, lastName, phone, acceptsMarketing, resetUrl } = await req.json();

  const forwardedFor =
    req.headers.get("x-forwarded-for") ??
    req.headers.get("x-real-ip") ??
    req.headers.get("forwarded");
  const buyerIp = forwardedFor?.split(",")[0]?.trim();

  try {
    let response;
    
    if (!mode || !['REGISTER', 'LOGIN', 'PASSWORD_RECOVERY', 'NEW_PASSWORD'].includes(mode)) {
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

    if (mode === 'NEW_PASSWORD') {
      response = await resetCustomerPasswordByUrl(password, resetUrl, buyerIp);
    }

    return NextResponse.json(response);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}