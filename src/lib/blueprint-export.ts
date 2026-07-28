import type { VisualPromptBlueprint } from "@/schemas/blueprint";

const LABELS: Record<string, string> = {
  visual_dna: "Visual DNA",
  quality_control: "Quality control",
  post_processing: "Post-processing",
  prompt_package: "Prompt package",
  provider_variants: "Provider variants",
  gpt_image: "GPT Image",
  gemini_image: "Gemini Image",
  flux_sdxl: "FLUX / SDXL",
  direct_artist_reference_avoided: "Direct artist reference avoided",
};

function labelFor(key: string): string {
  if (LABELS[key]) return LABELS[key];
  const words = key.replace(/_/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function heading(depth: number, label: string): string {
  return `${"#".repeat(Math.min(depth, 6))} ${label}`;
}

function scalar(value: unknown): string {
  if (value === null || value === undefined || value === "") return "_Not provided._";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}

function itemLabel(value: Record<string, unknown>, index: number): string {
  const identity =
    value.title ?? value.label ?? value.section ?? value.name ?? value.key ?? value.id;
  return identity ? `${index + 1}. ${String(identity)}` : `Item ${index + 1}`;
}

function renderObject(value: Record<string, unknown>, depth: number): string[] {
  const lines: string[] = [];

  for (const [key, fieldValue] of Object.entries(value)) {
    lines.push(heading(depth, labelFor(key)), "");

    if (Array.isArray(fieldValue)) {
      if (fieldValue.length === 0) {
        lines.push("_None._", "");
        continue;
      }

      if (fieldValue.every((item) => item === null || typeof item !== "object")) {
        for (const item of fieldValue) {
          lines.push(`- ${scalar(item).replace(/\n/g, "\n  ")}`);
        }
        lines.push("");
        continue;
      }

      fieldValue.forEach((item, index) => {
        if (item && typeof item === "object" && !Array.isArray(item)) {
          lines.push(heading(depth + 1, itemLabel(item as Record<string, unknown>, index)), "");
          lines.push(...renderObject(item as Record<string, unknown>, depth + 2));
        }
      });
      continue;
    }

    if (fieldValue && typeof fieldValue === "object") {
      lines.push(...renderObject(fieldValue as Record<string, unknown>, depth + 1));
      continue;
    }

    lines.push(scalar(fieldValue), "");
  }

  return lines;
}

/**
 * Creates a model-agnostic prompt for a new product image. It deliberately uses
 * only transferable craft fields and never reads the analysed image's subjects,
 * objects, setting, visible text, brands, slogans, or narrative description.
 */
export function buildProductStyleTransferPrompt(blueprint: VisualPromptBlueprint): string {
  const b = blueprint;
  const palette = [...b.colour_system.dominant_colours, ...b.colour_system.accent_colours]
    .map((colour) => `${colour.name} (${colour.hex_approximation})`)
    .join(", ");
  const styleDescriptors = b.style_and_medium.stylistic_descriptors.join(", ");
  const opticalCharacter = b.camera_language.optical_characteristics.join(", ");
  const moods = b.mood_and_narrative.moods.join(", ");

  return [
    "Use the attached product image as the sole source of product identity. Preserve the product’s exact geometry, proportions, silhouette, materials, colourway, packaging, label artwork, logo placement and small construction details. Do not redesign, replace or reinterpret the product.",
    "",
    "Create a completely new product-focused image with this transferable visual treatment:",
    `- Visual medium and finish: ${b.style_and_medium.visual_medium}; ${b.style_and_medium.realism_level}; ${b.style_and_medium.rendering_character}; ${b.style_and_medium.line_and_edge_character}. Style character: ${styleDescriptors}.`,
    `- Camera language: ${b.camera_language.shot_type}; ${b.camera_language.approximate_focal_language}; ${b.camera_language.camera_angle}; ${b.camera_language.depth_of_field}. Optical character: ${opticalCharacter}.`,
    `- Lighting: ${b.lighting.direction}; ${b.lighting.quality}; ${b.lighting.contrast_level} contrast; ${b.lighting.shadow_character} shadows; ${b.lighting.highlight_character} highlights.`,
    `- Colour treatment: use ${palette} for the scene, lighting accents and colour grade while preserving the attached product’s real brand colours. Keep the treatment ${b.colour_system.saturation}, ${b.colour_system.white_balance}, with ${b.colour_system.tonal_range}.`,
    `- Mood and energy: ${moods}; ${b.mood_and_narrative.emotional_tone}; ${b.mood_and_narrative.energy_level}.`,
    `- Post-processing: ${b.post_processing.colour_grading}; ${b.post_processing.contrast_treatment}; ${b.post_processing.sharpening_or_softness}; ${b.post_processing.bloom_or_halation}; ${b.post_processing.grain}.`,
    "",
    "Make the attached product the only hero subject. Build a fresh, minimal scene around it and keep every supporting element subordinate to the product. The result must look like a new campaign image, not a reconstruction of any existing scene.",
    "",
    "Do not introduce or copy any subject, prop, setting, character, narrative element, text, slogan, badge, logo, trademark or brand from any style source. Do not invent packaging copy. Include text or branding only when it is genuinely visible on the attached product, and reproduce that product-specific content accurately.",
  ].join("\n");
}

/** Returns every structured field plus every prompt in portable Markdown. */
export function buildBlueprintMarkdown(blueprint: VisualPromptBlueprint): string {
  const sections: Array<[string, Record<string, unknown>]> = [
    ["Overview", blueprint.overview],
    ["Observable content", blueprint.observable_content],
    ["Composition", blueprint.composition],
    ["Camera language", blueprint.camera_language],
    ["Lighting", blueprint.lighting],
    ["Colour system", blueprint.colour_system],
    ["Materials and texture", blueprint.materials_and_texture],
    ["Style and medium", blueprint.style_and_medium],
    ["Mood and narrative", blueprint.mood_and_narrative],
    ["Post-processing", blueprint.post_processing],
    ["Visual DNA", blueprint.visual_dna],
    ["Prompt package", blueprint.prompt_package],
    ["Quality control", blueprint.quality_control],
    ["Safety", blueprint.safety],
  ];

  const lines = [`# ${blueprint.overview.title}`, "", blueprint.overview.one_sentence_summary, ""];

  for (const [title, section] of sections) {
    lines.push(`## ${title}`, "", ...renderObject(section, 3));
  }

  lines.push(
    "## Generate any product in this style",
    "",
    buildProductStyleTransferPrompt(blueprint),
    "",
  );

  return lines
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
