/** Redondeo half away from zero al múltiplo de $100. */
export function roundClp(value: number): number {
  return Math.round(value / 100) * 100;
}

export function formatClp(value: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);
}
