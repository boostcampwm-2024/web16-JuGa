import { Injectable } from '@nestjs/common';
import { SocketGateway } from '../common/websocket/socket.gateway';
import { BaseSocketDomainService } from '../common/websocket/base-socket.domain-service';

@Injectable()
export abstract class BaseStockSocketDomainService {
  protected constructor(
    protected readonly socketGateway: SocketGateway,
    protected readonly baseSocketDomainService: BaseSocketDomainService,
    protected readonly TR_ID: string,
  ) {
    baseSocketDomainService.registerSocketOpenHandler(() =>
      this.socketOpenHandler(),
    );

    baseSocketDomainService.registerSocketDataHandler(TR_ID, (data: string[]) =>
      this.socketDataHandler(data),
    );
  }

  abstract socketOpenHandler(): void | Promise<void>;

  abstract socketDataHandler(data: string[]): void;
}
