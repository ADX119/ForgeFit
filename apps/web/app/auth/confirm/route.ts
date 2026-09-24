import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { failedLinkPath, safeNextPath } from "@/lib/auth/redirect";
import { createClient } from "@/lib/supabase/server";

// Handles every email link: sign-up confirmation and password recovery.
// Custom templates send `token_hash` + `type`; Supabase's default templates send a PKCE `code`.
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const tokenHash = params.get("token_hash");
  const type = params.get("type") as EmailOtpType | null;
  const code = params.get("code");
  const next = safeNextPath(params.get("next"), type);

  const supabase = await createClient();
  let verified = false;
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    verified = !error;
  } else if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    verified = !error;
  }

  return NextResponse.redirect(
    new URL(verified ? next : failedLinkPath(next, Boolean(code) && !tokenHash), request.url),
  );
}
