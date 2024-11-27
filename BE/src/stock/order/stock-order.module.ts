import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockOrderController } from './stock-order.controller';
import { StockOrderService } from './stock-order.service';
import { Order } from './stock-order.entity';
import { StockOrderRepository } from './stock-order.repository';
import { SocketModule } from '../../common/websocket/socket.module';
import { AssetModule } from '../../asset/asset.module';
import { StockSocketModule } from '../../stockSocket/stock-socket.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    SocketModule,
    AssetModule,
    StockSocketModule,
  ],
  controllers: [StockOrderController],
  providers: [StockOrderService, StockOrderRepository],
})
export class StockOrderModule {}
