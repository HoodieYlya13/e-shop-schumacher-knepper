import { serialize, type SerializeOptions } from "cookie";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export function setServerCookie({
  name,
  value,
  response,
  options = {},
}: {
  name: string;
  value: string;
  response: Response | NextResponse;
  options?: Partial<SerializeOptions>;
}) {
  const cookieStr = serialize(name, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    ...options,
  });

  response.headers.append("Set-Cookie", cookieStr);
}

export function setMiddlewareCookie(
  res: NextResponse,
  name: string,
  value: string,
  options: Partial<SerializeOptions> = {}
) {
  res.cookies.set(name, value, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    ...options,
  });
}

export async function deleteCookie(name: string) {
  (await cookies()).delete(name);
}