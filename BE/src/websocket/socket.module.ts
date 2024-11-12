import { Module } from '@nestjs/common';
import { StockIndexSocketService } from './stock-index-socket.service';
import { SocketGateway } from './socket.gateway';
import { SocketTokenService } from './socket-token.service';
import { StockPriceSocketService } from './stock/price/stock-price-socket.service';
import { StockItemModule } from '../stock/item/stock-item.module';
import { BaseSocketService } from './base-socket.service';

@Module({
  imports: [StockItemModule],
  controllers: [],
  providers: [
    SocketTokenService,
    StockIndexSocketService,
    SocketGateway,
    StockPriceSocketService,
    BaseSocketService,
  ],
  exports: [SocketGateway],
})
export class SocketModule {}
