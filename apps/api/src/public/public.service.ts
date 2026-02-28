import { Injectable, NotFoundException } from '@nestjs/common';
import type { BillResponse, RestaurantTaxConfig, CurrencyCode } from '../types';
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
}
