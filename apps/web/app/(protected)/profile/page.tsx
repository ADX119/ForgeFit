import { Badge, Card, PageHeader } from "@fitforge/ui";
import { InstallHelp } from "@/components/features/install-help";
import { ProfileForm } from "@/components/features/profile-form";
import { getCurrentProfile, getOrders } from "@/lib/data/queries";

export default async function ProfilePage() {
  const [profile, orders] = await Promise.all([getCurrentProfile(), getOrders()]);
  return (
    <div className="grid gap-8">
      <PageHeader
        eyebrow="Profile & settings"
        title="Your FitForge baseline"
        description="Update the inputs behind your nutrition estimate and review recent simulated orders."
      />
      <div className="grid gap-5 xl:grid-cols-[1fr_0.8fr]">
        <Card>
          <h2 className="text-xl font-black">Personal details</h2>
          <p className="mt-2 mb-6 text-sm text-zinc-500">Metric units · Asia/Kolkata</p>
          <ProfileForm profile={profile} />
        </Card>
        <div className="grid content-start gap-5">
          <Card>
            <h2 className="text-xl font-black">Install the app</h2>
            <p className="mt-2 mb-5 text-sm leading-6 text-zinc-400">
              Add FitForge to your home screen for faster access and a standalone window.
            </p>
            <InstallHelp />
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black">Recent demo orders</h2>
              <Badge tone="orange">Demo only</Badge>
            </div>
            {orders.length ? (
              <div className="mt-5 divide-y divide-white/8">
                {orders.map((order) => (
                  <div key={order.id} className="py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-bold">{order.source_name}</p>
                        <p className="mt-1 text-xs text-zinc-500">
                          {order.provider} · {order.order_type.toLowerCase()}
                        </p>
                      </div>
                      <p className="font-black">₹{order.mock_price_inr.toLocaleString("en-IN")}</p>
                    </div>
                    <p className="mt-2 text-[11px] font-black uppercase tracking-wider text-orange-300">
                      Demo placed · no charge
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-5 text-sm text-zinc-500">
                No demo orders yet. Try a recipe or equipment offer.
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
