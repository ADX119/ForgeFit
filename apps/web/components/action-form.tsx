"use client";

import { LoaderCircle } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useFormStatus } from "react-dom";
import type { MutationResult } from "@/lib/actions/state";
import { useToast } from "./toast";

const UNREACHABLE_MESSAGE = "Couldn't reach ForgeFit. Check your connection and try again.";

/**
 * A form that runs a server action and reports the result as a toast.
 * Errors always show; success shows only when the action returns a message.
 */
export function ActionForm({
  action,
  children,
  className,
}: {
  action: (formData: FormData) => Promise<MutationResult>;
  children: ReactNode;
  className?: string;
}) {
  const toast = useToast();
  return (
    <form
      className={className}
      action={async (formData) => {
        let result: MutationResult;
        try {
          result = await action(formData);
        } catch {
          result = { ok: false, message: UNREACHABLE_MESSAGE };
        }
        if (!result.ok) toast("error", result.message);
        else if (result.message) toast("success", result.message);
      }}
    >
      {children}
    </form>
  );
}

/** Submit button that shows a spinner in place of its icon while the parent form is pending. */
export function PendingButton({
  children,
  icon,
  label,
  ...props
}: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "disabled"> & {
  icon?: ReactNode;
  /** Accessible name for icon-only buttons. */
  label?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} aria-label={label} {...props}>
      {pending ? <LoaderCircle className="size-4 animate-spin" /> : icon}
      {children}
    </button>
  );
}
