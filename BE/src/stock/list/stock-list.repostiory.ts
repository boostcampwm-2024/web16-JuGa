import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Stocks } from './stock-list.entity';
import { SearchParams } from './interface/search-params.interface';

@Injectable()
export class StockListRepository extends Repository<Stocks> {
  constructor(@InjectDataSource() dataSource: DataSource) {
    super(Stocks, dataSource.createEntityManager());
  }

  async findAllStocks() {
    return this.find();
  }

  async findOneStock(code: string): Promise<Stocks> {
    return this.findOne({ where: { code } });
  }

  async search(params: SearchParams): Promise<Stocks[]> {
    const queryBuilder = this.createQueryBuilder();
    if (params.name) {
      queryBuilder.where('name LIKE :name', { name: `%${params.name}%` });
    }
    if (params.market) {
      queryBuilder.andWhere('market LIKE :market', {
        market: `%${params.market}%`,
      });
    }
    if (params.code) {
      queryBuilder.andWhere('code LIKE :code', { code: `%${params.code}%` });
    }
    return queryBuilder.getMany();
  }
}
