import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, MoreThan, Repository } from 'typeorm';
import { UserStock } from './user-stock.entity';
import { UserStockInterface } from './interface/user-stock.interface';

@Injectable()
export class UserStockRepository extends Repository<UserStock> {
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super(UserStock, dataSource.createEntityManager());
  }

  findUserStockWithNameByUserId(userId: number) {
    return this.createQueryBuilder('user_stocks')
      .leftJoinAndSelect(
        'stocks',
        'stocks',
        'stocks.code = user_stocks.stock_code',
      )
      .where('user_stocks.user_id = :userId AND user_stocks.quantity > 0', {
        userId,
      })
      .getRawMany<UserStockInterface>();
  }

  findAllDistinctCode(userId?: number) {
    const queryBuilder = this.createQueryBuilder('user_stocks')
      .select('DISTINCT user_stocks.stock_code')
      .where({ quantity: MoreThan(0) });

    if (userId) queryBuilder.andWhere({ user_id: userId });

    return queryBuilder.getRawMany();
  }
}
