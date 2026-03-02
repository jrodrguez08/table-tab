import { Input } from '@/components/ui/input';

export function MenuHeader({
  tableName,
  restaurantName,
  currency,
  query,
  onQueryChange,
  children,
}: {
  tableName: string;
  restaurantName: string;
  currency: string;
  query: string;
  onQueryChange: (v: string) => void;
  children: React.ReactNode; // aquí van los tabs
}) {
  return (
    <div className="tt-header">
      <div className="tt-container py-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="tt-badge w-fit">{tableName}</div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight leading-tight">
              {restaurantName}
            </h1>
            <p className="text-sm tt-subtle">Pedí desde tu mesa en segundos</p>
          </div>
          <div className="text-xs tt-subtle pt-1">{currency}</div>
        </div>
        <div className="flex gap-3 flex-col sm:flex-row sm:items-center">
          <Input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Buscar… (hamburguesa, limonada, etc.)"
            className="tt-input sm:max-w-sm ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          {children}
        </div>
      </div>
    </div>
  );
}
