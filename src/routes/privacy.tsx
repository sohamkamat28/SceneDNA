import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { BRAND } from "@/config/brand";

const TITLE = `Privacy — ${BRAND.name}`;
const DESCRIPTION = `How ${BRAND.name} handles reference images, analysis data and accounts. Images are stripped of metadata in your browser and deleted by default.`;

export const Route = createFileRoute("/privacy")({
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
  component: PrivacyPage,
});

const SECTIONS = [
  {
    h: "What we process",
    p: "The reference image you upload, the analysis produced from it, and your account email. Nothing else is collected about you.",
  },
  {
    h: "Before upload",
    p: "Images are resized and re-encoded in your browser. EXIF metadata — including GPS coordinates, device details and timestamps — is removed at that point and never reaches our servers.",
  },
  {
    h: "Image retention",
    p: "By default the source image is deleted as soon as the analysis is written. If you choose to keep an image alongside its analysis, it is stored privately and only you can access it. You can delete it at any time.",
  },
  {
    h: "Analysis retention",
    p: "Your analyses are stored in your account so you can revisit them. Deleting an analysis removes the record and any stored image permanently.",
  },
  {
    h: "AI processing",
    p: "Image analysis is performed by a third-party AI model provider. The image is transmitted for the purpose of producing your analysis and is not used by us for any other purpose.",
  },
  {
    h: "What we never do",
    p: "We do not identify people, infer sensitive characteristics, sell data, run advertising, or share your images with other users.",
  },
  {
    h: "Your rights",
    p: `You can export or delete your data at any time from settings, or by writing to ${BRAND.contactEmail}. Deleting your account removes your analyses and stored images.`,
  },
];

function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-5 py-20">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Privacy
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
            What happens to your image.
          </h1>
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
