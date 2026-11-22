import { roundClp } from "./money";
import { allowsGlass, outerSize, sizeIssue } from "./sizing";
import type { FrameId, ProtectionId, QuoteInput, QuoteSnapshot } from "./types";

/**
 * Tarifa 2026.11.pilot. Única autoridad de precio del prototipo.
 * Costo = impresión (área de la imagen) + marco (perímetro exterior)
 *       + protección (área exterior) + passe-partout + taller.
 * Venta = redondeo a $100 de costo × 1.42, IVA incluido.
 * Cada línea se redondea a $100. La diferencia queda en "Redondeo".
 * El despacho se suma después, sin otro margen.
 */
export const RULESET = "2026.11.pilot";
export const MARKUP = 1.42;

export const FRAMES: Record<
  FrameId,
  { id: FrameId; name: string; note: string; perCm: number }
> = {
  pino: {
    id: "pino",
    name: "Pino natural",
    note: "Madera clara, veta suave.",
    perCm: 48,
  },
  negro: {
    id: "negro",
    name: "Negro plano",
    note: "Perfil fino, contraste gráfico.",
    perCm: 54,
  },
  blanco: {
    id: "blanco",
    name: "Blanco plano",
    note: "Luz de casa, casi sin borde.",
    perCm: 54,
  },
};

export const PROTECTIONS: Record<
  ProtectionId,
  { id: ProtectionId; name: string; note: string; perCm2: number }
> = {
  vidrio: {
    id: "vidrio",
    name: "Vidrio 2 mm",
    note: "Para formatos chicos, hasta 40 cm de lado largo.",
    perCm2: 4,
  },
  acrilico: {
    id: "acrilico",
    name: "Acrílico",
    note: "Más liviano. Es la protección de los formatos grandes.",
    perCm2: 5.5,
  },
};

const PRINT_PER_CM2 = 5;
const WORKSHOP = 3200;
const MAT_COST: Record<0 | 3 | 5, number> = { 0: 0, 3: 1800, 5: 2800 };

export type QuoteResult =
  | { ok: true; quote: QuoteSnapshot }
  | { ok: false; reason: string };

export function quote(input: QuoteInput): QuoteResult {
  const issue = sizeIssue(input.widthCm, input.heightCm, input.matCm);
  if (issue) return { ok: false, reason: issue };
  if (!Number.isInteger(input.quantity) || input.quantity < 1 || input.quantity > 6) {
    return { ok: false, reason: "La cantidad va de 1 a 6 cuadros por línea." };
  }
  const { outerW, outerH } = outerSize(input.widthCm, input.heightCm, input.matCm);
  if (input.protection === "vidrio" && !allowsGlass(outerW, outerH)) {
    return {
      ok: false,
      reason: "Este formato no usa vidrio. El acrílico viaja mejor.",
    };
  }

  const qty = input.quantity;
  const printCost = Math.round(input.widthCm * input.heightCm * PRINT_PER_CM2) * qty;
  const perimeter = 2 * (outerW + outerH);
  const frame = FRAMES[input.frameId];
  const frameCost = perimeter * frame.perCm * qty;
  const cover = PROTECTIONS[input.protection];
  const coverCost = Math.round(outerW * outerH * cover.perCm2) * qty;
  const matCost = MAT_COST[input.matCm] * qty;
  const workshopCost = WORKSHOP * qty;

  const parts: { id: string; label: string; cost: number }[] = [
    {
      id: "impresion",
      label: `Impresión · ${input.widthCm}×${input.heightCm} cm`,
      cost: printCost,
    },
    {
      id: "marco",
      label: `Marco ${frame.name.toLowerCase()} · ${perimeter} cm`,
      cost: frameCost,
    },
    {
      id: "proteccion",
      label: `${cover.name} · ${outerW}×${outerH} cm`,
      cost: coverCost,
    },
  ];
  if (matCost > 0) {
    parts.push({
      id: "paspartu",
      label: `Passe-partout ${input.matCm} cm`,
      cost: matCost,
    });
  }
  parts.push({
    id: "taller",
    label: "Taller, herraje y embalaje",
    cost: workshopCost,
  });

  const costTotal = parts.reduce((sum, part) => sum + part.cost, 0);
  const merchandiseTotal = roundClp(costTotal * MARKUP);
  const lines = parts.map((part) => ({
    id: part.id,
    label: part.label,
    amount: roundClp(part.cost * MARKUP),
  }));
  const drift = merchandiseTotal - lines.reduce((sum, line) => sum + line.amount, 0);
  if (drift !== 0) {
    lines.push({ id: "redondeo", label: "Redondeo a $100", amount: drift });
  }

  return {
    ok: true,
    quote: {
      ruleset: RULESET,
      currency: "CLP",
      quantity: qty,
      inputs: {
        widthCm: input.widthCm,
        heightCm: input.heightCm,
        matCm: input.matCm,
        outerWidthCm: outerW,
        outerHeightCm: outerH,
        frameId: input.frameId,
        protection: input.protection,
      },
      lines,
      merchandiseTotal,
      shipping: 0,
      total: merchandiseTotal,
    },
  };
}

export function addShipping(
  snapshot: QuoteSnapshot,
  shipping: number,
  label: string,
): QuoteSnapshot {
  return {
    ...snapshot,
    shipping,
    total: snapshot.merchandiseTotal + shipping,
    lines: [...snapshot.lines, { id: "entrega", label, amount: shipping }],
  };
}

export const ZONES: {
  id: import("./types").ZoneId;
  name: string;
  group: string;
  shipping: number | null;
}[] = [
  { id: "centro", name: "Talca Centro", group: "Talca", shipping: 3500 },
  { id: "las-rastras", name: "Las Rastras", group: "Talca", shipping: 3500 },
  { id: "la-florida", name: "La Florida", group: "Talca", shipping: 3500 },
  { id: "norte", name: "Sector Norte", group: "Talca", shipping: 3500 },
  { id: "maule", name: "Maule urbano", group: "Maule", shipping: 4900 },
  { id: "fuera", name: "Otra comuna", group: "Sin cobertura", shipping: null },
];

export function zoneById(id: string) {
  return ZONES.find((zone) => zone.id === id) ?? null;
}
