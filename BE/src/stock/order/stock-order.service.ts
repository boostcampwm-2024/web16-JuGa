import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { NotFoundError } from 'rxjs';
import { StockOrderRequestDto } from './dto/stock-order-request.dto';
import { StockOrderRepository } from './stock-order.repository';
import { TradeType } from './enum/trade-type';
import { StatusType } from './enum/status-type';
import { UserStockRepository } from '../../asset/user-stock.repository';
import { AssetRepository } from '../../asset/asset.repository';
import { StockOrderElementResponseDto } from './dto/stock-order-element-response.dto';
import { Order } from './stock-order.entity';
import { StockPriceSocketService } from '../../stockSocket/stock-price-socket.service';

@Injectable()
export class StockOrderService {
  constructor(
    private readonly stockOrderRepository: StockOrderRepository,
    private readonly stockPriceSocketService: StockPriceSocketService,
    private readonly userStockRepository: UserStockRepository,
    private readonly assetRepository: AssetRepository,
  ) {}

  async buy(userId: number, stockOrderRequest: StockOrderRequestDto) {
    const asset = await this.assetRepository.findOneBy({ user_id: userId });
    const pendingOrders = await this.stockOrderRepository.findBy({
      user_id: userId,
      status: StatusType.PENDING,
      trade_type: TradeType.BUY,
      stock_code: stockOrderRequest.stock_code,
    });
    const totalPendingPrice = pendingOrders.reduce(
      (sum, pendingOrder) => sum + pendingOrder.price * pendingOrder.amount,
      0,
    );

    if (
      asset &&
      asset.cash_balance <
        stockOrderRequest.amount * stockOrderRequest.price + totalPendingPrice
    )
      throw new BadRequestException('가용 자산이 충분하지 않습니다.');

    const order = this.stockOrderRepository.create({
      user_id: userId,
      stock_code: stockOrderRequest.stock_code,
      trade_type: TradeType.BUY,
      amount: stockOrderRequest.amount,
      price: stockOrderRequest.price,
      status: StatusType.PENDING,
    });

    await this.stockOrderRepository.save(order);
    await this.stockPriceSocketService.subscribeByCode(
      stockOrderRequest.stock_code,
    );
  }

  async sell(userId: number, stockOrderRequest: StockOrderRequestDto) {
    const userStock = await this.userStockRepository.findOneBy({
      user_id: userId,
      stock_code: stockOrderRequest.stock_code,
    });
    const pendingOrders = await this.stockOrderRepository.findBy({
      user_id: userId,
      status: StatusType.PENDING,
      trade_type: TradeType.SELL,
      stock_code: stockOrderRequest.stock_code,
    });
    const totalPendingCount = pendingOrders.reduce(
      (sum, pendingOrder) => sum + pendingOrder.amount,
      0,
    );

    if (
      !userStock ||
      userStock.quantity < stockOrderRequest.amount + totalPendingCount
    )
      throw new BadRequestException('주식을 매도 수만큼 가지고 있지 않습니다.');

    const order = this.stockOrderRepository.create({
      user_id: userId,
      stock_code: stockOrderRequest.stock_code,
      trade_type: TradeType.SELL,
      amount: stockOrderRequest.amount,
      price: stockOrderRequest.price,
      status: StatusType.PENDING,
    });

    await this.stockOrderRepository.save(order);
    await this.stockPriceSocketService.subscribeByCode(
      stockOrderRequest.stock_code,
    );
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
      await this.stockPriceSocketService.unsubscribeByCode([order.stock_code]);
  }

  async getPendingListByUserId(userId: number) {
    const stockOrderRaws =
      await this.stockOrderRepository.findAllPendingOrdersByUserId(userId);

    return stockOrderRaws.map((stockOrderRaw) => {
      return new StockOrderElementResponseDto(
        stockOrderRaw.o_id,
        stockOrderRaw.o_stock_code,
        stockOrderRaw.s_name,
        stockOrderRaw.o_amount,
        stockOrderRaw.o_price,
        stockOrderRaw.o_trade_type,
        stockOrderRaw.o_created_at,
      );
    });
  }

  async removePendingOrders() {
    const orders: Order[] =
      await this.stockOrderRepository.findAllCodeByStatus();

    await this.stockPriceSocketService.unsubscribeByCode(
      orders.map((order) => order.stock_code),
    );

    await this.stockOrderRepository.delete({ status: StatusType.PENDING });
  }
}
