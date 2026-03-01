import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function MenuError({ message, status }: { message: string; status?: number }) {
  return (
    <div className="tt-page tt-page-gradient">
      <div className="tt-container py-10">
        <div className="tt-surface tt-section space-y-3">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold tracking-tight">No se pudo cargar el menú</h1>
            <p className="text-sm text-muted-foreground">
              {status ? `HTTP ${status}` : 'Error de red'} — revisa el QR o la conexión.
            </p>
          </div>

          <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--muted)]/40 p-3">
            <pre className="text-xs whitespace-pre-wrap text-muted-foreground">{message}</pre>
          </div>

          <div className="pt-2">
            <Button asChild variant="secondary">
              <Link to="/">Volver</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
