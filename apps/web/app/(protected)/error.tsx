"use client";

import { Button, Card } from "@forgefit/ui";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <Card className="mx-auto mt-20 max-w-lg text-center">
      <AlertTriangle className="mx-auto size-9 text-nutrition" />
      <h1 className="mt-5 text-2xl font-semibold">That set didn’t land</h1>
      <p className="mt-3 text-sm leading-6 text-muted">
        ForgeFit could not load this section. Check the connection and try again.
      </p>
      <Button className="mt-6" onClick={reset}>
        <RefreshCw className="size-4" />
        Retry
      </Button>
    </Card>
  );
}
