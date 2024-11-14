import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StockTradeHistoryService } from './stock-trade-history.service';
import { TodayStockTradeHistoryResponseDto } from './dto/today-stock-trade-history-response.dto';
import { DailyStockTradeHistoryDataDto } from './dto/daily-stock-trade-history-data.dto';

@ApiTags('주식현재가 체결 조회 API')
@Controller('/api/stocks')
export class StockTradeHistoryController {
  constructor(
    private readonly stockTradeHistoryService: StockTradeHistoryService,
  ) {}

  @Get(':stockCode/today-trade-history')
  @ApiOperation({ summary: '단일 주식 종목에 대한 주식현재가 체결 API' })
  @ApiParam({
    name: 'stockCode',
    required: true,
    description:
      '종목 코드\n\n' +
      '(ex) 005930 삼성전자 / 005380 현대차 / 001500 현대차증권',
  })
  @ApiResponse({
    status: 200,
    description: '단일 주식 종목에 대한 주식현재가 체결값 조회 성공',
    type: TodayStockTradeHistoryResponseDto,
  })
  getTodayStockTradeHistory(@Param('stockCode') stockCode: string) {
    return this.stockTradeHistoryService.getTodayStockTradeHistory(stockCode);
  }

  @Get(':stockCode/daily-trade-history')
  @ApiOperation({ summary: '단일 주식 종목에 대한 일자별 주식현재가 API' })
  @ApiParam({
    name: 'stockCode',
    required: true,
    description:
      '종목 코드\n\n' +
      '(ex) 005930 삼성전자 / 005380 현대차 / 001500 현대차증권',
  })
  @ApiResponse({
    status: 200,
    description: '단일 주식 종목에 대한 일자별 주식현재가 조회 성공',
    type: DailyStockTradeHistoryDataDto,
  })
  getDailyStockTradeHistory(@Param('stockCode') stockCode: string) {
    return this.stockTradeHistoryService.getDailyStockTradeHistory(stockCode);
  }
}
