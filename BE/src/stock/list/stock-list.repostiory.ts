import { Injectable } from '@nestjs/common';
import { Stock } from './stock-list.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class StockListRepository extends Repository<Stock> {
  constructor(@InjectDataSource() dataSource: DataSource) {
    super(Stock, dataSource.createEntityManager());
  }
}
