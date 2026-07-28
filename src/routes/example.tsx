import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { BRAND } from "@/config/brand";
import { ROUTES } from "@/config/routes";
import { CopyButton } from "@/features/blueprint/CopyButton";
import { EXAMPLE_BLUEPRINT } from "@/features/example/example-blueprint";
import { buildBlueprintMarkdown, buildProductStyleTransferPrompt } from "@/lib/blueprint-export";
import exampleReference from "@/assets/example-reference.jpg";

const b = EXAMPLE_BLUEPRINT;
const fullMarkdown = buildBlueprintMarkdown(b);
const productStylePrompt = buildProductStyleTransferPrompt(b);
const TITLE = `Example analysis — ${BRAND.name}`;
const DESCRIPTION =
  "A complete worked example: one reference image analysed across composition, lighting, colour, camera language and style, with a full reusable prompt package.";

export const Route = createFileRoute("/example")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ExamplePage,
});

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border py-8">
      <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-primary">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Rows({ rows }: { rows: Array<[string, string]> }) {
  return (
    <dl className="divide-y divide-border">
      {rows.map(([k, v]) => (
        <div key={k} className="grid gap-1 py-3 md:grid-cols-[240px_1fr] md:gap-8">
          <dt className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{k}</dt>
          <dd className="text-sm leading-relaxed">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function Prompt({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-5 first:mt-0 rounded-lg border border-border bg-surface">
      <div className="flex items-start justify-between gap-4 border-b border-border px-4 py-2.5">
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
        <CopyButton value={value} label={label} />
      </div>
      <pre className="whitespace-pre-wrap p-4 font-mono text-xs leading-relaxed">{value}</pre>
    </div>
  );
}

function ExamplePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-5 py-20">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Worked example · pre-computed
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
            {b.overview.title}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {b.overview.one_sentence_summary}
          </p>

          <div className="mt-8 flex flex-col gap-4 rounded-lg border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium">Copy the complete analysis</p>
              <p className="mt-1 max-w-xl text-xs leading-relaxed text-muted-foreground">
                Includes every analysed feature, Visual DNA attribute, variation, quality note and
                prompt in portable Markdown.
              </p>
            </div>
            <CopyButton
              value={fullMarkdown}
              label="full analysis as Markdown"
              buttonText="Copy full analysis as Markdown"
              prominent
            />
          </div>

          <img
            src={exampleReference}
            alt="Matte ceramic cylinder, sphere and stepped block lit by a hard key light against a charcoal backdrop"
            width={1280}
            height={1600}
            loading="lazy"
            className="mt-10 w-full max-w-md rounded-lg border border-border"
          />

          <div className="mt-12">
            <Block title="Overview">
              <Rows
                rows={[
                  ["Category", b.overview.image_category.replace(/_/g, " ")],
                  ["Aspect ratio", `${b.overview.aspect_ratio} · ${b.overview.orientation}`],
                  ["Overall confidence", `${b.overview.overall_confidence} / 100`],
                  ["Likely use cases", b.overview.likely_use_cases.join(", ")],
                ]}
              />
            </Block>

            <Block title="Composition">
              <Rows
                rows={[
                  ["Framing", b.composition.framing],
                  ["Subject placement", b.composition.subject_placement],
                  ["Depth structure", b.composition.depth_structure],
                  ["Negative space", b.composition.negative_space],
                  ["Leading lines", b.composition.leading_lines],
                ]}
              />
            </Block>

            <Block title="Camera language">
              <Rows
                rows={[
                  ["Shot type", b.camera_language.shot_type],
                  ["Focal language", b.camera_language.approximate_focal_language],
                  ["Camera height", b.camera_language.camera_height],
                  ["Depth of field", b.camera_language.depth_of_field],
                ]}
              />
            </Block>

            <Block title="Lighting">
              <Rows
                rows={[
                  ["Summary", b.lighting.summary],
                  ["Key light", b.lighting.key_light],
                  ["Fill light", b.lighting.fill_light],
                  ["Quality", b.lighting.quality],
                  ["Shadow character", b.lighting.shadow_character],
                ]}
              />
            </Block>

            <Block title="Colour system">
              <p className="text-sm leading-relaxed">{b.colour_system.palette_summary}</p>
              <ul className="mt-5 flex flex-wrap gap-3">
                {[...b.colour_system.dominant_colours, ...b.colour_system.accent_colours].map(
                  (c) => (
                    <li
                      key={c.hex_approximation}
                      className="flex items-center gap-3 rounded-md border border-border px-3 py-2"
                    >
                      <span
                        className="h-6 w-6 rounded-sm border border-border"
                        style={{ backgroundColor: c.hex_approximation }}
                        aria-hidden
                      />
                      <span className="text-sm">
                        {c.name}
                        <span className="ml-2 font-mono text-xs text-muted-foreground">
                          {c.hex_approximation}
                        </span>
                      </span>
                    </li>
                  ),
                )}
              </ul>
            </Block>

            <Block title="Style, materials and mood">
              <Rows
                rows={[
                  ["Medium", b.style_and_medium.visual_medium],
                  ["Realism", b.style_and_medium.realism_level],
                  ["Descriptors", b.style_and_medium.stylistic_descriptors.join(", ")],
                  ["Materials", b.materials_and_texture.materials.join(", ")],
                  ["Moods", b.mood_and_narrative.moods.join(", ")],
                  ["Grade", b.post_processing.colour_grading],
                ]}
              />
            </Block>

            <Block title="Visual DNA">
              <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Essential attributes
              </p>
              <ul className="mt-3 space-y-3">
                {b.visual_dna.essential_attributes.map((a) => (
                  <li key={a.id} className="flex gap-3">
                    <span className="mt-0.5 font-mono text-xs text-primary">{a.importance}</span>
                    <span>
                      <span className="block text-sm font-medium">{a.label}</span>
                      <span className="mt-1 block text-sm text-muted-foreground">
                        {a.description}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>

              <p className="mt-8 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Editable variables
              </p>
              <ul className="mt-3 space-y-3">
                {b.visual_dna.editable_variables.map((v) => (
                  <li key={v.key} className="rounded-md border border-border p-4">
                    <span className="font-mono text-xs text-muted-foreground">{v.key}</span>
                    <span className="mt-1 block text-sm font-medium">{v.current_value}</span>
                    <span className="mt-1 block text-sm text-muted-foreground">
                      {v.description}
                    </span>
                    <span className="mt-2 block font-mono text-xs text-muted-foreground">
                      Alternatives: {v.example_alternatives.join(" · ")}
                    </span>
                  </li>
                ))}
              </ul>

              <p className="mt-8 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Consistency rules
              </p>
              <ul className="mt-3 space-y-2">
                {b.visual_dna.consistency_rules.map((r) => (
                  <li key={r} className="flex gap-3 text-sm text-muted-foreground">
                    <span className="font-mono text-xs text-primary">—</span>
                    {r}
                  </li>
                ))}
              </ul>
            </Block>

            <Block title="Prompt package">
              <Prompt label="Master prompt" value={b.prompt_package.master_prompt} />
              <Prompt
                label="Theme-locked template"
                value={b.prompt_package.theme_locked_template}
              />
              <Prompt label="Negative prompt" value={b.prompt_package.negative_prompt} />
              <Prompt label="Midjourney" value={b.prompt_package.provider_variants.midjourney} />
              <Prompt label="FLUX / SDXL" value={b.prompt_package.provider_variants.flux_sdxl} />
            </Block>

            <Block title="Variations">
              <ul className="space-y-5">
                {b.prompt_package.variation_examples.map((v) => (
                  <li key={v.title} className="rounded-md border border-border p-5">
                    <p className="text-sm font-medium">{v.title}</p>
                    <p className="mt-2 font-mono text-xs text-muted-foreground">
                      {v.changed_variables
                        .map((c) => `${c.key}: ${c.original_value} → ${c.new_value}`)
                        .join(" · ")}
                    </p>
                    <pre className="mt-3 whitespace-pre-wrap font-mono text-xs leading-relaxed text-muted-foreground">
                      {v.final_prompt}
                    </pre>
                  </li>
                ))}
              </ul>
            </Block>

            <Block title="Quality control">
              <ul className="space-y-2">
                {b.quality_control.confidence_by_section.map((c) => (
                  <li key={c.section} className="flex items-baseline gap-3 text-sm">
                    <span className="font-mono text-xs text-primary">{c.confidence}</span>
                    <span className="font-medium">{c.section}</span>
                    <span className="text-muted-foreground">{c.reason}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Reproduction tips
              </p>
              <ul className="mt-3 space-y-2">
                {b.quality_control.reproduction_tips.map((t) => (
                  <li key={t} className="flex gap-3 text-sm text-muted-foreground">
                    <span className="font-mono text-xs text-primary">—</span>
                    {t}
                  </li>
                ))}
              </ul>
            </Block>

            <Block title="Generate any product in this style">
              <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                Attach your product image to an image-generation tool, then paste this prompt.
              </p>
              <Prompt label="Attached-product style prompt" value={productStylePrompt} />
            </Block>
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            <Link
              to={ROUTES.signup}
              className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Analyse your own image
            </Link>
            <Link
              to={ROUTES.home}
              className="rounded-md border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-surface"
            >
              Back home
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
