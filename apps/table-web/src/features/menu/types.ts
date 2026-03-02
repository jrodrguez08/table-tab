export type CurrencyCode = 'CRC' | 'USD' | 'COP';

export type PublicMenuCategory = {
  id: string;
  name: string;
  sortOrder: number;
};

export type PublicMenuProduct = {
  id: string;
  categoryId: string | null;
  name: string;
  description?: string | null;
  price: number;
  sortOrder?: number;
};

export type PublicMenuRestaurant = {
  id: string;
  name: string;
  currency: CurrencyCode;
  vatRate: number;
  serviceRate: number;
  pricesIncludeVat: boolean;
  timezone: string;
};

export type PublicMenuTable = {
  id: string;
  name: string;
};

export type PublicMenuResponse = {
  restaurant: PublicMenuRestaurant;
  table: PublicMenuTable;
  categories: PublicMenuCategory[];
  products: PublicMenuProduct[];
};

export type CategorySection = {
  id: string; // categoryId o 'uncategorized'
  name: string;
  products: PublicMenuProduct[];
};
