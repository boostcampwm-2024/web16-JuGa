import { Injectable } from '@nestjs/common';
import { StockItemRepository } from './stock-item.repository';

@Injectable()
export class StockItemService {
  constructor(private readonly stockItemRepository: StockItemRepository) {}

  getAllStockItems() {
    return this.stockItemRepository.find({
      select: ['code'],
    });
  }
}
