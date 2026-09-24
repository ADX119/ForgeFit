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

/** Where to send someone whose email link was invalid or expired. */
export function failedLinkPath(next: string): string {
  return next === "/update-password" ? "/forgot-password?error=link" : "/login?error=confirmation";
}
