import { deleteCookie } from "@/utils/shared/setters/shared/setServerCookie";
import { NextResponse } from "next/server";

export async function POST() {
  await deleteCookie("checkout_id");
  await deleteCookie("checkout_url");

  return NextResponse.json({ success: true });
}