import type { Metadata } from "next";
import { Check, ExternalLink } from "lucide-react";
import {
  EQUIPMENT_PROVIDER_IDS,
  providerName,
  providerSearchUrl,
  TRAINING_LOCATIONS,
  type TrainingLocation,
} from "@forgefit/domain";
import { Badge, Card, PageHeader } from "@forgefit/ui";
import { ActionForm, PendingButton } from "@/components/action-form";
import { setEquipmentOwned, setTrainingLocation } from "@/lib/actions/commerce";
import { getEquipmentOverview } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Equipment" };

const locationCopy: Record<TrainingLocation, { label: string; note: string }> = {
  FULL_GYM: { label: "Full gym", note: "Machines, racks and cables are available" },
  HOME_DUMBBELLS: { label: "Home, with some equipment", note: "Tick what you own below" },
  BODYWEIGHT: { label: "Bodyweight only", note: "No equipment needed" },
};

export default async function EquipmentPage() {
  const { items, owned, usedByPlan, location } = await getEquipmentOverview();

  return (
    <div className="grid gap-8">
      <PageHeader
        eyebrow="Equipment"
        title="What you train with"
        description="ForgeFit uses this to pick exercises you can actually do. Links open the retailer's own search; ForgeFit doesn't sell anything or see what you buy."
      />

      <section aria-labelledby="where-heading" className="grid gap-3">
        <h2 id="where-heading" className="text-base font-semibold">
          Where do you train?
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {TRAINING_LOCATIONS.map((option) => (
            <ActionForm key={option} action={setTrainingLocation}>
              <input type="hidden" name="location" value={option} />
              <PendingButton
                aria-pressed={location === option}
                className={`grid h-full w-full content-start gap-1 rounded-xl border p-4 text-left transition-colors disabled:opacity-60 ${
                  location === option
                    ? "border-primary bg-raised"
                    : "border-line bg-surface hover:border-line-strong"
                }`}
              >
                <span className="text-sm font-medium text-ink">{locationCopy[option].label}</span>
                <span className="text-xs text-muted">{locationCopy[option].note}</span>
              </PendingButton>
            </ActionForm>
          ))}
        </div>
      </section>

      <section aria-labelledby="own-heading" className="grid gap-3">
        <div>
          <h2 id="own-heading" className="text-base font-semibold">
            What you own
          </h2>
          <p className="mt-1 text-sm text-muted">
            {location === "FULL_GYM"
              ? "At a full gym everything is covered. Tick anything you also have at home."
              : "Tick what you have. Items your plan uses but you don't own are flagged."}
          </p>
        </div>
        <Card className="divide-y divide-line p-0">
          {items.map((item) => {
            const isOwned = owned.has(item.id);
            const neededByPlan = usedByPlan.has(item.id) && !isOwned && location !== "FULL_GYM";
            return (
              <div key={item.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-ink">{item.name}</p>
                    {neededByPlan ? <Badge tone="warning">Used in your plan</Badge> : null}
                  </div>
                  <p className="mt-1 text-sm text-muted">{item.description}</p>
                  {!isOwned ? (
                    <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                      {EQUIPMENT_PROVIDER_IDS.map((provider) => (
                        <a
                          key={provider}
                          href={providerSearchUrl(provider, item.name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-secondary underline-offset-4 hover:underline"
                        >
                          <span aria-hidden="true">{providerName(provider)}</span>
                          <ExternalLink className="size-3.5" aria-hidden="true" />
                          <span className="sr-only">
                            Search {item.name} on {providerName(provider)} (opens in a new tab)
                          </span>
                        </a>
                      ))}
                    </p>
                  ) : null}
                </div>
                <ActionForm action={setEquipmentOwned}>
                  <input type="hidden" name="equipmentId" value={item.id} />
                  <input type="hidden" name="owned" value={isOwned ? "false" : "true"} />
                  <PendingButton
                    aria-pressed={isOwned}
                    aria-label={`I own ${item.name}`}
                    icon={isOwned ? <Check className="size-4" aria-hidden="true" /> : undefined}
                    className={`inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border px-4 text-sm font-medium whitespace-nowrap transition-colors disabled:opacity-60 sm:w-36 ${
                      isOwned
                        ? "border-primary bg-primary text-on-primary"
                        : "border-line-strong/60 text-ink hover:border-muted hover:bg-raised"
                    }`}
                  >
                    {isOwned ? "Owned" : "I own this"}
                  </PendingButton>
                </ActionForm>
              </div>
            );
          })}
        </Card>
      </section>
    </div>
  );
}
