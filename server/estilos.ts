import { localProposals, normalizeProposal } from "../src/domain/styles";
import type { StyleAdvice, StyleProviderId } from "../src/domain/types";

export type StyleRequest = {
  provider?: StyleProviderId;
  title?: string;
  brief?: string;
  widthPx?: number;
  heightPx?: number;
  imageDataUrl?: string;
};

type Env = Record<string, string | undefined>;

const PROVIDERS: StyleProviderId[] = ["gemini", "claude", "grok"];

export function providerStatus(env: Env) {
  return {
    gemini: Boolean(env.GEMINI_API_KEY),
    claude: Boolean(env.ANTHROPIC_API_KEY),
    grok: Boolean(env.XAI_API_KEY),
  };
}

export async function advise(
  body: StyleRequest,
  env: Env,
  fetchImpl: typeof fetch = fetch,
): Promise<StyleAdvice> {
  const requested = PROVIDERS.includes(body.provider as StyleProviderId)
    ? (body.provider as StyleProviderId)
    : "gemini";
  const context = {
    title: clean(body.title, "Tu foto"),
    brief: clean(body.brief, "Foto del cliente para enmarcar."),
    widthPx: positive(body.widthPx, 800),
    heightPx: positive(body.heightPx, 1000),
  };
  const local = localProposals(context);
  const key = keyFor(requested, env);
  if (!key) {
    return {
      source: "estudio",
      requested,
      notice: `Sin clave de ${label(requested)} en el servidor. El estudio local arma la propuesta y la foto no sale de este computador.`,
      proposals: local,
    };
  }

  try {
    const text = await callProvider(requested, key, env, context, body.imageDataUrl, fetchImpl);
    const parsed = parseJson(text);
    const proposals = parsed
      .map((item, index) => normalizeProposal(item, context, index))
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .slice(0, 3);
    if (proposals.length === 0) throw new Error("vacio");
    return {
      source: requested,
      requested,
      notice: `Propuesta de ${label(requested)}, ajustada a las medidas y materiales que sí fabricamos.`,
      proposals,
    };
  } catch {
    return {
      source: "estudio",
      requested,
      notice: `${label(requested)} no entregó una propuesta usable. Mostramos el estudio local.`,
      proposals: local,
    };
  }
}

async function callProvider(
  provider: StyleProviderId,
  key: string,
  env: Env,
  context: { title: string; brief: string; widthPx: number; heightPx: number },
  imageDataUrl: string | undefined,
  fetchImpl: typeof fetch,
): Promise<string> {
  const prompt = buildPrompt(context);
  const image = parseDataUrl(imageDataUrl);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    if (provider === "gemini") {
      return await gemini(env.GEMINI_MODEL || "gemini-2.5-flash", key, prompt, image, fetchImpl, controller.signal);
    }
    if (provider === "claude") {
      return await claude(env.ANTHROPIC_MODEL || "claude-sonnet-4-5", key, prompt, image, fetchImpl, controller.signal);
    }
    return await grok(env.XAI_MODEL || "grok-4", key, prompt, image, fetchImpl, controller.signal);
  } finally {
    clearTimeout(timer);
  }
}

function buildPrompt(context: { title: string; brief: string; widthPx: number; heightPx: number }): string {
  return [
    "Eres estilista de enmarcado de Frameart, taller en Talca y Maule, Chile.",
    "Responde solo JSON válido:",
    '{"proposals":[{"name":"","mood":"","rationale":"","frameId":"pino|negro|blanco","protection":"vidrio|acrilico","matCm":0,"widthCm":30,"heightCm":40,"preset":"bueno|mejor|premium","palette":["#112233","#AABBCC","#DDEEFF"]}]}',
    "Entrega 3 propuestas distintas.",
    "La imagen impresa usa centímetros enteros. Ningún lado menor a 10. El lado largo de la imagen, al menos 15.",
    "El cuadro terminado (imagen + passe-partout) no supera 60 cm en el lado corto ni 80 cm en el lado largo.",
    "Vidrio solo si el lado largo terminado mide 40 cm o menos. Si no, acrílico.",
    "matCm solo puede ser 0, 3 o 5.",
    "rationale en español, máximo dos frases, concreto. No prometas precios, fechas ni stock.",
    `Título: ${context.title}`,
    `Notas: ${context.brief}`,
    `Píxeles de referencia: ${context.widthPx}×${context.heightPx}`,
  ].join("\n");
}

async function gemini(
  model: string,
  key: string,
  prompt: string,
  image: { mime: string; data: string } | null,
  fetchImpl: typeof fetch,
  signal: AbortSignal,
): Promise<string> {
  const parts: Record<string, unknown>[] = [{ text: prompt }];
  if (image) parts.push({ inline_data: { mime_type: image.mime, data: image.data } });
  const response = await fetchImpl(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
    {
      method: "POST",
      signal,
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: { temperature: 0.4, responseMimeType: "application/json" },
      }),
    },
  );
  if (!response.ok) throw new Error(`gemini ${response.status}`);
  const payload = (await response.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  return payload.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("\n") ?? "";
}

async function claude(
  model: string,
  key: string,
  prompt: string,
  image: { mime: string; data: string } | null,
  fetchImpl: typeof fetch,
  signal: AbortSignal,
): Promise<string> {
  const content: Record<string, unknown>[] = [];
  if (image) {
    content.push({
      type: "image",
      source: { type: "base64", media_type: image.mime, data: image.data },
    });
  }
  content.push({ type: "text", text: prompt });
  const response = await fetchImpl("https://api.anthropic.com/v1/messages", {
    method: "POST",
    signal,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({ model, max_tokens: 900, temperature: 0.4, messages: [{ role: "user", content }] }),
  });
  if (!response.ok) throw new Error(`claude ${response.status}`);
  const payload = (await response.json()) as { content?: { text?: string }[] };
  return payload.content?.map((part) => part.text ?? "").join("\n") ?? "";
}

async function grok(
  model: string,
  key: string,
  prompt: string,
  image: { mime: string; data: string } | null,
  fetchImpl: typeof fetch,
  signal: AbortSignal,
): Promise<string> {
  const content: Record<string, unknown>[] = [{ type: "text", text: prompt }];
  if (image) {
    content.push({ type: "image_url", image_url: { url: `data:${image.mime};base64,${image.data}` } });
  }
  const response = await fetchImpl("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    signal,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      messages: [{ role: "user", content }],
    }),
  });
  if (!response.ok) throw new Error(`grok ${response.status}`);
  const payload = (await response.json()) as {
    choices?: { message?: { content?: string | { text?: string }[] } }[];
  };
  const message = payload.choices?.[0]?.message?.content;
  if (typeof message === "string") return message;
  return message?.map((part) => part.text ?? "").join("\n") ?? "";
}

function parseJson(text: string): unknown[] {
  const trimmed = text.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start < 0 || end < start) return [];
  const payload = JSON.parse(trimmed.slice(start, end + 1)) as { proposals?: unknown[] } | unknown[];
  if (Array.isArray(payload)) return payload;
  return Array.isArray(payload.proposals) ? payload.proposals : [];
}

function parseDataUrl(value: string | undefined): { mime: string; data: string } | null {
  if (!value) return null;
  const match = /^data:(image\/(?:jpeg|png|webp));base64,([a-z0-9+/=\r\n]+)$/i.exec(value.trim());
  if (!match) return null;
  const data = match[2].replace(/\s/g, "");
  if (data.length > 2_200_000) return null;
  return { mime: match[1].toLowerCase(), data };
}

function keyFor(provider: StyleProviderId, env: Env): string | undefined {
  if (provider === "gemini") return env.GEMINI_API_KEY || undefined;
  if (provider === "claude") return env.ANTHROPIC_API_KEY || undefined;
  return env.XAI_API_KEY || undefined;
}

function label(provider: StyleProviderId): string {
  if (provider === "gemini") return "Gemini";
  if (provider === "claude") return "Claude";
  return "Grok";
}

function clean(value: unknown, fallback: string): string {
  if (typeof value !== "string") return fallback;
  const text = value.replace(/\s+/g, " ").trim();
  return text ? text.slice(0, 180) : fallback;
}

function positive(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.round(value) : fallback;
}
