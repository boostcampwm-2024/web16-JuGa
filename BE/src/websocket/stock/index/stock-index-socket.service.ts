import { Injectable } from '@nestjs/common';
import { StockIndexValueElementDto } from '../../../stock/index/dto/stock-index-value-element.dto';
import { BaseSocketService } from '../../base-socket.service';
import { SocketGateway } from '../../socket.gateway';

@Injectable()
export class StockIndexSocketService {
  private TR_ID = 'H0UPCNT0';
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
      this.baseSocketService.registerCode(this.TR_ID, '0001'); // 코스피
      this.baseSocketService.registerCode(this.TR_ID, '1001'); // 코스닥
      this.baseSocketService.registerCode(this.TR_ID, '2001'); // 코스피200
      this.baseSocketService.registerCode(this.TR_ID, '3003'); // KSQ150
    });

    baseSocketService.registerSocketDataHandler(
      this.TR_ID,
      (data: string[]) => {
        this.socketGateway.sendStockIndexValueToClient(
          this.STOCK_CODE[data[0]],
          new StockIndexValueElementDto(
            data[2], // 주가 지수
            data[4], // 전일 대비 등락
            data[9], // 전일 대비 등락률
            data[3], // 부호
          ),
        );
      },
    );
  }
}
