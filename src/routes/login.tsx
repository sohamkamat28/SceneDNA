import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AuthShell } from "@/components/auth/AuthShell";
import { ROUTES } from "@/config/routes";
import { BRAND } from "@/config/brand";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/lib/auth";

const TITLE = `Sign in — ${BRAND.name}`;
const DESCRIPTION = `Sign in to your ${BRAND.name} workspace to analyse reference images and revisit saved blueprints.`;

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: ROUTES.app });
  }, [loading, user, navigate]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    navigate({ to: ROUTES.app });
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

  return (
    <AuthShell
      title="Sign in"
      subtitle="Continue to your workspace."
      footer={
        <p>
          No account?{" "}
          <Link to={ROUTES.signup} className="text-foreground underline underline-offset-4">
            Create one
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
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Password
            </label>
            <Link to={ROUTES.forgotPassword} className="text-xs text-muted-foreground hover:text-foreground">
              Forgot?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </AuthShell>
  );
}
