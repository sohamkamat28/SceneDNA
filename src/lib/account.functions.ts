import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getAccountOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const now = Date.now();
    const dayAgo = new Date(now - 24 * 60 * 60_000).toISOString();
    const monthAgo = new Date(now - 30 * 24 * 60 * 60_000).toISOString();

    const [profileResult, dayResult, monthResult, totalResult] = await Promise.all([
      context.supabase
        .from("profiles")
        .select("full_name, plan, preferred_generator, preferred_depth, default_retain_source")
        .eq("id", context.userId)
        .maybeSingle(),
      context.supabase
        .from("analyses")
        .select("id", { count: "exact", head: true })
        .neq("status", "failed")
        .gte("created_at", dayAgo),
      context.supabase
        .from("analyses")
        .select("id", { count: "exact", head: true })
        .neq("status", "failed")
        .gte("created_at", monthAgo),
      context.supabase.from("analyses").select("id", { count: "exact", head: true }),
    ]);

    if (profileResult.error) throw new Error(profileResult.error.message);

    return {
      profile: profileResult.data ?? {
        full_name: null,
        plan: "free",
        preferred_generator: "universal",
        preferred_depth: "detailed",
        default_retain_source: false,
      },
      usage: {
        today: dayResult.count ?? 0,
        month: monthResult.count ?? 0,
        total: totalResult.count ?? 0,
      },
    };
  });

export const updateAccountPreferences = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) =>
    z
      .object({
        full_name: z.string().max(80).nullable(),
        preferred_generator: z.enum([
          "universal",
          "midjourney",
          "flux_sdxl",
          "gpt_image",
          "gemini_image",
          "ideogram",
        ]),
        preferred_depth: z.enum(["concise", "balanced", "detailed"]),
        default_retain_source: z.boolean(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("profiles")
      .update({
        full_name: data.full_name,
        preferred_generator: data.preferred_generator,
        preferred_depth: data.preferred_depth,
        default_retain_source: data.default_retain_source,
      })
      .eq("id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const exportAccountData = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("analyses")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { exportedAt: new Date().toISOString(), analyses: data ?? [] };
  });

export const deleteAllAnalyses = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: rows, error: listError } = await context.supabase
      .from("analyses")
      .select("id, source_path");
    if (listError) throw new Error(listError.message);

    const paths = (rows ?? []).map((row) => row.source_path).filter(Boolean) as string[];
    if (paths.length > 0) {
      await context.supabase.storage.from("reference-images").remove(paths);
    }

    const { error } = await context.supabase
      .from("analyses")
      .delete()
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { deleted: rows?.length ?? 0 };
  });
