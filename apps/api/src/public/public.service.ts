import { Injectable, NotFoundException } from '@nestjs/common';
import type {
  BillResponse,
  RestaurantTaxConfig,
  CurrencyCode,
  PublicMenuResponse,
} from '../types';
import { PrismaService } from '../prisma/prisma.service';
import { BillingService } from '../billing/billing.service';
import type { LoadedSession } from '../session/session.types';

@Injectable()
export class PublicService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly billingService: BillingService,
  ) {}

  async getBillByTableQr(publicCode: string): Promise<BillResponse> {
    const qr = await this.prisma.diningTableQr.findFirst({
      where: { publicCode, isActive: true },
    });

    if (!qr) throw new NotFoundException('QR not found');

    const session = await this.prisma.tableSession.findFirst({
      where: { tableId: qr.tableId, status: 'OPEN' },
      include: {
        restaurant: true,
        tabs: true,
        adjustments: true,
        payments: true,
        orders: {
          include: {
            items: { include: { modifiers: true, allocations: true } },
          },
        },
      },
    });

    if (!session) throw new NotFoundException('No open session for this table');

    const restaurantTaxConfig: RestaurantTaxConfig = {
      vatRate: Number(session.restaurant.vatRate),
      serviceRate: Number(session.restaurant.serviceRate),
      pricesIncludeVat: session.restaurant.pricesIncludeVat,
      currency: session.restaurant.currency as CurrencyCode,
    };

    // BillingService devuelve BillResponse (tipo compartido)
    return this.billingService.buildBill(
      session as LoadedSession,
      restaurantTaxConfig,
    );
  }

  async getMenuByTableQr(publicCode: string): Promise<PublicMenuResponse> {
    const qr = await this.prisma.diningTableQr.findFirst({
      where: { publicCode, isActive: true },
      include: {
        table: {
          include: {
            restaurant: true,
          },
        },
      },
    });

    if (!qr) throw new NotFoundException('QR not found');

    const restaurant = qr.table.restaurant;

    const categories = await this.prisma.category.findMany({
      where: {
        restaurantId: restaurant.id,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        sortOrder: true,
      },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });

    const products = await this.prisma.product.findMany({
      where: {
        restaurantId: restaurant.id,
        isActive: true,
      },
      select: {
        id: true,
        categoryId: true,
        name: true,
        description: true,
        price: true,
        sortOrder: true,
      },
      orderBy: [{ sortOrder: 'asc' }], // o sortOrder si lo agregaste
    });

    return {
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
        currency: restaurant.currency as CurrencyCode,
        vatRate: Number(restaurant.vatRate),
        serviceRate: Number(restaurant.serviceRate),
        pricesIncludeVat: restaurant.pricesIncludeVat,
        timezone: restaurant.timezone,
      },
      table: {
        id: qr.table.id,
        name: qr.table.name,
      },
      categories: categories.map((c) => ({
        id: c.id,
        name: c.name,
        sortOrder: c.sortOrder,
      })),
      products: products.map((p) => ({
        id: p.id,
        categoryId: p.categoryId,
        name: p.name,
        description: p.description,
        price: Number(p.price),
        // sortOrder: p.sortOrder,
      })),
    };
  }
}
