import type { StyleAdvice, StyleProviderId } from "@/domain/types";

export type StyleRequest = {
  provider: StyleProviderId;
  title: string;
  brief: string;
  widthPx: number;
  heightPx: number;
  imageDataUrl?: string;
};

export async function fetchProviderStatus(): Promise<Record<StyleProviderId, boolean>> {
  const response = await fetch("/api/estilos");
  if (!response.ok) throw new Error("estado");
  return response.json() as Promise<Record<StyleProviderId, boolean>>;
}

export async function requestStyles(body: StyleRequest): Promise<StyleAdvice> {
  const response = await fetch("/api/estilos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error("estilos");
  return response.json() as Promise<StyleAdvice>;
}
