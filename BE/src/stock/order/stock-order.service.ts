import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { NotFoundError } from 'rxjs';
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { StockOrderRequestDto } from './dto/stock-order-request.dto';
import { StockOrderRepository } from './stock-order.repository';
import { TradeType } from './enum/trade-type';
import { StatusType } from './enum/status-type';

@Injectable()
export class StockOrderService {
  constructor(private readonly stockOrderRepository: StockOrderRepository) {}

  async buy(userId: number, stockOrderRequest: StockOrderRequestDto) {
    const order = this.stockOrderRepository.create({
      user_id: userId,
      stock_code: stockOrderRequest.stock_code,
      trade_type: TradeType.BUY,
      amount: stockOrderRequest.amount,
      price: stockOrderRequest.price,
      status: StatusType.PENDING,
    });

    await this.stockOrderRepository.save(order);
  }

  async sell(userId: number, stockOrderRequest: StockOrderRequestDto) {
    const order = this.stockOrderRepository.create({
      user_id: userId,
      stock_code: stockOrderRequest.stock_code,
      trade_type: TradeType.SELL,
      amount: stockOrderRequest.amount,
      price: stockOrderRequest.price,
      status: StatusType.PENDING,
    });

    await this.stockOrderRepository.save(order);
  }

  async cancel(userId: number, orderId: number) {
    const order = await this.stockOrderRepository.findOneBy({ id: orderId });

    if (!order) throw new NotFoundError('주문을 찾을 수 없습니다.');

    if (order.user_id !== userId)
      throw new ForbiddenException('다른 사용자의 주문은 취소할 수 없습니다.');

    if (order.status === StatusType.COMPLETE)
      throw new ConflictException('이미 체결된 주문은 취소할 수 없습니다.');

    await this.stockOrderRepository.remove(order);
  }

  async checkExecutableOrder(stockCode, value) {
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
  }

  private executeBuy(order) {
    // TODO: 매수 체결 로직 필요...
    console.log(`${order.id}번 매수 예약이 체결되었습니다.`);
  }

  private executeSell(order) {
    // TODO: 매도 체결 로직 필요...
    console.log(`${order.id}번 매도 예약이 체결되었습니다.`);
  }
}
