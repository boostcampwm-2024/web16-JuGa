import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisUtil } from 'src/common/redis/redis';
import { RedisModule } from 'src/common/redis/redis.module';
import { StockListRepository } from './stock-list.repostiory';
import { StockListService } from './stock-list.service';
import { StockListController } from './stock-list.controller';
import { Stocks } from './stock-list.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Stocks]), RedisModule],
  controllers: [StockListController],
  providers: [StockListRepository, StockListService, RedisUtil],
  exports: [],
})
export class StockListModule {}