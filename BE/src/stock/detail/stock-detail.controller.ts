import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { StockDetailService } from './stock-detail.service';
import { InquirePriceResponseDto } from './dto/stock-detail-response.dto';

@Controller('/api/stocks')
export class StockDetailController {
  constructor(private readonly stockDetailService: StockDetailService) {}

  @Get(':stockCode')
  @ApiOperation({ summary: '단일 주식 종목 detail 페이지 상단부 조회 API' })
  @ApiParam({
    name: 'stockCode',
    required: true,
    description:
      '종목 코드\n' +
      '(ex) 005930 삼성전자 / 005380 현대차 / 001500 현대차증권',
  })
  @ApiResponse({
    status: 200,
    description: '단일 주식 종목 기본값 조회 성공',
    type: InquirePriceResponseDto,
  })
  getStockDetail(@Param('stockCode') stockCode: string) {
    return this.stockDetailService.getInquirePrice(stockCode);
  }
}
