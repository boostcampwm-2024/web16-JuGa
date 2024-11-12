import { Injectable } from '@nestjs/common';
import { StockIndexValueElementDto } from '../stock/index/dto/stock-index-value-element.dto';
import { BaseSocketService } from './base-socket.service';

@Injectable()
export class StockIndexSocketService extends BaseSocketService {
  protected tradeHandler = {
    H0UPCNT0: this.handleStockIndexValue.bind(this),
  };

  private STOCK_CODE = {
    '0001': 'KOSPI',
    '1001': 'KOSDAQ',
    '2001': 'KOSPI200',
    '3003': 'KSQ150',
  };

  protected handleSocketOpen() {
    this.registerCode('H0UPCNT0', '0001'); // 코스피
    this.registerCode('H0UPCNT0', '1001'); // 코스닥
    this.registerCode('H0UPCNT0', '2001'); // 코스피200
    this.registerCode('H0UPCNT0', '3003'); // KSQ150
  }

  private handleStockIndexValue(responseData: string) {
    const responseList = responseData.split('^');
    this.socketGateway.sendStockIndexValueToClient(
      this.STOCK_CODE[responseList[0]],
      new StockIndexValueElementDto(
        responseList[2],
        responseList[4],
        responseList[9],
        responseList[3],
      ),
    );
  }
}
