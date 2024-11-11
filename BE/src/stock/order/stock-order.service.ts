import { Injectable } from '@nestjs/common';
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
      stock_id: stockOrderRequest.stock_id,
      trade_type: TradeType.BUY,
      amount: stockOrderRequest.amount,
      price: stockOrderRequest.price,
      status: StatusType.PENDING,
    });

    await this.stockOrderRepository.save(order);
  }
}
