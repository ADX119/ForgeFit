import Link from "next/link";
import { Check, ExternalLink, ListChecks, Trash2 } from "lucide-react";
import {
  DEFAULT_GROCERY_PROVIDER,
  GROCERY_PROVIDER_IDS,
  isGroceryProvider,
  providerName,
  providerSearchUrl,
} from "@forgefit/domain";
import { Card, EmptyState, PageHeader } from "@forgefit/ui";
import { ActionForm, PendingButton } from "@/components/action-form";
import { setGroceryProvider } from "@/lib/actions/commerce";
import {
  clearCheckedGroceries,
  removeGroceryItem,
  updateGroceryItem,
} from "@/lib/actions/features";
import { getCurrentProfile, getGroceries } from "@/lib/data/queries";

export default async function GroceryPage() {
  const [items, profile] = await Promise.all([getGroceries(), getCurrentProfile()]);
  const store = isGroceryProvider(profile.preferred_grocery_provider)
    ? profile.preferred_grocery_provider
    : DEFAULT_GROCERY_PROVIDER;
  const storeName = providerName(store);
  const checkedCount = items.filter((item) => item.checked).length;

  return (
    <div className="grid gap-8">
      <PageHeader
        eyebrow="Grocery list"
        title="One list. Fewer forgotten ingredients."
        description="Ingredients from the recipes you add, combined. Shop item by item on your store, and tick things off as they go in the cart."
        action={
          checkedCount ? (
            <ActionForm action={clearCheckedGroceries}>
              <PendingButton className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium whitespace-nowrap text-muted hover:bg-raised hover:text-ink disabled:opacity-60">
                Clear {checkedCount} checked
              </PendingButton>
            </ActionForm>
          ) : undefined
        }
      />

      {items.length ? (
        <>
          <section aria-labelledby="store-heading" className="grid gap-3">
            <h2
              id="store-heading"
              className="text-xs font-medium tracking-[0.18em] text-muted uppercase"
            >
              Shop on
            </h2>
            <div className="flex flex-wrap gap-2">
              {GROCERY_PROVIDER_IDS.map((provider) => (
                <ActionForm key={provider} action={setGroceryProvider}>
                  <input type="hidden" name="provider" value={provider} />
                  <PendingButton
                    aria-pressed={store === provider}
                    className={`min-h-10 rounded-lg border px-3 text-sm font-medium transition-colors disabled:opacity-60 ${
                      store === provider
                        ? "border-primary bg-raised text-ink"
                        : "border-line text-muted hover:border-line-strong hover:text-ink"
                    }`}
                  >
                    {providerName(provider)}
                  </PendingButton>
                </ActionForm>
              ))}
            </div>
            <p className="text-sm text-muted">
              Links open {storeName}&apos;s own search. ForgeFit doesn&apos;t see prices or what you
              buy.
            </p>
          </section>

          <Card className="divide-y divide-line p-0">
            {items.map((item) => {
              const name = item.selected_alternative ?? item.name;
              return (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 p-4 ${item.checked ? "opacity-60" : ""}`}
                >
                  <ActionForm action={updateGroceryItem}>
                    <input type="hidden" name="itemId" value={item.id} />
                    <input type="hidden" name="checked" value={item.checked ? "false" : "true"} />
                    <PendingButton
                      className={`grid size-11 place-items-center rounded-lg border disabled:opacity-60 ${item.checked ? "border-primary bg-primary text-on-primary" : "border-line-strong text-muted hover:border-primary hover:text-ink"}`}
                      label={`${item.checked ? "Uncheck" : "Check"} ${name}`}
                      icon={<Check className="size-5" />}
                    />
                  </ActionForm>
                  <div className="min-w-0 flex-1">
                    <p className={`font-medium ${item.checked ? "line-through" : ""}`}>{name}</p>
                    <p className="mt-1 text-xs text-muted">
                      {item.quantity} {item.unit}
                      {item.selected_alternative
                        ? ` · alternative for ${item.name}, adjust as needed`
                        : ""}
                    </p>
                  </div>
                  {item.checked ? null : (
                    <a
                      href={providerSearchUrl(store, name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-sm whitespace-nowrap text-secondary hover:bg-raised"
                    >
                      <span aria-hidden="true" className="hidden sm:inline">
                        Search on {storeName}
                      </span>
                      <span aria-hidden="true" className="sm:hidden">
                        Search
                      </span>
                      <ExternalLink className="size-3.5" aria-hidden="true" />
                      <span className="sr-only">
                        Search {name} on {storeName} (opens in a new tab)
                      </span>
                    </a>
                  )}
                  <ActionForm action={removeGroceryItem}>
                    <input type="hidden" name="itemId" value={item.id} />
                    <PendingButton
                      className="grid size-11 place-items-center rounded-lg text-muted hover:bg-danger/10 hover:text-danger disabled:opacity-60"
                      label={`Remove ${name}`}
                      icon={<Trash2 className="size-4" />}
                    />
                  </ActionForm>
                </div>
              );
            })}
          </Card>
        </>
      ) : (
        <EmptyState
          icon={<ListChecks className="size-9" />}
          title="Your grocery list is clear"
          description="Open a recipe and add its scaled ingredients here in one tap."
          action={
            <Link
              href="/nutrition"
              className="font-medium text-ink underline-offset-4 hover:underline"
            >
              Browse recipes
            </Link>
          }
        />
      )}
    </div>
  );
}
