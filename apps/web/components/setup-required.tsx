import { Card } from "@forgefit/ui";
import { DatabaseZap } from "lucide-react";

export function SetupRequired() {
  return (
    <main className="grid min-h-screen place-items-center p-6">
      <Card className="max-w-xl">
        <DatabaseZap className="size-9 text-primary" />
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Configuration needed
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Connect your Supabase project</h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Copy <code className="text-ink">.env.example</code> to{" "}
          <code className="text-ink">.env.local</code>, apply the migrations and seed, then add the
          project URL and publishable key. No service-role key belongs in this app.
        </p>
      </Card>
    </main>
  );
}
