import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  // Si estás usando Decimal en Prisma, es común aceptar number y convertir a string
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price!: number;

  @ValidateIf((o: CreateProductDto) => o.cost !== undefined)
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  cost?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
