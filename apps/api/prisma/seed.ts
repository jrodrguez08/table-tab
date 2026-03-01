import {
  PrismaClient,
  OrderSource,
  OrderStatus,
  SessionStatus,
  TableStatus,
  TabStatus,
  PaymentStatus,
  AdjustmentScope,
  AdjustmentType,
  AdjustmentMode,
} from '@prisma/client';
import { nanoid } from 'nanoid';

const prisma = new PrismaClient();

function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quita acentos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-') // no alfanum -> -
    .replace(/^-+|-+$/g, '') // trim guiones
    .replace(/-{2,}/g, '-'); // colapsa guiones
}

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

  await prisma.product.deleteMany();
  // NUEVO: categorías antes de restaurante
  await prisma.category.deleteMany();

  await prisma.restaurant.deleteMany();

  const restaurantName = 'TableTab Demo';
  const restaurant = await prisma.restaurant.create({
    data: {
      name: restaurantName,
      slug: slugify(restaurantName), // NUEVO
      currency: 'CRC',
      timezone: 'America/Costa_Rica',
    },
  });

  // NUEVO: categorías
  const [catComidas, catBebidas] = await Promise.all([
    prisma.category.create({
      data: {
        restaurantId: restaurant.id,
        name: 'Comidas',
        sortOrder: 1,
        isActive: true,
      },
    }),
    prisma.category.create({
      data: {
        restaurantId: restaurant.id,
        name: 'Bebidas',
        sortOrder: 2,
        isActive: true,
      },
    }),
  ]);

  // Productos (AHORA con categoryId)
  const [productBurger, productFries, productLemonade] = await Promise.all([
    prisma.product.create({
      data: {
        restaurantId: restaurant.id,
        categoryId: catComidas.id,
        name: 'Hamburguesa',
        description: 'Burger clásica',
        price: '4500.00',
        cost: '2500.00', // costo ejemplo (interno)
        isActive: true,
        // sortOrder: 1, // si lo agregaste en schema
      },
    }),
    prisma.product.create({
      data: {
        restaurantId: restaurant.id,
        categoryId: catComidas.id,
        name: 'Papas grandes',
        description: 'Papas fritas tamaño grande',
        price: '1800.00',
        cost: '700.00',
        isActive: true,
        // sortOrder: 2,
      },
    }),
    prisma.product.create({
      data: {
        restaurantId: restaurant.id,
        categoryId: catBebidas.id,
        name: 'Limonada',
        description: 'Limonada natural',
        price: '1200.00',
        cost: '250.00',
        isActive: true,
        // sortOrder: 1,
      },
    }),
  ]);

  const table1 = await prisma.diningTable.create({
    data: {
      restaurantId: restaurant.id,
      name: 'Mesa 1',
      status: TableStatus.OCCUPIED,
    },
  });

  await prisma.diningTable.create({
    data: {
      restaurantId: restaurant.id,
      name: 'Mesa 2',
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
    },
  });

  const tabA = await prisma.tableSessionTab.create({
    data: {
      tableSessionId: session.id,
      label: 'Persona 1',
      status: TabStatus.OPEN,
    },
  });

  const tabB = await prisma.tableSessionTab.create({
    data: {
      tableSessionId: session.id,
      label: 'Persona 2',
      status: TabStatus.OPEN,
    },
  });

  const order = await prisma.order.create({
    data: {
      restaurantId: restaurant.id,
      tableSessionId: session.id,
      source: OrderSource.TABLET,
      status: OrderStatus.SUBMITTED,
    },
  });

  // Items (catálogo + snapshots)
  const burger = await prisma.orderItem.create({
    data: {
      orderId: order.id,
      productId: productBurger.id,
      nameSnapshot: productBurger.name,
      qty: '1.000',
      unitPrice: productBurger.price,
      unitCost: productBurger.cost,
      notes: 'Sin cebolla',
    },
  });

  const fries = await prisma.orderItem.create({
    data: {
      orderId: order.id,
      productId: productFries.id,
      nameSnapshot: productFries.name,
      qty: '1.000',
      unitPrice: productFries.price,
      unitCost: productFries.cost,
    },
  });

  const lemonade = await prisma.orderItem.create({
    data: {
      orderId: order.id,
      productId: productLemonade.id,
      nameSnapshot: productLemonade.name,
      qty: '2.000',
      unitPrice: productLemonade.price,
      unitCost: productLemonade.cost,
    },
  });

  // Asignaciones para split bill
  await prisma.orderItemAllocation.createMany({
    data: [
      { orderItemId: burger.id, tabId: tabA.id, qty: '1.000' },
      { orderItemId: fries.id, tabId: tabA.id, qty: '0.500' },
      { orderItemId: fries.id, tabId: tabB.id, qty: '0.500' },
      { orderItemId: lemonade.id, tabId: tabA.id, qty: '1.000' },
      { orderItemId: lemonade.id, tabId: tabB.id, qty: '1.000' },
    ],
  });

  // Ajuste global (ej: 10% descuento)
  await prisma.sessionAdjustment.create({
    data: {
      tableSessionId: session.id,
      scope: AdjustmentScope.SESSION,
      type: AdjustmentType.DISCOUNT,
      mode: AdjustmentMode.PERCENT,
      value: '10.00',
      reason: 'Promo',
    },
  });

  // Pago parcial de Persona 1
  await prisma.payment.create({
    data: {
      tableSessionId: session.id,
      tabId: tabA.id,
      amount: '3000.00',
      method: 'cash',
      status: PaymentStatus.PAID,
    },
  });

  console.log('Seed listo ✅');
  console.log('Restaurant slug:', restaurant.slug);
  console.log('Mesa 1 QR publicCode:', table1Qr.publicCode);
  console.log('Session id:', session.id);
  console.log('Tab Persona 1:', tabA.id);
  console.log('Tab Persona 2:', tabB.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
