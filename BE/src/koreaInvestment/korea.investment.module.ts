import { Module } from '@nestjs/common';
import { KoreaInvestmentService } from './korea.investment.service';

@Module({
  imports: [],
  controllers: [],
  providers: [KoreaInvestmentService],
  exports: [KoreaInvestmentService],
})
export class KoreaInvestmentModule {}
