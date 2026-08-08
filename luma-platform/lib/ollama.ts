import OpenAI from "openai";

/**
 * Local LLM client for Ollama's OpenAI-compatible endpoint.
 * No external API keys needed — everything runs on this machine.
 */

/** Accept both `http://host:11434` and `http://host:11434/v1` forms. */
function normalizeBaseUrl(url: string): string {
  const trimmed = url.replace(/\/+$/, "");
  return trimmed.endsWith("/v1") ? trimmed : `${trimmed}/v1`;
}

export const OLLAMA_BASE_URL = normalizeBaseUrl(
  process.env.OLLAMA_BASE_URL ?? "http://localhost:11434/v1"
);
export const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? "llama3.2:3b";

let _client: OpenAI | null = null;
function getClient(): OpenAI {
  _client ??= new OpenAI({
    baseURL: OLLAMA_BASE_URL,
    apiKey: "ollama",
    // Local models can take a while to load into memory on first request.
    timeout: 120_000,
  });
  return _client;
}

/** Send a system + user message to the local model and return its text reply. */
export async function completeLLM(
  system: string,
  user: string,
  temperature = 0.7
): Promise<string> {
  const completion = await getClient().chat.completions.create({
    model: OLLAMA_MODEL,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    temperature,
  });
  return completion.choices[0]?.message.content ?? "";
}

/**
 * Extract the first balanced JSON object from model output. Ollama often wraps
 * JSON in prose or markdown fences, so we slice from the first "{" to the last
 * "}" before parsing.
 */
export function extractJson<T>(text: string): T | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1)) as T;
  } catch {
    return null;
  }
}

/** Ask the local model to produce a JSON object; returns null on failure. */
export async function completeJSON<T>(
  system: string,
  user: string,
  temperature = 0.5
): Promise<T | null> {
  const text = await completeLLM(system, user, temperature);
  return extractJson<T>(text);
}
