import {
  Body,
  Controller,
  Post,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PlatformGuard } from '../auth/guards/platform.guard';
import { PlatformService } from './platform.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';

@Controller('platform')
@UseGuards(JwtAuthGuard, PlatformGuard)
export class PlatformController {
  constructor(private readonly platform: PlatformService) {}

  @Post('restaurants')
  @HttpCode(HttpStatus.CREATED)
  createRestaurant(
    @Body() dto: CreateRestaurantDto,
    @Req() req: Request & { user: { userId: string } },
  ) {
    return this.platform.createRestaurantWithOwner(dto, req.user.userId);
  }
}
