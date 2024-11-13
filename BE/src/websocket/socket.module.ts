import { forwardRef, Module } from '@nestjs/common';
import { StockIndexSocketService } from './stock-index-socket.service';
import { SocketGateway } from './socket.gateway';
import { SocketTokenService } from './socket-token.service';
import { StockPriceSocketService } from './stock/price/stock-price-socket.service';
import { BaseSocketService } from './base-socket.service';
import { StockOrderModule } from '../stock/order/stock-order.module';

@Module({
  imports: [forwardRef(() => StockOrderModule)],
  controllers: [],
  providers: [
    SocketTokenService,
    StockIndexSocketService,
    SocketGateway,
    StockPriceSocketService,
    BaseSocketService,
  ],
  exports: [SocketGateway, StockPriceSocketService],
})
export class SocketModule {}
