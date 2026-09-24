import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { register } from "@/lib/actions/auth";

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Start stronger"
      title="Create your ForgeFit account"
      description="Build a plan around your body, schedule, and goal."
    >
      <AuthForm mode="register" action={register} />
      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link className="font-bold text-primary" href="/login">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
