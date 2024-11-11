import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockOrderController } from './stock-order.controller';
import { StockOrderService } from './stock-order.service';
import { Order } from './stock-order.entity';
import { StockOrderRepository } from './stock-order.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  controllers: [StockOrderController],
  providers: [StockOrderService, StockOrderRepository],
})
export class StockOrderModule {}
