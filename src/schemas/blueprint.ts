import { z } from "zod";

const confidence = z.number().int().min(0).max(100);
const str = z.string();
const strArray = z.array(z.string());

const colourEntry = z.object({
  name: str,
  hex_approximation: str,
  role: str,
});

export const visualPromptBlueprintSchema = z
  .object({
    schema_version: z.literal("1.0"),

    overview: z.object({
      title: str,
      one_sentence_summary: str,
      image_category: z.enum([
        "photograph",
        "illustration",
        "3d_render",
        "digital_art",
        "graphic_design",
        "mixed_media",
        "screenshot",
        "other",
      ]),
      likely_use_cases: strArray,
      aspect_ratio: str,
      orientation: z.enum(["portrait", "landscape", "square"]),
      overall_confidence: confidence,
    }),

    observable_content: z.object({
      primary_subject: str,
      secondary_subjects: strArray,
      environment: str,
      action_or_pose: str,
      visible_objects: strArray,
      visible_text: z.array(z.object({ text: str, role: str, confidence: confidence })),
      brands_or_trademarks: strArray,
      copyrighted_character_notes: strArray,
    }),

    composition: z.object({
      framing: str,
      subject_placement: str,
      viewpoint: str,
      perspective: str,
      foreground: str,
      midground: str,
      background: str,
      depth_structure: str,
      negative_space: str,
      symmetry: str,
      leading_lines: str,
      visual_hierarchy: strArray,
      crop_notes: str,
    }),

    camera_language: z.object({
      medium: str,
      shot_type: str,
      approximate_focal_language: str,
      camera_height: str,
      camera_angle: str,
      depth_of_field: str,
      focus_behaviour: str,
      motion_character: str,
      optical_characteristics: strArray,
    }),

    lighting: z.object({
      summary: str,
      key_light: str,
      fill_light: str,
      rim_or_separation_light: str,
      direction: str,
      quality: str,
      contrast_level: str,
      time_of_day_impression: str,
      practical_lights: strArray,
      shadow_character: str,
      highlight_character: str,
    }),

    colour_system: z.object({
      palette_summary: str,
      dominant_colours: z.array(colourEntry),
      accent_colours: z.array(colourEntry),
      saturation: str,
      contrast: str,
      white_balance: str,
      tonal_range: str,
      colour_relationship: str,
    }),

    materials_and_texture: z.object({
      materials: strArray,
      surfaces: strArray,
      texture_density: str,
      grain_or_noise: str,
      atmospheric_effects: strArray,
    }),

    style_and_medium: z.object({
      visual_medium: str,
      realism_level: str,
      rendering_character: str,
      line_and_edge_character: str,
      detail_density: str,
      era_or_design_language: str,
      stylistic_descriptors: strArray,
      direct_artist_reference_avoided: z.boolean(),
      artist_reference_note: str.nullable(),
    }),

    mood_and_narrative: z.object({
      moods: strArray,
      emotional_tone: str,
      narrative_impression: str,
      energy_level: str,
      intended_audience_impression: str,
    }),

    post_processing: z.object({
      colour_grading: str,
      contrast_treatment: str,
      sharpening_or_softness: str,
      bloom_or_halation: str,
      vignette: str,
      grain: str,
      compositing_character: str,
      additional_effects: strArray,
    }),

    visual_dna: z.object({
      essential_attributes: z.array(
        z.object({
          id: str,
          label: str,
          description: str,
          importance: confidence,
          locked_by_default: z.boolean(),
        }),
      ),
      supporting_attributes: z.array(
        z.object({
          id: str,
          label: str,
          description: str,
          importance: confidence,
        }),
      ),
      editable_variables: z.array(
        z.object({
          key: str,
          label: str,
          current_value: str,
          description: str,
          example_alternatives: strArray,
          impact_if_changed: str,
        }),
      ),
      consistency_rules: strArray,
      attributes_to_avoid_changing: strArray,
    }),

    prompt_package: z.object({
      master_prompt: str,
      theme_locked_template: str,
      negative_prompt: str,
      provider_variants: z.object({
        universal: str,
        midjourney: str,
        flux_sdxl: str,
        gpt_image: str,
        gemini_image: str,
        ideogram: str,
      }),
      variation_examples: z.array(
        z.object({
          title: str,
          changed_variables: z.array(
            z.object({
              key: str,
              original_value: str,
              new_value: str,
            }),
          ),
          preserved_attributes: strArray,
          final_prompt: str,
        }),
      ),
    }),

    quality_control: z.object({
      likely_failure_modes: strArray,
      ambiguity_notes: strArray,
      unsupported_inferences_avoided: strArray,
      confidence_by_section: z.array(
        z.object({ section: str, confidence: confidence, reason: str }),
      ),
      reproduction_tips: strArray,
    }),

    safety: z.object({
      contains_person: z.boolean(),
      contains_sensitive_content: z.boolean(),
      contains_logo_or_trademark: z.boolean(),
      contains_possible_copyrighted_character: z.boolean(),
      safe_to_process: z.boolean(),
      user_facing_notice: str.nullable(),
    }),
  })
  .strip();

export type VisualPromptBlueprint = z.infer<typeof visualPromptBlueprintSchema>;
