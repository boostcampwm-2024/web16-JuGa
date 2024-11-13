import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockOrderController } from './stock-order.controller';
import { StockOrderService } from './stock-order.service';
import { Order } from './stock-order.entity';
import { StockOrderRepository } from './stock-order.repository';
import { SocketModule } from '../../websocket/socket.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), forwardRef(() => SocketModule)],
  controllers: [StockOrderController],
  providers: [StockOrderService, StockOrderRepository],
  exports: [StockOrderService],
})
export class StockOrderModule {}
