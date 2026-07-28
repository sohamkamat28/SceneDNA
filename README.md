# SceneDNA

SceneDNA reverse-engineers a reference image into a reusable visual system. It analyses composition, camera language, lighting, colour, materials, mood, and post-processing, then turns those findings into structured prompts for creating new work in the same visual style.

**Live app:** [scene-dna-studio.vercel.app](https://scene-dna-studio.vercel.app)

## Highlights

- Structured visual analysis across composition, camera, lighting, colour, materials, mood, and finish
- Reusable master prompts with editable variation controls
- Product-transfer prompts that preserve an attached product while applying only the reference image's visual treatment
- One-click Markdown export for the complete analysis
- Google authentication and private analysis history
- Responsive interface built for desktop and mobile

## Tech stack

- React 19 and TypeScript
- TanStack Start, Router, and Query
- Vite and Nitro
- Tailwind CSS
- Supabase authentication, database, and storage
- Google Gemini for image analysis
- Vercel for production hosting

## Local development

Requirements:

- Node.js 22 or newer
- npm
- A Supabase project
- A Google Gemini API key

```bash
git clone https://github.com/sohamkamat28/SceneDNA.git
cd SceneDNA
npm install
cp .env.example .env.local
npm run dev
```

The development server runs at `http://localhost:8080`.

## Environment variables

Copy `.env.example` to `.env.local` and provide your own credentials. Never commit real secrets.

| Variable | Purpose |
| --- | --- |
| `VITE_SUPABASE_URL` | Public Supabase project URL used by the browser |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Public Supabase publishable key used by the browser |
| `SUPABASE_URL` | Supabase project URL used by server functions |
| `SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key used by server functions |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only key for trusted database and storage operations |
| `GEMINI_API_KEY` | Server-only Google Gemini API key |

## Commands

```bash
npm run dev       # Start the local development server
npm run build     # Create a production build
npm run preview   # Preview the production build
npm run lint      # Run ESLint
npx tsc --noEmit  # Run TypeScript checks
```

## Database

SQL migrations are stored in `supabase/migrations`. Apply them to your Supabase project before using analysis history and storage features.

## Deployment

The application is configured for Vercel through Nitro. Add the environment variables listed above to the Vercel project, then deploy the repository.
