import { FRAMES } from "./pricing";
import { coerceProtection, recommendSize, sizeIssue } from "./sizing";
import type { FrameId, MatCm, ProtectionId, StyleProposal } from "./types";

type Draft = Omit<StyleProposal, "protection"> & { protection?: ProtectionId };

const HEX = /^#[0-9a-fA-F]{6}$/;

export function localProposals(input: {
  title: string;
  widthPx: number;
  heightPx: number;
}): StyleProposal[] {
  const size = recommendSize(input.widthPx, input.heightPx);
  const portrait = input.heightPx >= input.widthPx;
  const simple = proposal({
    id: "claro",
    name: "Claro y simple",
    mood: "Diario",
    rationale: portrait
      ? `${input.title} se lee mejor en vertical. Pino natural, sin margen, para que la foto ocupe la pared.`
      : `${input.title} pide aire a los lados. Un marco de pino, sin passe-partout, deja el horizonte quieto.`,
    frameId: "pino",
    matCm: 0,
    preset: "bueno",
    widthCm: size.w,
    heightCm: size.h,
    palette: ["#C4A574", "#F6F1E8", "#2C2420"],
  });
  const home = proposal({
    id: "casa",
    name: "Casa luminosa",
    mood: "Íntimo",
    rationale:
      "Blanco plano y un passe-partout de 3 cm separan la imagen del muro. Sirve cuando la pared ya tiene luz propia.",
    frameId: "blanco",
    matCm: 3,
    preset: "mejor",
    widthCm: size.w,
    heightCm: size.h,
    palette: ["#F7F3EE", "#E7C7B6", "#6E8B74"],
  });
  const gallerySize = stepUp(size.w, size.h);
  const gallery = proposal({
    id: "galeria",
    name: "Galería",
    mood: "Expuesto",
    rationale:
      "Negro plano, margen amplio y acrílico. La foto queda como pieza, no como recuerdo pegado al marco.",
    frameId: "negro",
    matCm: 5,
    preset: "premium",
    widthCm: gallerySize.w,
    heightCm: gallerySize.h,
    palette: ["#1C1917", "#C4623A", "#F3EBE1"],
  });
  return [simple, home, gallery];
}

export function normalizeProposal(
  raw: unknown,
  input: { title: string; widthPx: number; heightPx: number },
  index: number,
): StyleProposal | null {
  if (!raw || typeof raw !== "object") return null;
  const record = raw as Record<string, unknown>;
  const fallback = recommendSize(input.widthPx, input.heightPx);
  let widthCm = integer(record.widthCm) ?? fallback.w;
  let heightCm = integer(record.heightCm) ?? fallback.h;
  let matCm: MatCm = record.matCm === 0 || record.matCm === 3 || record.matCm === 5 ? record.matCm : 0;
  ({ widthCm, heightCm, matCm } = repairSize(widthCm, heightCm, matCm, fallback));
  if (sizeIssue(widthCm, heightCm, matCm)) return null;

  const frameId: FrameId =
    record.frameId === "pino" || record.frameId === "negro" || record.frameId === "blanco"
      ? record.frameId
      : "pino";
  const requested: ProtectionId =
    record.protection === "vidrio" || record.protection === "acrilico" ? record.protection : "acrilico";
  const protection = coerceProtection(widthCm, heightCm, matCm, requested);
  const preset =
    record.preset === "bueno" || record.preset === "mejor" || record.preset === "premium"
      ? record.preset
      : "mejor";
  const palette = Array.isArray(record.palette)
    ? record.palette.filter((color): color is string => typeof color === "string" && HEX.test(color)).slice(0, 4)
    : [];

  return {
    id: `modelo-${index}`,
    name: text(record.name, `Propuesta ${index + 1}`).slice(0, 48),
    mood: text(record.mood, FRAMES[frameId].name).slice(0, 32),
    rationale: text(record.rationale, "Enmarcado ajustado a la foto y al formato que podemos fabricar.").slice(0, 280),
    frameId,
    protection,
    matCm,
    widthCm,
    heightCm,
    preset,
    palette: palette.length > 0 ? palette : ["#C4A574", "#F3EBE1", "#2C2420"],
  };
}

function proposal(input: Draft): StyleProposal {
  const protection = coerceProtection(
    input.widthCm,
    input.heightCm,
    input.matCm,
    input.protection ?? "vidrio",
  );
  let matCm = input.matCm;
  while (matCm > 0 && sizeIssue(input.widthCm, input.heightCm, matCm)) {
    matCm = matCm === 5 ? 3 : 0;
  }
  return { ...input, protection, matCm };
}

function repairSize(
  widthCm: number,
  heightCm: number,
  matCm: MatCm,
  fallback: { w: number; h: number },
): { widthCm: number; heightCm: number; matCm: MatCm } {
  let mat: MatCm = matCm;
  while (mat > 0 && sizeIssue(widthCm, heightCm, mat)) {
    mat = mat === 5 ? 3 : 0;
  }
  if (!sizeIssue(widthCm, heightCm, mat)) return { widthCm, heightCm, matCm: mat };
  return { widthCm: fallback.w, heightCm: fallback.h, matCm: 0 };
}

function stepUp(widthCm: number, heightCm: number): { w: number; h: number } {
  const next = STANDARD_UP.find((size) => size.w * size.h > widthCm * heightCm);
  if (!next) return { w: widthCm, h: heightCm };
  const portrait = heightCm >= widthCm;
  const w = portrait ? Math.min(next.w, next.h) : Math.max(next.w, next.h);
  const h = portrait ? Math.max(next.w, next.h) : Math.min(next.w, next.h);
  if (sizeIssue(w, h, 5)) return { w: widthCm, h: heightCm };
  return { w, h };
}

const STANDARD_UP = [
  { w: 20, h: 30 },
  { w: 30, h: 40 },
  { w: 40, h: 50 },
  { w: 50, h: 70 },
];

function integer(value: unknown): number | null {
  const number = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
  if (!Number.isInteger(number)) return null;
  return number;
}

function text(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}
