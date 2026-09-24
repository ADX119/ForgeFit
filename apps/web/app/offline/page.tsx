import Link from "next/link";
import { Dumbbell, RefreshCw } from "lucide-react";
import { Card } from "@forgefit/ui";

export default function OfflinePage() {
  return (
    <main className="grid min-h-screen place-items-center p-6">
      <Card className="max-w-md text-center">
        <Dumbbell className="mx-auto size-10 text-primary" />
        <h1 className="mt-5 text-2xl font-semibold">You’re offline</h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          ForgeFit keeps the application shell available, but personal plans and nutrition data are
          never cached on this device.
        </p>
        <Link
          href="/today"
          className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-on-primary hover:bg-primary-hover"
        >
          <RefreshCw className="size-4" /> Try again
        </Link>
      </Card>
    </main>
  );
}
