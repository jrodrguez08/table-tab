import { Alert, AlertDescription } from '@/components/ui/alert';

export function LoginError({ message }: { message?: string | null }) {
  if (!message) return null;

  return (
    <Alert className="text-destructive border-border mb-4">
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
