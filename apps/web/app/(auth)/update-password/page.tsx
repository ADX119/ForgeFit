import { AuthShell } from "@/components/auth/auth-shell";
import { SimpleActionForm } from "@/components/auth/simple-action-form";
import { updatePassword } from "@/lib/actions/auth";

export default function UpdatePasswordPage() {
  return (
    <AuthShell
      eyebrow="Choose a password"
      title="Secure your account"
      description="Use at least eight characters that you do not reuse elsewhere."
    >
      <SimpleActionForm type="password" action={updatePassword} />
    </AuthShell>
  );
}
