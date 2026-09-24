"use client";

import type { CommerceOffer, OrderType } from "@forgefit/domain";
import { Badge, Button, Card } from "@forgefit/ui";
import { CheckCircle2, LoaderCircle, ShoppingBag, X } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { placeDemoOrder } from "@/lib/actions/features";

export function DemoOffers({
  type,
  sourceId,
  sourceName,
  label = "View offers",
  compact = false,
}: {
  type: OrderType;
  sourceId: string;
  sourceName: string;
  label?: string;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [offers, setOffers] = useState<CommerceOffer[]>([]);
  const [loadingOffers, setLoadingOffers] = useState(false);
  const [offersError, setOffersError] = useState<string | null>(null);
  const [result, setResult] = useState<{ message: string; provider?: string } | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!open) return;

    const loadOffers = async () => {
      setLoadingOffers(true);
      setOffersError(null);
      setOffers([]);

      try {
        const response = await fetch("/api/offers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, sourceId, sourceName }),
        });

        if (!response.ok) {
          const body = await response.text();
          throw new Error(body || "Unable to load offers.");
        }

        const payload = await response.json();
        setOffers(payload.offers ?? []);
      } catch (error) {
        setOffersError((error as Error)?.message ?? "Unable to load offers.");
      } finally {
        setLoadingOffers(false);
      }
    };

    loadOffers();
  }, [open, sourceId, sourceName, type]);

  const choose = (offer: CommerceOffer) =>
    startTransition(async () => {
      if (!offer.demo && offer.externalUrl) {
        window.open(offer.externalUrl, "_blank");
        return;
      }

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
          setOffers([]);
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
          aria-label={`${sourceName} offers`}
          className="fixed inset-0 z-[9999] grid place-items-end bg-black/70 p-0 backdrop-blur-sm sm:place-items-center sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <Card className="z-[10000] max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-b-none border-white/12 bg-zinc-950 p-0 sm:rounded-2xl">
            <div className="sticky top-0 z-10 flex flex-col gap-3 border-b border-white/8 bg-zinc-950 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Badge tone="orange">
                  {offers.some((offer) => !offer.demo) ? "Live offers" : "Demo · no charge"}
                </Badge>
                <h2 className="mt-3 text-xl font-black">{sourceName}</h2>
                <p className="mt-2 text-sm text-zinc-400">
                  Offers are either demo flows or direct provider search links. Use the button to
                  review the item or place a demo order.
                </p>
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
                  <h3 className="mt-3 font-black">Order placed</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">{result.message}</p>
                  {result.provider ? (
                    <p className="mt-2 text-xs text-zinc-400">Provider: {result.provider}</p>
                  ) : null}
                </div>
              ) : loadingOffers ? (
                <div className="rounded-xl border border-white/12 bg-zinc-900 p-5 text-center">
                  <LoaderCircle className="mx-auto size-9 animate-spin text-zinc-400" />
                  <p className="mt-3 text-sm text-zinc-400">Loading offers…</p>
                </div>
              ) : offersError ? (
                <div className="rounded-xl border border-rose-300/20 bg-rose-300/10 p-5 text-center text-rose-100">
                  <p className="font-bold">Unable to load offers</p>
                  <p className="mt-2 text-sm text-rose-100">{offersError}</p>
                </div>
              ) : offers.length ? (
                offers.map((offer) => (
                  <div
                    key={offer.id}
                    className="flex items-center gap-4 rounded-xl border border-white/8 bg-zinc-900 p-4"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-bold">{offer.provider}</p>
                      <p className="mt-1 text-sm text-zinc-300">{offer.label}</p>
                      <p className="mt-2 text-xs text-zinc-400">
                        Est. ₹{offer.priceInr.toLocaleString("en-IN")} · {offer.etaMinutes} min
                        {offer.demo ? " · Demo item" : " · Live search"}
                      </p>
                      {!offer.demo ? (
                        <p className="mt-2 text-xs text-zinc-400">
                          Estimated price from provider search — open provider to see live pricing
                          and availability.
                        </p>
                      ) : null}
                    </div>
                    <Button onClick={() => choose(offer)} disabled={pending}>
                      {pending ? <LoaderCircle className="size-4 animate-spin" /> : null}
                      {offer.demo
                        ? "Place demo order"
                        : offer.externalUrl
                          ? "Open provider"
                          : "Select"}
                    </Button>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-white/12 bg-zinc-900 p-5 text-center">
                  <p className="text-sm text-zinc-400">
                    No offers are available for this item right now.
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      ) : null}
    </>
  );
}
