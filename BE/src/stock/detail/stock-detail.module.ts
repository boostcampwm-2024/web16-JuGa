import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KoreaInvestmentModule } from '../../common/koreaInvestment/korea-investment.module';
import { StockDetailController } from './stock-detail.controller';
import { StockDetailService } from './stock-detail.service';
import { StockDetailRepository } from './stock-detail.repository';
import { Stocks } from './stock-detail.entity';

@Module({
  imports: [KoreaInvestmentModule, TypeOrmModule.forFeature([Stocks])],
  controllers: [StockDetailController],
  providers: [StockDetailService, StockDetailRepository],
})
export class StockDetailModule {}
