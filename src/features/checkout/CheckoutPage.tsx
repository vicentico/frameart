import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatClp } from "@/domain/money";
import { RULESET, ZONES, zoneById } from "@/domain/pricing";
import { planDelivery, productionDays } from "@/domain/promise";
import { isStandard } from "@/domain/sizing";
import type { ZoneId } from "@/domain/types";
import { useStore } from "@/state/store";

type Mode = "retiro" | "domicilio";
type Pay = "mercadopago" | "webpay";

export function CheckoutPage() {
  const { cart, placeOrder } = useStore();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [mode, setMode] = useState<Mode>("domicilio");
  const [zone, setZone] = useState<ZoneId | "">("");
  const [address, setAddress] = useState("");
  const [pay, setPay] = useState<Pay>("mercadopago");
  const [accept, setAccept] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const days = cart.reduce(
    (max, line) => Math.max(max, productionDays(line.widthCm, line.heightCm, isStandard(line.widthCm, line.heightCm))),
    2,
  );
  const plan = useMemo(() => planDelivery(new Date(), days), [days]);
  const merchandise = cart.reduce((sum, line) => sum + line.quote.merchandiseTotal, 0);
  const selectedZone = zone ? zoneById(zone) : null;
  const shipping = mode === "retiro" ? 0 : (selectedZone?.shipping ?? 0);
  const total = merchandise + (mode === "domicilio" && selectedZone?.shipping == null ? 0 : shipping);

  if (cart.length === 0) {
    return (
      <div className="page narrow">
        <h1>No hay cuadros para entregar</h1>
        <Link className="btn btn-primary" to="/carrito">
          Volver al carrito
        </Link>
      </div>
    );
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (name.trim().length < 2) next.name = "Escribe tu nombre.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = "Revisa el correo.";
    if (phone.replace(/\D/g, "").length < 8) next.phone = "Deja un teléfono de contacto.";
    if (mode === "domicilio" && !zone) next.zone = "Elige una zona.";
    if (mode === "domicilio" && zone === "fuera") next.zone = "Todavía no llegamos a esa comuna.";
    if (mode === "domicilio" && address.trim().length < 6) next.address = "Escribe calle y número.";
    if (!accept) next.accept = "Confirma que este pedido es una muestra, sin cobro real.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    const id = `FA-${Math.floor(1000 + Math.random() * 9000)}`;
    placeOrder({
      id,
      createdAt: new Date().toISOString(),
      lines: cart,
      contact: { name: name.trim(), email: email.trim(), phone: phone.trim(), notes: notes.trim() },
      delivery: {
        mode,
        zone: mode === "domicilio" ? zone : "",
        address: mode === "domicilio" ? address.trim() : "Taller central, Talca urbano",
        promiseLabel: plan.label,
        window: plan.window,
      },
      payMethod: pay,
      total,
      shipping: mode === "retiro" ? 0 : shipping,
      ruleset: RULESET,
      status: "pago-simulado",
    });
    navigate(`/pedido/${id}`);
  }

  return (
    <form className="page checkout" onSubmit={submit} noValidate>
      <div>
        <p className="eyebrow">Entrega</p>
        <h1>Dónde y cuándo</h1>
        <fieldset>
          <legend>Modalidad</legend>
          <label className="check">
            <input type="radio" name="modo" checked={mode === "domicilio"} onChange={() => setMode("domicilio")} />
            Despacho a domicilio
          </label>
          <label className="check">
            <input type="radio" name="modo" checked={mode === "retiro"} onChange={() => setMode("retiro")} />
            Retiro en el taller, martes y viernes
          </label>
        </fieldset>
        {mode === "domicilio" ? (
          <>
            <label>
              Zona
              <select value={zone} onChange={(event) => setZone(event.target.value as ZoneId | "")}>
                <option value="">Elige tu zona</option>
                {ZONES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.group} · {item.name}
                    {item.shipping == null ? " · sin cobertura" : ` · ${formatClp(item.shipping)}`}
                  </option>
                ))}
              </select>
              {errors.zone ? <span className="field-error">{errors.zone}</span> : null}
            </label>
            <label>
              Dirección
              <input value={address} onChange={(event) => setAddress(event.target.value)} autoComplete="street-address" />
              {errors.address ? <span className="field-error">{errors.address}</span> : null}
            </label>
          </>
        ) : (
          <p className="banner">Taller central, Talca urbano. Lleva el código del pedido.</p>
        )}
        <p className="promise">
          Salida del {plan.label}, {plan.window}. Cupo de muestra {plan.reserved}/{plan.capacity}.
        </p>
        <h2>Contacto</h2>
        <label>
          Nombre
          <input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" />
          {errors.name ? <span className="field-error">{errors.name}</span> : null}
        </label>
        <label>
          Correo
          <input value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" inputMode="email" />
          {errors.email ? <span className="field-error">{errors.email}</span> : null}
        </label>
        <label>
          Teléfono
          <input value={phone} onChange={(event) => setPhone(event.target.value)} autoComplete="tel" inputMode="tel" />
          {errors.phone ? <span className="field-error">{errors.phone}</span> : null}
        </label>
        <label>
          Indicaciones
          <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} />
        </label>
        <fieldset>
          <legend>Medio de pago del piloto</legend>
          <label className="check">
            <input type="radio" name="pago" checked={pay === "mercadopago"} onChange={() => setPay("mercadopago")} />
            Mercado Pago
          </label>
          <label className="check">
            <input type="radio" name="pago" checked={pay === "webpay"} onChange={() => setPay("webpay")} />
            Webpay Plus
          </label>
        </fieldset>
        <label className="check">
          <input type="checkbox" checked={accept} onChange={(event) => setAccept(event.target.checked)} />
          Entiendo que este pedido es una demostración y no se cobra.
        </label>
        {errors.accept ? <p className="field-error">{errors.accept}</p> : null}
      </div>
      <aside className="ticket">
        <h2>Resumen</h2>
        <dl>
          {cart.map((line) => (
            <div key={line.id}>
              <dt>
                {line.title} × {line.quantity}
              </dt>
              <dd>{formatClp(line.quote.merchandiseTotal)}</dd>
            </div>
          ))}
          <div>
            <dt>{mode === "retiro" ? "Retiro en taller" : "Despacho"}</dt>
            <dd>{formatClp(mode === "domicilio" && !selectedZone ? 0 : shipping)}</dd>
          </div>
        </dl>
        <p className="ticket-total">
          <span>Total</span>
          <strong>{formatClp(total)}</strong>
        </p>
        <p className="fine">Los cuadros conservan la tarifa con la que entraron al carrito. IVA incluido.</p>
        <button className="btn btn-primary" type="submit">
          Confirmar pedido de muestra
        </button>
      </aside>
    </form>
  );
}
