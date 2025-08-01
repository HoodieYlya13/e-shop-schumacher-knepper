import { setServerCookie } from '@/utils/shared/setters/shared/setServerCookie';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { customerIp } = await req.json();
  if (!customerIp) return NextResponse.json({ error: 'Customer IP is required' }, { status: 400 });

  try {
    const response = NextResponse.json({ success: true });

    setServerCookie({
      name: "customer_ip",
      value: customerIp,
      response,
      options: { maxAge: 60 * 60 * 24 },
    });

    return response;
  } catch (error: unknown) {
    if (error instanceof Error) return NextResponse.json({ error: error.message }, { status: 500 });
    
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}