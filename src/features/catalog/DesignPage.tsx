import { Link, useParams } from "react-router-dom";
import { getDesign } from "@/data/catalog";
import { formatClp } from "@/domain/money";
import { quote } from "@/domain/pricing";
import { coerceProtection, recommendSize } from "@/domain/sizing";
import { PrintArt } from "@/features/art/PrintArt";
import { FramePreview } from "@/ui/FramePreview";

export function DesignPage() {
  const { id } = useParams();
  const design = id ? getDesign(id) : undefined;
  if (!design) {
    return (
      <div className="page narrow">
        <h1>Esa lámina no está en el catálogo</h1>
        <Link className="btn btn-primary" to="/catalogo">
          Volver al catálogo
        </Link>
      </div>
    );
  }
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
  const href = `/disenar?origen=catalogo&pieza=${design.id}&an=${size.w}&al=${size.h}&marco=pino&proteccion=${protection}&paspartu=0&preset=bueno&paso=medida`;
  return (
    <div className="page detail">
      <div className="stage">
        <FramePreview
          title={design.title}
          innerW={size.w}
          innerH={size.h}
          matCm={0}
          frameId="pino"
          protection={protection}
          pxPerCm={360 / Math.max(size.w, size.h)}
        >
          <PrintArt id={design.id} />
        </FramePreview>
      </div>
      <div>
        <p className="eyebrow">{design.category}</p>
        <h1>{design.title}</h1>
        <p className="lede">{design.story}</p>
        <p>
          Medida sugerida {size.w}×{size.h} cm, marco de pino, sin passe-partout.
        </p>
        <p className="detail-price">{priced.ok ? formatClp(priced.quote.total) : ""}</p>
        <p className="fine">{design.license}. El precio cambia si modificas marco, margen o tamaño.</p>
        <div className="actions">
          <Link className="btn btn-primary" to={href}>
            Configurar este cuadro
          </Link>
          <Link className="btn btn-ghost" to="/catalogo">
            Seguir mirando
          </Link>
        </div>
      </div>
    </div>
  );
}
