import Link from "next/link";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      aria-label="ForgeFit home"
    >
      <span className="grid size-10 place-items-center rounded-xl bg-primary font-semibold text-on-primary">
        F
      </span>
      {!compact ? (
        <span className="text-lg font-semibold tracking-tight text-ink">ForgeFit</span>
      ) : null}
    </Link>
  );
}
