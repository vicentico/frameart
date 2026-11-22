import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { DESIGNS, type DesignCategory } from "@/data/catalog";
import { formatClp } from "@/domain/money";
import { quote } from "@/domain/pricing";
import { coerceProtection, recommendSize } from "@/domain/sizing";
import { PrintArt } from "@/features/art/PrintArt";

const FILTERS: Array<DesignCategory | "Todas"> = ["Todas", "Paisaje", "Botánica", "Casa", "Abstracto"];

export function CatalogPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Todas");
  const [query, setQuery] = useState("");
  const designs = useMemo(() => {
    const text = query.trim().toLowerCase();
    return DESIGNS.filter((design) => {
      const categoryOk = filter === "Todas" || design.category === filter;
      const textOk =
        text.length === 0 ||
        `${design.title} ${design.place} ${design.tags.join(" ")}`.toLowerCase().includes(text);
      return categoryOk && textOk;
    });
  }, [filter, query]);

  return (
    <div className="page">
      <header className="section-head">
        <div>
          <p className="eyebrow">Catálogo</p>
          <h1>Láminas listas para enmarcar</h1>
        </div>
        <label className="search">
          <span className="sr-only">Buscar láminas</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por lugar o tema"
            type="search"
          />
        </label>
      </header>
      <div className="chips" role="toolbar" aria-label="Categorías">
        {FILTERS.map((item) => (
          <button
            key={item}
            type="button"
            className={item === filter ? "chip is-on" : "chip"}
            aria-pressed={item === filter}
            onClick={() => setFilter(item)}
          >
            {item}
          </button>
        ))}
      </div>
      {designs.length === 0 ? (
        <p className="empty">No hay láminas con esa búsqueda. Prueba con “Maule” o cambia el filtro.</p>
      ) : (
        <div className="grid-cards">
          {designs.map((design) => {
            const size = recommendSize(design.widthPx, design.heightPx);
            const protection = coerceProtection(size.w, size.h, 0, "vidrio");
            const priced = quote({
              widthCm: size.w,
              heightCm: size.h,
              matCm: 0,
              frameId: "pino",
              protection,
              quantity: 1,
            });
            return (
              <Link key={design.id} className="card" to={`/catalogo/${design.id}`}>
                <div className="card-art">
                  <PrintArt id={design.id} />
                </div>
                <div className="card-body">
                  <p className="eyebrow">{design.category}</p>
                  <h2>{design.title}</h2>
                  <p>{design.story}</p>
                  <p className="card-meta">
                    <span>
                      Sugerido {size.w}×{size.h}
                    </span>
                    <strong>{priced.ok ? formatClp(priced.quote.total) : ""}</strong>
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
