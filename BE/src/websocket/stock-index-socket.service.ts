import { Injectable } from '@nestjs/common';
import { StockIndexValueElementDto } from '../stock/index/dto/stock-index-value-element.dto';
import { BaseSocketService } from './base-socket.service';

@Injectable()
export class StockIndexSocketService extends BaseSocketService {
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

  protected handleSocketData(dataList: string[]) {
    this.socketGateway.sendStockIndexValueToClient(
      this.STOCK_CODE[dataList[0]],
      new StockIndexValueElementDto(
        dataList[2],
        dataList[4],
        dataList[9],
        dataList[3],
      ),
    );
  }
}
