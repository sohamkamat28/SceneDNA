import { IMAGE_RULES, FREE_LIMITS } from "@/config/limits";

export type PreparedImage = {
  /** Raw base64 (no data-url prefix) of the re-encoded image. */
  base64: string;
  dataUrl: string;
  mimeType: string;
  bytes: number;
  width: number;
  height: number;
  aspectRatio: string;
  orientation: "portrait" | "landscape" | "square";
};

export class ImagePipelineError extends Error {}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export function describeAspectRatio(width: number, height: number): string {
  const divisor = gcd(width, height) || 1;
  let w = Math.round(width / divisor);
  let h = Math.round(height / divisor);
  if (w > 32 || h > 32) {
    const ratio = width / height;
    const common: Array<[number, number]> = [
      [1, 1],
      [4, 5],
      [5, 4],
      [2, 3],
      [3, 2],
      [3, 4],
      [4, 3],
      [9, 16],
      [16, 9],
      [21, 9],
    ];
    let best = common[0];
    let bestDelta = Infinity;
    for (const [cw, ch] of common) {
      const delta = Math.abs(cw / ch - ratio);
      if (delta < bestDelta) {
        bestDelta = delta;
        best = [cw, ch];
      }
    }
    [w, h] = best;
  }
  return `${w}:${h}`;
}

export function orientationOf(width: number, height: number) {
  if (Math.abs(width - height) / Math.max(width, height) < 0.02) return "square" as const;
  return width > height ? ("landscape" as const) : ("portrait" as const);
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new ImagePipelineError("Could not read that file."));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new ImagePipelineError("That file is not a readable image."));
    image.src = src;
  });
}

/**
 * Decodes, downscales and re-encodes an image entirely in the browser.
 * Re-encoding through a canvas drops all EXIF metadata, including GPS.
 */
export async function prepareImage(file: File): Promise<PreparedImage> {
  const accepted = IMAGE_RULES.acceptedMimeTypes as readonly string[];
  if (!accepted.includes(file.type)) {
    throw new ImagePipelineError("Use a JPG, PNG or WebP image.");
  }
  if (file.size > FREE_LIMITS.maximumFileBytes) {
    const mb = Math.round(FREE_LIMITS.maximumFileBytes / (1024 * 1024));
    throw new ImagePipelineError(`That image is larger than ${mb} MB.`);
  }

  const sourceUrl = await readAsDataUrl(file);
  const image = await loadImage(sourceUrl);

  const naturalWidth = image.naturalWidth;
  const naturalHeight = image.naturalHeight;
  if (Math.min(naturalWidth, naturalHeight) < IMAGE_RULES.minDimension) {
    throw new ImagePipelineError(
      `Image must be at least ${IMAGE_RULES.minDimension}px on the shortest side.`,
    );
  }

  const longest = Math.max(naturalWidth, naturalHeight);
  const scale = longest > IMAGE_RULES.maxLongestEdge ? IMAGE_RULES.maxLongestEdge / longest : 1;
  const width = Math.round(naturalWidth * scale);
  const height = Math.round(naturalHeight * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new ImagePipelineError("Your browser could not process this image.");
  context.drawImage(image, 0, 0, width, height);

  const dataUrl = canvas.toDataURL("image/webp", IMAGE_RULES.webpQuality);
  const mimeType = dataUrl.startsWith("data:image/webp") ? "image/webp" : "image/png";
  const base64 = dataUrl.slice(dataUrl.indexOf(",") + 1);

  return {
    base64,
    dataUrl,
    mimeType,
    bytes: Math.round((base64.length * 3) / 4),
    width,
    height,
    aspectRatio: describeAspectRatio(width, height),
    orientation: orientationOf(width, height),
  };
}
