import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { BRAND } from "@/config/brand";
import { ROUTES } from "@/config/routes";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { WorkspaceNav } from "@/components/layout/WorkspaceNav";
import { useAuth } from "@/lib/auth";

const TITLE = `Workspace — ${BRAND.name}`;
const DESCRIPTION = `Your ${BRAND.name} workspace: analyse a reference image and revisit saved visual blueprints.`;

export const Route = createFileRoute("/app/")({
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
  component: WorkspacePage,
});

function WorkspacePage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: ROUTES.login });
  }, [loading, user, navigate]);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <WorkspaceNav />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-20">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Workspace
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          {user ? `Signed in as ${user.email}` : "Checking your session…"}
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Upload a reference image to build a new visual blueprint, or reopen a saved one.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to={ROUTES.newAnalysis}
            className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            New analysis
          </Link>
          <Link
            to={ROUTES.history}
            className="rounded-md border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-surface"
          >
            History
          </Link>
          <Link
            to={ROUTES.example}
            className="rounded-md border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-surface"
          >
            View the example blueprint
          </Link>
        </div>
      </main>
    </div>
  );
}
