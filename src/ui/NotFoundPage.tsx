import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="page narrow">
      <p className="eyebrow">404</p>
      <h1>Esta página no está en el taller</h1>
      <Link className="btn btn-primary" to="/">
        Volver al inicio
      </Link>
    </div>
  );
}
