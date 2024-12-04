import { WebSocket } from 'ws';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { SocketTokenDomainService } from './socket-token.domain-service';
import { RedisDomainService } from '../redis/redis.domain-service';

@Injectable()
export class BaseSocketDomainService implements OnModuleInit {
  private socket: WebSocket;
  private socketConnectionKey: string;
  private socketOpenHandlers: (() => void | Promise<void>)[] = [];
  private socketDataHandlers: {
    [key: string]: (data) => void;
  } = {};

  private readonly logger = new Logger();

  constructor(
    private readonly socketTokenDomainService: SocketTokenDomainService,
    private readonly redisDomainService: RedisDomainService,
  ) {}

  async onModuleInit() {
    this.socketConnectionKey =
      await this.socketTokenDomainService.getSocketConnectionKey();
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

      if (data.length < 2) {
        const json = JSON.parse(data[0]);
        if (json.body) {
          this.logger.log(
            `한국투자증권 웹소켓 연결: ${json.body.msg1}`,
            json.header.tr_id,
          );
        }
        if (json.header.tr_id === 'PINGPONG')
          this.socket.pong(JSON.stringify(json));
        return;
      }

      const dataList = data[3].split('^');
      if (Number(dataList[1]) % 500 === 0)
        this.logger.log(`한국투자증권 데이터 수신 성공 (5분 단위)`, data[1]);

      if (data[1] === 'H0UPCNT0') {
        this.socketDataHandlers.H0UPCNT0(dataList);
        return;
      }

      this.redisDomainService
        .publish(`stock/${dataList[0]}`, data[3])
        .catch((err) => {
          throw new InternalServerErrorException(err);
        });
    };

    this.socket.onclose = () => {
      this.logger.warn(`한국투자증권 소켓 연결 종료`);
      setTimeout(() => {
        this.onModuleInit().catch((err) => {
          throw new InternalServerErrorException(err);
        });
      }, 60000);
    };

    this.redisDomainService.on((message) => {
      const dataList = message.split('^');
      this.socketDataHandlers.H0STCNT0(dataList);
    });
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

  unregisterCode(trId: string, trKey: string) {
    this.socket.send(
      JSON.stringify({
        header: {
          approval_key: this.socketConnectionKey,
          custtype: 'P',
          tr_type: '2',
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
