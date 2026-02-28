export type TabLineItem = {
  itemId: string;
  name: string;
  qty: number;
  unitPrice: number;
  modifiers: {
    name: string;
    qty: number;
    priceDelta: number;
  }[];
  lineSubtotal: number;
};

export type TabTotals = {
  subtotal: number;
  discount: number;
  vat: number;
  service: number;
  total: number;
  paid: number;
  balance: number;
};

export type BillTab = {
  id: string;
  label: string;
  items: TabLineItem[];
  totals: TabTotals;
};

export type BillTotals = {
  subtotal: number;
  discount: number;
  vat: number;
  service: number;
  total: number;
  paid: number;
  balance: number;
};

export type BillResponse = {
  restaurantId: string;
  tableId: string;
  sessionId: string;
  currency: string;
  tabs: BillTab[];
  totals: BillTotals;
  updatedAt: string;
};
