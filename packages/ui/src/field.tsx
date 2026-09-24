"use client";

import { AlertCircle, Minus, Plus } from "lucide-react";
import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from "react";
import { cn } from "./utils";

const controlClasses = (invalid: boolean, className?: string) =>
  cn(
    "min-h-11 w-full rounded-lg border bg-raised px-3 py-2 text-ink outline-none transition-[border-color,box-shadow]",
    "placeholder:text-muted focus:border-primary focus:ring-3 focus:ring-primary/15",
    "disabled:cursor-not-allowed disabled:opacity-60",
    invalid ? "border-danger" : "border-line-strong",
    className,
  );

/** Label above, control, then either the error or the hint below, all linked for screen readers. */
function FieldShell({
  id,
  label,
  hint,
  error,
  children,
  className,
}: {
  id: string;
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid content-start gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="flex items-start gap-1.5 text-sm text-danger">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-sm text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function describedBy(id: string, hint?: ReactNode, error?: ReactNode) {
  return error ? `${id}-error` : hint ? `${id}-hint` : undefined;
}

export function TextField({
  label,
  hint,
  error,
  id: givenId,
  className,
  inputClassName,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  inputClassName?: string;
}) {
  const generatedId = useId();
  const id = givenId ?? generatedId;
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} className={className}>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={controlClasses(Boolean(error), inputClassName)}
        {...props}
      />
    </FieldShell>
  );
}

export function SelectField({
  label,
  hint,
  error,
  id: givenId,
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
}) {
  const generatedId = useId();
  const id = givenId ?? generatedId;
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} className={className}>
      <select
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={controlClasses(Boolean(error))}
        {...props}
      >
        {children}
      </select>
    </FieldShell>
  );
}

const round = (value: number, decimals: number) => {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

/**
 * Number input with large − / + buttons for weight and reps. Typing is free-form; the value is
 * clamped to min/max when it's committed. `value` null means empty.
 */
export function NumberStepper({
  label,
  value,
  onChange,
  step = 1,
  min = 0,
  max = 9999,
  decimals = 0,
  unit,
  hideLabel = false,
  className,
}: {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
  step?: number;
  min?: number;
  max?: number;
  decimals?: number;
  unit?: string;
  /** Keep the label for screen readers only, e.g. inside a set row with column headings. */
  hideLabel?: boolean;
  className?: string;
}) {
  const id = useId();
  const clamp = (next: number) => round(Math.min(max, Math.max(min, next)), decimals);
  const nudge = (direction: 1 | -1) => onChange(clamp((value ?? 0) + direction * step));
  const buttonClasses =
    "grid size-11 shrink-0 place-items-center rounded-lg text-muted hover:bg-raised hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-40";
  return (
    <div className={cn("grid content-start gap-1.5", className)}>
      <label htmlFor={id} className={cn("text-sm font-medium text-ink", hideLabel && "sr-only")}>
        {label}
      </label>
      <div className="flex items-center gap-1 rounded-lg border border-line-strong bg-raised focus-within:border-primary">
        <button
          type="button"
          className={buttonClasses}
          onClick={() => nudge(-1)}
          disabled={value !== null && value <= min}
          aria-label={`Decrease ${label.toLowerCase()}`}
        >
          <Minus className="size-4" aria-hidden="true" />
        </button>
        <input
          id={id}
          inputMode={decimals > 0 ? "decimal" : "numeric"}
          className="min-h-11 w-full min-w-0 bg-transparent text-center text-xl font-semibold tabular-nums text-ink outline-none"
          value={value ?? ""}
          onChange={(event) => {
            const raw = event.target.value.replace(",", ".");
            if (raw === "") return onChange(null);
            const parsed = Number(raw);
            if (!Number.isNaN(parsed)) onChange(parsed);
          }}
          onBlur={() => {
            if (value !== null) onChange(clamp(value));
          }}
        />
        {unit ? <span className="text-sm text-muted">{unit}</span> : null}
        <button
          type="button"
          className={buttonClasses}
          onClick={() => nudge(1)}
          disabled={value !== null && value >= max}
          aria-label={`Increase ${label.toLowerCase()}`}
        >
          <Plus className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
