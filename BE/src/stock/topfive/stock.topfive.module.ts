import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StockTopfiveController } from './stock.topfive.controller';
import { StockTopfiveService } from './stock.topfive.service';
import { KoreaInvestmentModule } from '../../koreaInvestment/korea.investment.module';

@Module({
  imports: [ConfigModule, KoreaInvestmentModule],
  controllers: [StockTopfiveController],
  providers: [StockTopfiveService],
})
export class StockTopfiveModule {}
