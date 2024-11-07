import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StockTopfiveController } from './stock.topfive.controller';
import { StockTopfiveService } from './stock.topfive.service';

@Module({
  imports: [ConfigModule],
  controllers: [StockTopfiveController],
  providers: [StockTopfiveService],
})
export class StockTopfiveModule {}
