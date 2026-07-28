import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BRAND } from "@/config/brand";
import { FREE_LIMITS } from "@/config/limits";
import { GENERATOR_FAMILIES, PROMPT_DEPTHS, ROUTES, TARGET_GENERATORS } from "@/config/routes";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { WorkspaceNav } from "@/components/layout/WorkspaceNav";
import { useAuth } from "@/lib/auth";
import {
  deleteAllAnalyses,
  exportAccountData,
  getAccountOverview,
  updateAccountPreferences,
} from "@/lib/account.functions";

const TITLE = `Settings — ${BRAND.name}`;
const DESCRIPTION =
  "Manage your SceneDNA defaults, review free-tier usage, export your blueprints or delete your data.";

export const Route = createFileRoute("/app/settings")({
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
  component: SettingsPage,
});

function SettingsPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const fetchOverview = useServerFn(getAccountOverview);
  const savePrefs = useServerFn(updateAccountPreferences);
  const exportData = useServerFn(exportAccountData);
  const deleteAll = useServerFn(deleteAllAnalyses);

  useEffect(() => {
    if (!loading && !user) navigate({ to: ROUTES.login });
  }, [loading, user, navigate]);

  const { data } = useQuery({
    queryKey: ["account-overview"],
    queryFn: () => fetchOverview(),
    enabled: Boolean(user),
  });

  const [form, setForm] = useState<{
    full_name: string;
    preferred_generator: string;
    preferred_depth: string;
    default_retain_source: boolean;
  } | null>(null);

  useEffect(() => {
    if (data && !form) {
      setForm({
        full_name: data.profile.full_name ?? "",
        preferred_generator: data.profile.preferred_generator,
        preferred_depth: data.profile.preferred_depth,
        default_retain_source: data.profile.default_retain_source,
      });
    }
  }, [data, form]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!form) return;
      await savePrefs({
        data: {
          full_name: form.full_name.trim() === "" ? null : form.full_name.trim(),
          preferred_generator: form.preferred_generator as never,
          preferred_depth: form.preferred_depth as never,
          default_retain_source: form.default_retain_source,
        },
      });
    },
    onSuccess: () => {
      toast.success("Preferences saved");
      queryClient.invalidateQueries({ queryKey: ["account-overview"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteAll(),
    onSuccess: (result) => {
      toast.success(`Deleted ${result.deleted} blueprint${result.deleted === 1 ? "" : "s"}`);
      queryClient.invalidateQueries();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  async function handleExport() {
    try {
      const payload = await exportData();
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "scenedna-export.json";
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Export failed");
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <WorkspaceNav />
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-16">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Settings
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">Account</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Signed in as <span className="font-mono text-foreground">{user?.email}</span> ·{" "}
          {data?.profile.plan ?? "free"} plan
        </p>

        <section className="mt-10 rounded-lg border border-border bg-surface p-6">
          <h2 className="text-sm font-semibold tracking-tight">Free-tier usage</h2>
          <dl className="mt-5 grid grid-cols-3 gap-4 font-mono text-xs">
            <div>
              <dt className="uppercase tracking-[0.14em] text-muted-foreground">Today</dt>
              <dd className="mt-2 text-lg text-foreground">
                {data?.usage.today ?? "—"}/{FREE_LIMITS.perUserPerDay}
              </dd>
            </div>
            <div>
              <dt className="uppercase tracking-[0.14em] text-muted-foreground">This month</dt>
              <dd className="mt-2 text-lg text-foreground">
                {data?.usage.month ?? "—"}/{FREE_LIMITS.perUserPerMonth}
              </dd>
            </div>
            <div>
              <dt className="uppercase tracking-[0.14em] text-muted-foreground">All time</dt>
              <dd className="mt-2 text-lg text-foreground">{data?.usage.total ?? "—"}</dd>
            </div>
          </dl>
        </section>

        <section className="mt-6 rounded-lg border border-border bg-surface p-6">
          <h2 className="text-sm font-semibold tracking-tight">Analysis defaults</h2>
          <div className="mt-5 grid gap-5">
            <label className="grid gap-2 text-sm">
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                Display name
              </span>
              <input
                value={form?.full_name ?? ""}
                onChange={(event) =>
                  setForm((prev) => (prev ? { ...prev, full_name: event.target.value } : prev))
                }
                maxLength={80}
                className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40"
              />
            </label>

            <label className="grid gap-2 text-sm">
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                Default target generator
              </span>
              <select
                value={form?.preferred_generator ?? "universal"}
                onChange={(event) =>
                  setForm((prev) =>
                    prev ? { ...prev, preferred_generator: event.target.value } : prev,
                  )
                }
                className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40"
              >
                {GENERATOR_FAMILIES.map((family) => (
                  <optgroup key={family} label={family}>
                    {TARGET_GENERATORS.filter((option) => option.family === family).map(
                      (option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ),
                    )}
                  </optgroup>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm">
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                Default prompt depth
              </span>
              <select
                value={form?.preferred_depth ?? "detailed"}
                onChange={(event) =>
                  setForm((prev) => (prev ? { ...prev, preferred_depth: event.target.value } : prev))
                }
                className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40"
              >
                {PROMPT_DEPTHS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                checked={form?.default_retain_source ?? false}
                onChange={(event) =>
                  setForm((prev) =>
                    prev ? { ...prev, default_retain_source: event.target.checked } : prev,
                  )
                }
                className="mt-1"
              />
              <span className="text-muted-foreground">
                Keep uploaded reference images by default. When off, images are analysed in memory
                and never stored.
              </span>
            </label>
          </div>

          <button
            type="button"
            disabled={!form || saveMutation.isPending}
            onClick={() => saveMutation.mutate()}
            className="mt-6 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {saveMutation.isPending ? "Saving…" : "Save preferences"}
          </button>
        </section>

        <section className="mt-6 rounded-lg border border-border bg-surface p-6">
          <h2 className="text-sm font-semibold tracking-tight">Your data</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Export every blueprint as JSON, or permanently delete all of them along with any stored
            reference images.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleExport}
              className="rounded-md border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-background"
            >
              Export JSON
            </button>
            <button
              type="button"
              disabled={deleteMutation.isPending}
              onClick={() => {
                if (window.confirm("Delete all blueprints and stored images? This cannot be undone."))
                  deleteMutation.mutate();
              }}
              className="rounded-md border border-destructive/50 px-5 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
            >
              {deleteMutation.isPending ? "Deleting…" : "Delete all data"}
            </button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            To close your account entirely, email {BRAND.contactEmail}.
          </p>
        </section>
      </main>
    </div>
  );
}
