"use client";

import {
  MockFoodDeliveryProvider,
  MockShoppingProvider,
  type CommerceOffer,
  type OrderType,
} from "@fitforge/domain";
import { Badge, Button, Card } from "@fitforge/ui";
import { CheckCircle2, LoaderCircle, ShoppingBag, X } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { placeDemoOrder } from "@/lib/actions/features";

export function DemoOffers({
  type,
  sourceId,
  sourceName,
  label = "View demo offers",
  compact = false,
}: {
  type: OrderType;
  sourceId: string;
  sourceName: string;
  label?: string;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<{ message: string; provider?: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const offers = useMemo<CommerceOffer[]>(
    () =>
      type === "DISH"
        ? new MockFoodDeliveryProvider().getOffers(sourceId, sourceName)
        : new MockShoppingProvider().getOffers(type, sourceId, sourceName),
    [sourceId, sourceName, type],
  );
  const choose = (offer: CommerceOffer) =>
    startTransition(async () => {
      const response = await placeDemoOrder({
        type,
        sourceId,
        sourceName,
        offerId: offer.id,
        provider: offer.provider,
        priceInr: offer.priceInr,
        etaMinutes: offer.etaMinutes,
      });
      setResult({
        message: response.message ?? "Unable to place demo order.",
        provider: response.order?.provider,
      });
    });
  return (
    <>
      <Button
        variant={compact ? "ghost" : "secondary"}
        className={compact ? "min-h-9 px-2 text-xs" : ""}
        onClick={() => {
          setResult(null);
          setOpen(true);
        }}
      >
        <ShoppingBag className="size-4" />
        {label}
      </Button>
      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${sourceName} demo offers`}
          className="fixed inset-0 z-50 grid place-items-end bg-black/70 p-0 backdrop-blur-sm sm:place-items-center sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <Card className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-b-none border-white/12 bg-zinc-950 p-0 sm:rounded-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/8 bg-zinc-950 p-5">
              <div>
                <Badge tone="orange">Demo · no charge</Badge>
                <h2 className="mt-3 text-xl font-black">{sourceName}</h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="grid size-11 place-items-center rounded-xl text-zinc-400 hover:bg-zinc-800 hover:text-white"
                aria-label="Close offers"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="grid gap-3 p-5">
              {result ? (
                <div className="rounded-xl border border-lime-300/20 bg-lime-300/10 p-5 text-center">
                  <CheckCircle2 className="mx-auto size-9 text-lime-300" />
                  <h3 className="mt-3 font-black">Demo order placed</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">{result.message}</p>
                  {result.provider ? (
                    <p className="mt-2 text-xs text-zinc-500">Provider: {result.provider}</p>
                  ) : null}
                </div>
              ) : (
                offers.map((offer) => (
                  <div
                    key={offer.id}
                    className="flex items-center gap-4 rounded-xl border border-white/8 bg-zinc-900 p-4"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-bold">{offer.provider}</p>
                      <p className="mt-1 text-xs text-zinc-500">
                        ₹{offer.priceInr.toLocaleString("en-IN")} · {offer.etaMinutes} min · Demo
                      </p>
                    </div>
                    <Button onClick={() => choose(offer)} disabled={pending}>
                      {pending ? <LoaderCircle className="size-4 animate-spin" /> : null}Place demo
                    </Button>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      ) : null}
    </>
  );
}
