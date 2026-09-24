"use client";

import { AlertCircle, CheckCircle2, X } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

type Tone = "success" | "error";
interface Toast {
  id: number;
  tone: Tone;
  message: string;
}

type ShowToast = (tone: Tone, message: string) => void;

// Without a provider (e.g. isolated component tests) toasts are silently skipped.
const ToastContext = createContext<ShowToast>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

const SUCCESS_TIMEOUT_MS = 4000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);
  const show = useCallback<ShowToast>((tone, message) => {
    setToast({ id: Date.now(), tone, message });
  }, []);

  // Success toasts dismiss themselves; errors stay until dismissed so they can't be missed.
  useEffect(() => {
    if (!toast || toast.tone === "error") return;
    const timer = window.setTimeout(() => setToast(null), SUCCESS_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [toast]);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4 md:bottom-6"
      >
        {toast ? (
          <div
            key={toast.id}
            role={toast.tone === "error" ? "alert" : "status"}
            className={`pointer-events-auto flex max-w-md items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-xl shadow-black/40 ${
              toast.tone === "error"
                ? "border-red-400/30 bg-zinc-900 text-red-100"
                : "border-lime-300/30 bg-zinc-900 text-zinc-100"
            }`}
          >
            {toast.tone === "error" ? (
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-300" />
            ) : (
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-lime-300" />
            )}
            <p className="flex-1">{toast.message}</p>
            <button
              type="button"
              onClick={() => setToast(null)}
              aria-label="Dismiss notification"
              className="-m-1 grid size-7 place-items-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white"
            >
              <X className="size-4" />
            </button>
          </div>
        ) : null}
      </div>
    </ToastContext.Provider>
  );
}
