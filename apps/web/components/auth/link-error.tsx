import { AlertCircle } from "lucide-react";

/** Explains why an email link didn't work. Shown above auth forms when `?error=` is present. */
export function LinkError({ message }: { message: string }) {
  return (
    <p
      role="alert"
      className="mb-5 flex gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-100"
    >
      <AlertCircle className="mt-0.5 size-4 shrink-0" />
      {message}
    </p>
  );
}
