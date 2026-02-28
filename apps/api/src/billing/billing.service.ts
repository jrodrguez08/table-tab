import { Injectable } from '@nestjs/common';

import { LoadedSession } from '../session/session.types';
import type { RestaurantTaxConfig } from '../types/restaurant.types';
import type { TabLineItem, BillResponse } from '../types/bill.types';

function money(n: number) {
  return Math.round(n * 100) / 100;
}

function normalizeRate(r: number) {
  return r > 1 ? r / 100 : r;
}

@Injectable()
export class BillingService {
  buildBill(
    session: LoadedSession,
    restaurant: RestaurantTaxConfig,
  ): BillResponse {
    const vatRate = normalizeRate(Number(restaurant.vatRate));
    const serviceRate = normalizeRate(Number(restaurant.serviceRate));
    const pricesIncludeVat = restaurant.pricesIncludeVat;

    const tabData: Record<
      string,
      {
        items: TabLineItem[];
        subtotal: number;
        discount: number;
        vat: number;
        service: number;
        total: number;
        paid: number;
      }
    > = {};

    for (const tab of session.tabs) {
      tabData[tab.id] = {
        items: [],
        subtotal: 0,
        discount: 0,
        vat: 0,
        service: 0,
        total: 0,
        paid: 0,
      };
    }

    // 1) items + allocations => items por tab
    for (const order of session.orders) {
      for (const item of order.items) {
        const modifiersTotal = item.modifiers.reduce(
          (sum, m) => sum + Number(m.priceDelta) * Number(m.qty),
          0,
        );

        const itemBaseTotal =
          Number(item.unitPrice) * Number(item.qty) + modifiersTotal;

        for (const alloc of item.allocations) {
          const ratio =
            Number(item.qty) === 0 ? 0 : Number(alloc.qty) / Number(item.qty);
          const lineSubtotalRaw = itemBaseTotal * ratio;

          let base = lineSubtotalRaw;
          if (pricesIncludeVat) base = lineSubtotalRaw / (1 + vatRate);

          tabData[alloc.tabId].items.push({
            itemId: item.id,
            name: item.nameSnapshot,
            qty: Number(alloc.qty),
            unitPrice: Number(item.unitPrice),
            modifiers: item.modifiers.map((m) => ({
              name: m.nameSnapshot,
              qty: Number(m.qty),
              priceDelta: Number(m.priceDelta),
            })),
            lineSubtotal: base,
          });

          tabData[alloc.tabId].subtotal += base;
        }
      }
    }

    // 2) descuentos session-level
    const percentDiscount = session.adjustments
      .filter(
        (a) =>
          a.scope === 'SESSION' &&
          a.type === 'DISCOUNT' &&
          a.mode === 'PERCENT',
      )
      .reduce((sum, a) => sum + Number(a.value), 0);

    const fixedDiscount = session.adjustments
      .filter(
        (a) =>
          a.scope === 'SESSION' && a.type === 'DISCOUNT' && a.mode === 'FIXED',
      )
      .reduce((sum, a) => sum + Number(a.value), 0);

    const totalSubtotal = Object.values(tabData).reduce(
      (s, t) => s + t.subtotal,
      0,
    );

    for (const tabId of Object.keys(tabData)) {
      const tab = tabData[tabId];

      const percentAmount = tab.subtotal * (percentDiscount / 100);
      const fixedAmount =
        totalSubtotal > 0 ? fixedDiscount * (tab.subtotal / totalSubtotal) : 0;

      tab.discount = percentAmount + fixedAmount;

      const baseAfterDiscount = tab.subtotal - tab.discount;

      tab.vat = baseAfterDiscount * vatRate;
      tab.service = baseAfterDiscount * serviceRate;
      tab.total = baseAfterDiscount + tab.vat + tab.service;
    }

    // 3) pagos
    for (const payment of session.payments) {
      if (payment.status !== 'PAID') continue;
      if (payment.tabId) tabData[payment.tabId].paid += Number(payment.amount);
    }

    // 4) response tabs (redondeo aquí)
    const tabs = session.tabs.map((tab) => {
      const data = tabData[tab.id];
      const balance = money(data.total - data.paid);

      return {
        id: tab.id,
        label: tab.label,
        items: data.items.map((it) => ({
          ...it,
          lineSubtotal: money(it.lineSubtotal),
        })),
        totals: {
          subtotal: money(data.subtotal),
          discount: money(data.discount),
          vat: money(data.vat),
          service: money(data.service),
          total: money(data.total),
          paid: money(data.paid),
          balance,
        },
      };
    });

    const grand = tabs.reduce(
      (acc, t) => {
        acc.subtotal += t.totals.subtotal;
        acc.discount += t.totals.discount;
        acc.vat += t.totals.vat;
        acc.service += t.totals.service;
        acc.total += t.totals.total;
        acc.paid += t.totals.paid;
        return acc;
      },
      { subtotal: 0, discount: 0, vat: 0, service: 0, total: 0, paid: 0 },
    );

    return {
      restaurantId: session.restaurantId,
      tableId: session.tableId,
      sessionId: session.id,
      currency: `${restaurant.currency}`,
      tabs,
      totals: {
        subtotal: money(grand.subtotal),
        discount: money(grand.discount),
        vat: money(grand.vat),
        service: money(grand.service),
        total: money(grand.total),
        paid: money(grand.paid),
        balance: money(grand.total - grand.paid),
      },
      updatedAt: new Date().toISOString(),
    };
  }
}
