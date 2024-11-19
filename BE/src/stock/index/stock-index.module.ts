import { Module } from '@nestjs/common';
import { StockIndexController } from './stock-index.controller';
import { StockIndexService } from './stock-index.service';
import { KoreaInvestmentModule } from '../../common/koreaInvestment/korea-investment.module';
import { SocketModule } from '../../common/websocket/socket.module';
import { StockIndexSocketService } from './stock-index-socket.service';

@Module({
  imports: [KoreaInvestmentModule, SocketModule],
  controllers: [StockIndexController],
  providers: [StockIndexService, StockIndexSocketService],
})
export class StockIndexModule {}
