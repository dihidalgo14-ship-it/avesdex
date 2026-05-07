import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const genus = searchParams.get("gen") || "";
  const species = searchParams.get("sp") || "";
  const key = process.env.XC_API_KEY || "demo";

  if (!genus || !species) {
    return NextResponse.json({ error: "gen and sp are required" }, { status: 400 });
  }

  // Build query: scientific name + country Chile, no country filter to get more results
  // Also try without country to show global range
  const query = `gen:${genus}+sp:${species}+cnt:chile`;

  try {
    const url = `https://xeno-canto.org/api/3/recordings?query=${query}&key=${key}&per_page=6`;
    const res = await fetch(url, {
      headers: { "Accept": "application/json" },
      next: { revalidate: 3600 }, // cache 1h
    });

    if (!res.ok) {
      // fallback: search without country restriction
      const url2 = `https://xeno-canto.org/api/3/recordings?query=gen:${genus}+sp:${species}&key=${key}&per_page=6`;
      const res2 = await fetch(url2, {
        headers: { "Accept": "application/json" },
        next: { revalidate: 3600 },
      });
      const data2 = await res2.json();
      return NextResponse.json(data2);
    }

    const data = await res.json();

    // If no Chile results, try without country
    if (!data.recordings || data.recordings.length === 0) {
      const url2 = `https://xeno-canto.org/api/3/recordings?query=gen:${genus}+sp:${species}&key=${key}&per_page=6`;
      const res2 = await fetch(url2, {
        headers: { "Accept": "application/json" },
        next: { revalidate: 3600 },
      });
      const data2 = await res2.json();
      return NextResponse.json({ ...data2, _fallback: true });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("XC API error:", err);
    return NextResponse.json({ error: "Failed to fetch from Xeno-canto" }, { status: 500 });
  }
}
