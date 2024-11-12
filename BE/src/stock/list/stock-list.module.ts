import { Module } from '@nestjs/common';
import { StockListRepository } from './stock-list.repostiory';
import { StockListService } from './stock-list.service';
import { StockListController } from './stock-list.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stocks } from './stock-list.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Stocks])],
  controllers: [StockListController],
  providers: [StockListRepository, StockListService],
  exports: [],
})
export class StockListModule {}
