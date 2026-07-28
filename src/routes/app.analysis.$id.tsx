import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { BRAND } from "@/config/brand";
import { ROUTES } from "@/config/routes";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { WorkspaceNav } from "@/components/layout/WorkspaceNav";
import { useAuth } from "@/lib/auth";
import { getAnalysis } from "@/lib/analysis.functions";
import { BlueprintView } from "@/features/blueprint/BlueprintView";

const TITLE = `Visual blueprint — ${BRAND.name}`;
const DESCRIPTION =
  "A saved visual blueprint: composition, lighting, colour, camera language and the full reusable prompt package.";

export const Route = createFileRoute("/app/analysis/$id")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AnalysisPage,
});

function AnalysisPage() {
  const { id } = Route.useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const fetchAnalysis = useServerFn(getAnalysis);

  useEffect(() => {
    if (!loading && !user) navigate({ to: ROUTES.login });
  }, [loading, user, navigate]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["analysis", id],
    queryFn: () => fetchAnalysis({ data: { id } }),
    enabled: Boolean(user),
  });

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <WorkspaceNav />
      <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-16">
        <Link
          to={ROUTES.history}
          className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
        >
          ← History
        </Link>

        {isLoading ? (
          <p className="mt-10 text-sm text-muted-foreground">Loading blueprint…</p>
        ) : error || !data ? (
          <p className="mt-10 text-sm text-muted-foreground">
            That blueprint could not be found.
          </p>
        ) : (
          <>
            <h1 className="mt-6 text-3xl font-semibold tracking-tight md:text-4xl">
              {data.title ?? "Untitled analysis"}
            </h1>
            <p className="mt-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">
              {data.target_generator} · {data.prompt_depth} · {data.aspect_ratio} ·{" "}
              {data.overall_confidence ?? "—"} confidence
            </p>
            <div className="mt-10">
              {data.blueprint ? (
                <BlueprintView blueprint={data.blueprint} />
              ) : (
                <p className="text-sm text-muted-foreground">
                  This analysis did not complete. Try running it again.
                </p>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
