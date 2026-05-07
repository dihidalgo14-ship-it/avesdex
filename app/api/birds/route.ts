import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://aves.ninjas.cl/api/birds", {
      next: { revalidate: 86400 }, // cache 24h
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch birds" }, { status: 500 });
  }
}
