import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { BRAND } from "@/config/brand";
import { FREE_LIMITS } from "@/config/limits";

const TITLE = `Terms of use — ${BRAND.name}`;
const DESCRIPTION = `The terms covering acceptable use, free usage limits and analysis accuracy for ${BRAND.name}.`;

export const Route = createFileRoute("/terms")({
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
  component: TermsPage,
});

const SECTIONS = [
  {
    h: "The service",
    p: `${BRAND.name} analyses a reference image you upload and returns a structured description and prompt package. It does not generate images.`,
  },
  {
    h: "Your images",
    p: "You must have the right to upload each image you submit. Do not upload images you do not own or are not licensed to use.",
  },
  {
    h: "Acceptable use",
    p: "Do not upload illegal content, sexual content involving minors, or content intended to harass or identify individuals. Do not attempt to circumvent usage limits or automate access.",
  },
  {
    h: "Usage limits",
    p: `Free accounts are limited to ${FREE_LIMITS.perUserPerDay} analyses per day and ${FREE_LIMITS.perUserPerMonth} per month, plus a shared daily capacity ceiling. Limits may change as capacity changes.`,
  },
  {
    h: "Accuracy",
    p: "Analysis is a best-effort interpretation of what is visually observable. It is not a guarantee of reproduction, and it deliberately avoids inferring equipment, identity or authorship.",
  },
  {
    h: "Availability",
    p: "The service is provided as-is, without warranty. It may be unavailable, rate limited, or discontinued.",
  },
  {
    h: "Contact",
    p: `Questions about these terms: ${BRAND.contactEmail}.`,
  },
];

function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-5 py-20">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Terms
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">Terms of use.</h1>
          <div className="mt-10 divide-y divide-border border-y border-border">
            {SECTIONS.map((s) => (
              <section key={s.h} className="py-6">
                <h2 className="text-sm font-medium">{s.h}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.p}</p>
              </section>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
