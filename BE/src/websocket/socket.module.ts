import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { SocketGateway } from './socket.gateway';
import { KoreaInvestmentModule } from '../koreaInvestment/korea.investment.module';

@Module({
  imports: [KoreaInvestmentModule],
  controllers: [],
  providers: [SocketService, SocketGateway],
  exports: [SocketGateway],
})
export class SocketModule {}
