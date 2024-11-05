import { Controller, Get } from '@nestjs/common';
import { Cron, Interval } from '@nestjs/schedule';
import { StockIndexService } from './stock.index.service';
import { StockGateway } from '../../websocket/stock.gateway';
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import {StockIndexResponseDto} from "./dto/stock.index.response.dto";

@Controller('/api/stock/index')
@ApiTags('주가 지수 API')
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

  @Interval(5000)
  async cronStockIndexValue() {
    const stockValueList = await Promise.all([
      this.stockIndexService.getDomesticStockIndexValueByCode('0001'), // 코스피
      this.stockIndexService.getDomesticStockIndexValueByCode('1001'), // 코스닥
    ]);

    this.stockGateway.sendStockIndexValueToClient(stockValueList);
  }

  @Get()
  @ApiOperation({ summary: '주가 지수 차트 정보, 현재 값 조회 API', description: '주가 지수 차트 정보와 현재 값을 리스트로 반환한다.'})
  @ApiResponse({
    status: 200,
    description: '주가 지수 조회 성공',
    type: StockIndexResponseDto,
  })
  async getStockIndex() {
    const stockLists = await Promise.all([
      this.stockIndexService.getDomesticStockIndexListByCode('0001'), // 코스피
      this.stockIndexService.getDomesticStockIndexListByCode('1001'), // 코스닥
      this.stockIndexService.getDomesticStockIndexValueByCode('0001'), // 코스피
      this.stockIndexService.getDomesticStockIndexValueByCode('1001'), // 코스닥
    ]);

    return {
      indexList: [stockLists[0], stockLists[1]],
      indexValue: [stockLists[2], stockLists[3]]
    }
  }
}
