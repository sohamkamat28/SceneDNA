CREATE TABLE IF NOT EXISTS analysis_attempts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  analysis_id TEXT,
  outcome TEXT NOT NULL CHECK (outcome IN ('started', 'failed', 'completed')),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS analysis_attempts_user_created_idx
  ON analysis_attempts (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS analysis_attempts_created_idx
  ON analysis_attempts (created_at DESC);
