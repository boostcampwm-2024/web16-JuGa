import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { StockDetailService } from './stock-detail.service';
import { StockDetailRequestDto } from './dto/stock-detail-request.dto';
import { InquirePriceResponseDto } from './dto/stock-detail-response.dto';

@Controller('/api/stocks')
export class StockDetailController {
  constructor(private readonly stockDetailService: StockDetailService) {}

  @Post(':stockCode')
  @ApiOperation({ summary: '단일 주식 종목 detail 페이지 상단부 조회 API' })
  @ApiParam({
    name: 'stockCode',
    required: true,
    description:
      '종목 코드\n\n' +
      '(ex) 005930 삼성전자 / 005380 현대차 / 001500 현대차증권',
  })
  @ApiBody({
    description:
      '주식 상세 조회에 필요한 데이터\n\n' +
      'fid_input_date_1: 조회 시작일자 (ex) 20240505\n\n' +
      'fid_input_date_2: 조회 종료일자 (ex) 20241111\n\n' +
      'fid_period_div_code: 기간 분류 코드 (ex) D(일봉), W(주봉), M(월봉), Y(년봉)',
    type: StockDetailRequestDto,
  })
  @ApiResponse({
    status: 200,
    description: '단일 주식 종목 기본값 조회 성공',
    type: InquirePriceResponseDto,
  })
  getStockDetail(
    @Param('stockCode') stockCode: string,
    @Body() body: StockDetailRequestDto,
  ) {
    const { fid_input_date_1, fid_input_date_2, fid_period_div_code } = body;
    return this.stockDetailService.getInquirePrice(
      stockCode,
      fid_input_date_1,
      fid_input_date_2,
      fid_period_div_code,
    );
  }
}
