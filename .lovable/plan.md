## SceneDNA — build plan

A visual-intelligence tool: upload one reference image, get back a structured visual specification and a reusable prompt blueprint. Built on the built-in Lovable Cloud backend, analysed by your own free Gemini key.

### Decisions locked in from your answers

- Backend: built-in Lovable Cloud (Postgres, auth, private storage, RLS) — no external Supabase account needed.
- AI: Google Gemini Developer API called directly with your `GEMINI_API_KEY`, stored server-side only. Model `gemini-2.5-flash`, centralised in one config file. No Lovable AI inference, no paid providers.
- Delivery: three phases with review points.

### Two deviations from your spec (unavoidable on this stack)

1. **Router**: this stack is TanStack Start, not React Router. Same routes, same URLs, file-based routing under `src/routes`. All spec routes are honoured.
2. **Server code**: server logic runs as TanStack server functions rather than Supabase Edge Functions. Identical guarantees — server-only secrets, server-enforced limits, no key in the browser. File layout mirrors your `supabase/functions/analyse-reference-image/` split (`ai-config.ts`, `system-prompt.ts`, `schema.ts`, `errors.ts`, `rate-limit.ts`).

Everything else in the spec is followed as written.

---

### Phase 1 — Foundation, brand, landing, auth

- `src/config/brand.ts` (single rename point), `routes.ts`, `limits.ts`.
- Design system in `src/styles.css`: dark-first tokens, Instrument Sans + IBM Plex Mono via `@fontsource`, restrained accent. No gradients, no glassmorphism, no Inter, no bento grids — per your restriction list. Motion 150–220ms, `prefers-reduced-motion` respected.
- Landing page at `/` with all 11 sections: hero (asymmetric two-column, real workspace preview, exact eyebrow/headline/CTA copy), static example, output anatomy, three-step workflow, use cases, Visual DNA explainer, privacy and limitations, free-beta pricing, final CTA, footer.
- Static example at `/example` — original generated copyright-safe reference image, hand-authored blueprint fixture, zero AI calls.
- Legal: `/pricing`, `/privacy`, `/terms`, 404 state.
- Auth: email/password sign-up, sign-in, `/forgot-password`, `/reset-password`, session context, protected `/app/*` gate, reverse-redirect from `/login` and `/signup`.
- Database migration: `profiles`, `analyses`, `analysis_usage` (attempt log), `global_usage`, with grants, RLS scoped to `auth.uid()`, and an auto-profile trigger on signup. Private storage bucket for source images with per-user path policies.

### Phase 2 — Upload, Gemini pipeline, workspace

- `/app/new` two-stage flow: drag-and-drop, format/MIME/dimension/size validation, Canvas preprocessing (EXIF stripped by re-encode, resize above 3072px, WebP 0.9 / JPEG 0.92, under 8MB), then preferences (target generator, prompt depth, use case, change-notes, retention toggle default OFF, the Gemini free-tier disclosure and required consent checkbox).
- Private upload, then a server function that: verifies session, verifies ownership, enforces `perUserPerMinute 1 / perUserPerDay 3 / perUserPerMonth 10 / globalPerDay 20` server-side, prevents duplicate concurrent runs, re-validates bytes, calls Gemini once with structured JSON output, validates with Zod, persists, deletes the source when retention is off. One controlled retry on schema/parse failure only. Typed errors `RATE_LIMITED`, `DAILY_LIMIT_REACHED`, `MONTHLY_LIMIT_REACHED`, `GLOBAL_FREE_QUOTA_REACHED`, `QUOTA_EXHAUSTED` with your exact user-facing messages.
- Full `VisualPromptBlueprint` schema (TypeScript + Zod + JSON Schema) and your system instruction verbatim in a dedicated server file, including the prompt-injection and identity/attribution safeguards.
- Real-stage progress UI (9 named stages, elapsed time, no fake percentage, no whimsical copy).
- `/app/analysis/:id` workspace: sectioned analysis, locked Visual DNA vs editable variables, live template substitution, generator-specific prompt versions, negative prompt, confidence and ambiguity display, full-analysis Markdown copy, and an attached-product style-transfer prompt.

### Phase 3 — Shell, history, settings, polish

- Authenticated layout: collapsible 220px sidebar, mobile drawer, top bar with usage counter.
- `/app` dashboard with real metrics only, empty state, recent analyses.
- `/app/history` with filters and delete; `/app/settings` with profile, default generator, retention default, data deletion, sign out.
- Responsive pass, console/network check, ownership and RLS verification, per-route SEO metadata.

### Technical notes

- `GEMINI_API_KEY` stored as a server secret; requests go to the Gemini Developer API from server functions only, 90s timeout, one image per request, no tools, no grounding, no image output.
- Logs carry analysis id, model, status, duration and safe error code — never image bytes, tokens, or keys.
- Limits and model config each live in exactly one editable file.

I'll ask for your Gemini key at the start of Phase 2, when the analysis pipeline first needs it.
