import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PublicModule } from './public/public.module';
import { ProductModule } from './product/product.module';
import { AuthModule } from './auth/auth.module';
import { PlatformModule } from './platform/platform.module';

@Module({
  imports: [PublicModule, ProductModule, AuthModule, PlatformModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
