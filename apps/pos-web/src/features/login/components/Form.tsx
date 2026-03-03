import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { FormProps } from '../types';

export function LoginForm({
  email,
  password,
  loading,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: FormProps) {
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          autoComplete="email"
          placeholder="tu@email.com"
          className="tt-input"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          className="tt-input"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
        />
      </div>

      <Button
        type="submit"
        disabled={!!loading}
        className="w-full tt-btn tt-btn-primary h-10 rounded-xl"
      >
        {loading ? 'Ingresando…' : 'Ingresar'}
      </Button>
    </form>
  );
}
