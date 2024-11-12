import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockItemController } from './stock-item.controller';
import { StockItemService } from './stock-item.service';
import { Stock } from './stock-item.entity';
import { StockItemRepository } from './stock-item.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Stock])],
  controllers: [StockItemController],
  providers: [StockItemService, StockItemRepository],
  exports: [StockItemService],
})
export class StockItemModule {}
