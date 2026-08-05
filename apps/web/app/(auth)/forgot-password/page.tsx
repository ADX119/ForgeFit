import { AuthShell } from "@/components/auth/auth-shell";
import { SimpleActionForm } from "@/components/auth/simple-action-form";
import { requestPasswordReset } from "@/lib/actions/auth";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Reset your password"
      description="We’ll email you a secure recovery link."
    >
      <SimpleActionForm type="email" action={requestPasswordReset} />
    </AuthShell>
  );
}
