type Shape = {
  viewBox: string;
  label: string;
  nodes: string;
};

const PRINTS: Record<string, Shape> = {
  "valle-maule": {
    viewBox: "0 0 80 100",
    label: "Colinas del Maule y un sol bajo",
    nodes: `
      <rect width="80" height="100" fill="#F4E2CF"/>
      <circle cx="58" cy="28" r="10" fill="#E39A62"/>
      <path d="M0 62 C18 50 28 70 46 58 C60 48 70 66 80 60 V100 H0Z" fill="#C4785A"/>
      <path d="M0 74 C20 64 34 86 58 72 C68 66 74 78 80 76 V100 H0Z" fill="#8E9A78"/>
      <path d="M0 86 C24 78 40 96 80 84 V100 H0Z" fill="#6E8B74"/>
    `,
  },
  "atardecer-talca": {
    viewBox: "0 0 80 100",
    label: "Silueta de Talca al atardecer",
    nodes: `
      <rect width="80" height="42" fill="#F3B89A"/>
      <rect y="42" width="80" height="28" fill="#E7C7B6"/>
      <rect y="70" width="80" height="30" fill="#C96B58"/>
      <path d="M8 78 H18 V62 H24 V70 H30 V54 H38 V78 H48 V66 H56 V48 H64 V78 H74 V72 H80 V100 H0 V78Z" fill="#3E2A28"/>
      <circle cx="22" cy="30" r="7" fill="#F7E1C8"/>
    `,
  },
  duraznos: {
    viewBox: "0 0 80 80",
    label: "Dos duraznos sobre fondo blush",
    nodes: `
      <rect width="80" height="80" fill="#F6E4D4"/>
      <circle cx="34" cy="42" r="16" fill="#E39A62"/>
      <circle cx="50" cy="38" r="13" fill="#C4623A"/>
      <path d="M40 24 C44 18 52 20 50 28" fill="none" stroke="#6E8B74" stroke-width="2"/>
      <ellipse cx="40" cy="62" rx="22" ry="4" fill="#E7C7B6"/>
    `,
  },
  boldo: {
    viewBox: "0 0 80 100",
    label: "Rama de boldo en trazo fino",
    nodes: `
      <rect width="80" height="100" fill="#F7F1E7"/>
      <path d="M40 88 C38 60 42 40 36 18" fill="none" stroke="#6E5A45" stroke-width="1.4"/>
      <ellipse cx="28" cy="36" rx="8" ry="4" transform="rotate(-30 28 36)" fill="none" stroke="#6E8B74" stroke-width="1.3"/>
      <ellipse cx="48" cy="32" rx="9" ry="4" transform="rotate(28 48 32)" fill="none" stroke="#6E8B74" stroke-width="1.3"/>
      <ellipse cx="30" cy="52" rx="8" ry="3.5" transform="rotate(-20 30 52)" fill="none" stroke="#8E9A78" stroke-width="1.3"/>
      <ellipse cx="50" cy="58" rx="8" ry="3.5" transform="rotate(24 50 58)" fill="none" stroke="#8E9A78" stroke-width="1.3"/>
      <ellipse cx="34" cy="70" rx="7" ry="3" transform="rotate(-16 34 70)" fill="none" stroke="#C4A574" stroke-width="1.2"/>
    `,
  },
  "casa-patio": {
    viewBox: "0 0 100 80",
    label: "Casa de un piso con patio",
    nodes: `
      <rect width="100" height="80" fill="#F3E6D4"/>
      <rect x="18" y="34" width="40" height="28" fill="#F7F3EE" stroke="#3E2A28" stroke-width="1.4"/>
      <path d="M16 36 L38 18 L60 36" fill="#C4785A" stroke="#3E2A28" stroke-width="1.2"/>
      <rect x="34" y="48" width="8" height="14" fill="#6E5A45"/>
      <path d="M68 62 A12 12 0 0 1 92 62 V66 H68Z" fill="none" stroke="#6E8B74" stroke-width="1.6"/>
      <rect x="12" y="66" width="76" height="3" fill="#E7C7B6"/>
    `,
  },
  "rio-claro": {
    viewBox: "0 0 100 80",
    label: "Bandas del Río Claro",
    nodes: `
      <rect width="100" height="80" fill="#E7EFE6"/>
      <path d="M0 28 H100 V38 H0Z" fill="#F7F3EE"/>
      <path d="M0 38 C20 34 30 46 52 40 C70 35 82 44 100 40 V52 H0Z" fill="#8FB3B0"/>
      <path d="M0 50 C24 58 40 46 68 54 C82 58 90 50 100 52 V66 H0Z" fill="#6E8B74"/>
      <path d="M0 64 H100 V80 H0Z" fill="#D7C4A4"/>
    `,
  },
  "geometria-cozy": {
    viewBox: "0 0 80 80",
    label: "Bloques de terracota, salvia y crema",
    nodes: `
      <rect width="80" height="80" fill="#F6F1E8"/>
      <rect x="8" y="10" width="28" height="36" fill="#C4623A"/>
      <rect x="40" y="10" width="32" height="18" fill="#E7C7B6"/>
      <rect x="40" y="32" width="18" height="28" fill="#6E8B74"/>
      <rect x="8" y="52" width="28" height="18" fill="#C4A574"/>
      <circle cx="62" cy="58" r="10" fill="#F7F3EE" stroke="#3E2A28" stroke-width="1.2"/>
    `,
  },
  mercado: {
    viewBox: "0 0 80 100",
    label: "Toldos de la feria de la mañana",
    nodes: `
      <rect width="80" height="100" fill="#F8EFE4"/>
      <path d="M8 28 H28 L24 44 H12Z" fill="#C4623A"/>
      <path d="M30 28 H52 L48 44 H34Z" fill="#E7C7B6"/>
      <path d="M54 28 H74 L70 44 H58Z" fill="#6E8B74"/>
      <rect x="14" y="46" width="10" height="16" fill="#C4A574"/>
      <rect x="36" y="48" width="12" height="12" rx="6" fill="#E39A62"/>
      <rect x="58" y="46" width="12" height="18" fill="#F7F3EE" stroke="#C4A574"/>
      <rect x="8" y="78" width="64" height="4" fill="#E7D3C4"/>
    `,
  },
};

export function PrintArt({ id }: { id: string }) {
  const print = PRINTS[id] ?? PRINTS["valle-maule"];
  return (
    <svg
      className="print-art"
      viewBox={print.viewBox}
      role="img"
      aria-label={print.label}
      preserveAspectRatio="xMidYMid slice"
      dangerouslySetInnerHTML={{ __html: print.nodes }}
    />
  );
}
