import { setServerCookie } from "@/utils/shared/setters/shared/setServerCookie";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { password } = await req.json();

  if (password === "nahnte") {
    const response = NextResponse.json({ ok: true });

    setServerCookie({
      name: "isAuthorized",
      value: "true",
      response,
      options: { maxAge: 60 * 60 * 24 * 31 },
    });

    return response;
  }

  return NextResponse.json({ error: "PASSWORD_INCORRECT" }, { status: 401 });
}