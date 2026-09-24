import { NextResponse } from "next/server";
import { createFoodDeliveryProvider, createShoppingProvider } from "@forgefit/domain";

export async function POST(request: Request) {
  const body = await request.json();
  const { type, sourceId, sourceName } = body as {
    type?: string;
    sourceId?: string;
    sourceName?: string;
  };

  if (!type || !sourceId || !sourceName) {
    return NextResponse.json({ error: "Missing required offer request fields." }, { status: 400 });
  }

  if (type === "DISH") {
    const provider = createFoodDeliveryProvider();
    const offers = await provider.getOffers(sourceId, sourceName);
    return NextResponse.json({ offers });
  }

  if (type === "INGREDIENT" || type === "EQUIPMENT") {
    const provider = createShoppingProvider();
    const offers = await provider.getOffers(type, sourceId, sourceName);
    return NextResponse.json({ offers });
  }

  return NextResponse.json({ error: "Invalid order type." }, { status: 400 });
}
