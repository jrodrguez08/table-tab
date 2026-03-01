// src/products/products.service.ts
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(restaurantId: string, dto: CreateProductDto) {
    // Opcional: evitar duplicados por restaurante (si tienes @@unique([restaurantId, name]))
    // Prisma tirará error de unique si aplica, pero esto da mensaje bonito:
    const existing = await this.prisma.product.findFirst({
      where: { restaurantId, name: dto.name },
      select: { id: true },
    });
    if (existing)
      throw new ConflictException(
        'Ya existe un producto con ese nombre en este restaurante.',
      );

    return this.prisma.product.create({
      data: {
        restaurantId,
        name: dto.name.trim(),
        description: dto.description?.trim(),
        price: dto.price.toFixed(2), // Decimal
        cost: dto.cost === undefined ? null : dto.cost.toFixed(2),
        isActive: dto.isActive ?? true,
      },
    });
  }

  async list(restaurantId: string, active?: boolean) {
    return this.prisma.product.findMany({
      where: {
        restaurantId,
        ...(active === undefined ? {} : { isActive: active }),
      },
      orderBy: [{ isActive: 'desc' }, { name: 'asc' }],
    });
  }

  async getById(restaurantId: string, id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Producto no encontrado.');
    if (product.restaurantId !== restaurantId)
      throw new ForbiddenException('No tienes acceso a este producto.');
    return product;
  }

  async update(restaurantId: string, id: string, dto: UpdateProductDto) {
    // Garantiza scoping (sin filtrar directo por where compuesto)
    await this.getById(restaurantId, id);

    // Si están intentando renombrar, evita choque por unique (opcional)
    if (dto.name) {
      const existing = await this.prisma.product.findFirst({
        where: { restaurantId, name: dto.name, NOT: { id } },
        select: { id: true },
      });
      if (existing)
        throw new ConflictException(
          'Ya existe un producto con ese nombre en este restaurante.',
        );
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        name: dto.name?.trim(),
        description: dto.description?.trim(),
        price: dto.price === undefined ? undefined : dto.price.toFixed(2),
        cost: dto.cost === undefined ? undefined : dto.cost?.toFixed(2),
        isActive: dto.isActive,
      },
    });
  }

  async deactivate(restaurantId: string, id: string) {
    await this.getById(restaurantId, id);
    return this.prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
