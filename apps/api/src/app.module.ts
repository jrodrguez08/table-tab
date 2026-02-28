import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PublicModule } from './public/public.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [PublicModule, ProductModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
