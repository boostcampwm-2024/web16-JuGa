import { WebSocket } from 'ws';
import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { SocketTokenService } from './socket-token.service';

@Injectable()
export class BaseSocketService implements OnModuleInit {
  private socket: WebSocket;
  private socketConnectionKey: string;
  private socketOpenHandlers: (() => void | Promise<void>)[] = [];
  private socketDataHandlers: {
    [key: string]: (data) => void;
  } = {};

  constructor(private readonly socketTokenService: SocketTokenService) {}

  async onModuleInit() {
    this.socketConnectionKey =
      await this.socketTokenService.getSocketConnectionKey();
    this.socket = new WebSocket(process.env.KOREA_INVESTMENT_SOCKET_URL);

    this.socket.onopen = () => {
      Promise.all(
        this.socketOpenHandlers.map(async (socketOpenHandler) => {
          await socketOpenHandler();
        }),
      ).catch(() => {
        throw new InternalServerErrorException();
      });
    };

    this.socket.onmessage = (event) => {
      const data =
        typeof event.data === 'string'
          ? event.data.split('|')
          : JSON.stringify(event.data);
      if (data.length < 2) return;

      const dataList = data[3].split('^');
      this.socketDataHandlers[data[1]](dataList);
    };
  }

  registerCode(trId: string, trKey: string) {
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

  registerSocketOpenHandler(handler: () => void | Promise<void>) {
    this.socketOpenHandlers.push(handler);
  }

  registerSocketDataHandler(tradeCode: string, handler: (data) => void) {
    this.socketDataHandlers[tradeCode] = handler;
  }
}
