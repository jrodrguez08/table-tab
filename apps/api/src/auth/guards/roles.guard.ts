import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { RestaurantRole } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';
import type { RolesRequest } from '../../types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<RestaurantRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!required || required.length === 0) return true;

    const req = context.switchToHttp().getRequest<RolesRequest>();
    const role: RestaurantRole | undefined = req.restaurantRole;

    if (!role) throw new ForbiddenException('Missing restaurant role');

    if (!required.includes(role)) {
      throw new ForbiddenException('Insufficient role');
    }

    return true;
  }
}
