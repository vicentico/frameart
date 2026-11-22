import { describe, expect, it } from "vitest";
import { formatClp, roundClp } from "./money";
import { quote } from "./pricing";
import { planDelivery, productionDays } from "./promise";
import { allowsGlass, qualityOf, recommendSize, sizeIssue } from "./sizing";
import { localProposals, normalizeProposal } from "./styles";

describe("tarifa 2026.11.pilot", () => {
  it("cotiza 30×40 pino y vidrio en $29.400 y las líneas cierran", () => {
    const result = quote({
      widthCm: 30,
      heightCm: 40,
      matCm: 0,
      frameId: "pino",
      protection: "vidrio",
      quantity: 1,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.quote.merchandiseTotal).toBe(29400);
    expect(result.quote.total).toBe(29400);
    expect(result.quote.ruleset).toBe("2026.11.pilot");
    const sum = result.quote.lines.reduce((total, line) => total + line.amount, 0);
    expect(sum).toBe(29400);
    expect(result.quote.lines.some((line) => line.id === "redondeo" && line.amount === 80)).toBe(true);
  });

  it("rechaza vidrio cuando el lado largo supera 40 cm", () => {
    const blocked = quote({
      widthCm: 50,
      heightCm: 70,
      matCm: 0,
      frameId: "negro",
      protection: "vidrio",
      quantity: 1,
    });
    expect(blocked.ok).toBe(false);
    const allowed = quote({
      widthCm: 50,
      heightCm: 70,
      matCm: 0,
      frameId: "negro",
      protection: "acrilico",
      quantity: 1,
    });
    expect(allowed.ok).toBe(true);
  });

  it("mantiene el total igual a la suma en medidas válidas", () => {
    for (let width = 10; width <= 60; width += 7) {
      for (let height = 15; height <= 80; height += 9) {
        const mat = width < 40 ? 3 : 0;
        const matCm = mat === 3 ? 3 : 0;
        if (sizeIssue(width, height, matCm)) continue;
        const protection = allowsGlass(width + matCm * 2, height + matCm * 2) ? "vidrio" : "acrilico";
        const result = quote({
          widthCm: width,
          heightCm: height,
          matCm,
          frameId: "blanco",
          protection,
          quantity: 2,
        });
        expect(result.ok).toBe(true);
        if (!result.ok) continue;
        const sum = result.quote.lines.reduce((total, line) => total + line.amount, 0);
        expect(sum).toBe(result.quote.total);
        expect(result.quote.total % 100).toBe(0);
      }
    }
  });
});

describe("medidas", () => {
  it("bloquea un passe-partout que se sale del furgón", () => {
    expect(sizeIssue(60, 80, 3)).toMatch(/60×80/);
    expect(sizeIssue(50, 70, 5)).toBeNull();
  });

  it("recomienda un estándar cuando la proporción calza", () => {
    expect(recommendSize(3000, 4000)).toEqual({ w: 30, h: 40, standard: true });
    expect(recommendSize(4000, 3000)).toEqual({ w: 40, h: 30, standard: true });
  });

  it("advierte resolución baja", () => {
    const quality = qualityOf({ widthPx: 800, heightPx: 600 }, 50, 70);
    expect(quality.level).toBe("baja");
  });
});

describe("promesa", () => {
  it("elige un martes o viernes dentro de siete días", () => {
    const now = new Date(2026, 10, 22, 15, 0, 0);
    const plan = planDelivery(now, productionDays(30, 40, true));
    expect([2, 5]).toContain(plan.date.getDay());
    const limit = new Date(2026, 10, 29);
    expect(plan.date.getTime()).toBeLessThanOrEqual(limit.getTime());
    expect(plan.date.getTime()).toBeGreaterThanOrEqual(new Date(2026, 10, 24).getTime());
    expect(plan.window).toBe("10:30–14:00");
  });
});

describe("estilos", () => {
  it("arma tres propuestas fabricables", () => {
    const proposals = localProposals({ title: "Valle", widthPx: 800, heightPx: 1000 });
    expect(proposals).toHaveLength(3);
    for (const proposal of proposals) {
      expect(sizeIssue(proposal.widthCm, proposal.heightCm, proposal.matCm)).toBeNull();
      const priced = quote({
        widthCm: proposal.widthCm,
        heightCm: proposal.heightCm,
        matCm: proposal.matCm,
        frameId: proposal.frameId,
        protection: proposal.protection,
        quantity: 1,
      });
      expect(priced.ok).toBe(true);
    }
  });

  it("corrige vidrio ilegal que venga del modelo", () => {
    const proposal = normalizeProposal(
      {
        name: "Enorme",
        mood: "Alto",
        rationale: "Más presencia.",
        frameId: "negro",
        protection: "vidrio",
        matCm: 5,
        widthCm: 50,
        heightCm: 70,
        preset: "premium",
        palette: ["#112233", "no"],
      },
      { title: "Foto", widthPx: 800, heightPx: 1000 },
      0,
    );
    expect(proposal?.protection).toBe("acrilico");
    expect(proposal?.palette).toEqual(["#112233"]);
  });
});

describe("dinero", () => {
  it("redondea a centenas", () => {
    expect(roundClp(29422.4)).toBe(29400);
    expect(formatClp(29400)).toContain("29.400");
  });
});
