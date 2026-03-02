import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PlatformRequest } from '../../types';

@Injectable()
export class PlatformGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<PlatformRequest>();
    const user = req.user;

    if (!user?.isPlatformAdmin) {
      throw new ForbiddenException('Platform access required');
    }

    return true;
  }
}
