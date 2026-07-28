import type { VisualPromptBlueprint } from "@/schemas/blueprint";

/**
 * Static example analysis. Hand-authored fixture — never calls the model,
 * never consumes free Gemini quota.
 */
export const EXAMPLE_BLUEPRINT: VisualPromptBlueprint = {
  schema_version: "1.0",
  overview: {
    title: "Ceramic geometry, hard key light, warm neutral palette",
    one_sentence_summary:
      "Three matte ceramic geometric forms sit on a plaster surface under a hard directional key light, with one small lime disc as the single accent.",
    image_category: "photograph",
    likely_use_cases: [
      "Product photography series",
      "Editorial art direction",
      "Brand campaign key visual",
    ],
    aspect_ratio: "4:5",
    orientation: "portrait",
    overall_confidence: 86,
  },
  observable_content: {
    primary_subject: "A tall matte off-white cylinder standing on a textured plaster surface",
    secondary_subjects: [
      "A bone-white sphere resting in the foreground",
      "An ochre stepped block to the right",
      "A small lime-green ceramic disc on the top step",
    ],
    environment:
      "A shallow studio set: a plaster-textured horizontal surface meeting a deep charcoal vertical backdrop",
    action_or_pose: "Static still-life arrangement, no motion",
    visible_objects: ["Cylinder", "Sphere", "Stepped block", "Disc", "Cast shadows"],
    visible_text: [],
    brands_or_trademarks: [],
    copyrighted_character_notes: [],
  },
  composition: {
    framing: "Medium still-life framing with generous headroom",
    subject_placement:
      "Cylinder on the left third, block on the right third, sphere breaking the lower centre line",
    viewpoint: "Slightly below object mid-height, near eye level to the set",
    perspective: "Mild one-point perspective with limited convergence",
    foreground: "Plaster surface texture and the sphere",
    midground: "Cylinder and stepped block",
    background: "Unbroken charcoal backdrop with soft tonal falloff",
    depth_structure: "Three clear depth planes separated by shadow rather than by colour",
    negative_space: "Large area of empty dark backdrop occupying the upper half of the frame",
    symmetry: "Deliberately asymmetric; visual weight balanced by shadow mass",
    leading_lines: "Long diagonal cast shadows travelling from upper left to lower right",
    visual_hierarchy: ["Cylinder", "Stepped block", "Sphere", "Lime accent disc"],
    crop_notes: "Objects fully contained; shadows crop at the lower edge",
  },
  camera_language: {
    medium: "Digital still photography appearance",
    shot_type: "Tabletop still life, medium close",
    approximate_focal_language: "Short telephoto compression language",
    camera_height: "Just below the top of the sphere",
    camera_angle: "Straight-on with a very slight downward tilt",
    depth_of_field: "Shallow depth-of-field appearance",
    focus_behaviour: "Focus held on the sphere and cylinder edge",
    motion_character: "Entirely static",
    optical_characteristics: [
      "Gentle edge falloff",
      "No visible distortion",
      "Clean specular roll-off",
    ],
  },
  lighting: {
    summary:
      "A single hard key from the upper left with a soft warm bounce filling the shadow side.",
    key_light: "Hard, small-source key from upper left, roughly 45 degrees",
    fill_light: "Low-intensity warm bounce from the lower right",
    rim_or_separation_light: "None; separation comes from backdrop tone",
    direction: "Upper left, front-side",
    quality: "Hard with crisp shadow terminators",
    contrast_level: "High",
    time_of_day_impression: "Controlled studio, no daylight cue",
    practical_lights: [],
    shadow_character: "Long, hard-edged, directional",
    highlight_character: "Broad, matte, non-specular",
  },
  colour_system: {
    palette_summary:
      "Warm neutral trio of bone, sand and charcoal, disrupted by one saturated lime accent.",
    dominant_colours: [
      { name: "Bone white", hex_approximation: "#E8E1D6", role: "Primary form" },
      { name: "Warm sand", hex_approximation: "#C9A87A", role: "Secondary form" },
      { name: "Charcoal", hex_approximation: "#2A2724", role: "Backdrop" },
    ],
    accent_colours: [{ name: "Lime", hex_approximation: "#A8C93A", role: "Single focal accent" }],
    saturation: "Low overall, with one high-saturation accent",
    contrast: "High tonal contrast, low chromatic contrast",
    white_balance: "Warm-neutral",
    tonal_range: "Full range with retained shadow detail",
    colour_relationship: "Near-monochrome neutrals against a complementary accent",
  },
  materials_and_texture: {
    materials: ["Matte ceramic", "Textured plaster", "Painted composite"],
    surfaces: ["Fine granular ceramic", "Rough plaster floor", "Smooth painted disc"],
    texture_density: "Medium-high; texture readable at object scale",
    grain_or_noise: "Subtle fine grain consistent with a clean capture",
    atmospheric_effects: [],
  },
  style_and_medium: {
    visual_medium: "Photographic still life",
    realism_level: "Photoreal",
    rendering_character: "Clean, controlled, product-adjacent",
    line_and_edge_character: "Crisp geometric edges, softened by matte surfaces",
    detail_density: "Low object count, high surface detail",
    era_or_design_language: "Contemporary editorial minimalism",
    stylistic_descriptors: ["Editorial", "Sculptural", "Restrained", "Tactile"],
    direct_artist_reference_avoided: true,
    artist_reference_note:
      "Direct artist naming was intentionally avoided; the look is expressed as objective attributes.",
  },
  mood_and_narrative: {
    moods: ["Calm", "Precise", "Considered"],
    emotional_tone: "Quietly confident",
    narrative_impression: "An arranged study of form and light rather than a scene with events",
    energy_level: "Low, deliberate",
    intended_audience_impression: "Design-literate, premium, unhurried",
  },
  post_processing: {
    colour_grading: "Warm-neutral grade with slightly lifted shadows",
    contrast_treatment: "Firm S-curve retaining highlight detail",
    sharpening_or_softness: "Moderate capture sharpening only",
    bloom_or_halation: "None observable",
    vignette: "Very slight natural corner falloff",
    grain: "Fine, even",
    compositing_character: "Single-frame appearance, no visible compositing",
    additional_effects: [],
  },
  visual_dna: {
    essential_attributes: [
      {
        id: "hard-key-45",
        label: "Hard key light from upper left",
        description:
          "A single small-source key at roughly 45 degrees producing long, crisp diagonal shadows.",
        importance: 95,
        locked_by_default: true,
      },
      {
        id: "warm-neutral-palette",
        label: "Warm neutral palette with one accent",
        description:
          "Bone, sand and charcoal only, disrupted by exactly one saturated accent object.",
        importance: 92,
        locked_by_default: true,
      },
      {
        id: "matte-ceramic-texture",
        label: "Matte ceramic and plaster texture",
        description: "Non-specular granular surfaces; no gloss, no reflections, no metal.",
        importance: 88,
        locked_by_default: true,
      },
      {
        id: "asymmetric-thirds",
        label: "Asymmetric thirds composition",
        description: "Tall form left, stepped form right, rounded form breaking the lower centre.",
        importance: 84,
        locked_by_default: true,
      },
    ],
    supporting_attributes: [
      {
        id: "shallow-dof",
        label: "Shallow depth-of-field appearance",
        description: "Background falls gently out of focus behind the set.",
        importance: 62,
      },
      {
        id: "fine-grain",
        label: "Fine even grain",
        description: "Subtle grain keeps surfaces from reading as CG.",
        importance: 48,
      },
    ],
    editable_variables: [
      {
        key: "PRIMARY_SUBJECT",
        label: "Primary subject",
        current_value: "tall matte ceramic cylinder",
        description: "The dominant form occupying the left third.",
        example_alternatives: [
          "a glass fragrance bottle",
          "a folded textile column",
          "a stacked paper form",
        ],
        impact_if_changed: "Low — the lighting and palette carry the identity.",
      },
      {
        key: "ACCENT_COLOUR",
        label: "Accent colour",
        current_value: "lime green",
        description: "The single saturated accent in an otherwise neutral set.",
        example_alternatives: ["signal orange", "cobalt", "oxblood"],
        impact_if_changed: "Medium — keep it to one object only.",
      },
      {
        key: "ENVIRONMENT",
        label: "Environment",
        current_value: "plaster surface against a charcoal backdrop",
        description: "The shallow studio set surrounding the objects.",
        example_alternatives: ["raw concrete ledge against deep green", "sand-toned paper sweep"],
        impact_if_changed: "Medium — retain the matte, unlit backdrop.",
      },
    ],
    consistency_rules: [
      "Keep exactly one saturated accent object per frame.",
      "Keep the key light direction and hardness identical across the series.",
      "Never introduce gloss, chrome or reflective materials.",
    ],
    attributes_to_avoid_changing: [
      "Key light direction and hardness",
      "Matte surface character",
      "Neutral-plus-one-accent colour discipline",
    ],
  },
  prompt_package: {
    master_prompt:
      "A tall matte off-white ceramic cylinder stands on a fine plaster surface beside an ochre stepped block and a bone-white sphere, with a single small lime-green ceramic disc resting on the top step. The set is shallow: a textured plaster floor meeting an unbroken deep charcoal backdrop. Composition is asymmetric across thirds, the sphere breaking the lower centre line, with long diagonal cast shadows travelling from upper left to lower right. Short telephoto visual language, near eye level to the set, shallow depth-of-field appearance. A single hard key light from the upper left at roughly 45 degrees produces crisp shadow terminators, filled by a low warm bounce from the lower right. Palette is restricted to bone, warm sand and charcoal with one saturated lime accent. Surfaces are matte ceramic and rough plaster with no gloss or reflection. Contemporary editorial minimalism, calm and deliberate, finished with a warm-neutral grade, firm contrast and fine even grain.",
    theme_locked_template:
      "[PRIMARY_SUBJECT] arranged with two supporting matte geometric forms on [ENVIRONMENT], one small [ACCENT_COLOUR] object as the single accent. Asymmetric thirds composition, [CAMERA_DISTANCE] short telephoto language, shallow depth-of-field appearance. Single hard key light from the upper left at roughly 45 degrees with long diagonal cast shadows and a low warm bounce fill. Matte ceramic and plaster surfaces, no gloss. Warm-neutral grade, firm contrast, fine even grain. [ASPECT_RATIO]",
    negative_prompt:
      "glossy surfaces, chrome, reflections, soft flat lighting, multiple accent colours, busy background, text, logos, watermark, people, hands, lens flare, heavy vignette, oversaturated colour, HDR look, plastic sheen",
    provider_variants: {
      universal:
        "Matte ceramic cylinder, sphere and ochre stepped block on a plaster surface against a charcoal backdrop, single lime accent disc, hard 45-degree key light from upper left with long diagonal shadows, short telephoto, shallow depth of field, warm-neutral grade, fine grain, editorial still life.",
      midjourney:
        "matte ceramic cylinder, sphere and ochre stepped block on plaster, charcoal backdrop, single lime accent disc, hard 45 degree key light, long diagonal shadows, short telephoto, shallow depth of field, warm neutral grade, fine grain, editorial still life --ar 4:5 --style raw --no gloss, reflections, text",
      flux_sdxl:
        "editorial still life photograph, matte ceramic cylinder, bone sphere and ochre stepped block on textured plaster, deep charcoal backdrop, one small lime ceramic disc, hard key light upper left 45 degrees, long crisp diagonal shadows, short telephoto compression, shallow depth of field, warm neutral colour grade, fine film grain | negative: gloss, chrome, reflections, text, watermark, people, oversaturation",
      gpt_image:
        "Create an editorial still-life photograph: a tall matte off-white ceramic cylinder, a bone sphere and an ochre stepped block on a textured plaster surface against a deep charcoal backdrop, with one small lime-green disc as the only accent. Light it with a single hard key from the upper left at about 45 degrees so the shadows fall long and crisp to the lower right. Short telephoto framing, shallow depth of field, warm-neutral grade, fine grain. No gloss, no text, no people.",
      gemini_image:
        "An editorial still-life photograph of three matte ceramic geometric forms — a tall cylinder, a bone sphere and an ochre stepped block — on textured plaster against a deep charcoal backdrop, with a single small lime-green disc as the only accent. A hard key light from the upper left at roughly 45 degrees casts long crisp diagonal shadows. Short telephoto, shallow depth of field, warm-neutral grade, fine grain, no gloss and no text.",
      ideogram:
        "Editorial still life: matte ceramic cylinder, bone sphere, ochre stepped block on plaster, charcoal backdrop, one lime accent disc. Hard 45-degree key light from upper left, long diagonal shadows, short telephoto, shallow depth of field, warm-neutral grade, fine grain. No text, no logos, no gloss.",
    },
    variation_examples: [
      {
        title: "Fragrance campaign frame",
        changed_variables: [
          {
            key: "PRIMARY_SUBJECT",
            original_value: "tall matte ceramic cylinder",
            new_value: "frosted glass fragrance bottle",
          },
        ],
        preserved_attributes: [
          "Hard key light from upper left",
          "Warm neutral palette with one accent",
          "Asymmetric thirds composition",
        ],
        final_prompt:
          "A frosted glass fragrance bottle arranged with two supporting matte geometric forms on a plaster surface against a deep charcoal backdrop, one small lime-green object as the single accent. Asymmetric thirds composition, short telephoto language, shallow depth-of-field appearance. Single hard key light from the upper left at roughly 45 degrees with long diagonal cast shadows and a low warm bounce fill. Matte surfaces, no gloss beyond the bottle itself. Warm-neutral grade, firm contrast, fine even grain. 4:5.",
      },
      {
        title: "Signal-orange accent variant",
        changed_variables: [
          {
            key: "ACCENT_COLOUR",
            original_value: "lime green",
            new_value: "signal orange",
          },
        ],
        preserved_attributes: [
          "Hard key light from upper left",
          "Matte ceramic and plaster texture",
          "One accent object only",
        ],
        final_prompt:
          "A tall matte ceramic cylinder arranged with two supporting matte geometric forms on a plaster surface against a deep charcoal backdrop, one small signal-orange object as the single accent. Asymmetric thirds composition, short telephoto language, shallow depth-of-field appearance. Single hard key light from the upper left at roughly 45 degrees with long diagonal cast shadows and a low warm bounce fill. Matte ceramic and plaster surfaces, no gloss. Warm-neutral grade, firm contrast, fine even grain. 4:5.",
      },
    ],
  },
  quality_control: {
    likely_failure_modes: [
      "Generators softening the key light into flat studio lighting",
      "Additional accent colours creeping into the palette",
      "Surfaces rendering glossy instead of matte",
    ],
    ambiguity_notes: [
      "Exact surface material is consistent with ceramic or plaster; it cannot be confirmed from the image alone.",
    ],
    unsupported_inferences_avoided: [
      "No camera body, lens, aperture or ISO has been inferred.",
      "No studio, location or photographer has been named.",
    ],
    confidence_by_section: [
      { section: "Lighting", confidence: 92, reason: "Shadow behaviour is unambiguous." },
      { section: "Composition", confidence: 90, reason: "Object placement is clearly readable." },
      {
        section: "Materials",
        confidence: 74,
        reason: "Material family is visible; exact composition is not.",
      },
      {
        section: "Post-processing",
        confidence: 68,
        reason: "Grade is inferred from tonal behaviour only.",
      },
    ],
    reproduction_tips: [
      "State the key light direction and hardness early in the prompt.",
      "Name the accent colour exactly once, attached to a single object.",
      "Add matte and non-reflective explicitly; most generators default to gloss.",
    ],
  },
  safety: {
    contains_person: false,
    contains_sensitive_content: false,
    contains_logo_or_trademark: false,
    contains_possible_copyrighted_character: false,
    safe_to_process: true,
    user_facing_notice: null,
  },
};
