"use client";

import { Button } from "@forgefit/ui";
import { Download } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const standaloneQuery = "(display-mode: standalone)";
const subscribeStandalone = (callback: () => void) => {
  const query = window.matchMedia(standaloneQuery);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
};
const getStandaloneSnapshot = () => window.matchMedia(standaloneQuery).matches;
const getStandaloneServerSnapshot = () => false;

export function InstallHelp() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const standalone = useSyncExternalStore(
    subscribeStandalone,
    getStandaloneSnapshot,
    getStandaloneServerSnapshot,
  );
  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault();
      setPrompt(event as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);
  if (standalone)
    return <p className="text-sm font-bold text-primary">ForgeFit is installed on this device.</p>;
  return (
    <div>
      <Button
        variant="secondary"
        disabled={!prompt}
        onClick={() => {
          if (prompt) void prompt.prompt();
        }}
      >
        <Download className="size-4" />
        Install ForgeFit
      </Button>
      <p className="mt-3 text-xs leading-5 text-muted">
        {prompt
          ? "Install for a standalone app experience."
          : "On iPhone or iPad, use Share → Add to Home Screen."}
      </p>
    </div>
  );
}
