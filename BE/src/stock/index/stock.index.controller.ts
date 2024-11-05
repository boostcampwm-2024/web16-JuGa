import { Controller, Get } from '@nestjs/common';
import { Cron, Interval } from '@nestjs/schedule';
import { StockIndexService } from './stock.index.service';
import { StockGateway } from '../../websocket/stock.gateway';

@Controller('/api/stock/index')
export class StockIndexController {
  constructor(
    private readonly stockIndexService: StockIndexService,
    private readonly stockGateway: StockGateway,
  ) {}

  @Cron('*/5 9-16 * * 1-5')
  async cronStockIndexLists() {
    const stockLists = await Promise.all([
      this.stockIndexService.getDomesticStockIndexListByCode('0001'), // 코스피
      this.stockIndexService.getDomesticStockIndexListByCode('1001'), // 코스닥
    ]);

    this.stockGateway.sendStockIndexListToClient(stockLists);
  }
}
