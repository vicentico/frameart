export type DesignCategory = "Paisaje" | "Botánica" | "Casa" | "Abstracto";

export type Design = {
  id: string;
  title: string;
  category: DesignCategory;
  place: string;
  story: string;
  license: string;
  widthPx: number;
  heightPx: number;
  tags: string[];
};

export const DESIGNS: Design[] = [
  {
    id: "valle-maule",
    title: "Valle del Maule",
    category: "Paisaje",
    place: "Maule",
    story: "Colinas en capas y un sol bajo. La luz de las cinco, cuando el valle se pone cobrizo.",
    license: "Catálogo Frameart · pieza de muestra",
    widthPx: 2400,
    heightPx: 3200,
    tags: ["paisaje", "tarde", "maule"],
  },
  {
    id: "atardecer-talca",
    title: "Atardecer en Talca",
    category: "Paisaje",
    place: "Talca",
    story: "Una silueta cálida contra el cielo. Pensada para un pasillo con poca luz.",
    license: "Catálogo Frameart · pieza de muestra",
    widthPx: 2400,
    heightPx: 3000,
    tags: ["ciudad", "tarde"],
  },
  {
    id: "duraznos",
    title: "Duraznos de enero",
    category: "Botánica",
    place: "Cocina",
    story: "Dos frutos y una sombra corta. Queda bien sobre un mueble claro.",
    license: "Catálogo Frameart · pieza de muestra",
    widthPx: 2800,
    heightPx: 2800,
    tags: ["bodegón", "color"],
  },
  {
    id: "boldo",
    title: "Rama de boldo",
    category: "Botánica",
    place: "Cerro",
    story: "Trazo fino sobre papel crema. Pide margen para no perder las hojas.",
    license: "Catálogo Frameart · pieza de muestra",
    widthPx: 2400,
    heightPx: 3200,
    tags: ["botánica", "línea"],
  },
  {
    id: "casa-patio",
    title: "Casa con patio",
    category: "Casa",
    place: "Talca",
    story: "Geometría de una casa de un piso, el arco y la sombra del alero.",
    license: "Catálogo Frameart · pieza de muestra",
    widthPx: 3000,
    heightPx: 2400,
    tags: ["casa", "geometría"],
  },
  {
    id: "rio-claro",
    title: "Río Claro",
    category: "Paisaje",
    place: "Río Claro",
    story: "Bandas de agua y orilla. Mejor en horizontal, cerca de una ventana.",
    license: "Catálogo Frameart · pieza de muestra",
    widthPx: 3200,
    heightPx: 2400,
    tags: ["agua", "calma"],
  },
  {
    id: "geometria-cozy",
    title: "Geometría cálida",
    category: "Abstracto",
    place: "Taller",
    story: "Bloques de terracota, salvia y crema. Para quien no quiere una foto literal.",
    license: "Catálogo Frameart · pieza de muestra",
    widthPx: 2700,
    heightPx: 2700,
    tags: ["abstracto", "color"],
  },
  {
    id: "mercado",
    title: "Feria de la mañana",
    category: "Casa",
    place: "Talca",
    story: "Toldos y cajas de fruta, dibujados en plano. Un recuerdo de la calle, no un cartel.",
    license: "Catálogo Frameart · pieza de muestra",
    widthPx: 2400,
    heightPx: 3200,
    tags: ["feria", "ciudad"],
  },
];

export function getDesign(id: string): Design | undefined {
  return DESIGNS.find((design) => design.id === id);
}
