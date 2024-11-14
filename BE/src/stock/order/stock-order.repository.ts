import { DataSource, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Order } from './stock-order.entity';
import { StatusType } from './enum/status-type';
import { Asset } from '../../asset/asset.entity';

@Injectable()
export class StockOrderRepository extends Repository<Order> {
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super(Order, dataSource.createEntityManager());
  }

  async findAllCodeByStatus() {
    return this.createQueryBuilder('orders')
      .select('DISTINCT orders.stock_code')
      .getRawMany();
  }

  async updateOrderAndAssetWhenBuy(order, realPrice) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.update(
        Order,
        { id: order.id },
        { status: StatusType.COMPLETE, completed_at: new Date() },
      );
      // TODO: stock_balance와 total_asset은 실시간 주가에 따라 변동하도록 따로 구현해야 함
      await queryRunner.manager
        .createQueryBuilder()
        .update(Asset)
        .set({
          cash_balance: () => 'cash_balance - :realPrice',
          total_asset: () => 'total_asset - :realPrice',
          total_profit: () => 'total_profit - :realPrice',
          total_profit_rate: () => `total_profit / 10000000`,
          last_updated: new Date(),
        })
        .where({ user_id: order.user_id })
        .setParameter('realPrice', realPrice)
        .execute();

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }

  async updateOrderAndAssetWhenSell(order, realPrice) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.update(
        Order,
        { id: order.id },
        { status: StatusType.COMPLETE, completed_at: new Date() },
      );
      // TODO: stock_balance와 total_asset은 실시간 주가에 따라 변동하도록 따로 구현해야 함
      await queryRunner.manager
        .createQueryBuilder()
        .update(Asset)
        .set({
          cash_balance: () => 'cash_balance + :realPrice',
          total_asset: () => 'total_asset + :realPrice',
          total_profit: () => 'total_profit + :realPrice',
          total_profit_rate: () => `total_profit / 10000000`,
          last_updated: new Date(),
        })
        .where({ user_id: order.user_id })
        .setParameter('realPrice', realPrice)
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