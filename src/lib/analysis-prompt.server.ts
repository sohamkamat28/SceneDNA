import type { PromptDepth, TargetGenerator, UseCase } from "@/config/routes";
import { GENERATOR_RULES, generatorMeta } from "@/config/generator-guidance";

const SHAPE = `{
  "schema_version": "1.0",
  "overview": { "title": string, "one_sentence_summary": string, "image_category": "photograph"|"illustration"|"3d_render"|"digital_art"|"graphic_design"|"mixed_media"|"screenshot"|"other", "likely_use_cases": string[], "aspect_ratio": string, "orientation": "portrait"|"landscape"|"square", "overall_confidence": int 0-100 },
  "observable_content": { "primary_subject": string, "secondary_subjects": string[], "environment": string, "action_or_pose": string, "visible_objects": string[], "visible_text": [{ "text": string, "role": string, "confidence": int }], "brands_or_trademarks": string[], "copyrighted_character_notes": string[] },
  "composition": { "framing": string, "subject_placement": string, "viewpoint": string, "perspective": string, "foreground": string, "midground": string, "background": string, "depth_structure": string, "negative_space": string, "symmetry": string, "leading_lines": string, "visual_hierarchy": string[], "crop_notes": string },
  "camera_language": { "medium": string, "shot_type": string, "approximate_focal_language": string, "camera_height": string, "camera_angle": string, "depth_of_field": string, "focus_behaviour": string, "motion_character": string, "optical_characteristics": string[] },
  "lighting": { "summary": string, "key_light": string, "fill_light": string, "rim_or_separation_light": string, "direction": string, "quality": string, "contrast_level": string, "time_of_day_impression": string, "practical_lights": string[], "shadow_character": string, "highlight_character": string },
  "colour_system": { "palette_summary": string, "dominant_colours": [{ "name": string, "hex_approximation": string, "role": string }], "accent_colours": [{ "name": string, "hex_approximation": string, "role": string }], "saturation": string, "contrast": string, "white_balance": string, "tonal_range": string, "colour_relationship": string },
  "materials_and_texture": { "materials": string[], "surfaces": string[], "texture_density": string, "grain_or_noise": string, "atmospheric_effects": string[] },
  "style_and_medium": { "visual_medium": string, "realism_level": string, "rendering_character": string, "line_and_edge_character": string, "detail_density": string, "era_or_design_language": string, "stylistic_descriptors": string[], "direct_artist_reference_avoided": boolean, "artist_reference_note": string|null },
  "mood_and_narrative": { "moods": string[], "emotional_tone": string, "narrative_impression": string, "energy_level": string, "intended_audience_impression": string },
  "post_processing": { "colour_grading": string, "contrast_treatment": string, "sharpening_or_softness": string, "bloom_or_halation": string, "vignette": string, "grain": string, "compositing_character": string, "additional_effects": string[] },
  "visual_dna": { "essential_attributes": [{ "id": string, "label": string, "description": string, "importance": int, "locked_by_default": boolean }], "supporting_attributes": [{ "id": string, "label": string, "description": string, "importance": int }], "editable_variables": [{ "key": string, "label": string, "current_value": string, "description": string, "example_alternatives": string[], "impact_if_changed": string }], "consistency_rules": string[], "attributes_to_avoid_changing": string[] },
  "prompt_package": { "master_prompt": string, "theme_locked_template": string, "negative_prompt": string, "provider_variants": { "universal": string, "midjourney": string, "flux_sdxl": string, "gpt_image": string, "gemini_image": string, "ideogram": string }, "variation_examples": [{ "title": string, "changed_variables": [{ "key": string, "original_value": string, "new_value": string }], "preserved_attributes": string[], "final_prompt": string }] },
  "quality_control": { "likely_failure_modes": string[], "ambiguity_notes": string[], "unsupported_inferences_avoided": string[], "confidence_by_section": [{ "section": string, "confidence": int, "reason": string }], "reproduction_tips": string[] },
  "safety": { "contains_person": boolean, "contains_sensitive_content": boolean, "contains_logo_or_trademark": boolean, "contains_possible_copyrighted_character": boolean, "safe_to_process": boolean, "user_facing_notice": string|null }
}`;

const DEPTH_GUIDANCE: Record<PromptDepth, string> = {
  concise: "Keep the analysis fields tight — one short sentence per field.",
  balanced: "Use one to two sentences per analysis field.",
  detailed: "Be thorough and specific in every analysis field, rich in craft vocabulary.",
};

const MASTER_PROMPT_WORDS: Record<PromptDepth, string> = {
  concise: "220-320 words",
  balanced: "320-450 words",
  detailed: "450-650 words",
};

export function buildAnalysisPrompt(input: {
  targetGenerator: TargetGenerator;
  promptDepth: PromptDepth;
  useCase: UseCase;
  changeNotes?: string | null;
  aspectRatio: string;
  orientation: string;
}): { system: string; user: string } {
  const system = [
    "You are a senior art director and technical image analyst.",
    "You analyse a single reference image and reconstruct its visual language as a reusable prompt blueprint.",
    "Describe only what is observably present. Never guess identities, locations, dates, camera model names or photographer names.",
    "Never name a living artist or studio to imitate; describe the visual qualities instead and set direct_artist_reference_avoided to true.",
    "Never generate or describe sexual, violent or degrading content; if the image is unsuitable, set safety.safe_to_process to false and explain in user_facing_notice.",
    "Return a single JSON object only. No markdown, no commentary, no code fences.",
  ].join(" ");

  const meta = generatorMeta(input.targetGenerator);

  const user = [
    `Analyse the attached reference image and return JSON matching exactly this shape:\n${SHAPE}`,
    "Rules:",
    "- Every key must be present. Never omit a field, never add extra keys.",
    '- Strings must never be empty; write "not applicable" where a property is absent.',
    "- hex_approximation must be a #RRGGBB string.",
    "- Provide 3-6 dominant_colours, 1-4 accent_colours, 4-8 essential_attributes, 3-8 editable_variables, 3 variation_examples.",
    `- The image aspect ratio is ${input.aspectRatio} (${input.orientation}); use those exact values in overview.`,
    `- TARGET MODEL: ${meta.label} (${input.targetGenerator}). Optimise the whole prompt package for this specific model.`,
    `- ${meta.label} prompt syntax rules you MUST follow: ${GENERATOR_RULES[input.targetGenerator]}`,
    `- master_prompt and theme_locked_template must both be written in ${meta.label} syntax exactly as described above, not in generic prose.`,
    `- master_prompt is the flagship deliverable: an exhaustive, self-contained ${MASTER_PROMPT_WORDS[input.promptDepth]} prompt that folds in EVERY analysed detail — subject and secondary subjects, environment, framing, subject placement, viewpoint and perspective, depth layers, shot type, focal and depth-of-field language, full lighting setup (key, fill, rim, direction, quality, contrast, shadow and highlight character), the dominant and accent colours WITH their #RRGGBB approximations, saturation/white balance/tonal range, materials and textures, atmospheric effects, medium/realism/rendering/line character/detail density/era, mood and narrative, and the full post-processing chain (grading, contrast, sharpness, bloom, vignette, grain). It must also explicitly bake in every visual_dna.essential_attributes item and every visual_dna.consistency_rules item so the image can be reproduced accurately. It must stay valid ${meta.label} syntax throughout.`,
    `- provider_variants.${meta.variant} must be the strongest, fully idiomatic ${meta.label} prompt; write the other provider_variants correctly but more briefly.`,
    meta.variant === "universal"
      ? "- provider_variants.universal must carry the model-specific phrasing described above."
      : "- provider_variants.universal must stay model-agnostic natural language.",
    "- If the target model does not support negative prompts, still fill negative_prompt but phrase it as 'not supported by this model — avoid instead: ...'.",
    `- Every variation_examples[].final_prompt must also be written in ${meta.label} syntax.`,
    `- Intended use case: ${input.useCase}. Bias likely_use_cases and prompt phrasing accordingly.`,
    `- Depth: ${DEPTH_GUIDANCE[input.promptDepth]}`,
    input.changeNotes?.trim()
      ? `- The user wants to be able to change this while keeping everything else consistent: "${input.changeNotes.trim()}". Reflect it in editable_variables and at least one variation example.`
      : "- Choose the most useful editable variables yourself.",
  ].join("\n");

  return { system, user };
}
