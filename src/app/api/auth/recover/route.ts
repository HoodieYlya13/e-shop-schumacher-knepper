import { NextRequest, NextResponse } from 'next/server';
import { recoverCustomer } from '@/lib/services/auth';

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  const forwardedFor = req.headers.get('x-forwarded-for');
  const buyerIp = forwardedFor?.split(',')[0]?.trim();

  try {
    const response = await recoverCustomer(email, buyerIp);

    return NextResponse.json(response);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}