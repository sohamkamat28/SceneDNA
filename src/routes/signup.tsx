import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AuthShell } from "@/components/auth/AuthShell";
import { ROUTES } from "@/config/routes";
import { BRAND } from "@/config/brand";
import { FREE_LIMITS } from "@/config/limits";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/lib/auth";

const TITLE = `Create an account — ${BRAND.name}`;
const DESCRIPTION = `Create a free ${BRAND.name} account and turn reference images into reusable prompt blueprints. No paid plan, no card.`;

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: ROUTES.app });
  }, [loading, user, navigate]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (password.length < 8) {
      toast.error("Use at least 8 characters.");
      return;
    }
    setSubmitting(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (data.session) {
      navigate({ to: ROUTES.app });
      return;
    }
    setSent(true);
  }

  async function onGoogle() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google sign-in failed. Please try again.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: ROUTES.app });
  }

  if (sent) {
    return (
      <AuthShell
        title="Check your email"
        subtitle={`We sent a confirmation link to ${email}. Open it to activate your account.`}
      >
        <Link
          to={ROUTES.login}
          className="inline-flex rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-surface"
        >
          Back to sign in
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle={`Free forever: ${FREE_LIMITS.perUserPerDay} analyses per day, ${FREE_LIMITS.perUserPerMonth} per month. No card required.`}
      footer={
        <p>
          Already have an account?{" "}
          <Link to={ROUTES.login} className="text-foreground underline underline-offset-4">
            Sign in
          </Link>
        </p>
      }
    >
      <button
        type="button"
        onClick={onGoogle}
        className="w-full rounded-md border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-surface"
      >
        Continue with Google
      </button>

      <div className="my-6 flex items-center gap-4">
        <span className="h-px flex-1 bg-border" />
        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">or</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>

        <div>
          <label htmlFor="password" className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
          <p className="mt-2 text-xs text-muted-foreground">At least 8 characters.</p>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
        >
          {submitting ? "Creating account…" : "Create account"}
        </button>

        <p className="text-xs leading-relaxed text-muted-foreground">
          By creating an account you agree to the{" "}
          <Link to={ROUTES.terms} className="text-foreground underline underline-offset-4">
            terms
          </Link>{" "}
          and{" "}
          <Link to={ROUTES.privacy} className="text-foreground underline underline-offset-4">
            privacy policy
          </Link>
          .
        </p>
      </form>
    </AuthShell>
  );
}
