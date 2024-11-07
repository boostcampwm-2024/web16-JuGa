import { Module } from '@nestjs/common';
import { StockIndexController } from './stock.index.controller';
import { StockIndexService } from './stock.index.service';
import { KoreaInvestmentModule } from '../../koreaInvestment/korea.investment.module';

@Module({
  imports: [KoreaInvestmentModule],
  controllers: [StockIndexController],
  providers: [StockIndexService],
  exports: [StockIndexService],
})
export class StockIndexModule {}
