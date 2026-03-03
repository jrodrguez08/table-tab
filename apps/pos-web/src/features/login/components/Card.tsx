import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { CardProps } from '../types';

export function LoginCard({
  title = 'POS Platform',
  subtitle = 'Ingresá con tu cuenta de administrador.',
  children,
}: CardProps & { children: React.ReactNode }) {
  return (
    <Card className="tt-surface-elevated">
      <CardHeader className="tt-section space-y-1">
        <CardTitle className="text-2xl font-semibold tracking-tight">{title}</CardTitle>
        <CardDescription className="tt-subtle">{subtitle}</CardDescription>
      </CardHeader>

      {/* CardContent sin padding, porque lo controla tt-section */}
      <CardContent className="tt-section pt-0 space-y-4">{children}</CardContent>
    </Card>
  );
}
