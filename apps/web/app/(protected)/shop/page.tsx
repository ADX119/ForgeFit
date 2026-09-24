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
          <Sparkles className="size-5 text-primary" />
          <h2 className="text-xl font-semibold">
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
          <PackageOpen className="size-5 text-muted" />
          <h2 className="text-xl font-semibold">All equipment</h2>
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
      <div className="mt-5 grid size-14 place-items-center rounded-xl bg-raised">
        <PackageOpen className="size-7 text-muted" />
      </div>
      <h3 className="mt-5 text-xl font-semibold">{item.name}</h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-muted">{item.description}</p>
      <p className="mt-5 text-2xl font-semibold">
        ₹{item.mock_price_inr.toLocaleString("en-IN")}{" "}
        <span className="text-xs font-bold text-nutrition">DB DEMO</span>
      </p>
      <div className="mt-4">
        <DemoOffers type="EQUIPMENT" sourceId={item.id} sourceName={item.name} label="Buy · Demo" />
      </div>
    </Card>
  );
}
