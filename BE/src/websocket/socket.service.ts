import { Injectable, OnModuleInit } from '@nestjs/common';
import { WebSocket } from 'ws';
import { StockGateway } from './gateway/stock.gateway';
import { StockIndexValueElementDto } from '../stock/index/dto/stock.index.value.element.dto';

@Injectable()
export class SocketService implements OnModuleInit {
  private socket: WebSocket;
  private tradeHandler = {
    H0UPCNT0: this.handleStockIndexValue.bind(this),
  };

  constructor(private readonly stockGateway: StockGateway) {}

  async onModuleInit() {
    const socketConnectionKey = await this.getSocketConnectionKey();

    const url = 'ws://ops.koreainvestment.com:21000';
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      this.registerStockIndexByCode('0001', socketConnectionKey);
      this.registerStockIndexByCode('1001', socketConnectionKey);
    };

    this.socket.onmessage = (event) => {
      const data =
        typeof event.data === 'string'
          ? event.data
          : JSON.stringify(event.data);
      if (data.length < 2) return;

      (this.tradeHandler[data[1]] as (data) => void)(data[3]);
    };
  }

  private handleStockIndexValue(responseData: string) {
    const responseList = responseData.split('^');
    this.stockGateway.sendStockIndexValueToClient(
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
    const url = 'https://openapi.koreainvestment.com:9443/oauth2/Approval';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        appkey: process.env.APP_KEY,
        secretkey: process.env.APP_SECRET,
      }),
    });
    const result: SocketConnectTokenInterface = await response.json();
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

// interfaces

interface SocketConnectTokenInterface {
  approval_key: string;
}
