export const GEMINI_MODEL = "gemini-flash-latest";

const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export class GeminiError extends Error {
  constructor(
    message: string,
    readonly code: string,
  ) {
    super(message);
  }
}

type Part =
  | { text: string }
  | { inlineData: { mimeType: string; data: string } };

export async function callGeminiJson(input: {
  system: string;
  parts: Part[];
}): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new GeminiError("Analysis is not configured.", "missing_key");

  const response = await fetch(`${ENDPOINT}?key=${apiKey}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: input.system }] },
      contents: [{ role: "user", parts: input.parts }],
      generationConfig: {
        temperature: 0.35,
        maxOutputTokens: 16384,
        responseMimeType: "application/json",
      },
      safetySettings: [
        "HARM_CATEGORY_HARASSMENT",
        "HARM_CATEGORY_HATE_SPEECH",
        "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        "HARM_CATEGORY_DANGEROUS_CONTENT",
      ].map((category) => ({ category, threshold: "BLOCK_ONLY_HIGH" })),
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error(`[gemini] ${response.status} ${body}`);
    if (response.status === 429) {
      throw new GeminiError(
        "The shared free analysis capacity is busy right now. Please try again shortly.",
        "rate_limited",
      );
    }
    throw new GeminiError("The analysis service rejected this request.", "upstream_error");
  }

  const payload = (await response.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
      finishReason?: string;
    }>;
    promptFeedback?: { blockReason?: string };
  };

  if (payload.promptFeedback?.blockReason) {
    throw new GeminiError("This image was blocked by the safety filter.", "safety_blocked");
  }

  const candidate = payload.candidates?.[0];
  const text = candidate?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
  if (!text.trim()) {
    throw new GeminiError("The analysis returned no content.", "empty_response");
  }
  return text;
}

export function extractJsonObject(raw: string): unknown {
  const trimmed = raw.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start === -1 || end <= start) {
      throw new GeminiError("The analysis returned malformed data.", "invalid_json");
    }
    return JSON.parse(trimmed.slice(start, end + 1));
  }
}
