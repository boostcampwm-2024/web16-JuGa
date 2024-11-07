import { Module } from '@nestjs/common';
import { StockIndexController } from './stock.index.controller';
import { StockIndexService } from './stock.index.service';

@Module({
  imports: [],
  controllers: [StockIndexController],
  providers: [StockIndexService],
  exports: [StockIndexService],
})
export class StockIndexModule {}
