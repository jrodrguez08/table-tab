export function EmptyState({
  title = 'No hay resultados',
  description = 'Prueba otra categoría o cambia el texto de búsqueda.',
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="tt-surface">
      <div className="tt-section text-center">
        <div className="tt-empty-icon">🍽️</div>
        <p className="text-base font-medium tracking-tight">{title}</p>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">{description}</p>
      </div>
    </div>
  );
}
