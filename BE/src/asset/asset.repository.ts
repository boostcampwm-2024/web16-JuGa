import { DataSource, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Asset } from './asset.entity';
import { Order } from '../stock/order/stock-order.entity';
import { StatusType } from '../stock/order/enum/status-type';
import { TradeType } from '../stock/order/enum/trade-type';

@Injectable()
export class AssetRepository extends Repository<Asset> {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    super(Asset, dataSource.createEntityManager());
  }

  async getAssets() {
    return this.createQueryBuilder('asset')
      .leftJoin('user', 'user', 'asset.user_id = user.id')
      .select(['asset.* ', 'user.nickname as nickname'])
      .getRawMany();
  }

  async findAllPendingOrders(userId: number, tradeType: TradeType) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const orders = await queryRunner.manager.find<Order>(Order, {
        where: {
          user_id: userId,
          status: StatusType.PENDING,
          trade_type: tradeType,
        },
      });

      await queryRunner.commitTransaction();
      return orders;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
