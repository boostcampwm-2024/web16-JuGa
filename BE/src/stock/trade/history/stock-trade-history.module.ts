import { Module } from '@nestjs/common';
import { KoreaInvestmentModule } from '../../../common/koreaInvestment/korea-investment.module';
import { StockTradeHistoryController } from './stock-trade-history.controller';
import { StockTradeHistoryService } from './stock-trade-history.service';
import { SocketModule } from '../../../common/websocket/socket.module';
import { StockSocketModule } from '../../../stockSocket/stock-socket.module';

@Module({
  imports: [KoreaInvestmentModule, SocketModule, StockSocketModule],
  controllers: [StockTradeHistoryController],
  providers: [StockTradeHistoryService],
})
export class StockTradeHistoryModule {}
