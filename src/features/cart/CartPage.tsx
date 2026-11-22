import { Link } from "react-router-dom";
import { formatClp } from "@/domain/money";
import { FRAMES } from "@/domain/pricing";
import { PrintArt } from "@/features/art/PrintArt";
import { useStore } from "@/state/store";

export function CartPage() {
  const { cart, updateQuantity, removeLine } = useStore();
  const total = cart.reduce((sum, line) => sum + line.quote.merchandiseTotal, 0);
  if (cart.length === 0) {
    return (
      <div className="page narrow">
        <h1>El carrito está vacío</h1>
        <p>Cuando elijas medida y marco, el cuadro aparece aquí con el precio ya congelado.</p>
        <Link className="btn btn-primary" to="/disenar">
          Diseñar un cuadro
        </Link>
      </div>
    );
  }
  return (
    <div className="page">
      <header className="section-head">
        <div>
          <p className="eyebrow">Carrito</p>
          <h1>Tu pedido, con el precio que viste</h1>
        </div>
      </header>
      <ul className="cart-list">
        {cart.map((line) => (
          <li key={line.id}>
            <div className="cart-art">
              {line.preview ? <img src={line.preview} alt="" /> : <PrintArt id={line.pieceId} />}
            </div>
            <div>
              <h2>{line.title}</h2>
              <p>
                {line.widthCm}×{line.heightCm} cm · {FRAMES[line.frameId].name} ·{" "}
                {line.protection === "vidrio" ? "vidrio" : "acrílico"}
                {line.matCm ? ` · margen ${line.matCm} cm` : ""}
              </p>
              <p className="fine">Tarifa {line.quote.ruleset}</p>
              {line.qualityOverride ? <p className="fine">Impresión confirmada con resolución baja.</p> : null}
            </div>
            <label>
              Cantidad
              <input
                type="number"
                min={1}
                max={6}
                value={line.quantity}
                onChange={(event) => {
                  const quantity = Number(event.target.value);
                  if (Number.isInteger(quantity)) updateQuantity(line.id, Math.min(6, Math.max(1, quantity)));
                }}
              />
            </label>
            <strong>{formatClp(line.quote.merchandiseTotal)}</strong>
            <button type="button" className="text-link" onClick={() => removeLine(line.id)}>
              Quitar
            </button>
          </li>
        ))}
      </ul>
      <div className="cart-total">
        <p>
          Cuadros <strong>{formatClp(total)}</strong>
        </p>
        <p className="fine">El despacho se suma en el paso siguiente. Retiro en taller no tiene cargo.</p>
        <Link className="btn btn-primary" to="/pago">
          Elegir entrega
        </Link>
      </div>
    </div>
  );
}
