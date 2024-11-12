import { Module } from '@nestjs/common';
import { StockIndexSocketService } from './stock-index-socket.service';
import { SocketGateway } from './socket.gateway';
import { SocketTokenService } from './socket-token.service';
import { BaseSocketService } from './base-socket.service';

@Module({
  imports: [],
  controllers: [],
  providers: [
    SocketTokenService,
    StockIndexSocketService,
    SocketGateway,
    BaseSocketService,
  ],
  exports: [SocketGateway],
})
export class SocketModule {}
