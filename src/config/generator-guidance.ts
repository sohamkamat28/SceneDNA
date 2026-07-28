import { TARGET_GENERATORS, type TargetGenerator } from "@/config/routes";

/** Short, user-facing hint shown under the model dropdown. */
export const GENERATOR_HINTS: Record<TargetGenerator, string> = {
  universal: "Model-agnostic natural language. Safe starting point for any generator.",
  midjourney_v7:
    "Comma-stacked descriptors plus --ar, --style raw, --stylize and --chaos parameters.",
  midjourney_v6: "Comma-stacked descriptors with --ar and --style raw; slightly more literal v6.1.",
  niji_6: "Anime and illustration phrasing tuned for Niji, with --niji 6 and --style parameters.",
  flux_1_pro: "Flowing prose, strong prompt adherence, no weights; excellent with rendered text.",
  flux_1_dev: "Compact prose, fewer clauses; Dev/Schnell reward simpler, front-loaded prompts.",
  sdxl: "Tag-style keywords with weights, quality boosters and an explicit negative prompt.",
  sd_3_5: "Balanced prose plus tags; supports a negative prompt and clearer text rendering.",
  gpt_image_1: "Conversational instruction, one idea per sentence, explicit layout and text content.",
  dalle_3: "Descriptive narrative sentences; no weights or parameters, no negative prompt.",
  nano_banana: "Direct conversational description with precise editing and consistency language.",
  imagen_4: "Photographic prose with explicit lens, lighting and material language.",
  ideogram_3: "Typography-first: exact text in quotes, layout, then style and colour.",
  recraft_v3: "Design-system phrasing: vector or raster, brand palette, spacing and text placement.",
  firefly_3: "Plain commercial-safe description, no artist names, explicit content type and style.",
  leonardo_phoenix: "Structured description plus contrast/quality cues and a negative prompt.",
};

/** Server-side prompt engineering rules per model. */
export const GENERATOR_RULES: Record<TargetGenerator, string> = {
  universal:
    "Write one dense, model-agnostic paragraph in natural language. No parameters, no weights, no vendor-specific syntax.",
  midjourney_v7:
    "Midjourney v7 syntax: a single line of comma-separated visual clauses ordered subject, action, environment, composition, lighting, colour, medium, mood, then technical finish. Append parameters: --ar <aspect ratio> --style raw --stylize 250 --chaos 5 (tune stylize/chaos to the image's stylisation). Never use full sentences, never use words like 'a photo of', never include a negative prompt inline (use --no <terms> instead).",
  midjourney_v6:
    "Midjourney v6.1 syntax: comma-separated clauses, more literal and less stylised than v7. Append --ar <aspect ratio> --style raw --stylize 150, plus --no <terms> for exclusions. No sentences, no weights.",
  niji_6:
    "Niji 6 syntax for anime/illustration: comma-separated clauses using anime craft vocabulary (line weight, cel shading, screen tone, key visual). Append --niji 6 --ar <aspect ratio> --style expressive|scenic|original chosen to match the image, plus --no <terms>.",
  flux_1_pro:
    "FLUX.1 Pro/Ultra: flowing, grammatical prose of 3-6 sentences with very high specificity, because FLUX follows instructions literally. No weights, no parentheses, no --parameters, no negative prompt. State any rendered text verbatim in double quotes and describe its placement.",
  flux_1_dev:
    "FLUX.1 Dev/Schnell: 2-3 short prose sentences, front-load the subject and composition, drop secondary detail. No weights, no parameters, no negative prompt.",
  sdxl:
    "SDXL: comma-separated tag list, most important tags first, using (tag:1.2) weighting sparingly for the two or three critical attributes. Include medium, lens, lighting, colour and quality tags. Provide a matching negative prompt of comma-separated defect tags.",
  sd_3_5:
    "Stable Diffusion 3.5: one descriptive sentence followed by comma-separated style and technical tags. Light weighting only. Put any rendered text in double quotes. Provide a comma-separated negative prompt.",
  gpt_image_1:
    "GPT Image 1: conversational instruction to an image model. Short declarative sentences, one idea each, ordered subject, setting, composition and framing, lighting, colour, style, finish. State exact rendered text in double quotes with its position. No weights, no parameters, no negative prompt — phrase exclusions positively.",
  dalle_3:
    "DALL·E 3: a vivid descriptive narrative of 3-5 sentences. No weights, no parameters, no negative prompt, no artist names. Describe exclusions as positive alternatives.",
  nano_banana:
    "Nano Banana (Gemini image): direct conversational description written as an instruction. Be explicit about subject identity, scene, camera perspective, lighting and what must stay consistent. State rendered text verbatim in double quotes. No parameters, no weights, no negative prompt.",
  imagen_4:
    "Imagen 4: photographic prose naming shot type, lens character, aperture feel, lighting setup, materials and colour grade in one or two rich sentences. No parameters, no weights, no negative prompt.",
  ideogram_3:
    'Ideogram 3.0: lead with rendered typography — exact wording in double quotes, then typeface character, size relationship and placement — followed by layout, illustration style, palette and finish. Prose, no weights, no parameters.',
  recraft_v3:
    "Recraft V3: design-tool phrasing. State asset type (vector illustration, raster image, icon, poster), then layout and grid, palette with hex values, typography and exact text in double quotes, then stylistic finish. Prose, no weights, no parameters.",
  firefly_3:
    "Adobe Firefly 3: plain commercially-safe description. Name the content type (photo, art, graphic), subject, composition, lighting, colour and style using generic craft vocabulary. Never name artists, brands or trademarks. No parameters, no weights.",
  leonardo_phoenix:
    "Leonardo Phoenix: structured prose — subject, scene, composition, lighting, colour, style — followed by short contrast and quality cues. Provide a comma-separated negative prompt of defects to avoid.",
};

export function generatorMeta(value: TargetGenerator) {
  return TARGET_GENERATORS.find((g) => g.value === value) ?? TARGET_GENERATORS[0];
}
