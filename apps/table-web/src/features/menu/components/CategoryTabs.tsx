import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { PublicMenuCategory } from '../types';

export function CategoryTabs({
  value,
  onValueChange,
  categories,
}: {
  value: string;
  onValueChange: (v: string) => void;
  categories: PublicMenuCategory[];
}) {
  return (
    <ScrollArea className="w-full">
      <Tabs value={value} onValueChange={onValueChange}>
        <TabsList className="tt-chip-row">
          <TabsTrigger className="tt-chip" value="all">
            Todo
          </TabsTrigger>

          {categories.map((c) => (
            <TabsTrigger key={c.id} className="tt-chip" value={c.id}>
              {c.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </ScrollArea>
  );
}
