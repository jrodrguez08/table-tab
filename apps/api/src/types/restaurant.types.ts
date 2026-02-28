export type CurrencyCode = 'CRC' | 'USD'; // puedes expandir luego

export type RestaurantTaxConfig = {
  vatRate: number; // IVA
  serviceRate: number; // servicio
  pricesIncludeVat: boolean;
  currency?: CurrencyCode;
};

export type Restaurant = {
  id: string;
  name: string;
  currency: CurrencyCode;
  timezone: string; // ej: 'America/Costa_Rica'
  tax: RestaurantTaxConfig;
  createdAt: string; // ISO
};

export type CreateRestaurantInput = {
  name: string;
  currency?: CurrencyCode; // default 'CRC' en backend
  timezone?: string; // default 'America/Costa_Rica'
  tax?: Partial<RestaurantTaxConfig>; // defaults en backend
};

export type UpdateRestaurantInput = {
  name?: string;
  currency?: CurrencyCode;
  timezone?: string;
  tax?: Partial<RestaurantTaxConfig>;
};

export type RestaurantSummary = Pick<
  Restaurant,
  'id' | 'name' | 'currency' | 'timezone'
>;

export type RestaurantListResponse = {
  items: RestaurantSummary[];
};

export type RestaurantResponse = {
  restaurant: Restaurant;
};
