import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/user.entity';
import { StockIndexModule } from './stock/index/stock.index.module';
import { SocketService } from './websocket/socket.service';
import { SocketGateway } from './websocket/socket.gateway';
import { StockTopfiveModule } from './stock/topfive/stock.topfive.module';
import { KoreaInvestmentModule } from './koreaInvestment/korea.investment.module';

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
      entities: [User],
      synchronize: true,
    }),
    KoreaInvestmentModule,
    AuthModule,
    StockIndexModule,
    StockTopfiveModule,
  ],
  controllers: [AppController],
  providers: [AppService, SocketService, SocketGateway],
})
export class AppModule {}
