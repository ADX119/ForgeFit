import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "./utils";

/** A group of related content. Not for decoration: no cards inside cards, no card for one line. */
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("rounded-xl border border-line bg-surface p-5", className)} {...props} />
  );
}

export type BadgeTone =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "nutrition"
  /** @deprecated use "primary" */
  | "lime"
  /** @deprecated use "nutrition" */
  | "orange";

/** Short status labels: PR, Offline, Skipped, Estimate. At most one or two per row. */
export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  const resolved = tone === "lime" ? "primary" : tone === "orange" ? "nutrition" : tone;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px] font-medium uppercase tracking-wider",
        resolved === "neutral" && "border-line bg-raised text-muted",
        resolved === "primary" && "border-primary/25 bg-primary/10 text-primary",
        resolved === "success" && "border-success/30 bg-success/10 text-success",
        resolved === "warning" && "border-warning/30 bg-warning/10 text-warning",
        resolved === "danger" && "border-danger/30 bg-danger/10 text-danger",
        resolved === "info" && "border-secondary/30 bg-secondary/10 text-secondary",
        resolved === "nutrition" && "border-nutrition/30 bg-nutrition/10 text-nutrition",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? (
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-muted">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{title}</h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{description}</p>
        ) : null}
      </div>
      {action}
    </header>
  );
}

/** One icon, one-line title, one-line reason, one action. */
export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <Card className="flex min-h-56 flex-col items-center justify-center text-center">
      {icon ? (
        <div className="mb-4 text-muted" aria-hidden="true">
          {icon}
        </div>
      ) : null}
      <h2 className="text-base font-semibold text-ink">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-muted">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </Card>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-xl bg-raised motion-reduce:animate-none", className)}
    />
  );
}

/** A number people glance at: "62.5 kg", "4 sessions". */
export function StatTile({
  label,
  value,
  unit,
  hint,
  className,
}: {
  label: string;
  value: ReactNode;
  unit?: string;
  hint?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-full min-h-24 flex-col justify-between gap-2 rounded-xl border border-line bg-surface p-4",
        className,
      )}
    >
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted">{label}</p>
      <p className="text-2xl font-semibold tabular-nums text-ink">
        {value}
        {unit ? <span className="ml-1 text-sm font-medium text-muted">{unit}</span> : null}
      </p>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

/** Thin progress bar, e.g. "3 of 6 exercises". */
export function ProgressBar({
  value,
  max,
  label,
  className,
}: {
  value: number;
  max: number;
  label: string;
  className?: string;
}) {
  const percent = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className={cn("h-1 w-full overflow-hidden rounded-full bg-raised", className)}
    >
      <div
        className="h-full rounded-full bg-primary transition-[width] duration-300 motion-reduce:transition-none"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

/** A row in a list: leading icon, title, subtitle, trailing content. Wrap in a link to make it one. */
export function ListRow({
  leading,
  title,
  subtitle,
  trailing,
  className,
}: {
  leading?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  trailing?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex min-h-14 items-center gap-3 px-4 py-3", className)}>
      {leading ? <div className="shrink-0 text-muted">{leading}</div> : null}
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-ink">{title}</p>
        {subtitle ? <p className="mt-0.5 truncate text-sm text-muted">{subtitle}</p> : null}
      </div>
      {trailing ? <div className="shrink-0">{trailing}</div> : null}
    </div>
  );
}
