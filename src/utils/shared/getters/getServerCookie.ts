import { cookies } from "next/headers";
import { NextResponse } from "next/server";


export async function getServerCookie(
  name: string
): Promise<string | undefined> {
  return (await cookies()).get(name)?.value;
}

export function getMiddlewareCookie(res: NextResponse, name: string): string | undefined {
  return res.cookies.get(name)?.value;
}