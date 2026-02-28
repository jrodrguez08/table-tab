import type {
  TableSession,
  TableSessionTab,
  SessionAdjustment,
  Payment,
  Order,
  OrderItem,
  OrderItemModifier,
  OrderItemAllocation,
} from '@prisma/client';

export type LoadedSession = TableSession & {
  tabs: TableSessionTab[];
  adjustments: SessionAdjustment[];
  payments: Payment[];
  orders: (Order & {
    items: (OrderItem & {
      modifiers: OrderItemModifier[];
      allocations: OrderItemAllocation[];
    })[];
  })[];
};
