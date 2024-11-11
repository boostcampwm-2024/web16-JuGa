import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { StockIndexModule } from './stock/index/stock-index.module';
import { StockTopfiveModule } from './stock/topfive/stock-topfive.module';
import { KoreaInvestmentModule } from './koreaInvestment/korea-investment.module';
import { SocketModule } from './websocket/socket.module';
import { StockOrderModule } from './stock/order/stock-order.module';
import { Order } from './stock/order/stock-order.entity';
import { typeOrmConfig } from './configs/typeorm.config';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql', // 데이터베이스 타입
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWD,
      database: process.env.DB_DATABASE,
      entities: [User, Order],
      synchronize: true,
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    KoreaInvestmentModule,
    AuthModule,
    StockIndexModule,
    StockTopfiveModule,
    SocketModule,
    StockOrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
