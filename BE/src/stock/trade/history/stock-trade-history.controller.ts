import { Controller, Get, Param, Sse } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StockTradeHistoryService } from './stock-trade-history.service';
import { TodayStockTradeHistoryDataDto } from './dto/today-stock-trade-history-data.dto';
import { DailyStockTradeHistoryDataDto } from './dto/daily-stock-trade-history-data.dto';
import { Observable } from 'rxjs';
import { SseEvent } from './interface/sse-event';
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

  @Sse(':stockCode/today-sse')
  @ApiOperation({ summary: '단일 주식 종목에 대한 실시간 체결 데이터 스트림' })
  @ApiParam({
    name: 'stockCode',
    required: true,
    description:
      '종목 코드\n\n' +
      '(ex) 005930 삼성전자 / 005380 현대차 / 001500 현대차증권',
  })
  @ApiResponse({
    status: 200,
    description:
      '단일 주식 종목에 대한 주식현재가 체결값 실시간 데이터 조회 성공',
    type: TodayStockTradeHistoryDataDto,
  })
  streamTradeHistory(@Param('stockCode') stockCode: string) {
    this.stockPriceSocketService.subscribeByCode(stockCode);

    return new Observable<SseEvent>((subscriber) => {
      const subscription = this.stockPriceSocketService
        .getTradeDataStream(stockCode)
        .subscribe(subscriber);

      return () => {
        this.stockPriceSocketService.unsubscribeByCode(stockCode);
        subscription.unsubscribe();
      };
    });
  }

  @Get(':stockCode/unsubscribe')
  @ApiOperation({ summary: '페이지를 벗어날 때 구독을 취소하기 위한 API' })
  @ApiParam({
    name: 'stockCode',
    required: true,
    description:
      '종목 코드\n\n' +
      '(ex) 005930 삼성전자 / 005380 현대차 / 001500 현대차증권',
  })
  @ApiResponse({
    status: 200,
    description: '구독 취소 성공',
  })
  unsubscribeCode(@Param('stockCode') stockCode: string) {
    this.stockTradeHistoryService.unsubscribeCode(stockCode);
  }
}
