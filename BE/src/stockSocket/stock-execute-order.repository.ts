import { DataSource, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { Order } from '../stock/order/stock-order.entity';
import { StatusType } from '../stock/order/enum/status-type';
import { Asset } from '../asset/asset.entity';
import { UserStock } from '../asset/user-stock.entity';

export class StockExecuteOrderRepository extends Repository<Order> {
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super(Order, dataSource.createEntityManager());
  }

  async findAllCodeByStatus() {
    return this.createQueryBuilder('orders')
      .select('DISTINCT orders.stock_code')
      .where({ status: StatusType.PENDING })
      .getRawMany();
  }

  async updateOrderAndAssetAndUserStockWhenBuy(order, realPrice) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
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

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(err);
    } finally {
      await queryRunner.release();
    }
  }

  async updateOrderAndAssetAndUserStockWhenSell(order, realPrice) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
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

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }
}