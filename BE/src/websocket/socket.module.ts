import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { SocketTokenService } from './socket-token.service';
import { BaseSocketService } from './base-socket.service';

@Module({
  providers: [SocketTokenService, SocketGateway, BaseSocketService],
  exports: [SocketGateway, BaseSocketService],
})
export class SocketModule {}
