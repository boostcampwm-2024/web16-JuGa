import { Module } from '@nestjs/common';
import { KoreaInvestmentModule } from '../../../common/koreaInvestment/korea-investment.module';
import { StockTradeHistoryController } from './stock-trade-history.controller';
import { StockTradeHistoryService } from './stock-trade-history.service';

@Module({
  imports: [KoreaInvestmentModule],
  controllers: [StockTradeHistoryController],
  providers: [StockTradeHistoryService],
})
export class StockTradeHistoryModule {}
