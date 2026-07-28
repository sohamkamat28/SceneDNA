import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { BRAND } from "@/config/brand";
import {
  ROUTES,
  TARGET_GENERATORS,
  GENERATOR_FAMILIES,
  PROMPT_DEPTHS,
  USE_CASES,
  type TargetGenerator,
} from "@/config/routes";
import { GENERATOR_HINTS } from "@/config/generator-guidance";

import { FREE_LIMITS, IMAGE_RULES } from "@/config/limits";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { WorkspaceNav } from "@/components/layout/WorkspaceNav";
import { useAuth } from "@/lib/auth";
import { prepareImage, type PreparedImage } from "@/lib/image-pipeline";
import { analyseImage } from "@/lib/analysis.functions";

const TITLE = `New analysis — ${BRAND.name}`;
const DESCRIPTION =
  "Upload a reference image and turn its composition, lighting, colour and camera language into a reusable prompt blueprint.";

export const Route = createFileRoute("/app/new")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: NewAnalysisPage,
});

const fieldClass =
  "mt-2 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus-visible:border-primary";
const labelClass = "font-mono text-xs uppercase tracking-wider text-muted-foreground";

function NewAnalysisPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const run = useServerFn(analyseImage);
  const inputRef = useRef<HTMLInputElement>(null);

  const [image, setImage] = useState<PreparedImage | null>(null);
  const [preparing, setPreparing] = useState(false);
  const [running, setRunning] = useState(false);
  const [targetGenerator, setTargetGenerator] = useState<string>("universal");
  const [promptDepth, setPromptDepth] = useState<string>("detailed");
  const [useCase, setUseCase] = useState<string>("general");
  const [changeNotes, setChangeNotes] = useState("");
  const [retainSource, setRetainSource] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: ROUTES.login });
  }, [loading, user, navigate]);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setPreparing(true);
    try {
      setImage(await prepareImage(file));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not read that image.");
      setImage(null);
    } finally {
      setPreparing(false);
    }
  }

  async function onAnalyse() {
    if (!image || running) return;
    setRunning(true);
    try {
      const result = await run({
        data: {
          imageBase64: image.base64,
          mimeType: image.mimeType as "image/webp",
          width: image.width,
          height: image.height,
          bytes: image.bytes,
          aspectRatio: image.aspectRatio,
          orientation: image.orientation,
          targetGenerator,
          promptDepth: promptDepth as "detailed",
          useCase,
          changeNotes: changeNotes.trim() || null,
          retainSource,
        },
      });
      navigate({ to: "/app/analysis/$id", params: { id: result.id } });
    } catch (error) {
      toast.error(
        error instanceof Error && error.message
          ? error.message.replace(/^Error:\s*/, "")
          : "The analysis failed. Please try again.",
      );
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <WorkspaceNav />
      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-16">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
          New analysis
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">Upload a reference image</h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Your image is resized and re-encoded in your browser, which strips all EXIF metadata
          including location. It is never stored unless you ask us to keep it. Free tier:{" "}
          {FREE_LIMITS.perUserPerDay} analyses per day.
        </p>

        <div className="mt-10 grid gap-10 md:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                void onFile(e.dataTransfer.files?.[0]);
              }}
              className="flex w-full flex-col items-center justify-center rounded-lg border border-dashed border-border bg-surface px-6 py-16 text-center transition-colors hover:border-primary"
            >
              {image ? (
                <img
                  src={image.dataUrl}
                  alt="Selected reference"
                  className="max-h-80 w-auto rounded-md border border-border"
                />
              ) : (
                <>
                  <span className="text-sm font-medium">
                    {preparing ? "Preparing image…" : "Drop an image, or click to browse"}
                  </span>
                  <span className="mt-2 font-mono text-xs text-muted-foreground">
                    JPG · PNG · WebP · up to{" "}
                    {Math.round(FREE_LIMITS.maximumFileBytes / (1024 * 1024))} MB · min{" "}
                    {IMAGE_RULES.minDimension}px
                  </span>
                </>
              )}
            </button>
            <input
              ref={inputRef}
              type="file"
              accept={IMAGE_RULES.acceptedMimeTypes.join(",")}
              className="hidden"
              onChange={(e) => void onFile(e.target.files?.[0])}
            />
            {image ? (
              <p className="mt-3 font-mono text-xs text-muted-foreground">
                {image.width}×{image.height} · {image.aspectRatio} · {image.orientation} ·{" "}
                {Math.round(image.bytes / 1024)} KB · EXIF stripped
              </p>
            ) : null}
          </div>

          <div className="space-y-5">
            <div>
              <label className={labelClass} htmlFor="target">
                Target model
              </label>
              <select
                id="target"
                className={fieldClass}
                value={targetGenerator}
                onChange={(e) => setTargetGenerator(e.target.value)}
              >
                {GENERATOR_FAMILIES.map((family) => (
                  <optgroup key={family} label={family}>
                    {TARGET_GENERATORS.filter((o) => o.family === family).map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {GENERATOR_HINTS[targetGenerator as TargetGenerator]}
              </p>
            </div>


            <div>
              <label className={labelClass} htmlFor="depth">
                Prompt depth
              </label>
              <select
                id="depth"
                className={fieldClass}
                value={promptDepth}
                onChange={(e) => setPromptDepth(e.target.value)}
              >
                {PROMPT_DEPTHS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass} htmlFor="usecase">
                Use case
              </label>
              <select
                id="usecase"
                className={fieldClass}
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
              >
                {USE_CASES.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass} htmlFor="notes">
                What do you want to change?
              </label>
              <textarea
                id="notes"
                rows={4}
                maxLength={IMAGE_RULES.maxChangeNotesLength}
                className={fieldClass}
                placeholder="e.g. keep the lighting and palette, swap the subject for a glass bottle"
                value={changeNotes}
                onChange={(e) => setChangeNotes(e.target.value)}
              />
            </div>

            <label className="flex items-start gap-3 text-sm text-muted-foreground">
              <input
                type="checkbox"
                className="mt-0.5"
                checked={retainSource}
                onChange={(e) => setRetainSource(e.target.checked)}
              />
              Keep my source image in private storage
            </label>

            <button
              type="button"
              onClick={() => void onAnalyse()}
              disabled={!image || running || preparing}
              className="w-full rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {running ? "Analysing…" : "Analyse image"}
            </button>

            <Link
              to={ROUTES.history}
              className="block text-center font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
            >
              View history
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
