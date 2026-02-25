import { Module } from '@nestjs/common';
import { PublicController } from './public.controller';
import { PublicService } from './public.service';
import { BillingModule } from 'src/billing/billing.module';

@Module({
  imports: [BillingModule],
  controllers: [PublicController],
  providers: [PublicService]
})
export class PublicModule {}
