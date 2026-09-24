"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@forgefit/ui";
import { AlertCircle, CheckCircle2, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useActionState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { ActionState } from "@/lib/actions/state";
import { initialActionState } from "@/lib/actions/state";

const schema = z.object({
  displayName: z.string().trim().min(2).optional(),
  email: z.email("Enter a valid email"),
  password: z.string().min(8, "Use at least 8 characters"),
});
type Fields = z.infer<typeof schema>;

export function AuthForm({
  mode,
  action,
}: {
  mode: "login" | "register";
  action: (state: ActionState, data: FormData) => Promise<ActionState>;
}) {
  const [state, runAction] = useActionState(action, initialActionState);
  const [pending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Fields>({ resolver: zodResolver(schema) });
  const submit = handleSubmit((values) => {
    const data = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value) data.set(key, value);
    });
    startTransition(() => runAction(data));
  });

  return (
    <form onSubmit={submit} className="grid gap-4" noValidate>
      {mode === "register" ? (
        <label className="label">
          Name
          <input className="input" autoComplete="name" {...register("displayName")} />
          {errors.displayName ? (
            <span className="text-xs text-red-300">{errors.displayName.message}</span>
          ) : null}
        </label>
      ) : null}
      <label className="label">
        Email
        <input className="input" type="email" autoComplete="email" {...register("email")} />
        {errors.email ? <span className="text-xs text-red-300">{errors.email.message}</span> : null}
      </label>
      <label className="label">
        Password
        <input
          className="input"
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          {...register("password")}
        />
        {errors.password ? (
          <span className="text-xs text-red-300">{errors.password.message}</span>
        ) : null}
      </label>
      {mode === "login" ? (
        <Link
          href="/forgot-password"
          className="justify-self-end text-xs font-bold text-lime-300 hover:text-lime-200"
        >
          Forgot password?
        </Link>
      ) : null}
      {state.message ? (
        <p
          role="status"
          className={`flex gap-2 rounded-xl border p-3 text-sm ${state.status === "error" ? "border-red-400/20 bg-red-400/10 text-red-200" : "border-lime-300/20 bg-lime-300/10 text-lime-200"}`}
        >
          {state.status === "error" ? (
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
          ) : (
            <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
          )}
          {state.message}
        </p>
      ) : null}
      <Button className="mt-1 w-full" disabled={pending}>
        {pending ? <LoaderCircle className="size-4 animate-spin" /> : null}
        {mode === "login" ? "Sign in" : "Create account"}
      </Button>
    </form>
  );
}
