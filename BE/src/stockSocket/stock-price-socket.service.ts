import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { filter, map, Observable, Subject } from 'rxjs';
import { BaseSocketDomainService } from '../common/websocket/base-socket.domain-service';
import { SocketGateway } from '../common/websocket/socket.gateway';
import { BaseStockSocketDomainService } from './base-stock-socket.domain-service';
import { Order } from '../stock/order/stock-order.entity';
import { StatusType } from '../stock/order/enum/status-type';
import { TodayStockTradeHistoryDataDto } from '../stock/trade/history/dto/today-stock-trade-history-data.dto';
import { StockDetailSocketDataDto } from '../stock/trade/history/dto/stock-detail-socket-data.dto';
import { StockExecuteOrderRepository } from './stock-execute-order.repository';
import { SseEvent } from '../stock/trade/history/interface/sse-event';

@Injectable()
export class StockPriceSocketService extends BaseStockSocketDomainService {
  private connection: { [key: string]: number } = {};
  private eventSubject = new Subject<SseEvent>();

  constructor(
    protected readonly socketGateway: SocketGateway,
    protected readonly baseSocketDomainService: BaseSocketDomainService,
    private readonly stockExecuteOrderRepository: StockExecuteOrderRepository,
  ) {
    super(socketGateway, baseSocketDomainService, 'H0STCNT0');
  }

  async socketOpenHandler(): Promise<void> {
    const orders: Order[] =
      await this.stockExecuteOrderRepository.findAllCodeByStatus();
    orders.forEach((order) => {
      this.baseSocketDomainService.registerCode(this.TR_ID, order.stock_code);
    });
  }

  socketDataHandler(data: string[]) {
    this.checkExecutableOrder(
      data[0], // 주식 코드
      data[2], // 주식 체결가
    ).catch((err) => {
      throw new InternalServerErrorException(err);
    });

    const tradeData: TodayStockTradeHistoryDataDto = {
      stck_shrn_iscd: data[0],
      stck_cntg_hour: data[1],
      stck_prpr: data[2],
      prdy_vrss_sign: data[3],
      cntg_vol: data[12],
      prdy_ctrt: data[5],
    };

    const detailData: StockDetailSocketDataDto = {
      stck_prpr: data[2],
      prdy_vrss_sign: data[3],
      prdy_vrss: data[4],
      prdy_ctrt: data[5],
    };

    this.eventSubject.next({
      data: JSON.stringify({
        tradeData,
      }),
    });

    this.socketGateway.sendStockIndexValueToClient(
      `trade-history/${data[0]}`,
      tradeData,
    );

    this.socketGateway.sendStockIndexValueToClient(
      `detail/${data[0]}`,
      detailData,
    );
  }

  getTradeDataStream(targetStockCode: string): Observable<SseEvent> {
    return this.eventSubject.pipe(
      filter((event: SseEvent) => {
        const parsed = JSON.parse(event.data);
        return parsed.tradeData.stck_shrn_iscd === targetStockCode;
      }),
      map((event: SseEvent) => event),
    );
  }

  subscribeByCode(trKey: string) {
    this.baseSocketDomainService.registerCode(this.TR_ID, trKey);

    if (this.connection[trKey]) {
      this.connection[trKey] += 1;
      return;
    }
    this.connection[trKey] = 1;
  }

  unsubscribeByCode(trKey: string) {
    if (!this.connection[trKey]) return;
    if (this.connection[trKey] > 1) {
      this.connection[trKey] -= 1;
      return;
    }
    delete this.connection[trKey];
    this.baseSocketDomainService.unregisterCode(this.TR_ID, trKey);
  }

  private async checkExecutableOrder(stockCode: string, value) {
    const affectedBuyRow =
      await this.stockExecuteOrderRepository.checkExecutableBuyOrder(
        stockCode,
        value,
      );

    const affectedSellRow =
      await this.stockExecuteOrderRepository.checkExecutableSellOrder(
        stockCode,
        value,
      );

    if (
      affectedBuyRow + affectedSellRow > 0 &&
      !(await this.stockExecuteOrderRepository.existsBy({
        stock_code: stockCode,
        status: StatusType.PENDING,
      }))
    )
      this.unsubscribeByCode(stockCode);
  }
}
