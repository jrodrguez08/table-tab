import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function HomePage() {
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  return (
    <div className="tt-page tt-page-gradient">
      <div className="tt-container pt-20 pb-10">
        <div className="mx-auto max-w-md">
          <Card className="tt-surface">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl tracking-tight">TableTap</CardTitle>
              <CardDescription>Pega el publicCode del QR para abrir el menú.</CardDescription>
            </CardHeader>

            <CardContent>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!code.trim()) return;
                  navigate(`/t/${encodeURIComponent(code.trim())}`);
                }}
              >
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Ej: TBL-LABIRRA-M1"
                  className="tt-input"
                />

                <Button type="submit" className="tt-btn tt-btn-primary w-full">
                  Abrir menú
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
