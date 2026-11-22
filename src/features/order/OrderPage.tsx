import { Link, useParams } from "react-router-dom";
import { formatClp } from "@/domain/money";
import { useStore } from "@/state/store";

export function OrderPage() {
  const { id } = useParams();
  const { lastOrder } = useStore();
  if (!lastOrder || lastOrder.id !== id) {
    return (
      <div className="page narrow">
        <h1>No encontramos ese pedido en este navegador</h1>
        <p>El prototipo guarda solo el último pedido de muestra.</p>
        <Link className="btn btn-primary" to="/">
          Volver al inicio
        </Link>
      </div>
    );
  }
  const pay = lastOrder.payMethod === "webpay" ? "Webpay Plus" : "Mercado Pago";
  return (
    <div className="page narrow">
      <p className="eyebrow">Pedido {lastOrder.id}</p>
      <h1>Quedó registrado como muestra</h1>
      <p className="lede">
        No hubo cobro. En el piloto real, {pay} confirmaría el pago por un aviso firmado al servidor, no desde esta
        pantalla.
      </p>
      <ol className="timeline">
        <li className="is-done">Pago simulado</li>
        <li>Validación del taller</li>
        <li>Producción y control</li>
        <li>
          {lastOrder.delivery.mode === "retiro" ? "Listo para retiro" : "Salida de despacho"} ·{" "}
          {lastOrder.delivery.promiseLabel}
        </li>
      </ol>
      <p>
        {lastOrder.delivery.mode === "retiro" ? "Retiro" : "Despacho"} en {lastOrder.delivery.address}. Ventana{" "}
        {lastOrder.delivery.window}.
      </p>
      <p>
        Contacto: {lastOrder.contact.name} · {lastOrder.contact.phone}
      </p>
      <p className="detail-price">{formatClp(lastOrder.total)}</p>
      <p className="fine">
        Tarifa {lastOrder.ruleset}. Despacho {formatClp(lastOrder.shipping)}. {lastOrder.lines.length}{" "}
        {lastOrder.lines.length === 1 ? "línea" : "líneas"}.
      </p>
      <Link className="btn btn-ghost" to="/catalogo">
        Seguir mirando
      </Link>
    </div>
  );
}
