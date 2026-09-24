import { PackageOpen, Sparkles } from "lucide-react";
import { Badge, Card, PageHeader } from "@forgefit/ui";
import { DemoOffers } from "@/components/features/demo-offers";
import { getEquipment } from "@/lib/data/queries";

export default async function ShopPage() {
  const { items, relevant } = await getEquipment();
  const suggested = relevant.size
    ? items.filter((item) => relevant.has(item.id))
    : items.slice(0, 3);
  return (
    <div className="grid gap-10">
      <PageHeader
        eyebrow="Equipment shop · Demo"
        title="Gear that earns its space"
        description="Recommendations are loaded from your equipment database and matched to your workout plan. Every purchase action is a clearly labeled simulation."
      />
      <section>
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="size-5 text-lime-300" />
          <h2 className="text-xl font-black">
            {relevant.size ? "Matched to your workout" : "Starter picks"}
          </h2>
        </div>
        <div className="grid grid-auto gap-4">
          {suggested.map((item) => (
            <EquipmentCard key={item.id} item={item} recommended />
          ))}
        </div>
      </section>
      <section>
        <div className="mb-4 flex items-center gap-2">
          <PackageOpen className="size-5 text-zinc-400" />
          <h2 className="text-xl font-black">All equipment</h2>
        </div>
        <div className="grid grid-auto gap-4">
          {items.map((item) => (
            <EquipmentCard key={item.id} item={item} recommended={false} />
          ))}
        </div>
      </section>
    </div>
  );
}

function EquipmentCard({
  item,
  recommended,
}: {
  item: Awaited<ReturnType<typeof getEquipment>>["items"][number];
  recommended: boolean;
}) {
  return (
    <Card className="flex flex-col">
      {recommended ? (
        <div>
          <Badge tone="lime">Plan match</Badge>
        </div>
      ) : null}
      <div className="mt-5 grid size-14 place-items-center rounded-xl bg-zinc-800">
        <PackageOpen className="size-7 text-zinc-400" />
      </div>
      <h3 className="mt-5 text-xl font-black">{item.name}</h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-zinc-400">{item.description}</p>
      <p className="mt-5 text-2xl font-black">
        ₹{item.mock_price_inr.toLocaleString("en-IN")}{" "}
        <span className="text-xs font-bold text-orange-300">DB DEMO</span>
      </p>
      <div className="mt-4">
        <DemoOffers type="EQUIPMENT" sourceId={item.id} sourceName={item.name} label="Buy · Demo" />
      </div>
    </Card>
  );
}
