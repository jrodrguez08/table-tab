import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PublicModule } from './public/public.module';
import { BillingModule } from './billing/billing.module';

@Module({
  imports: [PublicModule, BillingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
