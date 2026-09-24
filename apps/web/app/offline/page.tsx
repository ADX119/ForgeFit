import Link from "next/link";
import { Dumbbell, RefreshCw } from "lucide-react";
import { Card } from "@forgefit/ui";

export default function OfflinePage() {
  return (
    <main className="grid min-h-screen place-items-center p-6">
      <Card className="max-w-md text-center">
        <Dumbbell className="mx-auto size-10 text-lime-300" />
        <h1 className="mt-5 text-2xl font-black">You’re offline</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          ForgeFit keeps the application shell available, but personal plans and nutrition data are
          never cached on this device.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-lime-300 px-4 py-2 text-sm font-bold text-zinc-950 hover:bg-lime-200"
        >
          <RefreshCw className="size-4" /> Try again
        </Link>
      </Card>
    </main>
  );
}
