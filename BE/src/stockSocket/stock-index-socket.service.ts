import { Injectable } from '@nestjs/common';
import { StockIndexValueElementDto } from '../stock/index/dto/stock-index-value-element.dto';
import { BaseStockSocketDomainService } from './base-stock-socket.domain-service';
import { SocketGateway } from '../common/websocket/socket.gateway';
import { BaseSocketDomainService } from '../common/websocket/base-socket.domain-service';

@Injectable()
export class StockIndexSocketService extends BaseStockSocketDomainService {
  private STOCK_CODE = {
    '0001': 'KOSPI',
    '1001': 'KOSDAQ',
    '2001': 'KOSPI200',
    '3003': 'KSQ150',
  };

  constructor(
    protected readonly socketGateway: SocketGateway,
    protected readonly baseSocketDomainService: BaseSocketDomainService,
  ) {
    super(socketGateway, baseSocketDomainService, 'H0UPCNT0');
  }

  socketOpenHandler(): void {
    this.baseSocketDomainService.registerCode(this.TR_ID, '0001'); // 코스피
    this.baseSocketDomainService.registerCode(this.TR_ID, '1001'); // 코스닥
    this.baseSocketDomainService.registerCode(this.TR_ID, '2001'); // 코스피200
    this.baseSocketDomainService.registerCode(this.TR_ID, '3003'); // KSQ150
  }

  socketDataHandler(data: string[]): void {
    this.socketGateway.sendStockIndexValueToClient(
      this.STOCK_CODE[data[0]],
      new StockIndexValueElementDto(
        data[2], // 주가 지수
        data[4], // 전일 대비 등락
        data[9], // 전일 대비 등락률
        data[3], // 부호
      ),
    );
  }
}
