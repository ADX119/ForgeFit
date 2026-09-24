import { type NextRequest, NextResponse } from "next/server";

const accents: Record<string, string> = {
  exercises: "#e6e6e6",
  recipes: "#c9a27e",
  equipment: "#9aa8b8",
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ kind: string; name: string }> },
) {
  const { kind, name } = await params;
  const accent = accents[kind] ?? "#e6e6e6";
  const label = name
    .replace(/\.svg$/i, "")
    .replace(/[^a-z0-9-]/gi, "")
    .replaceAll("-", " ")
    .slice(0, 30);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="640" viewBox="0 0 960 640" role="img" aria-label="${label} placeholder"><rect width="960" height="640" fill="#121212"/><circle cx="760" cy="80" r="280" fill="${accent}" opacity=".10"/><path d="M168 292h92v-50h42v50h356v-50h42v50h92v56h-92v50h-42v-50H302v50h-42v-50h-92z" fill="${accent}"/><text x="480" y="494" text-anchor="middle" font-family="system-ui,sans-serif" font-size="34" font-weight="800" fill="#f4f4f5" text-transform="uppercase">${label}</text><text x="480" y="538" text-anchor="middle" font-family="system-ui,sans-serif" font-size="18" fill="#71717a">FORGEFIT DEMO ASSET</text></svg>`;
  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
