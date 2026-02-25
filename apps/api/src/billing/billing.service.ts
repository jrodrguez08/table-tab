import { Injectable } from '@nestjs/common';
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

type LoadedSession = TableSession & {
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

function money(n: number) {
  return Math.round(n * 100) / 100;
}

@Injectable()
export class BillingService {
  buildBill(session: LoadedSession, currency = 'CRC') {
    const items = session.orders
      .flatMap((o) => o.items)
      .map((i) => {
        const modifiersTotal = i.modifiers.reduce(
          (sum, m) => sum + Number(m.priceDelta) * Number(m.qty),
          0,
        );
        const baseTotal = Number(i.unitPrice) * Number(i.qty);
        const total = baseTotal + modifiersTotal;

        const allocatedQty = i.allocations.reduce(
          (sum, a) => sum + Number(a.qty),
          0,
        );
        const unassignedQty = Math.max(0, Number(i.qty) - allocatedQty);

        return {
          id: i.id,
          name: i.nameSnapshot,
          qty: Number(i.qty),
          unitPrice: Number(i.unitPrice),
          modifiers: i.modifiers.map((m) => ({
            name: m.nameSnapshot,
            qty: Number(m.qty),
            priceDelta: Number(m.priceDelta),
          })),
          modifiersTotal: money(modifiersTotal),
          baseTotal: money(baseTotal),
          total: money(total),
          allocations: i.allocations.map((a) => ({
            tabId: a.tabId,
            qty: Number(a.qty),
          })),
          allocatedQty: money(allocatedQty),
          unassignedQty: money(unassignedQty),
        };
      });

    const sessionDiscountPercent = session.adjustments
      .filter(
        (a) =>
          a.scope === 'SESSION' &&
          a.type === 'DISCOUNT' &&
          a.mode === 'PERCENT',
      )
      .reduce((sum, a) => sum + Number(a.value), 0);

    const sessionDiscountFixed = session.adjustments
      .filter(
        (a) =>
          a.scope === 'SESSION' && a.type === 'DISCOUNT' && a.mode === 'FIXED',
      )
      .reduce((sum, a) => sum + Number(a.value), 0);

    const tabSubtotal: Record<string, number> = Object.fromEntries(
      session.tabs.map((t) => [t.id, 0]),
    );

    for (const it of items) {
      const itemTotal = it.total;
      for (const alloc of it.allocations) {
        const ratio = it.qty === 0 ? 0 : alloc.qty / it.qty;
        tabSubtotal[alloc.tabId] =
          (tabSubtotal[alloc.tabId] ?? 0) + itemTotal * ratio;
      }
    }

    const subtotalAllTabs = Object.values(tabSubtotal).reduce(
      (s, v) => s + v,
      0,
    );
    const tableSubtotal = items.reduce((s, it) => s + it.total, 0);

    const tabDiscount: Record<string, number> = {};
    for (const tabId of Object.keys(tabSubtotal)) {
      const share =
        subtotalAllTabs > 0 ? tabSubtotal[tabId] / subtotalAllTabs : 0;
      const percentAmount = (tabSubtotal[tabId] * sessionDiscountPercent) / 100;
      const fixedAmount = sessionDiscountFixed * share;
      tabDiscount[tabId] = money(percentAmount + fixedAmount);
    }

    const paidByTab: Record<string, number> = Object.fromEntries(
      session.tabs.map((t) => [t.id, 0]),
    );
    for (const p of session.payments) {
      if (p.status !== 'PAID') continue;
      if (p.tabId)
        paidByTab[p.tabId] = (paidByTab[p.tabId] ?? 0) + Number(p.amount);
    }

    const tabs = session.tabs.map((t) => {
      const subtotal = money(tabSubtotal[t.id] ?? 0);
      const discount = money(tabDiscount[t.id] ?? 0);
      const total = money(subtotal - discount);
      const paid = money(paidByTab[t.id] ?? 0);
      const balance = money(total - paid);

      return {
        id: t.id,
        label: t.label,
        subtotal,
        discount,
        total,
        paid,
        balance,
      };
    });

    const unassigned = items
      .filter((it) => it.unassignedQty > 0)
      .map((it) => {
        const ratio = it.qty === 0 ? 0 : it.unassignedQty / it.qty;
        return {
          itemId: it.id,
          name: it.name,
          qty: it.unassignedQty,
          estimatedTotal: money(it.total * ratio),
        };
      });

    const totalDiscount = money(
      (subtotalAllTabs * sessionDiscountPercent) / 100 + sessionDiscountFixed,
    );
    const tableTotal = money(tableSubtotal - totalDiscount);

    const paidTotal = session.payments
      .filter((p) => p.status === 'PAID')
      .reduce((s, p) => s + Number(p.amount), 0);

    const tableBalance = money(tableTotal - paidTotal);

    return {
      restaurantId: session.restaurantId,
      tableId: session.tableId,
      sessionId: session.id,
      currency,
      items,
      unassigned,
      tabs,
      totals: {
        subtotal: money(tableSubtotal),
        discount: totalDiscount,
        total: tableTotal,
        paid: money(paidTotal),
        balance: tableBalance,
      },
      updatedAt: new Date().toISOString(),
    };
  }
}
