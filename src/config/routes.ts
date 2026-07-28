export const ROUTES = {
  home: "/",
  login: "/login",
  signup: "/signup",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  pricing: "/pricing",
  privacy: "/privacy",
  terms: "/terms",
  example: "/example",
  app: "/app",
  newAnalysis: "/app/new",
  history: "/app/history",
  settings: "/app/settings",
} as const;

export const TARGET_GENERATORS = [
  { value: "universal", label: "Universal (any model)", family: "General", variant: "universal" },
  { value: "midjourney_v7", label: "Midjourney v7", family: "Midjourney", variant: "midjourney" },
  { value: "midjourney_v6", label: "Midjourney v6.1", family: "Midjourney", variant: "midjourney" },
  { value: "niji_6", label: "Niji 6 (anime)", family: "Midjourney", variant: "midjourney" },
  { value: "flux_1_pro", label: "FLUX.1 Pro / Ultra", family: "FLUX & SD", variant: "flux_sdxl" },
  { value: "flux_1_dev", label: "FLUX.1 Dev / Schnell", family: "FLUX & SD", variant: "flux_sdxl" },
  { value: "sdxl", label: "Stable Diffusion XL", family: "FLUX & SD", variant: "flux_sdxl" },
  { value: "sd_3_5", label: "Stable Diffusion 3.5", family: "FLUX & SD", variant: "flux_sdxl" },
  { value: "gpt_image_1", label: "GPT Image 1 / ChatGPT", family: "OpenAI", variant: "gpt_image" },
  { value: "dalle_3", label: "DALL·E 3", family: "OpenAI", variant: "gpt_image" },
  {
    value: "nano_banana",
    label: "Nano Banana (Gemini Image)",
    family: "Google",
    variant: "gemini_image",
  },
  { value: "imagen_4", label: "Imagen 4", family: "Google", variant: "gemini_image" },
  { value: "ideogram_3", label: "Ideogram 3.0", family: "Typography", variant: "ideogram" },
  { value: "recraft_v3", label: "Recraft V3", family: "Typography", variant: "ideogram" },
  { value: "firefly_3", label: "Adobe Firefly 3", family: "Other", variant: "universal" },
  { value: "leonardo_phoenix", label: "Leonardo Phoenix", family: "Other", variant: "universal" },
] as const;

export const TARGET_GENERATOR_VALUES = TARGET_GENERATORS.map((g) => g.value) as unknown as [
  string,
  ...string[],
];

export const GENERATOR_FAMILIES = Array.from(new Set(TARGET_GENERATORS.map((g) => g.family)));


export const PROMPT_DEPTHS = [
  { value: "concise", label: "Concise" },
  { value: "balanced", label: "Balanced" },
  { value: "detailed", label: "Detailed" },
] as const;

export const USE_CASES = [
  { value: "brand_campaign", label: "Brand campaign" },
  { value: "product_photography", label: "Product photography" },
  { value: "editorial_portrait", label: "Editorial portrait" },
  { value: "social_series", label: "Social-media series" },
  { value: "film_storyboard", label: "Film or storyboard" },
  { value: "illustration_series", label: "Illustration series" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "poster_design", label: "Poster design" },
  { value: "architecture", label: "Architecture" },
  { value: "general", label: "General creative work" },
] as const;

export type TargetGenerator = (typeof TARGET_GENERATORS)[number]["value"];
export type PromptDepth = (typeof PROMPT_DEPTHS)[number]["value"];
export type UseCase = (typeof USE_CASES)[number]["value"];
