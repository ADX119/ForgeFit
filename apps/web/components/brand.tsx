import Link from "next/link";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300"
      aria-label="FitForge home"
    >
      <span className="grid size-10 place-items-center rounded-xl bg-lime-300 font-black text-zinc-950">
        F
      </span>
      {!compact ? (
        <span className="text-lg font-black tracking-tight text-white">FitForge</span>
      ) : null}
    </Link>
  );
}
