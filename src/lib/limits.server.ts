import { FREE_LIMITS, LIMIT_MESSAGES } from "@/config/limits";

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

function getLimitsDatabase(): D1Database {
  const database = (globalThis as RuntimeGlobals).__env__?.DB;
  if (!database) throw new Error("The analysis limits database is unavailable.");
  return database;
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

/** Server-side free-tier enforcement. Never trust the client for any of this. */
export async function assertWithinFreeLimits(userId: string) {
  const database = getLimitsDatabase();
  const now = Date.now();
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
  attemptId: string,
  analysisId: string | null,
  outcome: "failed" | "completed",
) {
  const result = await getLimitsDatabase()
    .prepare(
      `UPDATE analysis_attempts
       SET analysis_id = ?, outcome = ?, updated_at = ?
       WHERE id = ?`,
    )
    .bind(analysisId, outcome, Date.now(), attemptId)
    .run();
  if (!result.success) throw new Error("The analysis attempt could not be recorded.");
}
