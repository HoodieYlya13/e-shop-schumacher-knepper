import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const token = (await cookies()).get("shopify_token")?.value;

  return token
    ? NextResponse.json({ token })
    : NextResponse.json({ token: null }, { status: 401 });
}