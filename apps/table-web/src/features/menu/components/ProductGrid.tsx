import type { PublicMenuProduct, PublicMenuRestaurant } from '../types';
import { MenuProductCard } from './ProductCard';

export function ProductGrid({
  products,
  restaurant,
  categoryNameById,
}: {
  products: PublicMenuProduct[];
  restaurant: PublicMenuRestaurant;
  categoryNameById: Map<string, string>;
}) {
  return (
    <div className="tt-grid-products">
      {products.map((p) => (
        <MenuProductCard
          key={p.id}
          product={p}
          restaurant={restaurant}
          categoryName={p.categoryId ? categoryNameById.get(p.categoryId) : undefined}
        />
      ))}
    </div>
  );
}
