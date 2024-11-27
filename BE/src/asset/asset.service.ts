import { Injectable } from '@nestjs/common';
import { MoreThan } from 'typeorm';
import { UserStockRepository } from './user-stock.repository';
import { AssetRepository } from './asset.repository';
import { MypageResponseDto } from './dto/mypage-response.dto';
import { StockElementResponseDto } from './dto/stock-element-response.dto';
import { AssetResponseDto } from './dto/asset-response.dto';
import { StockDetailService } from '../stock/detail/stock-detail.service';
import { UserStock } from './user-stock.entity';
import { Asset } from './asset.entity';
import { InquirePriceResponseDto } from '../stock/detail/dto/stock-detail-response.dto';
import { TradeType } from '../stock/order/enum/trade-type';
import { StockPriceSocketService } from '../stockSocket/stock-price-socket.service';

@Injectable()
export class AssetService {
  constructor(
    private readonly userStockRepository: UserStockRepository,
    private readonly assetRepository: AssetRepository,
    private readonly stockDetailService: StockDetailService,
    private readonly stockPriceSocketService: StockPriceSocketService,
  ) {}

  async getUserStockByCode(userId: number, stockCode: string) {
    const userStock = await this.userStockRepository.findOneBy({
      user_id: userId,
      stock_code: stockCode,
    });
    const pendingOrders = await this.assetRepository.findAllPendingOrders(
      userId,
      TradeType.SELL,
    );
    const totalPendingCount = pendingOrders.reduce(
      (sum, pendingOrder) => sum + pendingOrder.amount,
      0,
    );

    return {
      quantity: userStock ? userStock.quantity - totalPendingCount : 0,
      avg_price: userStock ? userStock.avg_price : 0,
    };
  }

  async getCashBalance(userId: number) {
    const asset = await this.assetRepository.findOneBy({ user_id: userId });
    const pendingOrders = await this.assetRepository.findAllPendingOrders(
      userId,
      TradeType.BUY,
    );
    const totalPendingPrice = pendingOrders.reduce(
      (sum, pendingOrder) => sum + pendingOrder.price * pendingOrder.amount,
      0,
    );

    return { cash_balance: asset.cash_balance - totalPendingPrice };
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
      newAsset.total_profit_rate.toFixed(2),
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
      where: { user_id: userId, quantity: MoreThan(0) },
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
      this.stockPriceSocketService.subscribeByCode(userStock.stock_code),
    );
  }

  async unsubscribeMyStocks(userId: number) {
    const userStocks: UserStock[] =
      await this.userStockRepository.findAllDistinctCode(userId);

    userStocks.map((userStock) =>
      this.stockPriceSocketService.unsubscribeByCode(userStock.stock_code),
    );
  }
}
