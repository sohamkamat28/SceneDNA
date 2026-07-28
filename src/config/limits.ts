/**
 * Free-tier usage limits. All of these are enforced server-side.
 * Change values here only — nothing else hardcodes them.
 */
export const FREE_LIMITS = {
  perUserPerMinute: 1,
  perUserPerDay: 3,
  perUserPerMonth: 10,
  maximumFileBytes: 8 * 1024 * 1024,
} as const;

export const IMAGE_RULES = {
  acceptedMimeTypes: ["image/jpeg", "image/png", "image/webp"] as const,
  minDimension: 256,
  maxLongestEdge: 3072,
  webpQuality: 0.9,
  maxChangeNotesLength: 500,
} as const;

export const LIMIT_MESSAGES = {
  RATE_LIMITED: "Please wait a moment before starting another analysis.",
  DAILY_LIMIT_REACHED:
    "You have used today's free analysis allowance. Try again tomorrow.",
  MONTHLY_LIMIT_REACHED: "You have used this month's free analysis allowance.",
} as const;
