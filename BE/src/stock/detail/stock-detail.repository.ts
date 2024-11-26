import { InjectDataSource } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Stocks } from './stock-detail.entity';
import { Bookmark } from '../bookmark/stock-bookmark.entity';

@Injectable()
export class StockDetailRepository extends Repository<Stocks> {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    super(Stocks, dataSource.createEntityManager());
  }

  async findOneByCode(code: string) {
    return this.findOne({ where: { code } });
  }

  async existsBookmarkByUserIdAndStockCode(userId: number, stockCode: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    return queryRunner.manager.existsBy(Bookmark, {
      user_id: userId,
      stock_code: stockCode,
    });
  }
}
