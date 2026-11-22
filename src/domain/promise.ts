export type DeliveryPlan = {
  date: Date;
  label: string;
  window: string;
  reserved: number;
  capacity: number;
  waitlist: boolean;
  productionDays: number;
};

const WINDOW = "10:30–14:00";
const CAPACITY = 20;

export function productionDays(widthCm: number, heightCm: number, standard: boolean): number {
  const area = widthCm * heightCm;
  if (!standard || area > 2000) return 3;
  return 2;
}

/** Cupo estable por fecha, para que la promesa no cambie al recargar. */
export function routeLoad(day: Date): { reserved: number; capacity: number } {
  const key = day.getFullYear() * 10000 + (day.getMonth() + 1) * 100 + day.getDate();
  return { capacity: CAPACITY, reserved: 8 + (key % 9) };
}

export function planDelivery(now: Date, prodDays: number): DeliveryPlan {
  const today = startOfDay(now);
  const ready = addDays(today, prodDays);
  const candidates = routeDays(today, ready);
  const open = candidates.find((day) => {
    const load = routeLoad(day);
    return load.reserved < load.capacity;
  });
  const chosen = open ?? candidates[candidates.length - 1] ?? addDays(today, prodDays);
  const load = routeLoad(chosen);
  return {
    date: chosen,
    label: formatDay(chosen),
    window: WINDOW,
    reserved: load.reserved,
    capacity: load.capacity,
    waitlist: !open || load.reserved >= load.capacity,
    productionDays: prodDays,
  };
}

function routeDays(today: Date, ready: Date): Date[] {
  const days: Date[] = [];
  for (let offset = 0; offset <= 7; offset += 1) {
    const day = addDays(today, offset);
    const dow = day.getDay();
    if (day < ready) continue;
    if (dow === 2 || dow === 5) days.push(day);
  }
  return days;
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function formatDay(date: Date): string {
  const label = new Intl.DateTimeFormat("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
  return label.charAt(0).toUpperCase() + label.slice(1);
}
