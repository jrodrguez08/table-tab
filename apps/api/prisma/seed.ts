import { PrismaClient, OrderSource, OrderStatus, SessionStatus, TableStatus, TabStatus, PaymentStatus, AdjustmentScope, AdjustmentType, AdjustmentMode } from "@prisma/client";
import { nanoid } from "nanoid";

const prisma = new PrismaClient();

async function main() {
  // Limpieza (orden importante por FKs)
  await prisma.orderItemAllocation.deleteMany();
  await prisma.orderItemModifier.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.sessionAdjustment.deleteMany();
  await prisma.tableSessionTab.deleteMany();
  await prisma.tableSession.deleteMany();
  await prisma.diningTableQr.deleteMany();
  await prisma.diningTable.deleteMany();
  await prisma.restaurant.deleteMany();

  const restaurant = await prisma.restaurant.create({
    data: {
      name: "TableTap Demo",
      currency: "CRC",
      timezone: "America/Costa_Rica",
    },
  });

  const table1 = await prisma.diningTable.create({
    data: {
      restaurantId: restaurant.id,
      name: "Mesa 1",
      status: TableStatus.OCCUPIED,
    },
  });

  const table2 = await prisma.diningTable.create({
    data: {
      restaurantId: restaurant.id,
      name: "Mesa 2",
      status: TableStatus.AVAILABLE,
    },
  });

  const table1Qr = await prisma.diningTableQr.create({
    data: {
      tableId: table1.id,
      publicCode: nanoid(12), // QR fijo por mesa
      isActive: true,
    },
  });

  const session = await prisma.tableSession.create({
    data: {
      restaurantId: restaurant.id,
      tableId: table1.id,
      status: SessionStatus.OPEN,
      guestsCount: 2,
      // publicCode: nanoid(16), // opcional si luego haces QR por sesión
    },
  });

  const tabA = await prisma.tableSessionTab.create({
    data: { tableSessionId: session.id, label: "Persona 1", status: TabStatus.OPEN },
  });

  const tabB = await prisma.tableSessionTab.create({
    data: { tableSessionId: session.id, label: "Persona 2", status: TabStatus.OPEN },
  });

  const order = await prisma.order.create({
    data: {
      restaurantId: restaurant.id,
      tableSessionId: session.id,
      source: OrderSource.TABLET,
      status: OrderStatus.SUBMITTED,
    },
  });

  // Items (sin catálogo aún, usamos snapshot + productId null)
  const burger = await prisma.orderItem.create({
    data: {
      orderId: order.id,
      productId: null,
      nameSnapshot: "Hamburguesa",
      qty: "1.000",
      unitPrice: "4500.00",
      notes: "Sin cebolla",
    },
  });

  const fries = await prisma.orderItem.create({
    data: {
      orderId: order.id,
      productId: null,
      nameSnapshot: "Papas grandes",
      qty: "1.000",
      unitPrice: "1800.00",
    },
  });

  const lemonade = await prisma.orderItem.create({
    data: {
      orderId: order.id,
      productId: null,
      nameSnapshot: "Limonada",
      qty: "2.000",
      unitPrice: "1200.00",
    },
  });

  // Asignaciones para split bill
  await prisma.orderItemAllocation.createMany({
    data: [
      { orderItemId: burger.id, tabId: tabA.id, qty: "1.000" },           // burger persona 1
      { orderItemId: fries.id, tabId: tabA.id, qty: "0.500" },            // papas mitad y mitad
      { orderItemId: fries.id, tabId: tabB.id, qty: "0.500" },
      { orderItemId: lemonade.id, tabId: tabA.id, qty: "1.000" },         // 1 limonada cada uno
      { orderItemId: lemonade.id, tabId: tabB.id, qty: "1.000" },
    ],
  });

  // Ajuste global (ej: 10% descuento)
  await prisma.sessionAdjustment.create({
    data: {
      tableSessionId: session.id,
      scope: AdjustmentScope.SESSION,
      type: AdjustmentType.DISCOUNT,
      mode: AdjustmentMode.PERCENT,
      value: "10.00",
      reason: "Promo",
    },
  });

  // Pago parcial de Persona 1
  await prisma.payment.create({
    data: {
      tableSessionId: session.id,
      tabId: tabA.id,
      amount: "3000.00",
      method: "cash",
      status: PaymentStatus.PAID,
    },
  });

  console.log("Seed listo ✅");
  console.log("Mesa 1 QR publicCode:", table1Qr.publicCode);
  console.log("Session id:", session.id);
  console.log("Tab Persona 1:", tabA.id);
  console.log("Tab Persona 2:", tabB.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });