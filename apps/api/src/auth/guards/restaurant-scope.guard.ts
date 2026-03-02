import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ScopeRequest } from '../../types';

@Injectable()
export class RestaurantScopeGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<ScopeRequest>();

    const user = req.user;
    const headerRestaurantId = req.headers['x-restaurant-id'];
    const restaurantIdFromHeader =
      typeof headerRestaurantId === 'string' ? headerRestaurantId : undefined;
    const restaurantId = req.params?.restaurantId || restaurantIdFromHeader;

    if (!user?.userId) throw new ForbiddenException('Missing user');
    if (!restaurantId || typeof restaurantId !== 'string') {
      throw new ForbiddenException('Missing restaurant scope');
    }

    const membership = await this.prisma.restaurantUser.findFirst({
      where: {
        userId: user.userId,
        restaurantId,
        isActive: true,
      },
      select: { role: true, restaurantId: true },
    });

    if (!membership) {
      throw new ForbiddenException('No access to this restaurant');
    }

    // attach to request for later roles guard
    req.restaurant = { id: membership.restaurantId };
    req.restaurantRole = membership.role;

    return true;
  }
}
