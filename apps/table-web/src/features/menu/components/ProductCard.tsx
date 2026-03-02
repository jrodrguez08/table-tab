import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { PublicMenuProduct, PublicMenuRestaurant } from '../types';
import { formatMoney } from '@/lib/currency';

export function MenuProductCard({
  product,
  restaurant,
  categoryName,
  showCategoryBadge = false,
  onAdd,
}: {
  product: PublicMenuProduct;
  restaurant: PublicMenuRestaurant;
  categoryName?: string;
  showCategoryBadge?: boolean;
  onAdd?: () => void;
}) {
  return (
    <Card className="tt-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base sm:text-[15px] leading-tight tracking-tight">
            {product.name}
          </CardTitle>
          {showCategoryBadge && categoryName ? (
            <Badge variant="secondary" className="shrink-0 rounded-full">
              {categoryName}
            </Badge>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {product.description ? (
          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        ) : (
          <p className="text-sm text-muted-foreground">&nbsp;</p>
        )}
        <div className="tt-divider" />
        <div className="flex items-center justify-between">
          <div className="text-[15px] font-semibold tracking-tight">
            {formatMoney(product.price, restaurant.currency)}
          </div>
          <Button size="sm" onClick={onAdd} className="tt-btn tt-btn-primary tt-btn-sm">
            Agregar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
