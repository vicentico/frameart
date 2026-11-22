export type FrameId = "pino" | "negro" | "blanco";
export type ProtectionId = "vidrio" | "acrilico";
export type MatCm = 0 | 3 | 5;
export type PresetId = "bueno" | "mejor" | "premium" | "a-medida";
export type DesignOrigin = "catalogo" | "historia";
export type StyleProviderId = "gemini" | "claude" | "grok";
export type ZoneId =
  | "centro"
  | "las-rastras"
  | "la-florida"
  | "norte"
  | "maule"
  | "fuera";

export type QuoteLine = {
  id: string;
  label: string;
  amount: number;
};

export type QuoteSnapshot = {
  ruleset: string;
  currency: "CLP";
  quantity: number;
  inputs: {
    widthCm: number;
    heightCm: number;
    matCm: MatCm;
    outerWidthCm: number;
    outerHeightCm: number;
    frameId: FrameId;
    protection: ProtectionId;
  };
  lines: QuoteLine[];
  merchandiseTotal: number;
  shipping: number;
  total: number;
};

export type QuoteInput = {
  widthCm: number;
  heightCm: number;
  matCm: MatCm;
  frameId: FrameId;
  protection: ProtectionId;
  quantity: number;
};

export type UserImage = {
  id: string;
  name: string;
  preview: string;
  widthPx: number;
  heightPx: number;
  createdAt: string;
};

export type CartLine = {
  id: string;
  origin: DesignOrigin;
  pieceId: string;
  title: string;
  preview?: string;
  widthCm: number;
  heightCm: number;
  matCm: MatCm;
  frameId: FrameId;
  protection: ProtectionId;
  preset: PresetId;
  quantity: number;
  qualityOverride: boolean;
  quote: QuoteSnapshot;
};

export type DemoOrder = {
  id: string;
  createdAt: string;
  lines: CartLine[];
  contact: { name: string; email: string; phone: string; notes: string };
  delivery: {
    mode: "retiro" | "domicilio";
    zone: ZoneId | "";
    address: string;
    promiseLabel: string;
    window: string;
  };
  payMethod: "mercadopago" | "webpay";
  total: number;
  shipping: number;
  ruleset: string;
  status: "pago-simulado";
};

export type StyleProposal = {
  id: string;
  name: string;
  mood: string;
  rationale: string;
  frameId: FrameId;
  protection: ProtectionId;
  matCm: MatCm;
  widthCm: number;
  heightCm: number;
  preset: Exclude<PresetId, "a-medida">;
  palette: string[];
};

export type StyleAdvice = {
  source: StyleProviderId | "estudio";
  requested: StyleProviderId;
  notice: string;
  proposals: StyleProposal[];
};
