import { Injectable, OnModuleInit } from '@nestjs/common';
import { WebSocket } from 'ws';
import axios from 'axios';
import { SocketGateway } from './socket.gateway';
import { StockIndexValueElementDto } from '../stock/index/dto/stock.index.value.element.dto';
import { SocketConnectTokenInterface } from './interface/socket.interface';
import { getFullURL } from '../util/getFullURL';

@Injectable()
export class SocketService implements OnModuleInit {
  private socket: WebSocket;
  private tradeHandler = {
    H0UPCNT0: this.handleStockIndexValue.bind(this),
  };

  constructor(private readonly socketGateway: SocketGateway) {}

  async onModuleInit() {
    const socketConnectionKey = await this.getSocketConnectionKey();

    this.socket = new WebSocket(process.env.KOREA_INVESTMENT_SOCKET_URL);

    this.socket.onopen = () => {
      this.registerStockIndexByCode('0001', socketConnectionKey); // 코스피
      this.registerStockIndexByCode('1001', socketConnectionKey); // 코스닥
      this.registerStockIndexByCode('2001', socketConnectionKey); // 코스피200
      this.registerStockIndexByCode('3003', socketConnectionKey); // KSQ150
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

  private handleStockIndexValue(responseData: string) {
    const responseList = responseData.split('^');
    this.socketGateway.sendStockIndexValueToClient(
      new StockIndexValueElementDto(
        responseList[0],
        responseList[2],
        responseList[4],
        responseList[9],
        responseList[3],
      ),
    );
  }

  private async getSocketConnectionKey() {
    const response = await axios.post<SocketConnectTokenInterface>(
      getFullURL('/oauth2/Approval'),
      {
        grant_type: 'client_credentials',
        appkey: process.env.KOREA_INVESTMENT_APP_KEY,
        secretkey: process.env.KOREA_INVESTMENT_APP_SECRET,
      },
    );

    const result = response.data;
    return result.approval_key;
  }

  private registerStockIndexByCode(code, socketConnectionKey) {
    this.socket.send(
      JSON.stringify({
        header: {
          approval_key: socketConnectionKey,
          custtype: 'P',
          tr_type: '1',
          'content-type': 'utf-8',
        },
        body: {
          input: {
            tr_id: 'H0UPCNT0',
            tr_key: code,
          },
        },
      }),
    );
  }
}
