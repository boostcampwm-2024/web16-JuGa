import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { StockTradeHistoryService } from './stock-trade-history.service';
import { TodayStockTradeHistoryResponseDto } from './dto/today-stock-trade-history-response.dto';

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
  getStockDetail(@Param('stockCode') stockCode: string) {
    return this.stockTradeHistoryService.getTodayStockTradeHistory(stockCode);
  }
}
