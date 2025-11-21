import { getCollectionByHandle } from "@/lib/services/store-front/products";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { handle, language } = await req.json();

  try {
    if (!handle)
      return NextResponse.json({ error: "Missing handle" }, { status: 400 });

    const collection = await getCollectionByHandle(handle, language);

    if (!collection) {
      return NextResponse.json(
        { error: "Collection not found" },
        { status: 500 }
      );
    }

    const response = NextResponse.json(collection);

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}