import { FREE_LIMITS, LIMIT_MESSAGES } from "@/config/limits";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

class LimitError extends Error {
  constructor(
    message: string,
    readonly code: string,
  ) {
    super(message);
  }
}

async function countAnalyses(
  supabase: SupabaseClient<Database>,
  userId: string,
  since: number,
) {
  const { count, error } = await supabase
    .from("analyses")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .neq("status", "failed")
    .gte("created_at", new Date(since).toISOString());
  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function assertWithinFreeLimits(
  userId: string,
  supabase: SupabaseClient<Database>,
) {
  const now = Date.now();
  const [perMinute, perDay, perMonth] = await Promise.all([
    countAnalyses(supabase, userId, now - 60_000),
    countAnalyses(supabase, userId, now - 24 * 60 * 60_000),
    countAnalyses(supabase, userId, now - 30 * 24 * 60 * 60_000),
  ]);

  if (perMinute >= FREE_LIMITS.perUserPerMinute)
    throw new LimitError(LIMIT_MESSAGES.RATE_LIMITED, "rate_limited");
  if (perDay >= FREE_LIMITS.perUserPerDay)
    throw new LimitError(LIMIT_MESSAGES.DAILY_LIMIT_REACHED, "daily_limit");
  if (perMonth >= FREE_LIMITS.perUserPerMonth)
    throw new LimitError(LIMIT_MESSAGES.MONTHLY_LIMIT_REACHED, "monthly_limit");
}
