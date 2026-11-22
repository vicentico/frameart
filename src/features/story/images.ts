import type { UserImage } from "@/domain/types";

export async function readUserImage(file: File): Promise<UserImage | { error: string }> {
  if (!file.type.startsWith("image/")) return { error: "Elige una imagen JPG, PNG o WebP." };
  if (file.size > 12_000_000) return { error: "Esa foto pesa más de 12 MB." };
  const bitmap = await createImageBitmap(file);
  const widthPx = bitmap.width;
  const heightPx = bitmap.height;
  const max = 1400;
  const scale = Math.min(1, max / Math.max(widthPx, heightPx));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(widthPx * scale));
  canvas.height = Math.max(1, Math.round(heightPx * scale));
  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    return { error: "No pudimos leer esa foto." };
  }
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return {
    id: crypto.randomUUID(),
    name: file.name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").slice(0, 60) || "Foto",
    preview: canvas.toDataURL("image/jpeg", 0.82),
    widthPx,
    heightPx,
    createdAt: new Date().toISOString(),
  };
}
