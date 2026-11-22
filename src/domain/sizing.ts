import type { MatCm, ProtectionId } from "./types";

export const STANDARD_SIZES: { w: number; h: number; label: string }[] = [
  { w: 15, h: 20, label: "15×20" },
  { w: 20, h: 30, label: "20×30" },
  { w: 30, h: 40, label: "30×40" },
  { w: 40, h: 50, label: "40×50" },
  { w: 50, h: 70, label: "50×70" },
];

export function outerSize(widthCm: number, heightCm: number, matCm: number) {
  return { outerW: widthCm + matCm * 2, outerH: heightCm + matCm * 2 };
}

export function allowsGlass(outerW: number, outerH: number): boolean {
  return Math.max(outerW, outerH) <= 40;
}

/** El vidrio viaja en formatos chicos. El resto usa acrílico. */
export function sizeIssue(
  widthCm: number,
  heightCm: number,
  matCm: number,
): string | null {
  if (!Number.isInteger(widthCm) || !Number.isInteger(heightCm)) {
    return "Usa centímetros enteros.";
  }
  if (widthCm < 10 || heightCm < 10) {
    return "Ningún lado de la imagen puede medir menos de 10 cm.";
  }
  if (Math.max(widthCm, heightCm) < 15) {
    return "El lado largo de la imagen debe medir al menos 15 cm.";
  }
  const { outerW, outerH } = outerSize(widthCm, heightCm, matCm);
  const short = Math.min(outerW, outerH);
  const long = Math.max(outerW, outerH);
  if (short > 60 || long > 80) {
    return "Con este passe-partout el cuadro supera 60×80 cm, el máximo del furgón.";
  }
  return null;
}

export function protectionChoices(
  widthCm: number,
  heightCm: number,
  matCm: number,
): ProtectionId[] {
  const { outerW, outerH } = outerSize(widthCm, heightCm, matCm);
  return allowsGlass(outerW, outerH) ? ["vidrio", "acrilico"] : ["acrilico"];
}

export function coerceProtection(
  widthCm: number,
  heightCm: number,
  matCm: number,
  requested: ProtectionId,
): ProtectionId {
  return protectionChoices(widthCm, heightCm, matCm).includes(requested)
    ? requested
    : "acrilico";
}

export function isStandard(widthCm: number, heightCm: number): boolean {
  return STANDARD_SIZES.some(
    (size) =>
      (size.w === widthCm && size.h === heightCm) ||
      (size.w === heightCm && size.h === widthCm),
  );
}

export function recommendSize(widthPx: number, heightPx: number): {
  w: number;
  h: number;
  standard: boolean;
} {
  const safeW = Math.max(1, widthPx);
  const safeH = Math.max(1, heightPx);
  const aspect = safeW / safeH;
  let best = STANDARD_SIZES[0];
  let bestDiff = Infinity;
  let swap = false;
  for (const size of STANDARD_SIZES) {
    const direct = Math.abs(size.w / size.h - aspect);
    const flipped = Math.abs(size.h / size.w - aspect);
    const diff = Math.min(direct, flipped);
    const larger = size.w * size.h > best.w * best.h;
    if (diff < bestDiff - 1e-9 || (Math.abs(diff - bestDiff) < 1e-9 && larger)) {
      best = size;
      bestDiff = diff;
      swap = flipped < direct;
    }
  }
  if (bestDiff <= 0.08) {
    return swap
      ? { w: best.h, h: best.w, standard: true }
      : { w: best.w, h: best.h, standard: true };
  }
  return { ...fitLongSide(aspect, 40), standard: false };
}

function fitLongSide(aspect: number, longSide: number): { w: number; h: number } {
  let w = aspect >= 1 ? longSide : Math.round(longSide * aspect);
  let h = aspect >= 1 ? Math.round(longSide / aspect) : longSide;
  w = clamp(w, 10, 80);
  h = clamp(h, 10, 80);
  if (Math.max(w, h) < 15) {
    if (w >= h) w = 15;
    else h = 15;
  }
  if (Math.min(w, h) > 60) {
    const scale = 60 / Math.min(w, h);
    w = Math.max(10, Math.round(w * scale));
    h = Math.max(10, Math.round(h * scale));
  }
  if (Math.max(w, h) > 80) {
    const scale = 80 / Math.max(w, h);
    w = Math.max(10, Math.round(w * scale));
    h = Math.max(10, Math.round(h * scale));
  }
  return { w, h };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function printDpi(pixels: number, cm: number): number {
  if (cm <= 0) return 0;
  return pixels / (cm / 2.54);
}

export function qualityOf(
  image: { widthPx: number; heightPx: number },
  widthCm: number,
  heightCm: number,
): { dpi: number; level: "optima" | "aceptable" | "baja" } {
  const imageLandscape = image.widthPx >= image.heightPx;
  const printLandscape = widthCm >= heightCm;
  const dpi =
    imageLandscape === printLandscape
      ? Math.min(printDpi(image.widthPx, widthCm), printDpi(image.heightPx, heightCm))
      : Math.min(printDpi(image.widthPx, heightCm), printDpi(image.heightPx, widthCm));
  const rounded = Math.round(dpi);
  if (rounded < 100) return { dpi: rounded, level: "baja" };
  if (rounded < 150) return { dpi: rounded, level: "aceptable" };
  return { dpi: rounded, level: "optima" };
}

export function isMat(value: number): value is MatCm {
  return value === 0 || value === 3 || value === 5;
}
