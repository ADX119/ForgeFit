import Link from "next/link";
import { Check, ListChecks, Trash2 } from "lucide-react";
import { Button, Card, EmptyState, PageHeader } from "@forgefit/ui";
import { ActionForm, PendingButton } from "@/components/action-form";
import {
  clearCheckedGroceries,
  removeGroceryItem,
  updateGroceryItem,
} from "@/lib/actions/features";
import { getGroceries } from "@/lib/data/queries";

export default async function GroceryPage() {
  const items = await getGroceries();
  const orderAllUrl =
    items.length > 0
      ? `https://www.bigbasket.com/ps/?q=${encodeURIComponent(
          items.map((item) => item.selected_alternative ?? item.name).join(" "),
        )}`
      : undefined;
  const checkedCount = items.filter((item) => item.checked).length;
  return (
    <div className="grid gap-8">
      <PageHeader
        eyebrow="Consolidated grocery list"
        title="One list. Fewer forgotten ingredients."
        description="This is your combined ingredient list. Use the collective order action to open a provider search for all items in the list."
        action={
          items.length ? (
            <div className="flex flex-wrap items-center gap-2">
              <a href={orderAllUrl} target="_blank" rel="noreferrer">
                <Button>Order full list</Button>
              </a>
              {checkedCount ? (
                <ActionForm action={clearCheckedGroceries}>
                  <PendingButton className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-zinc-300 hover:bg-zinc-800 hover:text-white disabled:opacity-60">
                    Clear {checkedCount} checked
                  </PendingButton>
                </ActionForm>
              ) : null}
            </div>
          ) : undefined
        }
      />
      {items.length ? (
        <Card className="p-0">
          <div className="divide-y divide-white/8">
            {items.map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-3 p-4 sm:p-5 ${item.checked ? "opacity-55" : ""}`}
              >
                <ActionForm action={updateGroceryItem}>
                  <input type="hidden" name="itemId" value={item.id} />
                  <input type="hidden" name="checked" value={item.checked ? "false" : "true"} />
                  <PendingButton
                    className={`grid size-11 place-items-center rounded-xl border disabled:opacity-60 ${item.checked ? "border-lime-300 bg-lime-300 text-zinc-950" : "border-zinc-500 text-zinc-400 hover:border-lime-300 hover:text-lime-300"}`}
                    label={`${item.checked ? "Uncheck" : "Check"} ${item.name}`}
                    icon={<Check className="size-5" />}
                  />
                </ActionForm>
                <div className="min-w-0 flex-1">
                  <p className={`font-bold ${item.checked ? "line-through" : ""}`}>
                    {item.selected_alternative ?? item.name}
                  </p>
                  <p className="mt-1 text-xs text-zinc-400">
                    {item.quantity} {item.unit}
                    {item.selected_alternative
                      ? ` · alternative for ${item.name}, adjust as needed`
                      : ""}
                  </p>
                </div>
                <ActionForm action={removeGroceryItem}>
                  <input type="hidden" name="itemId" value={item.id} />
                  <PendingButton
                    className="grid size-11 place-items-center rounded-xl text-zinc-400 hover:bg-red-400/10 hover:text-red-300 disabled:opacity-60"
                    label={`Remove ${item.name}`}
                    icon={<Trash2 className="size-4" />}
                  />
                </ActionForm>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <EmptyState
          icon={<ListChecks className="size-9" />}
          title="Your grocery list is clear"
          description="Open a recipe and add its scaled ingredients here in one tap."
          action={
            <Link href="/diet" className="font-bold text-lime-300">
              Browse recipes
            </Link>
          }
        />
      )}
    </div>
  );
}
