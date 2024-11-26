import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { BaseSocketDomainService } from '../../common/websocket/base-socket.domain-service';
import { SocketGateway } from '../../common/websocket/socket.gateway';
import { Order } from './stock-order.entity';
import { TradeType } from './enum/trade-type';
import { StatusType } from './enum/status-type';
import { StockOrderRepository } from './stock-order.repository';

@Injectable()
export class StockOrderSocketService {
  private TR_ID = 'H0STCNT0';

  private readonly logger = new Logger();

  constructor(
    private readonly socketGateway: SocketGateway,
    private readonly baseSocketDomainService: BaseSocketDomainService,
    private readonly stockOrderRepository: StockOrderRepository,
  ) {
    baseSocketDomainService.registerSocketOpenHandler(async () => {
      const orders: Order[] =
        await this.stockOrderRepository.findAllCodeByStatus();
      orders.forEach((order) => {
        baseSocketDomainService.registerCode(this.TR_ID, order.stock_code);
      });
    });

    baseSocketDomainService.registerSocketDataHandler(
      this.TR_ID,
      (data: string[]) => {
        this.checkExecutableOrder(
          data[0], // 주식 코드
          data[2], // 주식 체결가
        ).catch((err) => {
          throw new InternalServerErrorException(err);
        });
      },
    );
  }

  subscribeByCode(trKey: string) {
    this.baseSocketDomainService.registerCode(this.TR_ID, trKey);
  }

  unsubscribeByCode(trKey: string) {
    this.baseSocketDomainService.unregisterCode(this.TR_ID, trKey);
  }

  private async checkExecutableOrder(stockCode: string, value) {
    const buyOrders = await this.stockOrderRepository.find({
      where: {
        stock_code: stockCode,
        trade_type: TradeType.BUY,
        status: StatusType.PENDING,
        price: MoreThanOrEqual(value),
      },
    });

    const sellOrders = await this.stockOrderRepository.find({
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
      !(await this.stockOrderRepository.existsBy({
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
    await this.stockOrderRepository.updateOrderAndAssetAndUserStockWhenBuy(
      order,
      totalPrice + fee,
    );
  }

  private async executeSell(order) {
    this.logger.log(`${order.id}번 매도 예약이 체결되었습니다.`, 'SELL');

    const totalPrice = order.price * order.amount;
    const fee = this.calculateFee(totalPrice);
    await this.stockOrderRepository.updateOrderAndAssetAndUserStockWhenSell(
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
