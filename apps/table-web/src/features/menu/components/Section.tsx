import { type ReactNode } from 'react';
import { Separator } from '@/components/ui/separator';

type MenuSectionProps = {
  id: string;
  title: string;
  count?: number;
  children: ReactNode;
};

export function MenuSection({ id, title, count, children }: MenuSectionProps) {
  return (
    <section id={id} className="space-y-3 scroll-mt-28">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
        {typeof count === 'number' && <div className="text-xs text-muted-foreground">{count}</div>}
      </div>

      <Separator className="opacity-60" />

      {children}
    </section>
  );
}
