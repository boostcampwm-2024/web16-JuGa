import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockOrderController } from './stock-order.controller';
import { StockOrderService } from './stock-order.service';
import { Order } from './stock-order.entity';
import { StockOrderRepository } from './stock-order.repository';
import { SocketModule } from '../../websocket/socket.module';
import { AssetModule } from '../../asset/asset.module';
import { StockOrderSocketService } from './stock-order-socket.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), SocketModule, AssetModule],
  controllers: [StockOrderController],
  providers: [StockOrderService, StockOrderRepository, StockOrderSocketService],
})
export class StockOrderModule {}