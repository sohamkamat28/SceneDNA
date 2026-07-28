import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";
import { BRAND } from "@/config/brand";
import { ROUTES } from "@/config/routes";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { WorkspaceNav } from "@/components/layout/WorkspaceNav";
import { useAuth } from "@/lib/auth";
import { listAnalyses, deleteAnalysis } from "@/lib/analysis.functions";

const TITLE = `Analysis history — ${BRAND.name}`;
const DESCRIPTION = "Every visual blueprint you have generated, ready to reopen, copy or delete.";

export const Route = createFileRoute("/app/history")({
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
  component: HistoryPage,
});

function HistoryPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const fetchList = useServerFn(listAnalyses);
  const remove = useServerFn(deleteAnalysis);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!loading && !user) navigate({ to: ROUTES.login });
  }, [loading, user, navigate]);

  const { data, isLoading } = useQuery({
    queryKey: ["analyses"],
    queryFn: () => fetchList(),
    enabled: Boolean(user),
  });

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <WorkspaceNav />
      <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              History
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight">Your blueprints</h1>
          </div>
          <Link
            to={ROUTES.newAnalysis}
            className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            New analysis
          </Link>
        </div>

        <div className="mt-10">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : !data?.length ? (
            <p className="text-sm text-muted-foreground">
              No analyses yet. Upload a reference image to create your first blueprint.
            </p>
          ) : (
            <ul className="divide-y divide-border border-t border-border">
              {data.map((row) => (
                <li key={row.id} className="flex items-start justify-between gap-6 py-5">
                  <div>
                    <Link
                      to="/app/analysis/$id"
                      params={{ id: row.id }}
                      className="text-sm font-medium hover:text-primary"
                    >
                      {row.title ?? "Untitled analysis"}
                    </Link>
                    <p className="mt-1 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                      {new Date(row.created_at).toLocaleString()} · {row.target_generator} ·{" "}
                      {row.status}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      await remove({ data: { id: row.id } });
                      await queryClient.invalidateQueries({ queryKey: ["analyses"] });
                      toast.success("Analysis deleted.");
                    }}
                    className="rounded-md border border-border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground transition-colors hover:bg-surface"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
