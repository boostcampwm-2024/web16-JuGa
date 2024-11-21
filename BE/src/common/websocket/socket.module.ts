import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { SocketTokenDomainService } from './socket-token.domain-service';
import { BaseSocketDomainService } from './base-socket.domain-service';

@Module({
  providers: [SocketTokenDomainService, SocketGateway, BaseSocketDomainService],
  exports: [SocketGateway, BaseSocketDomainService],
})
export class SocketModule {}
