import { DataSource, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Stock } from './stock-item.entity';

@Injectable()
export class StockItemRepository extends Repository<Stock> {
  constructor(@InjectDataSource() dataSource: DataSource) {
    super(Stock, dataSource.createEntityManager());
  }
}
