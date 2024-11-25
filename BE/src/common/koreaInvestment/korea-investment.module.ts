import { Module } from '@nestjs/common';
import { KoreaInvestmentDomainService } from './korea-investment.domain-service';

@Module({
  imports: [],
  controllers: [],
  providers: [KoreaInvestmentDomainService],
  exports: [KoreaInvestmentDomainService],
})
export class KoreaInvestmentModule {}
