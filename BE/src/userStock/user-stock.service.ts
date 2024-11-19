import { Injectable } from '@nestjs/common';
import { UserStockRepository } from './user-stock.repository';

@Injectable()
export class UserStockService {
  constructor(private readonly userStockRepository: UserStockRepository) {}

  async getUserStockByCode(userId: number, stockCode: string) {
    const userStock = await this.userStockRepository.findOneBy({
      user_id: userId,
      stock_code: stockCode,
    });

    return { quantity: userStock ? userStock.quantity : 0 };
  }
}
