import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserStock } from './user-stock.entity';

@Injectable()
export class UserStockRepository extends Repository<UserStock> {
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super(UserStock, dataSource.createEntityManager());
  }
}
