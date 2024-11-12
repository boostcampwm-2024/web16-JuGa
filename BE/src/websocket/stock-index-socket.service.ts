import { Injectable } from '@nestjs/common';
import { StockIndexValueElementDto } from '../stock/index/dto/stock-index-value-element.dto';
import { BaseSocketService } from './base-socket.service';
import { SocketGateway } from './socket.gateway';

@Injectable()
export class StockIndexSocketService {
  private TRADE_CODE = 'H0UPCNT0';
  private STOCK_CODE = {
    '0001': 'KOSPI',
    '1001': 'KOSDAQ',
    '2001': 'KOSPI200',
    '3003': 'KSQ150',
  };

  constructor(
    private readonly socketGateway: SocketGateway,
    private readonly baseSocketService: BaseSocketService,
  ) {
    baseSocketService.registerSocketOpenHandler(() => {
      this.baseSocketService.registerCode(this.TRADE_CODE, '0001'); // 코스피
      this.baseSocketService.registerCode(this.TRADE_CODE, '1001'); // 코스닥
      this.baseSocketService.registerCode(this.TRADE_CODE, '2001'); // 코스피200
      this.baseSocketService.registerCode(this.TRADE_CODE, '3003'); // KSQ150
    });

    baseSocketService.registerSocketDataHandler(
      this.TRADE_CODE,
      (data: string[]) => {
        this.socketGateway.sendStockIndexValueToClient(
          this.STOCK_CODE[data[0]],
          new StockIndexValueElementDto(data[2], data[4], data[9], data[3]),
        );
      },
    );
  }
}
