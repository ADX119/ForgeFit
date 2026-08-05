import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { login } from "@/lib/actions/auth";

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to your forge"
      description="Pick up today’s session and keep the momentum moving."
    >
      <AuthForm mode="login" action={login} />
      <p className="mt-6 text-center text-sm text-zinc-400">
        New to FitForge?{" "}
        <Link className="font-bold text-lime-300" href="/register">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}
