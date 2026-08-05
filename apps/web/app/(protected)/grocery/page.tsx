import Link from "next/link";
import { Check, ListChecks, Trash2 } from "lucide-react";
import { Button, Card, EmptyState, PageHeader } from "@fitforge/ui";
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
                <form action={clearCheckedGroceries}>
                  <Button variant="ghost">Clear {checkedCount} checked</Button>
                </form>
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
                <form action={updateGroceryItem}>
                  <input type="hidden" name="itemId" value={item.id} />
                  <input type="hidden" name="checked" value={item.checked ? "false" : "true"} />
                  <button
                    className={`grid size-11 place-items-center rounded-xl border ${item.checked ? "border-lime-300 bg-lime-300 text-zinc-950" : "border-zinc-700 text-zinc-600 hover:border-lime-300 hover:text-lime-300"}`}
                    aria-label={`${item.checked ? "Uncheck" : "Check"} ${item.name}`}
                  >
                    <Check className="size-5" />
                  </button>
                </form>
                <div className="min-w-0 flex-1">
                  <p className={`font-bold ${item.checked ? "line-through" : ""}`}>
                    {item.selected_alternative ?? item.name}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {item.quantity} {item.unit}
                    {item.selected_alternative
                      ? ` · alternative for ${item.name}, adjust as needed`
                      : ""}
                  </p>
                </div>
                <form action={removeGroceryItem}>
                  <input type="hidden" name="itemId" value={item.id} />
                  <button
                    className="grid size-11 place-items-center rounded-xl text-zinc-600 hover:bg-red-400/10 hover:text-red-300"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </form>
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
