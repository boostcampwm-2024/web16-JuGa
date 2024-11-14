import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserStock } from './user-stock.entity';
import { UserStockController } from './user-stock.controller';
import { UserStockRepository } from './user-stock.repository';
import { UserStockService } from './user-stock.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserStock])],
  controllers: [UserStockController],
  providers: [UserStockRepository, UserStockService],
})
export class StockOrderModule {}
