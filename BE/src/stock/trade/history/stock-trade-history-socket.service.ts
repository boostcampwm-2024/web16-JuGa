import {
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { SocketGateway } from '../../../websocket/socket.gateway';
import { WebSocket } from 'ws';
import axios from 'axios';
import { SocketConnectTokenInterface } from '../../../websocket/interface/socket.interface';

interface TradeHistoryData {
  stck_prpr: string; // 체결가(주식 현재가)
  cntg_vol: string; // 체결 거래량
  prdy_ctrt: string; // 전일 대비율
  stck_cntg_hour: string; // 주식 체결 시간
}

@Injectable()
export class StockTradeHistorySocketService implements OnModuleInit {
  private TR_ID = 'H0STCNT0';
  private readonly logger = new Logger('StockTradeHistorySocketService');
  private subscribedStocks = new Set<string>();
  private socket: WebSocket;
  private socketConnectionKey: string;

  constructor(private readonly socketGateway: SocketGateway) {}

  async onModuleInit() {
    this.socketConnectionKey = await this.getSocketConnectionKey();
    this.socket = new WebSocket(process.env.KOREA_INVESTMENT_TEST_SOCKET_URL);

    this.socket.onopen = () => {
      this.registerCode(this.TR_ID, '005930');
    };

    this.socket.onmessage = (event) => {
      const data =
        typeof event.data === 'string'
          ? event.data.split('|')
          : JSON.stringify(event.data);

      if (data.length < 2) {
        const json = JSON.parse(data[0]);
        if (json.body)
          this.logger.log(
            `한국투자증권 웹소켓 연결: ${json.body.msg1}`,
            json.header.tr_id,
          );
        if (json.header.tr_id === 'PINGPONG')
          this.socket.pong(JSON.stringify(json));
        return;
      }

      const dataList = data[3].split('^');

      if (Number(dataList[1]) % 500 === 0)
        this.logger.log(`한국투자증권 데이터 수신 성공 (5분 단위)`, data[1]);

      console.log(dataList);
    };

    this.socket.onclose = () => {
      this.logger.warn(`한국투자증권 소켓 연결 종료`);
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

  subscribeByCode(stockCode: string) {
    this.subscribedStocks.add(stockCode);
  }

  unsubscribeByCode(stockCode: string) {
    this.subscribedStocks.delete(stockCode);
  }

  async getSocketConnectionKey() {
    if (this.socketConnectionKey) {
      return this.socketConnectionKey;
    }

    const response = await axios.post<SocketConnectTokenInterface>(
      'https://openapivts.koreainvestment.com:29443/oauth2/Approval',
      {
        grant_type: 'client_credentials',
        appkey: process.env.KOREA_INVESTMENT_TEST_APP_KEY,
        secretkey: process.env.KOREA_INVESTMENT_TEST_APP_SECRET,
      },
    );

    this.socketConnectionKey = response.data.approval_key;
    return this.socketConnectionKey;
  }
}
