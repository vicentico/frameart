import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { quote } from "@/domain/pricing";
import type { CartLine, DemoOrder, UserImage } from "@/domain/types";

const KEY = "frameart.studio.v1";

type Persisted = {
  cart: CartLine[];
  uploads: UserImage[];
  lastOrder: DemoOrder | null;
};

type Store = Persisted & {
  addLine: (line: CartLine) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeLine: (id: string) => void;
  addUpload: (image: UserImage) => string | null;
  removeUpload: (id: string) => void;
  placeOrder: (order: DemoOrder) => void;
};

const EMPTY: Persisted = { cart: [], uploads: [], lastOrder: null };

import { createContext, useContext } from "react";

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Persisted>(() => load());

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* La cuota del navegador puede llenarse con fotos grandes. */
    }
  }, [state]);

  const store = useMemo<Store>(() => {
    return {
      ...state,
      addLine: (line) => {
        setState((current) => {
          const signature = lineKey(line);
          const existing = current.cart.find((item) => lineKey(item) === signature);
          if (!existing) return { ...current, cart: [...current.cart, line] };
          const quantity = Math.min(6, existing.quantity + line.quantity);
          return {
            ...current,
            cart: current.cart.map((item) => (item.id === existing.id ? requoteLine(item, quantity) : item)),
          };
        });
      },
      updateQuantity: (id, quantity) => {
        setState((current) => ({
          ...current,
          cart: current.cart.map((item) => (item.id === id ? requoteLine(item, quantity) : item)),
        }));
      },
      removeLine: (id) => {
        setState((current) => ({ ...current, cart: current.cart.filter((item) => item.id !== id) }));
      },
      addUpload: (image) => {
        if (state.uploads.length >= 12) return "Puedes guardar hasta 12 fotos en este navegador.";
        setState((current) => ({ ...current, uploads: [image, ...current.uploads] }));
        return null;
      },
      removeUpload: (id) => {
        setState((current) => ({
          ...current,
          uploads: current.uploads.filter((image) => image.id !== id),
        }));
      },
      placeOrder: (order) => {
        setState((current) => ({ ...current, cart: [], lastOrder: order }));
      },
    };
  }, [state]);

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const store = useContext(StoreContext);
  if (!store) throw new Error("useStore debe usarse dentro de StoreProvider");
  return store;
}

function requoteLine(line: CartLine, quantity: number): CartLine {
  const result = quote({
    widthCm: line.widthCm,
    heightCm: line.heightCm,
    matCm: line.matCm,
    frameId: line.frameId,
    protection: line.protection,
    quantity,
  });
  if (!result.ok) return line;
  return { ...line, quantity, quote: result.quote };
}

function lineKey(line: CartLine): string {
  return [
    line.origin,
    line.pieceId,
    line.widthCm,
    line.heightCm,
    line.matCm,
    line.frameId,
    line.protection,
    line.quote.ruleset,
  ].join(":");
}

function load(): Persisted {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<Persisted>;
    return {
      cart: Array.isArray(parsed.cart) ? parsed.cart.filter(isCartLine) : [],
      uploads: Array.isArray(parsed.uploads) ? parsed.uploads.filter(isUpload) : [],
      lastOrder: parsed.lastOrder && typeof parsed.lastOrder === "object" ? parsed.lastOrder : null,
    };
  } catch {
    return EMPTY;
  }
}

function isCartLine(value: unknown): value is CartLine {
  if (!value || typeof value !== "object") return false;
  const line = value as CartLine;
  return Boolean(line.id && line.quote && line.title && line.widthCm && line.heightCm);
}

function isUpload(value: unknown): value is UserImage {
  if (!value || typeof value !== "object") return false;
  const image = value as UserImage;
  return Boolean(image.id && image.preview && image.widthPx && image.heightPx);
}
