// src/products/products.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('restaurants/:restaurantId/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(
    @Param('restaurantId') restaurantId: string,
    @Body() dto: CreateProductDto,
  ) {
    return this.productService.create(restaurantId, dto);
  }

  @Get()
  list(
    @Param('restaurantId') restaurantId: string,
    @Query('active') active?: string,
  ) {
    const activeBool = active === undefined ? undefined : active === 'true';
    return this.productService.list(restaurantId, activeBool);
  }

  @Get(':id')
  getById(
    @Param('restaurantId') restaurantId: string,
    @Param('id') id: string,
  ) {
    return this.productService.getById(restaurantId, id);
  }

  @Patch(':id')
  update(
    @Param('restaurantId') restaurantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productService.update(restaurantId, id, dto);
  }

  @Delete(':id')
  deactivate(
    @Param('restaurantId') restaurantId: string,
    @Param('id') id: string,
  ) {
    return this.productService.deactivate(restaurantId, id);
  }
}
