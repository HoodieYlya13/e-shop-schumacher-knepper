import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { token, tokenExpiry } = body;

  if (!token || !tokenExpiry) {
    return NextResponse.json({ error: "Missing token or expiry" }, { status: 400 });
  }

  const expires = new Date(tokenExpiry);

  if (expires.getTime() <= Date.now()) {
    return NextResponse.json({ error: "Token expiry must be in the future" }, { status: 400 });
  }

  const response = NextResponse.json({ success: true });

  response.headers.append("Set-Cookie", serialize("shopify_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires,
  }));

  return response;
}