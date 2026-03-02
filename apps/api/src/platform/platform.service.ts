import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import * as bcrypt from 'bcrypt';
import { RestaurantRole } from '@prisma/client';

@Injectable()
export class PlatformService {
  constructor(private readonly prisma: PrismaService) {}

  async createRestaurantWithOwner(
    dto: CreateRestaurantDto,
    createdByUserId: string,
  ) {
    const slug = dto.slug.trim().toLowerCase();
    const ownerEmail = dto.ownerEmail.trim().toLowerCase();

    // Validaciones simples
    if (!slug.match(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)) {
      throw new BadRequestException(
        'slug must be kebab-case (e.g. mi-restaurante)',
      );
    }

    const existingRestaurant = await this.prisma.restaurant.findUnique({
      where: { slug },
    });
    if (existingRestaurant)
      throw new BadRequestException('slug already exists');

    const existingOwner = await this.prisma.user.findUnique({
      where: { email: ownerEmail },
    });
    if (existingOwner)
      throw new BadRequestException('owner email already exists');

    const passwordHash = await bcrypt.hash(dto.ownerPassword, 10);

    const result = await this.prisma.$transaction(async (tx) => {
      const restaurant = await tx.restaurant.create({
        data: {
          name: dto.name,
          slug,
          currency: dto.currency ?? undefined,
          timezone: dto.timezone ?? undefined,
          createdByUserId,
          updatedByUserId: createdByUserId,
        },
        select: {
          id: true,
          name: true,
          slug: true,
          currency: true,
          timezone: true,
        },
      });

      const owner = await tx.user.create({
        data: {
          email: ownerEmail,
          passwordHash,
          isPlatformAdmin: false,
          createdByUserId,
          updatedByUserId: createdByUserId,
        },
        select: { id: true, email: true },
      });

      const membership = await tx.restaurantUser.create({
        data: {
          restaurantId: restaurant.id,
          userId: owner.id,
          role: RestaurantRole.OWNER,
          createdByUserId,
          updatedByUserId: createdByUserId,
          isActive: true,
        },
        select: { restaurantId: true, userId: true, role: true },
      });

      return { restaurant, owner, membership };
    });

    return result;
  }
}
