import { InjectDataSource } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Stocks } from './stock-detail.entity';

@Injectable()
export class StockDetailRepository extends Repository<Stocks> {
  constructor(@InjectDataSource() dataSource: DataSource) {
    super(Stocks, dataSource.createEntityManager());
  }

  async findOneByCode(code: string) {
    return this.findOne({ where: { code } });
  }
}
