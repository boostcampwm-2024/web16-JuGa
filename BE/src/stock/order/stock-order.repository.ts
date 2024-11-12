import { DataSource, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Order } from './stock-order.entity';

@Injectable()
export class StockOrderRepository extends Repository<Order> {
  constructor(@InjectDataSource() dataSource: DataSource) {
    super(Order, dataSource.createEntityManager());
  }
}
