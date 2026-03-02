import type { RestaurantRole } from '@prisma/client';

export type PlatformUser = {
  userId: string;
  isPlatformAdmin?: boolean;
};

export type PlatformRequest = {
  user?: PlatformUser;
};

export type ScopeUser = {
  userId: string;
};

export type ScopeRequest = {
  user?: ScopeUser;
  params?: { restaurantId?: string };
  headers: Record<string, string | string[] | undefined>;
  restaurant?: { id: string };
  restaurantRole?: string;
};

export type RolesRequest = {
  restaurantRole?: RestaurantRole;
};
