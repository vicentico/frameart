import { NavLink, Outlet } from "react-router-dom";
import { useStore } from "@/state/store";

export function Shell() {
  const { cart, lastOrder } = useStore();
  const count = cart.reduce((sum, line) => sum + line.quantity, 0);
  return (
    <div className="app">
      <a className="skip" href="#contenido">
        Saltar al contenido
      </a>
      <header className="site-header">
        <NavLink to="/" className="brand" aria-label="Frameart, inicio">
          <span className="brand-mark" aria-hidden="true" />
          <span>Frameart</span>
        </NavLink>
        <nav className="nav" aria-label="Principal">
          <NavLink to="/catalogo">Catálogo</NavLink>
          <NavLink to="/disenar">Diseñar</NavLink>
          <NavLink to="/historia">Mi historia</NavLink>
          {lastOrder ? <NavLink to={`/pedido/${lastOrder.id}`}>Pedido</NavLink> : null}
        </nav>
        <div className="header-tools">
          <span className="proto-pill">Prototipo</span>
          <NavLink to="/carrito" className="cart-pill">
            Carrito
            <strong>{count}</strong>
          </NavLink>
        </div>
      </header>
      <main id="contenido">
        <Outlet />
      </main>
      <footer className="site-footer">
        <div>
          <strong>Frameart</strong>
          <p>Taller urbano en Talca. Entregas en Talca y Maule, martes y viernes de 10:30 a 14:00.</p>
        </div>
        <p className="fine">Precios de muestra con tarifa 2026.11.pilot. El pago de esta versión no cobra dinero real.</p>
      </footer>
    </div>
  );
}
