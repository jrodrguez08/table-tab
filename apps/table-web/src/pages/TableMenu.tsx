import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { usePublicMenu } from '@/features/menu/usePublicMenu';
import { MenuLoading } from '@/features/menu/components/Loading';
import { MenuError } from '@/features/menu/components/Error';
import { MenuHeader } from '@/features/menu/components/Header';
import { CategoryTabs } from '@/features/menu/components/CategoryTabs';
import { EmptyState } from '@/features/menu/components/EmptyState';
import { MenuSection } from '@/features/menu/components/Section';
import { ProductGrid } from '@/features/menu/components/ProductGrid';
import { buildCategorySections } from '@/features/menu/utils';

export function TableMenuPage() {
  const { publicCode } = useParams();
  const { state, derived } = usePublicMenu(publicCode);

  const [activeCategoryId, setActiveCategoryId] = useState<string>('all');
  const [query, setQuery] = useState('');

  const categoryNameById = useMemo(() => {
    const map = new Map<string, string>();
    if (derived?.categories) for (const c of derived.categories) map.set(c.id, c.name);
    return map;
  }, [derived]);

  const filteredProducts = useMemo(() => {
    if (!derived) return [];
    const q = query.trim().toLowerCase();

    return derived.products.filter((p) => {
      const matchesCategory = activeCategoryId === 'all' ? true : p.categoryId === activeCategoryId;
      const matchesQuery =
        !q || p.name.toLowerCase().includes(q) || (p.description ?? '').toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [derived, activeCategoryId, query]);

  const sections = useMemo(() => {
    return buildCategorySections({
      products: filteredProducts,
      categories: derived?.categories ?? [],
      activeCategoryId,
    });
  }, [filteredProducts, derived?.categories, activeCategoryId]);

  if (state.status === 'loading' || state.status === 'idle') return <MenuLoading />;

  if (state.status === 'error') {
    const status = (state.error as Error & { status?: number }).status;
    return <MenuError message={state.error.message} status={status} />;
  }

  const { restaurant, table } = state.data;

  return (
    <div className="tt-page tt-page-gradient">
      <MenuHeader
        tableName={table.name}
        restaurantName={restaurant.name}
        currency={restaurant.currency}
        query={query}
        onQueryChange={setQuery}
      >
        <CategoryTabs
          value={activeCategoryId}
          onValueChange={setActiveCategoryId}
          categories={derived?.categories ?? []}
        />
      </MenuHeader>

      <div className="tt-container pt-4 pb-10">
        <div className="tt-surface tt-section">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium tracking-tight">Productos</h2>
            <div className="text-sm text-muted-foreground">
              {filteredProducts.length} producto{filteredProducts.length === 1 ? '' : 's'}
            </div>
          </div>

          <Separator className="my-4 opacity-60" />

          {filteredProducts.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-6">
              {sections.map((section) => (
                <MenuSection key={section.id} id={`cat-${section.id}`} title={section.name}>
                  <ProductGrid
                    products={section.products}
                    restaurant={restaurant}
                    categoryNameById={categoryNameById}
                  />
                </MenuSection>
              ))}
            </div>
          )}

          <div className="mt-6 text-xs text-muted-foreground">publicCode: {publicCode}</div>
        </div>
      </div>
    </div>
  );
}
