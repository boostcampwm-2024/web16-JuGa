import { Injectable } from '@nestjs/common';
import { UserStockRepository } from './user-stock.repository';
import { AssetRepository } from './asset.repository';
import { MypageResponseDto } from './dto/mypage-response.dto';
import { StockElementResponseDto } from './dto/stock-element-response.dto';
import { AssetResponseDto } from './dto/asset-response.dto';
import { StockDetailService } from '../stock/detail/stock-detail.service';
import { UserStock } from './user-stock.entity';
import { Asset } from './asset.entity';

@Injectable()
export class AssetService {
  constructor(
    private readonly userStockRepository: UserStockRepository,
    private readonly assetRepository: AssetRepository,
    private readonly stockDetailService: StockDetailService,
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
    const newAsset = await this.updateMyAsset(
      asset,
      await this.getCurrPrices(),
    );

    const myStocks = userStocks.map((userStock) => {
      return new StockElementResponseDto(
        userStock.stocks_name,
        userStock.stocks_code,
        userStock.user_stocks_quantity,
        userStock.user_stocks_avg_price,
      );
    });

    const myAsset = new AssetResponseDto(
      newAsset.cash_balance,
      newAsset.stock_balance,
      newAsset.total_asset,
      newAsset.total_profit,
      newAsset.total_profit_rate,
    );

    const response = new MypageResponseDto();
    response.asset = myAsset;
    response.stocks = myStocks;

    return response;
  }

  async updateStockBalance() {
    const currPrices = await this.getCurrPrices();
    const assets = await this.assetRepository.find();

    await Promise.allSettled(
      assets.map((asset) => this.updateMyAsset(asset, currPrices)),
    );
  }

  private async updateMyAsset(asset: Asset, currPrices) {
    const userId = asset.user_id;
    const userStocks = await this.userStockRepository.find({
      where: { user_id: userId },
    });

    const totalPrice = userStocks.reduce(
      (sum, userStock) =>
        sum + userStock.quantity * currPrices[userStock.stock_code],
      0,
    );

    const updatedAsset = {
      ...asset,
      stock_balance: totalPrice,
      total_asset: asset.cash_balance + totalPrice,
      last_updated: new Date(),
      prev_total_asset: asset.total_asset,
    };
    return this.assetRepository.save(updatedAsset);
  }

  private async getCurrPrices() {
    const userStocks: UserStock[] =
      await this.userStockRepository.findAllDistinctCode();
    const currPrices = {};

    await Promise.allSettled(
      userStocks.map(async (userStock) => {
        const inquirePrice = await this.stockDetailService.getInquirePrice(
          userStock.stock_code,
        );
        currPrices[userStock.stock_code] = Number(inquirePrice.stck_prpr);
      }),
    );

    return currPrices;
  }
}
