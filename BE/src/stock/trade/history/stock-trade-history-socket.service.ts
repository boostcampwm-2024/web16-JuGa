import { Injectable, Logger } from '@nestjs/common';
import { SocketGateway } from '../../../websocket/socket.gateway';
import { BaseSocketService } from '../../../websocket/base-socket.service';

interface TradeHistoryData {
  stck_prpr: string; // 체결가(주식 현재가)
  cntg_vol: string; // 체결 거래량
  prdy_ctrt: string; // 전일 대비율
  stck_cntg_hour: string; // 주식 체결 시간
}

@Injectable()
export class StockTradeHistorySocketService {
  private TR_ID = 'H0STCNT0';
  private readonly logger = new Logger('StockTradeHistorySocketService');
  private subscribedStocks = new Set<string>();

  constructor(
    private readonly socketGateway: SocketGateway,
    private readonly baseSocketService: BaseSocketService,
  ) {
    baseSocketService.registerSocketOpenHandler(() => {
      this.logger.debug('trade-history 소켓 연결 성공');
      this.subscribedStocks.forEach((stockCode) => {
        this.baseSocketService.registerCode(this.TR_ID, stockCode);
      });
    });

    baseSocketService.registerSocketDataHandler(
      this.TR_ID,
      (dataList: string[]) => {
        try {
          const stockCode = dataList[0];

          const tradeData: TradeHistoryData = {
            stck_prpr: dataList[2],
            cntg_vol: dataList[12],
            prdy_ctrt: dataList[5],
            stck_cntg_hour: dataList[1],
          };

          const eventName = `trade-history/${stockCode}`;
          this.logger.debug(`Emitting trade data for ${stockCode}`);
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
    this.baseSocketService.registerCode(this.TR_ID, stockCode);
    this.subscribedStocks.add(stockCode);
  }

  unsubscribeByCode(stockCode: string) {
    this.baseSocketService.unregisterCode(this.TR_ID, stockCode);
    this.subscribedStocks.delete(stockCode);
  }
}
