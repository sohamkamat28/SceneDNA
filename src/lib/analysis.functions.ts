import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { IMAGE_RULES, FREE_LIMITS } from "@/config/limits";
import { TARGET_GENERATOR_VALUES, type TargetGenerator } from "@/config/routes";

import { visualPromptBlueprintSchema } from "@/schemas/blueprint";

const analyseInput = z.object({
  imageBase64: z.string().min(64),
  mimeType: z.enum(["image/webp", "image/png", "image/jpeg"]),
  width: z.number().int().min(IMAGE_RULES.minDimension).max(IMAGE_RULES.maxLongestEdge),
  height: z.number().int().min(IMAGE_RULES.minDimension).max(IMAGE_RULES.maxLongestEdge),
  bytes: z.number().int().min(1).max(FREE_LIMITS.maximumFileBytes),
  aspectRatio: z.string().min(1).max(16),
  orientation: z.enum(["portrait", "landscape", "square"]),
  targetGenerator: z.enum(TARGET_GENERATOR_VALUES),

  promptDepth: z.enum(["concise", "balanced", "detailed"]),
  useCase: z.string().min(1).max(40),
  changeNotes: z.string().max(IMAGE_RULES.maxChangeNotesLength).nullable().optional(),
  retainSource: z.boolean(),
});

export const analyseImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => analyseInput.parse(data))
  .handler(async ({ data, context }) => {
    const { runAnalysis } = await import("@/lib/analysis.server");
    return runAnalysis(
      context.userId,
      {
        ...data,
        targetGenerator: data.targetGenerator as TargetGenerator,
      },
      context.supabase,
    );
  });

export const listAnalyses = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("analyses")
      .select(
        "id, title, status, created_at, target_generator, prompt_depth, use_case, aspect_ratio, orientation, overall_confidence",
      )
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const getAnalysis = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("analyses")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) return null;
    const parsed = visualPromptBlueprintSchema.safeParse(row.result);
    return { ...row, blueprint: parsed.success ? parsed.data : null };
  });

export const deleteAnalysis = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("analyses").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
