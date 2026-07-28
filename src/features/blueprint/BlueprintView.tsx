import type { VisualPromptBlueprint } from "@/schemas/blueprint";
import { buildBlueprintMarkdown, buildProductStyleTransferPrompt } from "@/lib/blueprint-export";
import { CopyButton } from "@/features/blueprint/CopyButton";

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

function Prompt({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="mt-6 first:mt-0 rounded-lg border border-border bg-surface">
      <div className="flex items-start justify-between gap-4 border-b border-border px-4 py-2.5">
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
        <CopyButton value={value} label={label} />
      </div>
      {note ? (
        <p className="border-b border-border px-4 py-2.5 text-xs leading-relaxed text-muted-foreground">
          {note}
        </p>
      ) : null}
      <pre className="whitespace-pre-wrap p-4 font-mono text-xs leading-relaxed">{value}</pre>
    </div>
  );
}

function buildPromptPackageText(b: VisualPromptBlueprint) {
  const p = b.prompt_package;
  const lines = [
    "MASTER PROMPT",
    p.master_prompt,
    "",
    "THEME-LOCKED TEMPLATE",
    p.theme_locked_template,
    "",
    "NEGATIVE PROMPT",
    p.negative_prompt,
    "",
    "UNIVERSAL",
    p.provider_variants.universal,
    "",
    "MIDJOURNEY",
    p.provider_variants.midjourney,
    "",
    "FLUX / SDXL",
    p.provider_variants.flux_sdxl,
    "",
    "GPT IMAGE",
    p.provider_variants.gpt_image,
    "",
    "GEMINI IMAGE",
    p.provider_variants.gemini_image,
    "",
    "IDEOGRAM",
    p.provider_variants.ideogram,
  ];
  return lines.join("\n");
}

export function BlueprintView({ blueprint: b }: { blueprint: VisualPromptBlueprint }) {
  const fullMarkdown = buildBlueprintMarkdown(b);
  const productStylePrompt = buildProductStyleTransferPrompt(b);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 rounded-lg border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
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

      {b.safety.user_facing_notice ? (
        <p className="mb-8 rounded-md border border-border bg-surface p-4 text-sm text-muted-foreground">
          {b.safety.user_facing_notice}
        </p>
      ) : null}

      <Block title="Overview">
        <Rows
          rows={[
            ["Summary", b.overview.one_sentence_summary],
            ["Category", b.overview.image_category.replace(/_/g, " ")],
            ["Aspect ratio", `${b.overview.aspect_ratio} · ${b.overview.orientation}`],
            ["Overall confidence", `${b.overview.overall_confidence} / 100`],
            ["Likely use cases", b.overview.likely_use_cases.join(", ")],
          ]}
        />
      </Block>

      <Block title="Observable content">
        <Rows
          rows={[
            ["Primary subject", b.observable_content.primary_subject],
            ["Secondary subjects", b.observable_content.secondary_subjects.join(", ") || "—"],
            ["Environment", b.observable_content.environment],
            ["Action or pose", b.observable_content.action_or_pose],
            ["Visible objects", b.observable_content.visible_objects.join(", ") || "—"],
          ]}
        />
      </Block>

      <Block title="Composition">
        <Rows
          rows={[
            ["Framing", b.composition.framing],
            ["Subject placement", b.composition.subject_placement],
            ["Perspective", b.composition.perspective],
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
            ["Camera angle", b.camera_language.camera_angle],
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
            ["Contrast", b.lighting.contrast_level],
            ["Shadow character", b.lighting.shadow_character],
          ]}
        />
      </Block>

      <Block title="Colour system">
        <p className="text-sm leading-relaxed">{b.colour_system.palette_summary}</p>
        <ul className="mt-5 flex flex-wrap gap-3">
          {[...b.colour_system.dominant_colours, ...b.colour_system.accent_colours].map((c, i) => (
            <li
              key={`${c.hex_approximation}-${i}`}
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
          ))}
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
                <span className="mt-1 block text-sm text-muted-foreground">{a.description}</span>
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
              <span className="mt-1 block text-sm text-muted-foreground">{v.description}</span>
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
        <div className="mb-5 flex items-center justify-end gap-3">
          <CopyButton value={buildPromptPackageText(b)} label="entire prompt package" />
        </div>
        <Prompt
          label="1 · In-depth master prompt"
          value={b.prompt_package.master_prompt}
          note="The complete reconstruction — composition, camera, lighting, colour with hex values, materials, style, mood, post-processing and every locked Visual DNA attribute. Use this to reproduce the image faithfully."
        />

        <details className="group mt-8">
          <summary className="cursor-pointer font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground">
            More variants (template, negative, per-model)
          </summary>
          <div className="mt-4">
            <Prompt label="Theme-locked template" value={b.prompt_package.theme_locked_template} />
            <Prompt label="Negative prompt" value={b.prompt_package.negative_prompt} />
            <Prompt label="Universal" value={b.prompt_package.provider_variants.universal} />
            <Prompt label="Midjourney" value={b.prompt_package.provider_variants.midjourney} />
            <Prompt label="FLUX / SDXL" value={b.prompt_package.provider_variants.flux_sdxl} />
            <Prompt label="GPT Image" value={b.prompt_package.provider_variants.gpt_image} />
            <Prompt label="Gemini Image" value={b.prompt_package.provider_variants.gemini_image} />
            <Prompt label="Ideogram" value={b.prompt_package.provider_variants.ideogram} />
          </div>
        </details>
      </Block>

      <Block title="Variations">
        <ul className="space-y-5">
          {b.prompt_package.variation_examples.map((v) => (
            <li key={v.title} className="rounded-md border border-border p-5">
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm font-medium">{v.title}</p>
                <CopyButton value={v.final_prompt} label={v.title} />
              </div>
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
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Attach your product image to an image-generation tool, then paste this prompt. It keeps
          the attached product accurate while transferring only the engineered lighting, camera,
          colour, mood and finish. It excludes subjects, props, text, slogans, logos and brands from
          the analysed image.
        </p>
        <Prompt
          label="Attached-product style prompt"
          value={productStylePrompt}
          note="Model-agnostic. Use it with a separate product image attached to your generation request."
        />
      </Block>
    </div>
  );
}
