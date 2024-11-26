import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { BaseSocketDomainService } from '../common/websocket/base-socket.domain-service';
import { SocketGateway } from '../common/websocket/socket.gateway';
import { BaseStockSocketDomainService } from './base-stock-socket.domain-service';
import { Order } from '../stock/order/stock-order.entity';
import { TradeType } from '../stock/order/enum/trade-type';
import { StatusType } from '../stock/order/enum/status-type';
import { TodayStockTradeHistoryDataDto } from '../stock/trade/history/dto/today-stock-trade-history-data.dto';
import { StockDetailSocketDataDto } from '../stock/trade/history/dto/stock-detail-socket-data.dto';
import { StockExecuteOrderRepository } from './stock-execute-order.repository';

@Injectable()
export class StockPriceSocketService extends BaseStockSocketDomainService {
  private readonly logger = new Logger();
  private connection: { [key: string]: number } = {};

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

    this.socketGateway.sendStockIndexValueToClient(
      `trade-history/${data[0]}`,
      tradeData,
    );

    this.socketGateway.sendStockIndexValueToClient(
      `detail/${data[0]}`,
      detailData,
    );
  }

  subscribeByCode(trKey: string) {
    this.baseSocketDomainService.registerCode(this.TR_ID, trKey);

    if (this.connection[trKey]) return this.connection[trKey]++;
    return (this.connection[trKey] = 1);
  }

  unsubscribeByCode(trKey: string) {
    if (!this.connection[trKey]) return;
    if (this.connection[trKey] > 1) return this.connection[trKey]--;
    delete this.connection[trKey];
    return this.baseSocketDomainService.unregisterCode(this.TR_ID, trKey);
  }

  private async checkExecutableOrder(stockCode: string, value) {
    const buyOrders = await this.stockExecuteOrderRepository.find({
      where: {
        stock_code: stockCode,
        trade_type: TradeType.BUY,
        status: StatusType.PENDING,
        price: MoreThanOrEqual(value),
      },
    });

    const sellOrders = await this.stockExecuteOrderRepository.find({
      where: {
        stock_code: stockCode,
        trade_type: TradeType.SELL,
        status: StatusType.PENDING,
        price: LessThanOrEqual(value),
      },
    });

    await Promise.all(buyOrders.map((buyOrder) => this.executeBuy(buyOrder)));
    await Promise.all(
      sellOrders.map((sellOrder) => this.executeSell(sellOrder)),
    );

    if (
      buyOrders.length + sellOrders.length > 0 &&
      !(await this.stockExecuteOrderRepository.existsBy({
        stock_code: stockCode,
        status: StatusType.PENDING,
      }))
    )
      this.unsubscribeByCode(stockCode);
  }

  private async executeBuy(order) {
    this.logger.log(`${order.id}번 매수 예약이 체결되었습니다.`, 'BUY');

    const totalPrice = order.price * order.amount;
    const fee = this.calculateFee(totalPrice);
    await this.stockExecuteOrderRepository.updateOrderAndAssetAndUserStockWhenBuy(
      order,
      totalPrice + fee,
    );
  }

  private async executeSell(order) {
    this.logger.log(`${order.id}번 매도 예약이 체결되었습니다.`, 'SELL');

    const totalPrice = order.price * order.amount;
    const fee = this.calculateFee(totalPrice);
    await this.stockExecuteOrderRepository.updateOrderAndAssetAndUserStockWhenSell(
      order,
      totalPrice - fee,
    );
  }

  private calculateFee(totalPrice: number) {
    if (totalPrice <= 10000000) return Math.floor(totalPrice * 0.16);
    if (totalPrice > 10000000 && totalPrice <= 50000000)
      return Math.floor(totalPrice * 0.14);
    if (totalPrice > 50000000 && totalPrice <= 100000000)
      return Math.floor(totalPrice * 0.12);
    if (totalPrice > 100000000 && totalPrice <= 300000000)
      return Math.floor(totalPrice * 0.1);
    return Math.floor(totalPrice * 0.08);
  }
}
