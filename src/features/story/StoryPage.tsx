import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DESIGNS, getDesign } from "@/data/catalog";
import { formatClp } from "@/domain/money";
import { quote } from "@/domain/pricing";
import type { StyleAdvice, StyleProviderId, StyleProposal } from "@/domain/types";
import { PrintArt } from "@/features/art/PrintArt";
import { readUserImage } from "@/features/story/images";
import { fetchProviderStatus, requestStyles } from "@/features/story/styleClient";
import { useStore } from "@/state/store";
import { FramePreview } from "@/ui/FramePreview";

const PROVIDERS: { id: StyleProviderId; label: string }[] = [
  { id: "gemini", label: "Gemini" },
  { id: "claude", label: "Claude" },
  { id: "grok", label: "Grok" },
];

type Selection =
  | { origin: "historia"; id: string }
  | { origin: "catalogo"; id: string };

export function StoryPage() {
  const { uploads, addUpload, removeUpload } = useStore();
  const [selection, setSelection] = useState<Selection | null>(null);
  const [provider, setProvider] = useState<StyleProviderId>("gemini");
  const [ready, setReady] = useState<Partial<Record<StyleProviderId, boolean>>>({});
  const [advice, setAdvice] = useState<StyleAdvice | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    void fetchProviderStatus()
      .then(setReady)
      .catch(() => setReady({}));
  }, []);

  useEffect(() => {
    if (!selection && uploads[0]) setSelection({ origin: "historia", id: uploads[0].id });
  }, [selection, uploads]);

  const upload = selection?.origin === "historia" ? uploads.find((image) => image.id === selection.id) : undefined;
  const design = selection?.origin === "catalogo" ? getDesign(selection.id) : undefined;

  async function onFiles(files: FileList | null) {
    if (!files) return;
    setNotice(null);
    for (const file of Array.from(files)) {
      const image = await readUserImage(file);
      if ("error" in image) {
        setNotice(image.error);
        continue;
      }
      const saveError = addUpload(image);
      if (saveError) {
        setNotice(saveError);
        break;
      }
      setSelection({ origin: "historia", id: image.id });
      setAdvice(null);
    }
  }

  async function propose() {
    if (!upload && !design) return;
    setLoading(true);
    setError(null);
    try {
      const next = await requestStyles({
        provider,
        title: upload?.name ?? design?.title ?? "Pieza",
        brief: design?.story ?? "Foto personal del cliente para imprimir y enmarcar.",
        widthPx: upload?.widthPx ?? design?.widthPx ?? 800,
        heightPx: upload?.heightPx ?? design?.heightPx ?? 1000,
        imageDataUrl: upload?.preview,
      });
      setAdvice(next);
    } catch {
      setError("No pudimos pedir estilos. Revisa que el estudio local esté en marcha.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page story">
      <header className="section-head">
        <div>
          <p className="eyebrow">Mi historia</p>
          <h1>Fotos para imprimir, no para perder en el teléfono</h1>
          <p className="lede">
            Se guardan en este navegador. Solo salen de aquí si pides una propuesta y el servidor tiene clave del
            modelo elegido.
          </p>
        </div>
      </header>

      <label
        className="dropzone"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          void onFiles(event.dataTransfer.files);
        }}
      >
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={(event) => {
            void onFiles(event.target.files);
            event.target.value = "";
          }}
        />
        <strong>Suelta fotos o elige archivos</strong>
        <span>JPG, PNG o WebP. Las reducimos antes de guardarlas.</span>
      </label>
      {notice ? <p className="banner warn">{notice}</p> : null}

      <div className="film" aria-label="Tus fotos">
        {uploads.length === 0 ? <p className="fine">Todavía no hay fotos. Puedes ensayar con una lámina.</p> : null}
        {uploads.map((image) => (
          <figure key={image.id} className={selection?.id === image.id ? "film-item is-on" : "film-item"}>
            <button type="button" onClick={() => { setSelection({ origin: "historia", id: image.id }); setAdvice(null); }}>
              <img src={image.preview} alt="" />
              <figcaption>{image.name}</figcaption>
            </button>
            <button type="button" className="text-link" onClick={() => removeUpload(image.id)}>
              Quitar
            </button>
          </figure>
        ))}
      </div>

      <div className="chips" aria-label="Ensayar con el catálogo">
        {DESIGNS.slice(0, 4).map((item) => (
          <button
            key={item.id}
            type="button"
            className={selection?.origin === "catalogo" && selection.id === item.id ? "chip is-on" : "chip"}
            onClick={() => {
              setSelection({ origin: "catalogo", id: item.id });
              setAdvice(null);
            }}
          >
            Ensayar con {item.title}
          </button>
        ))}
      </div>

      <section className="advisor">
        <div>
          <h2>Proponer un enmarcado</h2>
          <div className="chips" role="radiogroup" aria-label="Modelo">
            {PROVIDERS.map((item) => (
              <button
                key={item.id}
                type="button"
                role="radio"
                aria-checked={provider === item.id}
                className={provider === item.id ? "chip is-on" : "chip"}
                onClick={() => setProvider(item.id)}
              >
                {item.label}
                <small>{ready[item.id] ? "conectado" : "estudio local"}</small>
              </button>
            ))}
          </div>
          <p className="fine">
            {ready[provider]
              ? `Hay clave de ${label(provider)}. La imagen se envía solo para esta propuesta.`
              : `Sin clave de ${label(provider)}. La propuesta queda en el computador y usa las mismas reglas de medida.`}
          </p>
          <button type="button" className="btn btn-primary" disabled={!selection || loading} onClick={() => void propose()}>
            {loading ? "Leyendo la pieza…" : "Proponer estilos"}
          </button>
          {error ? <p className="banner warn">{error}</p> : null}
        </div>
      </section>

      {advice ? (
        <section>
          <p className="banner">{advice.notice}</p>
          <div className="proposal-grid">
            {advice.proposals.map((proposal) => (
              <ProposalCard
                key={proposal.id}
                proposal={proposal}
                selection={selection}
                preview={upload?.preview}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function ProposalCard({
  proposal,
  selection,
  preview,
}: {
  proposal: StyleProposal;
  selection: Selection | null;
  preview?: string;
}) {
  const priced = quote({
    widthCm: proposal.widthCm,
    heightCm: proposal.heightCm,
    matCm: proposal.matCm,
    frameId: proposal.frameId,
    protection: proposal.protection,
    quantity: 1,
  });
  const href = selection
    ? `/disenar?origen=${selection.origin}&pieza=${selection.id}&an=${proposal.widthCm}&al=${proposal.heightCm}&marco=${proposal.frameId}&proteccion=${proposal.protection}&paspartu=${proposal.matCm}&preset=${proposal.preset}&paso=resumen`
    : "/disenar";
  return (
    <article className="proposal">
      <FramePreview
        title={proposal.name}
        innerW={proposal.widthCm}
        innerH={proposal.heightCm}
        matCm={proposal.matCm}
        frameId={proposal.frameId}
        protection={proposal.protection}
        pxPerCm={150 / Math.max(proposal.widthCm + proposal.matCm * 2, proposal.heightCm + proposal.matCm * 2)}
        plaque={false}
      >
        {preview ? <img src={preview} alt="" /> : <PrintArt id={selection?.origin === "catalogo" ? selection.id : "valle-maule"} />}
      </FramePreview>
      <p className="eyebrow">{proposal.mood}</p>
      <h3>{proposal.name}</h3>
      <p>{proposal.rationale}</p>
      <p className="card-meta">
        <span>
          {proposal.widthCm}×{proposal.heightCm} cm
        </span>
        <strong>{priced.ok ? formatClp(priced.quote.total) : ""}</strong>
      </p>
      <div className="palette" aria-hidden="true">
        {proposal.palette.map((color) => (
          <span key={color} style={{ background: color }} />
        ))}
      </div>
      <Link className="btn btn-ghost" to={href}>
        Usar este estilo
      </Link>
    </article>
  );
}

function label(provider: StyleProviderId): string {
  if (provider === "gemini") return "Gemini";
  if (provider === "claude") return "Claude";
  return "Grok";
}
