import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { StockTradeHistoryService } from './stock-trade-history.service';
import { TodayStockTradeHistoryDataDto } from './dto/today-stock-trade-history-data.dto';
import { DailyStockTradeHistoryDataDto } from './dto/daily-stock-trade-history-data.dto';
import { StockPriceSocketService } from '../../../stockSocket/stock-price-socket.service';

@ApiTags('주식현재가 체결 조회 API')
@Controller('/api/stocks/trade-history')
export class StockTradeHistoryController {
  constructor(
    private readonly stockTradeHistoryService: StockTradeHistoryService,
    private readonly stockPriceSocketService: StockPriceSocketService,
  ) {}

  @Get(':stockCode/today')
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
    type: TodayStockTradeHistoryDataDto,
  })
  getTodayStockTradeHistory(@Param('stockCode') stockCode: string) {
    return this.stockTradeHistoryService.getTodayStockTradeHistory(stockCode);
  }

  @Get(':stockCode/daily')
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

  @Get('/unsubscribe')
  @ApiOperation({ summary: '페이지를 벗어날 때 구독을 취소하기 위한 API' })
  @ApiQuery({
    name: 'stockCode',
    required: true,
    description:
      '종목 코드\n\n' +
      '(ex) 005930 삼성전자 / 005380 현대차 / 001500 현대차증권',
    schema: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '구독 취소 성공',
  })
  unsubscribeCode(@Query('stockCode') stockCode: string | string[]) {
    const stockCodeArray = Array.isArray(stockCode) ? stockCode : [stockCode];
    this.stockPriceSocketService.unsubscribeByCode(stockCodeArray);
  }
}
