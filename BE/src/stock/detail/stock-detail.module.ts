import { Module } from '@nestjs/common';
import { KoreaInvestmentModule } from '../../koreaInvestment/korea-investment.module';
import { StockDetailController } from './stock-detail.controller';
import { StockDetailService } from './stock-detail.service';

@Module({
  imports: [KoreaInvestmentModule],
  controllers: [StockDetailController],
  providers: [StockDetailService],
})
export class StockDetailModule {}
