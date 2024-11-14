import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Query } from '@nestjs/common';
import { StockTopfiveService } from './stock-topfive.service';
import { StockRankingResponseDto } from './dto/stock-ranking-response.dto';
import { MarketType } from '../enum/market-type';

@ApiTags('오늘의 상/하위 종목 조회 API')
@Controller('/api/stocks/topfive')
export class StockTopfiveController {
  constructor(private readonly topFiveService: StockTopfiveService) {}

  @Get()
  @ApiOperation({ summary: '오늘의 상/하위 종목 조회 API' })
  @ApiQuery({
    name: 'market',
    enum: MarketType,
    required: true,
    description:
      '주식 시장 구분\n' +
      'ALL: 전체, KOSPI: 코스피, KOSDAQ: 코스닥, KOSPI200: 코스피200',
  })
  @ApiResponse({
    status: 200,
    description: '주식 시장별 순위 조회 성공',
    type: StockRankingResponseDto,
  })
  async getTopFive(@Query('market') market: MarketType) {
    return this.topFiveService.getMarketRanking(market);
  }
}
