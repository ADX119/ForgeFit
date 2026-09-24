"use client";

import { Button } from "@forgefit/ui";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import type { ActionState } from "@/lib/actions/state";
import { initialActionState } from "@/lib/actions/state";

export function SimpleActionForm({
  type,
  action,
}: {
  type: "email" | "password";
  action: (state: ActionState, data: FormData) => Promise<ActionState>;
}) {
  const [state, formAction, pending] = useActionState(action, initialActionState);
  return (
    <form action={formAction} className="grid gap-4">
      <label className="label">
        {type === "email" ? "Email" : "New password"}
        <input
          className="input"
          name={type}
          type={type}
          autoComplete={type === "email" ? "email" : "new-password"}
          required
          minLength={type === "password" ? 8 : undefined}
        />
      </label>
      {state.message ? (
        <p
          role="status"
          className={`rounded-xl border p-3 text-sm ${state.status === "error" ? "border-red-400/20 text-red-200" : "border-lime-300/20 text-lime-200"}`}
        >
          {state.message}
        </p>
      ) : null}
      <Button disabled={pending}>
        {pending ? <LoaderCircle className="size-4 animate-spin" /> : null}
        {type === "email" ? "Send reset link" : "Update password"}
      </Button>
      <Link href="/login" className="text-center text-sm font-bold text-zinc-400 hover:text-white">
        Back to sign in
      </Link>
    </form>
  );
}
