import { WebSocket } from 'ws';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { SocketTokenService } from './socket-token.service';

@Injectable()
export abstract class BaseSocketService implements OnModuleInit {
  protected socket: WebSocket;
  protected abstract tradeHandler: Record<string, (data: string) => void>;
  protected socketConnectionKey: string;

  constructor(
    protected readonly socketTokenService: SocketTokenService,
    protected readonly socketGateway: SocketGateway,
  ) {}

  async onModuleInit() {
    this.socketConnectionKey =
      await this.socketTokenService.getSocketConnectionKey();
    this.socket = new WebSocket(process.env.KOREA_INVESTMENT_SOCKET_URL);

    this.socket.onopen = () => {
      this.handleSocketOpen();
    };

    this.socket.onmessage = (event) => {
      const data =
        typeof event.data === 'string'
          ? event.data.split('|')
          : JSON.stringify(event.data);
      if (data.length < 2) return;

      (this.tradeHandler[data[1]] as (data) => void)(data[3]);
    };
  }

  protected abstract handleSocketOpen(): void;

  protected registerCode(trId: string, trKey: string) {
    this.socket.send(
      JSON.stringify({
        header: {
          approval_key: this.socketConnectionKey,
          custtype: 'P',
          tr_type: '1',
          'content-type': 'utf-8',
        },
        body: {
          input: {
            tr_id: trId,
            tr_key: trKey,
          },
        },
      }),
    );
  }
}
