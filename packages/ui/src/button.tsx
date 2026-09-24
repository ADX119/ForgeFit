import type { ButtonHTMLAttributes } from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "./utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "danger-solid";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

/**
 * Button styling, also used for links that look like buttons:
 * `<Link className={buttonClasses({ variant: "secondary" })}>`.
 * Primary (lime) is reserved for the one main action on a screen.
 */
export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}) {
  return cn(
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-xl font-semibold transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
    "active:scale-[0.98] motion-reduce:active:scale-100 disabled:pointer-events-none disabled:opacity-50",
    size === "sm" && "min-h-9 px-3 text-sm",
    size === "md" && "min-h-11 px-4 text-sm",
    size === "lg" && "min-h-13 px-5 text-base",
    size === "icon" && "size-11",
    variant === "primary" && "bg-primary text-on-primary hover:bg-primary-hover",
    variant === "secondary" && "border border-line-strong bg-raised text-ink hover:border-muted",
    variant === "ghost" && "text-muted hover:bg-raised hover:text-ink",
    variant === "danger" && "text-danger hover:bg-danger/10",
    // Filled red only inside a confirmation dialog.
    variant === "danger-solid" && "bg-danger text-canvas hover:bg-danger/90",
    className,
  );
}

export function Button({
  variant,
  size,
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner and keeps the label, so the button doesn't change width. */
  loading?: boolean;
}) {
  return (
    <button
      className={buttonClasses({ variant, size, className })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : null}
      {children}
    </button>
  );
}
