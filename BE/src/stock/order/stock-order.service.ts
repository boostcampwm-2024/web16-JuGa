import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { NotFoundError } from 'rxjs';
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { StockOrderRequestDto } from './dto/stock-order-request.dto';
import { StockOrderRepository } from './stock-order.repository';
import { TradeType } from './enum/trade-type';
import { StatusType } from './enum/status-type';
import { StockOrderSocketService } from './stock-order-socket.service';

@Injectable()
export class StockOrderService {
  constructor(
    private readonly stockOrderRepository: StockOrderRepository,
    private readonly stockOrderSocketService: StockOrderSocketService,
  ) {}

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
    this.stockOrderSocketService.subscribeByCode(stockOrderRequest.stock_code);
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
    this.stockOrderSocketService.subscribeByCode(stockOrderRequest.stock_code);
  }

  async cancel(userId: number, orderId: number) {
    const order = await this.stockOrderRepository.findOneBy({ id: orderId });

    if (!order) throw new NotFoundError('주문을 찾을 수 없습니다.');

    if (order.user_id !== userId)
      throw new ForbiddenException('다른 사용자의 주문은 취소할 수 없습니다.');

    if (order.status === StatusType.COMPLETE)
      throw new ConflictException('이미 체결된 주문은 취소할 수 없습니다.');

    await this.stockOrderRepository.remove(order);

    if (
      !(await this.stockOrderRepository.existsBy({
        stock_code: order.stock_code,
        status: StatusType.PENDING,
      }))
    )
      this.stockOrderSocketService.unsubscribeByCode(order.stock_code);
  }
}
