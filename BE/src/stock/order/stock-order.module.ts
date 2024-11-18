import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockOrderController } from './stock-order.controller';
import { StockOrderService } from './stock-order.service';
import { Order } from './stock-order.entity';
import { StockOrderRepository } from './stock-order.repository';
import { SocketModule } from '../../common/websocket/socket.module';
import { AssetModule } from '../../asset/asset.module';
import { StockOrderSocketService } from './stock-order-socket.service';
import { UserStockModule } from '../../userStock/user-stock.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    SocketModule,
    AssetModule,
    UserStockModule,
  ],
  controllers: [StockOrderController],
  providers: [StockOrderService, StockOrderRepository, StockOrderSocketService],
})
export class StockOrderModule {}
