/**
 * Where to send someone after they open an email link. Only same-site paths are allowed,
 * so a crafted `next` can't bounce users to another website.
 */
export function safeNextPath(next: string | null, type: string | null): string {
  const fallback = type === "recovery" ? "/update-password" : "/onboarding";
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.includes("\\"))
    return fallback;
  return next;
}

/**
 * Where to send someone whose email link didn't sign them in.
 * `viaCode` links come from Supabase's default templates: Supabase has already verified the
 * email before handing over the code, and the code only works in the browser that asked for it.
 */
export function failedLinkPath(next: string, viaCode = false): string {
  if (next === "/update-password")
    return viaCode ? "/forgot-password?error=device" : "/forgot-password?error=link";
  return viaCode ? "/login?error=confirmed" : "/login?error=confirmation";
}
