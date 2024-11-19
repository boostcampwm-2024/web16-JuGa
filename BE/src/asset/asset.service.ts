import { Injectable } from '@nestjs/common';
import { UserStockRepository } from './user-stock.repository';
import { AssetRepository } from './asset.repository';
import { MypageResponseDto } from './dto/mypage-response.dto';
import { StockElementResponseDto } from './dto/stock-element-response.dto';
import { AssetResponseDto } from './dto/asset-response.dto';

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

    return { cash_balance: asset.cash_balance };
  }

  async getMyPage(userId: number) {
    const userStocks =
      await this.userStockRepository.findUserStockWithNameByUserId(userId);
    const asset = await this.assetRepository.findOneBy({ user_id: userId });

    const myStocks = userStocks.map((userStock) => {
      return new StockElementResponseDto(
        userStock.stocks_name,
        userStock.stocks_code,
        userStock.user_stocks_quantity,
        userStock.user_stocks_avg_price,
      );
    });

    const myAsset = new AssetResponseDto(
      asset.cash_balance,
      asset.stock_balance,
      asset.total_asset,
      asset.total_profit,
      asset.total_profit_rate,
    );

    const response = new MypageResponseDto();
    response.asset = myAsset;
    response.stocks = myStocks;

    return response;
  }
}
