import { Module } from '@nestjs/common';
import { StockIndexSocketService } from './stock-index-socket.service';
import { StockPriceSocketService } from './stock-price-socket.service';
import { SocketModule } from '../common/websocket/socket.module';
import { StockExecuteOrderRepository } from './stock-execute-order.repository';

@Module({
  imports: [SocketModule],
  providers: [
    StockIndexSocketService,
    StockPriceSocketService,
    StockExecuteOrderRepository,
  ],
  exports: [StockIndexSocketService, StockPriceSocketService],
})
export class StockSocketModule {}
