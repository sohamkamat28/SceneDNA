import { FREE_LIMITS, LIMIT_MESSAGES } from "@/config/limits";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export class LimitError extends Error {
  constructor(
    message: string,
    readonly code: string,
  ) {
    super(message);
  }
}

type D1Result = {
  success: boolean;
};

type D1PreparedStatement = {
  bind: (...values: unknown[]) => D1PreparedStatement;
  first: <T>() => Promise<T | null>;
  run: () => Promise<D1Result>;
};

type D1Database = {
  prepare: (query: string) => D1PreparedStatement;
};

type RuntimeGlobals = typeof globalThis & {
  __env__?: {
    DB?: D1Database;
  };
};

function getLimitsDatabase(): D1Database | null {
  return (globalThis as RuntimeGlobals).__env__?.DB ?? null;
}

async function countAttempts(database: D1Database, filters: { since: number; userId?: string }) {
  const userClause = filters.userId ? "AND user_id = ?" : "";
  const statement = database.prepare(
    `SELECT count(*) AS count
     FROM analysis_attempts
     WHERE created_at >= ?
       AND outcome <> 'failed'
       ${userClause}`,
  );
  const bound = filters.userId
    ? statement.bind(filters.since, filters.userId)
    : statement.bind(filters.since);
  const row = await bound.first<{ count: number }>();
  return Number(row?.count ?? 0);
}

async function countSupabaseAnalyses(
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

async function assertWithinSupabaseLimits(
  userId: string,
  supabase: SupabaseClient<Database>,
  now: number,
) {
  const [perMinute, perDay, perMonth] = await Promise.all([
    countSupabaseAnalyses(supabase, userId, now - 60_000),
    countSupabaseAnalyses(supabase, userId, now - 24 * 60 * 60_000),
    countSupabaseAnalyses(supabase, userId, now - 30 * 24 * 60 * 60_000),
  ]);

  if (perMinute >= FREE_LIMITS.perUserPerMinute)
    throw new LimitError(LIMIT_MESSAGES.RATE_LIMITED, "rate_limited");
  if (perDay >= FREE_LIMITS.perUserPerDay)
    throw new LimitError(LIMIT_MESSAGES.DAILY_LIMIT_REACHED, "daily_limit");
  if (perMonth >= FREE_LIMITS.perUserPerMonth)
    throw new LimitError(LIMIT_MESSAGES.MONTHLY_LIMIT_REACHED, "monthly_limit");

  return { perDay, perMonth, attemptId: null };
}

/** Server-side free-tier enforcement. Never trust the client for any of this. */
export async function assertWithinFreeLimits(userId: string, supabase: SupabaseClient<Database>) {
  const database = getLimitsDatabase();
  const now = Date.now();
  if (!database) return assertWithinSupabaseLimits(userId, supabase, now);

  const minuteAgo = now - 60_000;
  const dayAgo = now - 24 * 60 * 60_000;
  const monthAgo = now - 30 * 24 * 60 * 60_000;

  await database
    .prepare(
      `UPDATE analysis_attempts
       SET outcome = 'failed', updated_at = ?
       WHERE outcome = 'started' AND created_at < ?`,
    )
    .bind(now, now - 15 * 60_000)
    .run();

  const [perMinute, perDay, perMonth, globalDay] = await Promise.all([
    countAttempts(database, { since: minuteAgo, userId }),
    countAttempts(database, { since: dayAgo, userId }),
    countAttempts(database, { since: monthAgo, userId }),
    countAttempts(database, { since: dayAgo }),
  ]);

  if (perMinute >= FREE_LIMITS.perUserPerMinute)
    throw new LimitError(LIMIT_MESSAGES.RATE_LIMITED, "rate_limited");
  if (perDay >= FREE_LIMITS.perUserPerDay)
    throw new LimitError(LIMIT_MESSAGES.DAILY_LIMIT_REACHED, "daily_limit");
  if (perMonth >= FREE_LIMITS.perUserPerMonth)
    throw new LimitError(LIMIT_MESSAGES.MONTHLY_LIMIT_REACHED, "monthly_limit");
  if (globalDay >= FREE_LIMITS.globalPerDay)
    throw new LimitError(LIMIT_MESSAGES.GLOBAL_FREE_QUOTA_REACHED, "global_limit");

  const attemptId = crypto.randomUUID();
  await database
    .prepare(
      `INSERT INTO analysis_attempts
       (id, user_id, outcome, created_at, updated_at)
       VALUES (?, ?, 'started', ?, ?)`,
    )
    .bind(attemptId, userId, now, now)
    .run();

  return { perDay, perMonth, attemptId };
}

export async function recordAttempt(
  attemptId: string | null,
  analysisId: string | null,
  outcome: "failed" | "completed",
) {
  const database = getLimitsDatabase();
  if (!database || !attemptId) return;

  const result = await database
    .prepare(
      `UPDATE analysis_attempts
       SET analysis_id = ?, outcome = ?, updated_at = ?
       WHERE id = ?`,
    )
    .bind(analysisId, outcome, Date.now(), attemptId)
    .run();
  if (!result.success) throw new Error("The analysis attempt could not be recorded.");
}
