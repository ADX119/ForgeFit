import { AuthShell } from "@/components/auth/auth-shell";
import { LinkError } from "@/components/auth/link-error";
import { SimpleActionForm } from "@/components/auth/simple-action-form";
import { requestPasswordReset } from "@/lib/actions/auth";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Reset your password"
      description="We’ll email you a secure recovery link."
    >
      {error === "device" ? (
        <LinkError message="For your security, open the reset link in the same browser where you requested it. Request a new link below." />
      ) : null}
      {error === "link" ? (
        <LinkError message="That reset link is invalid or has expired. Request a new one below." />
      ) : null}
      <SimpleActionForm type="email" action={requestPasswordReset} />
    </AuthShell>
  );
}
