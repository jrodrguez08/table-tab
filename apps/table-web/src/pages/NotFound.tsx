import { Link } from 'react-router-dom';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function NotFoundPage() {
  return (
    <div className="tt-page tt-page-gradient">
      <div className="tt-container pt-20 pb-10">
        <div className="mx-auto max-w-md">
          <Card className="tt-surface text-center">
            <CardHeader className="space-y-2">
              <div className="text-5xl font-semibold tracking-tight">404</div>
              <CardTitle>Página no encontrada</CardTitle>
              <CardDescription>La ruta que intentaste abrir no existe.</CardDescription>
            </CardHeader>

            <CardContent className="pt-2">
              <Button asChild className="tt-btn tt-btn-primary w-full">
                <Link to="/">Volver al inicio</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
