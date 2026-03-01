import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div style={{ padding: 16 }}>
      <h1>404</h1>
      <p>Página no encontrada.</p>
      <Link to="/">Volver</Link>
    </div>
  );
}
