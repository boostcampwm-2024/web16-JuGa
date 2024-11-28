import { DataSource, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Order } from './stock-order.entity';
import { StatusType } from './enum/status-type';
import { StockOrderRawInterface } from './interface/stock-order-raw.interface';

@Injectable()
export class StockOrderRepository extends Repository<Order> {
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super(Order, dataSource.createEntityManager());
  }

  async findAllCodeByStatus() {
    return this.createQueryBuilder('orders')
      .select('DISTINCT orders.stock_code')
      .where({ status: StatusType.PENDING })
      .getRawMany();
  }

  async findAllPendingOrdersByUserId(userId: number) {
    return this.createQueryBuilder('o')
      .leftJoinAndSelect('stocks', 's', 's.code = o.stock_code')
      .where({ user_id: userId, status: StatusType.PENDING })
      .getRawMany<StockOrderRawInterface>();
  }
}
