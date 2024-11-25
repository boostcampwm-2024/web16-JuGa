import { Injectable } from '@nestjs/common';
import { UserStockRepository } from './user-stock.repository';
import { AssetRepository } from './asset.repository';
import { MypageResponseDto } from './dto/mypage-response.dto';
import { StockElementResponseDto } from './dto/stock-element-response.dto';
import { AssetResponseDto } from './dto/asset-response.dto';
import { StockDetailService } from '../stock/detail/stock-detail.service';
import { UserStock } from './user-stock.entity';
import { Asset } from './asset.entity';
import { InquirePriceResponseDto } from '../stock/detail/dto/stock-detail-response.dto';
import { StockTradeHistorySocketService } from '../stock/trade/history/stock-trade-history-socket.service';

@Injectable()
export class AssetService {
  constructor(
    private readonly userStockRepository: UserStockRepository,
    private readonly assetRepository: AssetRepository,
    private readonly stockDetailService: StockDetailService,
    private readonly stockTradeHistorySocketService: StockTradeHistorySocketService,
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
    const currPrices = await this.getCurrPrices(userId);
    const newAsset = await this.updateMyAsset(asset, currPrices);

    const myStocks = userStocks.map((userStock) => {
      const currPrice: InquirePriceResponseDto =
        currPrices[userStock.stocks_code];
      return new StockElementResponseDto(
        userStock.stocks_name,
        userStock.stocks_code,
        userStock.user_stocks_quantity,
        Number(userStock.user_stocks_avg_price),
        currPrice.stck_prpr,
        currPrice.prdy_vrss,
        currPrice.prdy_vrss_sign,
        currPrice.prdy_ctrt,
      );
    });

    const myAsset = new AssetResponseDto(
      newAsset.cash_balance,
      newAsset.stock_balance,
      newAsset.total_asset,
      newAsset.total_profit,
      newAsset.total_profit_rate,
      newAsset.total_profit_rate >= 0,
    );

    const response = new MypageResponseDto();
    response.asset = myAsset;
    response.stocks = myStocks;

    await this.subscribeMyStocks(userId);

    return response;
  }

  async updateAllAssets() {
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
        sum +
        userStock.quantity * Number(currPrices[userStock.stock_code].stck_prpr),
      0,
    );

    const updatedAsset = {
      ...asset,
      stock_balance: totalPrice,
      total_asset: asset.cash_balance + totalPrice,
      total_profit: asset.cash_balance + totalPrice - 10000000,
      total_profit_rate: (asset.cash_balance + totalPrice - 10000000) / 100000,
      last_updated: new Date(),
      prev_total_asset: asset.total_asset,
    };
    return this.assetRepository.save(updatedAsset);
  }

  private async getCurrPrices(userId?: number) {
    const userStocks: UserStock[] =
      await this.userStockRepository.findAllDistinctCode(userId);
    const currPrices = {};

    await Promise.allSettled(
      userStocks.map(async (userStock) => {
        currPrices[userStock.stock_code] =
          await this.stockDetailService.getInquirePrice(userStock.stock_code);
      }),
    );

    return currPrices;
  }

  private async subscribeMyStocks(userId: number) {
    const userStocks: UserStock[] =
      await this.userStockRepository.findAllDistinctCode(userId);

    userStocks.map((userStock) =>
      this.stockTradeHistorySocketService.subscribeByCode(userStock.stock_code),
    );
  }

  async unsubscribeMyStocks(userId: number) {
    const userStocks: UserStock[] =
      await this.userStockRepository.findAllDistinctCode(userId);

    userStocks.map((userStock) =>
      this.stockTradeHistorySocketService.unsubscribeByCode(
        userStock.stock_code,
      ),
    );
  }
}
