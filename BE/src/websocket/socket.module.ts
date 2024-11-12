import { Module } from '@nestjs/common';
import { StockIndexSocketService } from './stock-index-socket.service';
import { SocketGateway } from './socket.gateway';
import { SocketTokenService } from './socket-token.service';

@Module({
  imports: [],
  controllers: [],
  providers: [SocketTokenService, StockIndexSocketService, SocketGateway],
  exports: [SocketGateway],
})
export class SocketModule {}
