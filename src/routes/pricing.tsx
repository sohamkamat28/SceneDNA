import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { BRAND } from "@/config/brand";
import { ROUTES } from "@/config/routes";
import { FREE_LIMITS } from "@/config/limits";

const TITLE = `Pricing — ${BRAND.name} is free`;
const DESCRIPTION = `${BRAND.name} has no paid plan. Free accounts get ${FREE_LIMITS.perUserPerDay} image analyses per day and ${FREE_LIMITS.perUserPerMonth} per month.`;

export const Route = createFileRoute("/pricing")({
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
  component: PricingPage,
});

const INCLUDED = [
  `${FREE_LIMITS.perUserPerDay} analyses per day`,
  `${FREE_LIMITS.perUserPerMonth} analyses per month`,
  "Full structured blueprint, every section",
  "Master, theme-locked, product-style and negative prompts",
  "Provider variants for six generators",
  "Saved history you can revisit and delete",
];

const EXCLUDED = [
  "No image generation",
  "No team seats or shared workspaces",
  "No API access",
  "No bulk or batch analysis",
];

function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Pricing
          </p>
          <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight md:text-5xl">
            It is free, and the limits are the honest part.
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {BRAND.name} runs on a shared free AI allowance. Rather than pretend that is unlimited,
            the limits are published, enforced server-side and applied to everyone equally.
          </p>

          <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-2">
            <div className="bg-background p-8">
              <p className="font-mono text-xs uppercase tracking-wider text-primary">Included</p>
              <ul className="mt-5 space-y-3">
                {INCLUDED.map((i) => (
                  <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                    <span className="font-mono text-xs text-primary">+</span>
                    {i}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-background p-8">
              <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Not included
              </p>
              <ul className="mt-5 space-y-3">
                {EXCLUDED.map((i) => (
                  <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                    <span className="font-mono text-xs">—</span>
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to={ROUTES.signup}
              className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Create a free account
            </Link>
            <Link
              to={ROUTES.example}
              className="rounded-md border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-surface"
            >
              View example first
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
