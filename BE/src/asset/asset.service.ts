import { Injectable } from '@nestjs/common';
import { UserStockRepository } from './user-stock.repository';
import { AssetRepository } from './asset.repository';

@Injectable()
export class AssetService {
  constructor(
    private readonly userStockRepository: UserStockRepository,
    private readonly assetRepository: AssetRepository,
  ) {}

  async getUserStockByCode(userId: number, stockCode: string) {
    const userStock = await this.userStockRepository.findOneBy({
      user_id: userId,
      stock_code: stockCode,
    });

    return { quantity: userStock ? userStock.quantity : 0 };
  }

  async getCashBalance(userId: number) {
    const asset = await this.assetRepository.findOneBy({ user_id: userId });

    return { cash_balance: asset ? asset.cash_balance : 0 };
  }
}
