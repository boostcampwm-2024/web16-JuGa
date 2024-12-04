import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { BaseSocketDomainService } from '../common/websocket/base-socket.domain-service';
import { BaseStockSocketDomainService } from './base-stock-socket.domain-service';
import { RedisDomainService } from '../common/redis/redis.domain-service';
import { SocketGateway } from '../common/websocket/socket.gateway';
import { Order } from '../stock/order/stock-order.entity';
import { StockExecuteOrderRepository } from './stock-execute-order.repository';
import { StatusType } from '../stock/order/enum/status-type';
import { TodayStockTradeHistoryDataDto } from '../stock/trade/history/dto/today-stock-trade-history-data.dto';
import { StockDetailSocketDataDto } from '../stock/trade/history/dto/stock-detail-socket-data.dto';

@Injectable()
export class StockPriceSocketService extends BaseStockSocketDomainService {
  private connection: { [key: string]: number } = {};
  private register: string[] = [];

  constructor(
    protected readonly socketGateway: SocketGateway,
    protected readonly baseSocketDomainService: BaseSocketDomainService,
    private readonly stockExecuteOrderRepository: StockExecuteOrderRepository,
    private readonly redisDomainService: RedisDomainService,
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

    this.socketGateway.sendStockIndexValueToClient(
      `trade-history/${data[0]}`,
      tradeData,
    );

    this.socketGateway.sendStockIndexValueToClient(
      `detail/${data[0]}`,
      detailData,
    );
  }

  async subscribeByCode(trKey: string) {
    // 아무 서버도 한투와 구독 중이지 않을때
    if (!(await this.redisDomainService.exists(trKey))) {
      this.baseSocketDomainService.registerCode(this.TR_ID, trKey);
      await this.redisDomainService.subscribe(`stock/${trKey}`);
      this.register.push(trKey);
      await this.redisDomainService.set(trKey, 1);
      this.connection[trKey] = 1;

      return;
    }

    // 특정 서버는 한투와 구독 중일테니까...
    await this.redisDomainService.increment(trKey);

    // 여기 서버에서 최초로 구독을 시작한다면,
    if (!this.connection[trKey]) {
      await this.redisDomainService.subscribe(`stock/${trKey}`);
      this.connection[trKey] = 1;

      return;
    }

    this.connection[trKey] += 1;
  }

  async unsubscribeByCode(trKeys: string[]) {
    for (const trKey of trKeys) {
      if (!this.connection[trKey]) return;

      // redis 내의 key(종목코드)에 대한 value -= 1;
      await this.redisDomainService.decrement(trKey);

      // 현재 서버에서 구독 중이고 구독 유지해야 할 때
      if (this.connection[trKey] > 1) {
        this.connection[trKey] -= 1;
        return;
      }

      // 현재 서버에서 모든 연결이 종료됐을 경우
      if (this.connection[trKey] === 1) {
        delete this.connection[trKey];
        await this.redisDomainService.unsubscribe(`stock/${trKey}`);
      }

      // 레디스 내에서 모든 연결이 종료됐을 경우
      if ((await this.redisDomainService.get(trKey)) === 0) {
        await this.redisDomainService.del(trKey);
      }
    }
  }

  @Cron('*/5 * * * *')
  async checkConnection() {
    for (const trKey of this.register) {
      if (!(await this.redisDomainService.exists(trKey))) {
        this.baseSocketDomainService.unregisterCode(this.TR_ID, trKey);
        const idx = this.register.indexOf(trKey);
        if (idx) this.register.splice(idx, 1);
      }
    }
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
      await this.unsubscribeByCode([stockCode]);
  }
}
