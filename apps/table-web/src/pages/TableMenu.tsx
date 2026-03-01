import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { usePublicMenu } from '@/features/menu/usePublicMenu';

export function TableMenuPage() {
  const { publicCode } = useParams();
  const { state, derived } = usePublicMenu(publicCode);

  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const visibleProducts = useMemo(() => {
    if (!derived) return [];
    if (!activeCategoryId) return derived.products;
    return derived.products.filter((p) => p.categoryId === activeCategoryId);
  }, [derived, activeCategoryId]);

  if (state.status === 'loading' || state.status === 'idle') {
    return (
      <div style={{ padding: 16 }}>
        <p>Cargando menú…</p>
      </div>
    );
  }

  if (state.status === 'error') {
    const status = state.error.status;
    return (
      <div style={{ padding: 16 }}>
        <h1>Error</h1>
        <p>No se pudo cargar el menú{status ? ` (HTTP ${status})` : ''}.</p>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{state.error.message}</pre>
        <Link to="/">Volver</Link>
      </div>
    );
  }

  const { restaurant, table } = state.data;

  return (
    <div style={{ padding: 16, maxWidth: 900, margin: '0 auto' }}>
      <header style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 14, opacity: 0.8 }}>{table.name}</div>
        <h1 style={{ margin: '4px 0 0' }}>{restaurant.name}</h1>
      </header>

      {/* Categorías */}
      <div
        style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: 12 }}
      >
        <button
          onClick={() => setActiveCategoryId(null)}
          style={{
            padding: '8px 12px',
            borderRadius: 999,
            border: '1px solid #ddd',
            background: activeCategoryId === null ? '#eee' : 'white',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Todo
        </button>

        {derived?.categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategoryId(c.id)}
            style={{
              padding: '8px 12px',
              borderRadius: 999,
              border: '1px solid #ddd',
              background: activeCategoryId === c.id ? '#eee' : 'white',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Productos */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 12,
        }}
      >
        {visibleProducts.map((p) => (
          <div key={p.id} style={{ border: '1px solid #eee', borderRadius: 12, padding: 12 }}>
            <div style={{ fontWeight: 700 }}>{p.name}</div>
            {p.description ? (
              <div style={{ fontSize: 13, opacity: 0.8, marginTop: 6 }}>{p.description}</div>
            ) : null}
            <div style={{ marginTop: 10, fontWeight: 700 }}>
              {restaurant.currency} {p.price.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, opacity: 0.7, fontSize: 12 }}>publicCode: {publicCode}</div>
    </div>
  );
}
