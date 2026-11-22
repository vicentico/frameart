import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { DESIGNS, getDesign } from "@/data/catalog";
import { formatClp } from "@/domain/money";
import { FRAMES, PROTECTIONS, quote } from "@/domain/pricing";
import { planDelivery, productionDays } from "@/domain/promise";
import {
  STANDARD_SIZES,
  coerceProtection,
  isStandard,
  qualityOf,
  recommendSize,
  sizeIssue,
} from "@/domain/sizing";
import type { FrameId, MatCm, PresetId, ProtectionId } from "@/domain/types";
import { PrintArt } from "@/features/art/PrintArt";
import { useStore } from "@/state/store";
import { FramePreview } from "@/ui/FramePreview";
import { QuoteTicket } from "@/ui/QuoteTicket";

type Step = "pieza" | "medida" | "marco" | "resumen";

const STEPS: { id: Step; label: string }[] = [
  { id: "pieza", label: "Pieza" },
  { id: "medida", label: "Medida" },
  { id: "marco", label: "Marco" },
  { id: "resumen", label: "Precio" },
];

export function StudioPage() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const { uploads, addLine } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [override, setOverride] = useState(false);

  const origin = params.get("origen") === "historia" ? "historia" : "catalogo";
  const piece = params.get("pieza") ?? (origin === "catalogo" ? "valle-maule" : "");
  const width = cm(params.get("an"), 30);
  const height = cm(params.get("al"), 40);
  const frameId = asFrame(params.get("marco"));
  const matCm = asMat(params.get("paspartu"));
  const requestedProtection = params.get("proteccion") === "acrilico" ? "acrilico" : "vidrio";
  const protection = coerceProtection(width, height, matCm, requestedProtection);
  const preset = asPreset(params.get("preset"));
  const step = asStep(params.get("paso"));

  const design = origin === "catalogo" ? (getDesign(piece) ?? DESIGNS[0]) : undefined;
  const upload = origin === "historia" ? uploads.find((image) => image.id === piece) : undefined;
  const title = upload?.name ?? design?.title ?? "Tu cuadro";
  const issue = sizeIssue(width, height, matCm);
  const priced = issue
    ? null
    : quote({ widthCm: width, heightCm: height, matCm, frameId, protection, quantity });
  const quality = upload ? qualityOf(upload, width, height) : null;
  const plan = useMemo(
    () => planDelivery(new Date(), productionDays(width, height, isStandard(width, height))),
    [width, height],
  );

  useEffect(() => {
    if (protection !== requestedProtection) {
      const next = new URLSearchParams(params);
      next.set("proteccion", protection);
      setParams(next, { replace: true });
    }
  }, [protection, requestedProtection, params, setParams]);

  function update(partial: Record<string, string>) {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(partial)) next.set(key, value);
    setParams(next, { replace: true });
  }

  function applyPreset(next: Exclude<PresetId, "a-medida">) {
    const mat: MatCm = next === "bueno" ? 0 : next === "mejor" ? 3 : 5;
    const cover = coerceProtection(width, height, mat, next === "premium" ? "acrilico" : "vidrio");
    update({ preset: next, paspartu: String(mat), proteccion: cover });
  }

  function addToCart() {
    if (!priced || !priced.ok) return;
    if (quality?.level === "baja" && !override) return;
    addLine({
      id: crypto.randomUUID(),
      origin,
      pieceId: upload?.id ?? design?.id ?? piece,
      title,
      preview: upload?.preview,
      widthCm: width,
      heightCm: height,
      matCm,
      frameId,
      protection,
      preset,
      quantity,
      qualityOverride: Boolean(override && quality?.level === "baja"),
      quote: priced.quote,
    });
    navigate("/carrito");
  }

  const blocked = !priced || !priced.ok || (quality?.level === "baja" && !override);

  return (
    <div className="studio">
      <div className="stage studio-stage">
        {origin === "historia" && !upload ? (
          <div className="stage-empty">
            <h1>Falta la foto</h1>
            <p>Esa imagen no está en este navegador.</p>
            <Link className="btn btn-primary" to="/historia">
              Ir a mi historia
            </Link>
          </div>
        ) : (
          <FramePreview
            title={title}
            innerW={width}
            innerH={height}
            matCm={matCm}
            frameId={frameId}
            protection={protection}
            pxPerCm={460 / 80}
          >
            {upload ? <img src={upload.preview} alt="" /> : <PrintArt id={design?.id ?? "valle-maule"} />}
          </FramePreview>
        )}
      </div>
      <aside className="inspector">
        <ol className="stepper">
          {STEPS.map((item, index) => (
            <li key={item.id}>
              <button
                type="button"
                className={step === item.id ? "is-on" : undefined}
                aria-current={step === item.id ? "step" : undefined}
                onClick={() => update({ paso: item.id })}
              >
                <span>{index + 1}</span>
                {item.label}
              </button>
            </li>
          ))}
        </ol>

        {step === "pieza" ? (
          <section>
            <h1>Qué vamos a enmarcar</h1>
            <div className="piece-grid">
              {DESIGNS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={origin === "catalogo" && design?.id === item.id ? "piece is-on" : "piece"}
                  aria-pressed={origin === "catalogo" && design?.id === item.id}
                  onClick={() => {
                    const size = recommendSize(item.widthPx, item.heightPx);
                    const cover = coerceProtection(size.w, size.h, 0, "vidrio");
                    update({
                      origen: "catalogo",
                      pieza: item.id,
                      an: String(size.w),
                      al: String(size.h),
                      paspartu: "0",
                      proteccion: cover,
                      preset: "bueno",
                      paso: "medida",
                    });
                  }}
                >
                  <PrintArt id={item.id} />
                  <span>{item.title}</span>
                </button>
              ))}
            </div>
            <Link className="text-link" to="/historia">
              Usar una foto de mi historia
            </Link>
          </section>
        ) : null}

        {step === "medida" ? (
          <section>
            <h1>Medida</h1>
            <p className="fine">La imagen queda entre 10×15 y 60×80 cm, contando el passe-partout.</p>
            <div className="preset-grid compact">
              <button type="button" className={preset === "bueno" ? "preset is-on" : "preset"} onClick={() => applyPreset("bueno")}>
                <strong>Bueno</strong>
                <span>Sin margen</span>
              </button>
              <button type="button" className={preset === "mejor" ? "preset is-on" : "preset"} onClick={() => applyPreset("mejor")}>
                <strong>Mejor</strong>
                <span>Margen 3 cm</span>
              </button>
              <button type="button" className={preset === "premium" ? "preset is-on" : "preset"} onClick={() => applyPreset("premium")}>
                <strong>Premium</strong>
                <span>Margen 5 cm</span>
              </button>
            </div>
            <div className="chips">
              {STANDARD_SIZES.map((size) => {
                const selected = width === size.w && height === size.h;
                const illegal = sizeIssue(size.w, size.h, matCm);
                return (
                  <button
                    key={size.label}
                    type="button"
                    className={selected ? "chip is-on" : "chip"}
                    aria-pressed={selected}
                    disabled={Boolean(illegal)}
                    title={illegal ?? ""}
                    onClick={() => update({ an: String(size.w), al: String(size.h), preset: "a-medida" })}
                  >
                    {size.label}
                  </button>
                );
              })}
              <button
                type="button"
                className="chip"
                onClick={() => update({ an: String(height), al: String(width), preset: "a-medida" })}
              >
                Girar
              </button>
            </div>
            <div className="size-row">
              <label>
                Ancho
                <input
                  type="number"
                  min={10}
                  max={80}
                  value={width}
                  onChange={(event) => update({ an: event.target.value, preset: "a-medida" })}
                />
              </label>
              <label>
                Alto
                <input
                  type="number"
                  min={10}
                  max={80}
                  value={height}
                  onChange={(event) => update({ al: event.target.value, preset: "a-medida" })}
                />
              </label>
            </div>
            {issue ? <p className="banner warn">{issue}</p> : null}
          </section>
        ) : null}

        {step === "marco" ? (
          <section>
            <h1>Marco y protección</h1>
            <div className="option-grid">
              {(Object.values(FRAMES)).map((frame) => (
                <button
                  key={frame.id}
                  type="button"
                  className={frameId === frame.id ? "option is-on" : "option"}
                  aria-pressed={frameId === frame.id}
                  onClick={() => update({ marco: frame.id })}
                >
                  <span className="swatch" data-frame={frame.id} />
                  <strong>{frame.name}</strong>
                  <small>{frame.note}</small>
                </button>
              ))}
            </div>
            <div className="option-grid">
              {(Object.values(PROTECTIONS)).map((cover) => {
                const allowed = coerceProtection(width, height, matCm, cover.id) === cover.id;
                return (
                  <button
                    key={cover.id}
                    type="button"
                    className={protection === cover.id ? "option is-on" : "option"}
                    aria-pressed={protection === cover.id}
                    disabled={!allowed}
                    onClick={() => update({ proteccion: cover.id, preset: "a-medida" })}
                  >
                    <strong>{cover.name}</strong>
                    <small>{allowed ? cover.note : "Este formato viaja en acrílico."}</small>
                  </button>
                );
              })}
            </div>
            <div className="chips" role="group" aria-label="Passe-partout">
              {([0, 3, 5] as const).map((mat) => {
                const illegal = sizeIssue(width, height, mat);
                return (
                  <button
                    key={mat}
                    type="button"
                    className={matCm === mat ? "chip is-on" : "chip"}
                    disabled={Boolean(illegal)}
                    aria-pressed={matCm === mat}
                    onClick={() =>
                      update({
                        paspartu: String(mat),
                        preset: "a-medida",
                        proteccion: coerceProtection(width, height, mat, protection),
                      })
                    }
                  >
                    {mat === 0 ? "Sin margen" : `${mat} cm`}
                  </button>
                );
              })}
            </div>
          </section>
        ) : null}

        {step === "resumen" ? (
          <section>
            <h1>Precio y fecha</h1>
            <label>
              Cantidad
              <input
                type="number"
                min={1}
                max={6}
                value={quantity}
                onChange={(event) => setQuantity(clampQty(event.target.value))}
              />
            </label>
            {quality ? (
              <p className={quality.level === "baja" ? "banner warn" : "banner"}>
                Resolución estimada {quality.dpi} dpi
                {quality.level === "optima"
                  ? ". Se ve bien a este tamaño."
                  : quality.level === "aceptable"
                    ? ". Se puede imprimir; de cerca se notará suave."
                    : ". Está baja para este tamaño. Achica el cuadro o confirma que igual la quieres."}
              </p>
            ) : null}
            {quality?.level === "baja" ? (
              <label className="check">
                <input type="checkbox" checked={override} onChange={(event) => setOverride(event.target.checked)} />
                Imprimir igual, sabiendo que se verá suave
              </label>
            ) : null}
            <p className="promise">
              {plan.waitlist
                ? "El cupo de esta salida está completo. Te proponemos la siguiente dentro de la semana."
                : `Listo para la salida del ${plan.label}, ${plan.window}.`}
              <span>
                {" "}
                Cupo de muestra {plan.reserved}/{plan.capacity}. Si hay menos de 10 cuadros, igual salimos en la fecha
                prometida.
              </span>
            </p>
          </section>
        ) : null}

        {priced && priced.ok ? (
          <div aria-live="polite">
            <QuoteTicket quote={priced.quote} />
          </div>
        ) : (
          <p className="banner warn">{issue ?? "Ajusta la medida para ver el precio."}</p>
        )}
        <div className="inspector-actions">
          {step !== "resumen" ? (
            <button type="button" className="btn btn-primary" onClick={() => update({ paso: nextStep(step) })}>
              Seguir
            </button>
          ) : (
            <button type="button" className="btn btn-primary" disabled={blocked} onClick={addToCart}>
              Agregar al carrito {priced && priced.ok ? formatClp(priced.quote.total) : ""}
            </button>
          )}
        </div>
      </aside>
    </div>
  );
}

function nextStep(step: Step): Step {
  if (step === "pieza") return "medida";
  if (step === "medida") return "marco";
  return "resumen";
}

function cm(value: string | null, fallback: number): number {
  const number = Number(value);
  return Number.isInteger(number) ? number : fallback;
}

function clampQty(value: string): number {
  const number = Number(value);
  if (!Number.isInteger(number)) return 1;
  return Math.min(6, Math.max(1, number));
}

function asFrame(value: string | null): FrameId {
  if (value === "negro" || value === "blanco") return value;
  return "pino";
}

function asMat(value: string | null): MatCm {
  if (value === "3" || value === "5") return Number(value) as MatCm;
  return 0;
}

function asPreset(value: string | null): PresetId {
  if (value === "mejor" || value === "premium" || value === "a-medida") return value;
  return "bueno";
}

function asStep(value: string | null): Step {
  if (value === "pieza" || value === "marco" || value === "resumen") return value;
  return "medida";
}
