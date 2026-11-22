import { describe, expect, it, vi } from "vitest";
import { advise } from "./estilos";

describe("adaptador de estilos", () => {
  it("no llama a la red si no hay clave", async () => {
    const fetchImpl = vi.fn<typeof fetch>();
    const advice = await advise(
      { provider: "grok", title: "Patio", widthPx: 1200, heightPx: 900 },
      {},
      fetchImpl,
    );
    expect(fetchImpl).not.toHaveBeenCalled();
    expect(advice.source).toBe("estudio");
    expect(advice.proposals).toHaveLength(3);
    expect(advice.notice).toMatch(/no sale de este computador/);
  });

  it("lee el JSON de Gemini y corrige combinaciones ilegales", async () => {
    const fetchImpl = vi.fn<typeof fetch>(async () => {
      return new Response(
        JSON.stringify({
          candidates: [
            {
              content: {
                parts: [
                  {
                    text: JSON.stringify({
                      proposals: [
                        {
                          name: "Muro oscuro",
                          mood: "Noche",
                          rationale: "Negro para una foto ya contrastada.",
                          frameId: "negro",
                          protection: "vidrio",
                          matCm: 0,
                          widthCm: 50,
                          heightCm: 70,
                          preset: "premium",
                          palette: ["#111111", "#E7C7B6"],
                        },
                      ],
                    }),
                  },
                ],
              },
            },
          ],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    });
    const advice = await advise(
      { provider: "gemini", title: "Río", widthPx: 1000, heightPx: 800 },
      { GEMINI_API_KEY: "test-key" },
      fetchImpl,
    );
    expect(advice.source).toBe("gemini");
    expect(advice.proposals[0]?.protection).toBe("acrilico");
    expect(advice.proposals[0]?.name).toBe("Muro oscuro");
  });
});
