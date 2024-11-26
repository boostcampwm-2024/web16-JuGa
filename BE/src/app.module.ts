import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { StockIndexModule } from './stock/index/stock-index.module';
import { StockTopfiveModule } from './stock/topfive/stock-topfive.module';
import { KoreaInvestmentModule } from './common/koreaInvestment/korea-investment.module';
import { SocketModule } from './common/websocket/socket.module';
import { StockOrderModule } from './stock/order/stock-order.module';
import { StockDetailModule } from './stock/detail/stock-detail.module';
import { typeOrmConfig } from './configs/typeorm.config';
import { StockListModule } from './stock/list/stock-list.module';
import { StockTradeHistoryModule } from './stock/trade/history/stock-trade-history.module';
import { RedisModule } from './common/redis/redis.module';
import { HTTPExceptionFilter } from './common/filters/http-exception.filter';
import { RankingModule } from './ranking/ranking.module';
import { StockBookmarkModule } from './stock/bookmark/stock-bookmark.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(typeOrmConfig),
    KoreaInvestmentModule,
    AuthModule,
    StockIndexModule,
    StockTopfiveModule,
    SocketModule,
    StockDetailModule,
    StockOrderModule,
    StockListModule,
    StockTradeHistoryModule,
    RedisModule,
    RankingModule,
    StockBookmarkModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HTTPExceptionFilter,
    },
  ],
})
export class AppModule {}
