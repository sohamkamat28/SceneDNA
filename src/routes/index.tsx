import { createFileRoute, Link } from "@tanstack/react-router";
import { BRAND } from "@/config/brand";
import { ROUTES } from "@/config/routes";
import { FREE_LIMITS } from "@/config/limits";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { EXAMPLE_BLUEPRINT } from "@/features/example/example-blueprint";
import exampleReference from "@/assets/example-reference.jpg";

const TITLE = `${BRAND.name} — Reverse-engineer any reference image into a reusable prompt system`;
const DESCRIPTION =
  "Upload one reference image and get a structured visual blueprint: composition, lighting, colour, camera language, materials and a reusable prompt package. Free, analysis only.";

export const Route = createFileRoute("/")({
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
  component: Landing,
});

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
      {children}
    </p>
  );
}

function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
  bordered = true,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  intro?: string;
  children?: React.ReactNode;
  bordered?: boolean;
}) {
  return (
    <section id={id} className={bordered ? "border-t border-border" : undefined}>
      <div className="mx-auto max-w-6xl px-5 py-20">
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <h2 className="mt-3 max-w-3xl text-2xl font-semibold tracking-tight md:text-3xl">
          {title}
        </h2>
        {intro ? (
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{intro}</p>
        ) : null}
        {children ? <div className="mt-10">{children}</div> : null}
      </div>
    </section>
  );
}

const PROBLEMS = [
  {
    title: "You can see the look. You cannot name it.",
    body: "A reference feels right, but the reasons live in lighting angle, tonal contrast and framing discipline — not in adjectives.",
  },
  {
    title: "Prompts drift across a series.",
    body: "Each new image reintroduces small changes, so a campaign of ten images reads as ten unrelated images.",
  },
  {
    title: "Guessy prompt copying does not transfer.",
    body: "Pasting someone else's prompt carries their subject, not the underlying visual system you actually wanted.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Upload a reference",
    body: "One image. Resized and stripped of metadata in your browser before anything is sent.",
  },
  {
    n: "02",
    title: "Structured analysis",
    body: "The image is mapped across composition, camera language, lighting, colour, materials, style, mood and post-processing.",
  },
  {
    n: "03",
    title: "Visual DNA",
    body: "Essential attributes are separated from editable variables, so you know what to lock and what to change.",
  },
  {
    n: "04",
    title: "Reusable prompt package",
    body: "A master prompt, a theme-locked template, a negative prompt and variants for the generator you actually use.",
  },
];

const DIMENSIONS = [
  {
    k: "Composition",
    v: "Framing, placement, depth planes, negative space, leading lines, hierarchy.",
  },
  {
    k: "Camera language",
    v: "Shot type, viewpoint, focal language, depth of field, focus behaviour.",
  },
  {
    k: "Lighting",
    v: "Key, fill, separation, direction, hardness, contrast and shadow character.",
  },
  {
    k: "Colour system",
    v: "Palette summary, dominant and accent colours, saturation, white balance.",
  },
  {
    k: "Materials & texture",
    v: "Materials, surfaces, texture density, grain and atmospheric effects.",
  },
  {
    k: "Style & medium",
    v: "Medium, realism level, rendering character, era and design language.",
  },
  { k: "Mood & narrative", v: "Moods, emotional tone, narrative impression, energy level." },
  { k: "Post-processing", v: "Grading, contrast treatment, softness, halation, vignette, grain." },
];

const AUDIENCES = [
  "Brand and campaign designers holding a look across a series",
  "Product and e-commerce teams standardising a catalogue",
  "Art directors briefing generative work precisely",
  "Illustrators and 3D artists reverse-engineering a finish",
  "Film and storyboard teams keeping frames coherent",
  "Anyone tired of prompts that almost work",
];

const HONESTY = [
  `${BRAND.name} analyses images. It never generates them.`,
  "Analysis describes what is observable. It does not identify people or claim camera equipment.",
  "Artist names are deliberately avoided; style is expressed as objective attributes.",
  "Results are a strong starting point, not a guaranteed pixel match.",
];

const FAQS = [
  {
    q: "Is it really free?",
    a: `Yes. There is no paid plan. Free accounts get ${FREE_LIMITS.perUserPerDay} analyses per day and ${FREE_LIMITS.perUserPerMonth} per month, which keeps the shared AI capacity available for everyone.`,
  },
  {
    q: "Do you keep my image?",
    a: "No. Source images are deleted by default once analysis completes. You can opt to keep an image with your analysis, and delete it at any time.",
  },
  {
    q: "Does it generate images?",
    a: `No. ${BRAND.name} produces analysis and prompts. You take those prompts to whichever image generator you already use.`,
  },
  {
    q: "Will the output match my reference exactly?",
    a: "It reproduces the visual system — lighting, palette, framing, finish — rather than duplicating the original image. That is the point: a system you can vary.",
  },
  {
    q: "Which generators are supported?",
    a: "Every analysis includes a universal prompt plus variants for Midjourney, FLUX and SDXL, GPT Image, Gemini Image and Ideogram.",
  },
  {
    q: "Can I analyse images with people in them?",
    a: "Yes, but people are described only as observable subjects. No identification, no inferred identity, no sensitive attributes.",
  },
];

function Landing() {
  const dna = EXAMPLE_BLUEPRINT.visual_dna;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* 1. Hero */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-5 pb-20 pt-20 md:pt-28">
            <Eyebrow>{BRAND.eyebrow}</Eyebrow>
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.08] tracking-tight md:text-6xl">
              {BRAND.headline}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
              {BRAND.heroSupporting}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                to={ROUTES.signup}
                className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {BRAND.primaryCta}
              </Link>
              <Link
                to={ROUTES.example}
                className="rounded-md border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-surface"
              >
                {BRAND.secondaryCta}
              </Link>
            </div>
            <p className="mt-6 font-mono text-xs text-muted-foreground">{BRAND.trustLine}</p>
          </div>
        </section>

        {/* 2. Problem */}
        <Section
          eyebrow="The problem"
          title="Reference images carry a system. Prompts usually carry a mood."
          intro="Most prompt writing describes the subject and hopes the rest follows. The rest is exactly what makes a series look intentional."
          bordered={false}
        >
          <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-3">
            {PROBLEMS.map((p) => (
              <div key={p.title} className="bg-background p-6">
                <h3 className="text-sm font-medium">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* 3. How it works */}
        <Section eyebrow="How it works" title="Four steps, one image, no generation.">
          <ol className="grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <li key={s.n} className="bg-background p-6">
                <span className="font-mono text-xs text-primary">{s.n}</span>
                <h3 className="mt-3 text-sm font-medium">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </li>
            ))}
          </ol>
        </Section>

        {/* 4. What gets analysed */}
        <Section
          eyebrow="Analysis dimensions"
          title="Eight dimensions, described as attributes rather than adjectives."
        >
          <dl className="divide-y divide-border border-y border-border">
            {DIMENSIONS.map((d) => (
              <div key={d.k} className="grid gap-1 py-4 md:grid-cols-[220px_1fr] md:gap-8">
                <dt className="font-mono text-xs uppercase tracking-wider text-foreground">
                  {d.k}
                </dt>
                <dd className="text-sm leading-relaxed text-muted-foreground">{d.v}</dd>
              </div>
            ))}
          </dl>
        </Section>

        {/* 5. Visual DNA */}
        <Section
          eyebrow="Visual DNA"
          title="Know what to lock, and what you are free to change."
          intro="Every analysis separates the attributes that define the look from the variables you can safely swap for the next frame in the series."
        >
          <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-2">
            <div className="bg-background p-6">
              <Eyebrow>Essential — locked by default</Eyebrow>
              <ul className="mt-4 space-y-3">
                {dna.essential_attributes.map((a) => (
                  <li key={a.id} className="flex items-start gap-3">
                    <span className="mt-0.5 font-mono text-xs text-primary">
                      {String(a.importance).padStart(2, "0")}
                    </span>
                    <span>
                      <span className="block text-sm font-medium">{a.label}</span>
                      <span className="mt-1 block text-sm text-muted-foreground">
                        {a.description}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-background p-6">
              <Eyebrow>Editable variables</Eyebrow>
              <ul className="mt-4 space-y-3">
                {dna.editable_variables.map((v) => (
                  <li key={v.key}>
                    <span className="font-mono text-xs text-muted-foreground">{v.key}</span>
                    <span className="mt-1 block text-sm font-medium">{v.current_value}</span>
                    <span className="mt-1 block text-sm text-muted-foreground">
                      {v.impact_if_changed}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        {/* 6. Example preview */}
        <Section
          eyebrow="Example"
          title="One reference in. A complete blueprint out."
          intro="This example is pre-computed and free to browse — no account required, no AI capacity consumed."
        >
          <div className="grid gap-8 md:grid-cols-[minmax(0,320px)_1fr] md:items-start">
            <img
              src={exampleReference}
              alt="Matte ceramic cylinder, sphere and stepped block lit by a hard key light against a charcoal backdrop"
              width={1280}
              height={1600}
              loading="lazy"
              className="w-full rounded-lg border border-border object-cover"
            />
            <div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {EXAMPLE_BLUEPRINT.overview.one_sentence_summary}
              </p>
              <pre className="mt-5 overflow-x-auto rounded-lg border border-border bg-surface p-5 font-mono text-xs leading-relaxed text-muted-foreground">
                {EXAMPLE_BLUEPRINT.prompt_package.theme_locked_template}
              </pre>
              <Link
                to={ROUTES.example}
                className="mt-6 inline-flex rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-surface"
              >
                Read the full example
              </Link>
            </div>
          </div>
        </Section>

        {/* 7. Who it is for */}
        <Section eyebrow="Who it is for" title="Built for people holding a look together.">
          <ul className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {AUDIENCES.map((a) => (
              <li key={a} className="bg-background p-5 text-sm text-muted-foreground">
                {a}
              </li>
            ))}
          </ul>
        </Section>

        {/* 8. Honesty */}
        <Section eyebrow="Honest limitations" title="What this tool does not claim to do.">
          <ul className="space-y-3 border-y border-border py-6">
            {HONESTY.map((h) => (
              <li key={h} className="flex gap-3 text-sm text-muted-foreground">
                <span className="font-mono text-xs text-primary">—</span>
                {h}
              </li>
            ))}
          </ul>
        </Section>

        {/* 9. Privacy */}
        <Section
          eyebrow="Privacy"
          title="Your reference image does not stick around."
          intro="Images are resized and stripped of EXIF metadata in your browser before upload. By default the source image is deleted as soon as the analysis is written, and you can delete any analysis permanently at any time."
        >
          <Link
            to={ROUTES.privacy}
            className="inline-flex rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-surface"
          >
            Read the privacy policy
          </Link>
        </Section>

        {/* 10. FAQ */}
        <Section eyebrow="FAQ" title="Questions people actually ask.">
          <div className="divide-y divide-border border-y border-border">
            {FAQS.map((f) => (
              <div key={f.q} className="grid gap-2 py-5 md:grid-cols-[300px_1fr] md:gap-8">
                <h3 className="text-sm font-medium">{f.q}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* 11. Final CTA */}
        <section className="border-t border-border">
          <div className="mx-auto max-w-6xl px-5 py-24 text-center">
            <h2 className="mx-auto max-w-2xl text-2xl font-semibold tracking-tight md:text-4xl">
              Bring one image. Leave with a system.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
              {BRAND.supporting}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to={ROUTES.signup}
                className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {BRAND.primaryCta}
              </Link>
              <Link
                to={ROUTES.example}
                className="rounded-md border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-surface"
              >
                {BRAND.secondaryCta}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
