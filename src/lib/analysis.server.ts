import type { SupabaseClient } from "@supabase/supabase-js";
import { buildAnalysisPrompt } from "@/lib/analysis-prompt.server";
import { callGeminiJson, extractJsonObject, GeminiError, GEMINI_MODEL } from "@/lib/gemini.server";
import { assertWithinFreeLimits } from "@/lib/limits.server";
import type { Database } from "@/integrations/supabase/types";
import { visualPromptBlueprintSchema, type VisualPromptBlueprint } from "@/schemas/blueprint";
import type { PromptDepth, TargetGenerator, UseCase } from "@/config/routes";

export type AnalyseArgs = {
  imageBase64: string;
  mimeType: string;
  width: number;
  height: number;
  bytes: number;
  aspectRatio: string;
  orientation: "portrait" | "landscape" | "square";
  targetGenerator: TargetGenerator;
  promptDepth: PromptDepth;
  useCase: string;
  changeNotes?: string | null;
  retainSource: boolean;
};

function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export async function runAnalysis(
  userId: string,
  args: AnalyseArgs,
  supabase: SupabaseClient<Database>,
) {
  await assertWithinFreeLimits(userId, supabase);

  const startedAt = new Date();
  const { system, user } = buildAnalysisPrompt({
    targetGenerator: args.targetGenerator,
    promptDepth: args.promptDepth,
    useCase: args.useCase as UseCase,
    changeNotes: args.changeNotes ?? null,
    aspectRatio: args.aspectRatio,
    orientation: args.orientation,
  });

  let blueprint: VisualPromptBlueprint;
  try {
    const parts = [
      { inlineData: { mimeType: args.mimeType, data: args.imageBase64 } },
      { text: user },
    ];
    let raw = await callGeminiJson({ system, parts });
    let parsed = visualPromptBlueprintSchema.safeParse(extractJsonObject(raw));

    if (!parsed.success) {
      const issues = parsed.error.issues
        .slice(0, 25)
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("\n");
      raw = await callGeminiJson({
        system,
        parts: [
          ...parts,
          {
            text: `Your previous JSON was invalid. Fix exactly these problems and return the complete corrected JSON object only:\n${issues}\n\nPrevious output:\n${raw.slice(0, 20000)}`,
          },
        ],
      });
      parsed = visualPromptBlueprintSchema.safeParse(extractJsonObject(raw));
    }

    if (!parsed.success) {
      throw new GeminiError(
        "The analysis came back in an unexpected shape. Please try again.",
        "schema_mismatch",
      );
    }
    blueprint = parsed.data;
  } catch (error) {
    const code = error instanceof GeminiError ? error.code : "unknown_error";
    await supabase.from("analyses").insert({
      user_id: userId,
      status: "failed",
      error_code: code,
      model: GEMINI_MODEL,
      target_generator: args.targetGenerator,
      prompt_depth: args.promptDepth,
      use_case: args.useCase,
      change_notes: args.changeNotes ?? null,
      retain_source: false,
      aspect_ratio: args.aspectRatio,
      orientation: args.orientation,
      started_at: startedAt.toISOString(),
    });
    throw error instanceof Error ? error : new Error("Analysis failed.");
  }

  const completedAt = new Date();
  const { data: row, error } = await supabase
    .from("analyses")
    .insert({
      user_id: userId,
      status: "complete",
      title: blueprint.overview.title,
      result: blueprint,
      model: GEMINI_MODEL,
      overall_confidence: blueprint.overview.overall_confidence,
      target_generator: args.targetGenerator,
      prompt_depth: args.promptDepth,
      use_case: args.useCase,
      change_notes: args.changeNotes ?? null,
      retain_source: args.retainSource,
      source_mime: args.retainSource ? args.mimeType : null,
      source_bytes: args.retainSource ? args.bytes : null,
      source_width: args.width,
      source_height: args.height,
      aspect_ratio: args.aspectRatio,
      orientation: args.orientation,
      started_at: startedAt.toISOString(),
      completed_at: completedAt.toISOString(),
      duration_ms: completedAt.getTime() - startedAt.getTime(),
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  if (args.retainSource) {
    const path = `${userId}/${row.id}.webp`;
    const upload = await supabase.storage
      .from("reference-images")
      .upload(path, base64ToBytes(args.imageBase64), {
        contentType: args.mimeType,
        upsert: true,
      });
    if (!upload.error) {
      await supabase.from("analyses").update({ source_path: path }).eq("id", row.id);
    }
  }

  return { id: row.id as string, blueprint };
}
