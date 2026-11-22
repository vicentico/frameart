import { Link } from "react-router-dom";
import { DESIGNS } from "@/data/catalog";
import { formatClp } from "@/domain/money";
import { quote } from "@/domain/pricing";
import { coerceProtection } from "@/domain/sizing";
import { PrintArt } from "@/features/art/PrintArt";
import { FramePreview } from "@/ui/FramePreview";

export function HomePage() {
  const featured = DESIGNS[0];
  const prices = {
    bueno: priceOf(0, "vidrio"),
    mejor: priceOf(3, "vidrio"),
    premium: priceOf(5, "acrilico"),
  };
  return (
    <div className="page">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Talca y Maule</p>
          <h1>Enmarca lo que quieres seguir viendo.</h1>
          <p className="lede">
            Elige una lámina del catálogo o sube una foto tuya. El estudio muestra solo lo que podemos fabricar,
            con el precio y el día de entrega a la vista.
          </p>
          <div className="actions">
            <Link className="btn btn-primary" to="/disenar">
              Diseñar un cuadro
            </Link>
            <Link className="btn btn-ghost" to="/historia">
              Imprimir mi historia
            </Link>
          </div>
          <ul className="quiet-list">
            <li>Medidas de 10×15 a 60×80 cm</li>
            <li>Pino natural, negro o blanco</li>
            <li>Retiro o despacho los martes y viernes</li>
          </ul>
        </div>
        <div className="hero-stage stage">
          <FramePreview
            title={featured.title}
            innerW={30}
            innerH={40}
            matCm={3}
            frameId="pino"
            protection="acrilico"
            pxPerCm={5.4}
          >
            <PrintArt id={featured.id} />
          </FramePreview>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Tres caminos, no veinte decisiones</h2>
          <p>Un 30×40 con marco de pino. El resto del desglose aparece en el estudio.</p>
        </div>
        <div className="preset-grid">
          <article className="preset">
            <p className="eyebrow">Bueno</p>
            <h3>La foto, directa</h3>
            <p>Sin margen y con vidrio cuando el formato viaja bien.</p>
            <strong>{formatClp(prices.bueno)}</strong>
          </article>
          <article className="preset">
            <p className="eyebrow">Mejor</p>
            <h3>Aire alrededor</h3>
            <p>Passe-partout de 3 cm. Si el cuadro crece, el vidrio pasa a acrílico.</p>
            <strong>{formatClp(prices.mejor)}</strong>
          </article>
          <article className="preset">
            <p className="eyebrow">Premium</p>
            <h3>Pieza de galería</h3>
            <p>Margen de 5 cm y acrílico, para que se lea como obra.</p>
            <strong>{formatClp(prices.premium)}</strong>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Láminas para empezar</h2>
          <Link to="/catalogo">Ver el catálogo</Link>
        </div>
        <div className="grid-cards">
          {DESIGNS.slice(0, 4).map((design) => (
            <Link key={design.id} className="card" to={`/catalogo/${design.id}`}>
              <div className="card-art">
                <PrintArt id={design.id} />
              </div>
              <div className="card-body">
                <p className="eyebrow">{design.category}</p>
                <h3>{design.title}</h3>
                <p>{design.place}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="band">
        <div>
          <h2>Tu foto, en la pared</h2>
          <p>
            En Mi historia las imágenes quedan en este navegador. Gemini, Claude o Grok pueden proponer marco,
            margen y medida. Sin clave en el servidor, responde el estudio local y la foto no se envía.
          </p>
          <Link className="btn btn-primary" to="/historia">
            Abrir mi historia
          </Link>
        </div>
        <ol className="steps-quiet">
          <li>Sube la foto</li>
          <li>Elige un estilo propuesto</li>
          <li>Revisa precio y fecha</li>
          <li>Retiro en el taller o despacho</li>
        </ol>
      </section>
    </div>
  );
}

function priceOf(matCm: 0 | 3 | 5, requested: "vidrio" | "acrilico"): number {
  const protection = coerceProtection(30, 40, matCm, requested);
  const result = quote({
    widthCm: 30,
    heightCm: 40,
    matCm,
    frameId: "pino",
    protection,
    quantity: 1,
  });
  return result.ok ? result.quote.total : 0;
}
