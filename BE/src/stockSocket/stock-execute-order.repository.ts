import {
  DataSource,
  LessThanOrEqual,
  MoreThanOrEqual,
  QueryRunner,
  Repository,
} from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { Order } from '../stock/order/stock-order.entity';
import { StatusType } from '../stock/order/enum/status-type';
import { Asset } from '../asset/asset.entity';
import { UserStock } from '../asset/user-stock.entity';
import { TradeType } from '../stock/order/enum/trade-type';

export class StockExecuteOrderRepository extends Repository<Order> {
  private readonly logger = new Logger();

  constructor(@InjectDataSource() private dataSource: DataSource) {
    super(Order, dataSource.createEntityManager());
  }

  async findAllCodeByStatus() {
    return this.createQueryBuilder('orders')
      .select('DISTINCT orders.stock_code')
      .where({ status: StatusType.PENDING })
      .getRawMany();
  }

  async checkExecutableOrder(stockCode, value) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      const buyOrders = await queryRunner.manager.find(Order, {
        where: {
          stock_code: stockCode,
          trade_type: TradeType.BUY,
          status: StatusType.PENDING,
          price: MoreThanOrEqual(value),
        },
      });

      const sellOrders = await queryRunner.manager.find(Order, {
        where: {
          stock_code: stockCode,
          trade_type: TradeType.SELL,
          status: StatusType.PENDING,
          price: LessThanOrEqual(value),
        },
      });

      await Promise.all(
        buyOrders.map((buyOrder) => this.executeBuy(queryRunner, buyOrder)),
      );
      await Promise.all(
        sellOrders.map((sellOrder) => this.executeSell(queryRunner, sellOrder)),
      );

      await queryRunner.commitTransaction();
      return buyOrders.length + sellOrders.length;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(err);
    } finally {
      await queryRunner.release();
    }
  }

  private async executeBuy(queryRunner: QueryRunner, order) {
    this.logger.log(`${order.id}번 매수 예약이 체결되었습니다.`, 'BUY');

    const totalPrice = order.price * order.amount;
    const fee = this.calculateFee(totalPrice);
    await this.updateOrderAndAssetAndUserStockWhenBuy(
      queryRunner,
      order,
      totalPrice + fee,
    );
  }

  private async executeSell(queryRunner: QueryRunner, order) {
    this.logger.log(`${order.id}번 매도 예약이 체결되었습니다.`, 'SELL');

    const totalPrice = order.price * order.amount;
    const fee = this.calculateFee(totalPrice);
    await this.updateOrderAndAssetAndUserStockWhenSell(
      queryRunner,
      order,
      totalPrice - fee,
    );
  }

  private async updateOrderAndAssetAndUserStockWhenBuy(
    queryRunner: QueryRunner,
    order,
    realPrice,
  ) {
    await queryRunner.manager.update(
      Order,
      { id: order.id },
      { status: StatusType.COMPLETE, completed_at: new Date() },
    );
    await queryRunner.manager
      .createQueryBuilder()
      .update(Asset)
      .set({
        cash_balance: () => `cash_balance - :realPrice`,
        last_updated: new Date(),
      })
      .where({ user_id: order.user_id })
      .setParameters({ realPrice })
      .execute();

    await queryRunner.query(
      `INSERT INTO user_stocks (user_id, stock_code, quantity, avg_price, last_updated) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE avg_price = (avg_price * quantity + ? * ?) / (quantity + ?), quantity = quantity + ?`,
      [
        order.user_id,
        order.stock_code,
        order.amount,
        order.price,
        new Date(),
        order.price,
        order.amount,
        order.amount,
        order.amount,
      ],
    );
  }

  private async updateOrderAndAssetAndUserStockWhenSell(
    queryRunner: QueryRunner,
    order,
    realPrice,
  ) {
    await queryRunner.manager.update(
      Order,
      { id: order.id },
      { status: StatusType.COMPLETE, completed_at: new Date() },
    );
    await queryRunner.manager
      .createQueryBuilder()
      .update(Asset)
      .set({
        cash_balance: () => `cash_balance + :realPrice`,
        last_updated: new Date(),
      })
      .where({ user_id: order.user_id })
      .setParameters({ realPrice })
      .execute();

    await queryRunner.manager
      .createQueryBuilder()
      .update(UserStock)
      .set({
        quantity: () => `quantity - :newQuantity`,
      })
      .where({ user_id: order.user_id, stock_code: order.stock_code })
      .setParameters({ newQuantity: order.amount })
      .execute();
  }

  private calculateFee(totalPrice: number) {
    if (totalPrice <= 10000000) return Math.floor(totalPrice * 0.0016);
    if (totalPrice > 10000000 && totalPrice <= 50000000)
      return Math.floor(totalPrice * 0.0014);
    if (totalPrice > 50000000 && totalPrice <= 100000000)
      return Math.floor(totalPrice * 0.0012);
    if (totalPrice > 100000000 && totalPrice <= 300000000)
      return Math.floor(totalPrice * 0.001);
    return Math.floor(totalPrice * 0.0008);
  }
}
