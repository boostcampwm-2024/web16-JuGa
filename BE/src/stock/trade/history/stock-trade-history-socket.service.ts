import { Injectable, Logger } from '@nestjs/common';
import { SocketGateway } from '../../../websocket/socket.gateway';
import { BaseSocketService } from '../../../websocket/base-socket.service';

@Injectable()
export class StockTradeHistorySocketService {
  private TR_ID = 'H0STCNT0';
  private readonly logger = new Logger('StockTradeHistorySocketService');

  constructor(
    private readonly socketGateway: SocketGateway,
    private readonly baseSocketService: BaseSocketService,
  ) {
    baseSocketService.registerSocketOpenHandler(() => {
      this.logger.debug('trade-history 소켓 연결 성공');
    });

    baseSocketService.registerSocketDataHandler(
      this.TR_ID,
      (dataList: string[]) => {
        try {
          // BaseSocketService에서 이미 split된 데이터가 옴
          const tradeData = {
            stck_prpr: dataList[2],
            cntg_vol: dataList[12],
            prdy_ctrt: dataList[5],
            stck_cntg_hour: dataList[1],
          };

          const eventName = `trade-history/${dataList[0]}`;
          this.socketGateway.sendStockTradeHistoryValueToClient(
            eventName,
            tradeData,
          );
        } catch (error) {
          this.logger.error('Error processing trade data:', error);
          this.logger.error('Raw data was:', dataList);
        }
      },
    );
  }

  subscribeByCode(stockCode: string) {
    try {
      this.logger.log(`Subscribing to stock: ${stockCode}`);
      this.baseSocketService.registerCode(this.TR_ID, stockCode);
      this.logger.log(`Successfully subscribed to stock: ${stockCode}`);
    } catch (error) {
      this.logger.error(`Failed to subscribe to stock ${stockCode}:`, error);
      throw error;
    }
  }
}
