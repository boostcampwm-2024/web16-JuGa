import { Module } from '@nestjs/common';
import { KoreaInvestmentModule } from '../../../common/koreaInvestment/korea-investment.module';
import { StockTradeHistoryController } from './stock-trade-history.controller';
import { StockTradeHistoryService } from './stock-trade-history.service';
import { StockTradeHistorySocketService } from './stock-trade-history-socket.service';
import { SocketModule } from '../../../websocket/socket.module';

@Module({
  imports: [KoreaInvestmentModule, SocketModule],
  controllers: [StockTradeHistoryController],
  providers: [StockTradeHistoryService, StockTradeHistorySocketService],
})
export class StockTradeHistoryModule {}
