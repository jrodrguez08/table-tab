import { type CategorySection, type PublicMenuProduct } from './types';

export const buildCategorySections = (params: {
  products: PublicMenuProduct[];
  categories: { id: string; name: string }[];
  activeCategoryId: string;
}): CategorySection[] => {
  const { products, categories, activeCategoryId } = params;

  const categoryNameById = new Map(categories.map((c) => [c.id, c.name]));
  const grouped = new Map<string, CategorySection>();

  for (const p of products) {
    const categoryId = p.categoryId ?? 'uncategorized';
    const name =
      categoryId === 'uncategorized' ? 'Otros' : (categoryNameById.get(categoryId) ?? 'Otros');

    if (!grouped.has(categoryId)) grouped.set(categoryId, { id: categoryId, name, products: [] });
    grouped.get(categoryId)!.products.push(p);
  }

  // Si el usuario seleccionó una categoría específica, devolvemos solo esa
  if (activeCategoryId !== 'all') {
    const section = grouped.get(activeCategoryId);
    return section ? [section] : [];
  }

  // Orden: primero categorías en el orden del array categories, luego "Otros"
  const ordered: CategorySection[] = [];
  for (const c of categories) {
    const section = grouped.get(c.id);
    if (section && section.products.length) ordered.push(section);
  }
  const uncategorized = grouped.get('uncategorized');
  if (uncategorized && uncategorized.products.length) ordered.push(uncategorized);

  return ordered;
};
