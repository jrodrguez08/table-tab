import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { BillingService } from '../billing/billing.service';

const prisma = new PrismaClient();

@Injectable()
export class PublicService {
  constructor(private readonly billingService: BillingService) {}

  async getBillByTableQr(publicCode: string) {
    const qr = await prisma.diningTableQr.findFirst({
      where: { publicCode, isActive: true },
    });

    if (!qr) throw new NotFoundException('QR not found');

    const session = await prisma.tableSession.findFirst({
      where: { tableId: qr.tableId, status: 'OPEN' },
      include: {
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

    return this.billingService.buildBill(session, 'CRC');
  }
}
