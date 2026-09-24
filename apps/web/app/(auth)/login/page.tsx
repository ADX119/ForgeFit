import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { LinkError } from "@/components/auth/link-error";
import { login } from "@/lib/actions/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to your forge"
      description="Pick up today’s session and keep the momentum moving."
    >
      {error === "confirmed" ? (
        <LinkError message="Your email is confirmed. Sign in to continue." />
      ) : null}
      {error === "confirmation" ? (
        <LinkError message="That confirmation link is invalid or has expired. Sign in if you already confirmed, or register again for a new link." />
      ) : null}
      <AuthForm mode="login" action={login} />
      <p className="mt-6 text-center text-sm text-muted">
        New to ForgeFit?{" "}
        <Link className="font-bold text-primary" href="/register">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}
