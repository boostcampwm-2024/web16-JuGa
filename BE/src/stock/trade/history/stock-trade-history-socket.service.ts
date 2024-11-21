import { WebSocket } from 'ws';
import axios from 'axios';
import { Observable, Subject } from 'rxjs';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SseEvent } from './interface/sse-event';
import { SocketConnectTokenInterface } from '../../../common/websocket/interface/socket.interface';
import { getFullTestURL } from '../../../util/get-full-URL';
import { TodayStockTradeHistoryDataDto } from './dto/today-stock-trade-history-data.dto';
import { SocketGateway } from '../../../common/websocket/socket.gateway';

@Injectable()
export class StockTradeHistorySocketService implements OnModuleInit {
  private readonly logger = new Logger('');
  private socket: WebSocket;
  private socketConnectionKey: string;
  private subscribedStocks = new Set<string>();
  private TR_ID = 'H0STCNT0';
  private eventSubject = new Subject<SseEvent>();

  constructor(private readonly socketGateway: SocketGateway) {}

  async onModuleInit() {
    this.socketConnectionKey = await this.getSocketConnectionKey();
    this.socket = new WebSocket(process.env.KOREA_INVESTMENT_TEST_SOCKET_URL);

    this.socket.onopen = () => {};

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

      const tradeData: TodayStockTradeHistoryDataDto = {
        stck_cntg_hour: dataList[1],
        stck_prpr: dataList[2],
        prdy_vrss_sign: dataList[3],
        cntg_vol: dataList[12],
        prdy_ctrt: dataList[5],
      };

      this.eventSubject.next({
        data: JSON.stringify({
          tradeData,
        }),
      });

      this.socketGateway.sendStockTradeHistoryValueToClient(
        `trade-history/${dataList[0]}`,
        tradeData,
      );
    };

    this.socket.onclose = () => {
      this.logger.warn(`한국투자증권 소켓 연결 종료`);
    };
  }

  getTradeDataStream(): Observable<SseEvent> {
    return this.eventSubject.asObservable();
  }

  subscribeByCode(stockCode: string) {
    this.registerCode(this.TR_ID, stockCode);
    this.subscribedStocks.add(stockCode);
  }

  unsubscribeByCode(stockCode: string) {
    this.unregisterCode(this.TR_ID, stockCode);
    this.subscribedStocks.delete(stockCode);
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

  async getSocketConnectionKey() {
    if (this.socketConnectionKey) {
      return this.socketConnectionKey;
    }

    const response = await axios.post<SocketConnectTokenInterface>(
      getFullTestURL('/oauth2/Approval'),
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
