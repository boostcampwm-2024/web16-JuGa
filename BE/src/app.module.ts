import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/user.entity';
import { StockIndexModule } from './stock/index/stock-index.module';
import { StockTopfiveModule } from './stock/topfive/stock-topfive.module';
import { KoreaInvestmentModule } from './koreaInvestment/korea-investment.module';
import { SocketModule } from './websocket/socket.module';
import { typeOrmConfig } from './configs/typeorm.config';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
