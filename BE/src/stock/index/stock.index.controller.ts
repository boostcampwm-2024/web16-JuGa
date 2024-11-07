import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StockIndexService } from './stock.index.service';
import { StockIndexResponseDto } from './dto/stock.index.response.dto';

@Controller('/api/stocks/index')
@ApiTags('주가 지수 API')
export class StockIndexController {
  constructor(private readonly stockIndexService: StockIndexService) {}

  @Get()
  @ApiOperation({
    summary: '주가 지수 차트 정보, 현재 값 조회 API',
    description: '주가 지수 차트 정보와 현재 값을 리스트로 반환한다.',
  })
  @ApiResponse({
    status: 200,
    description: '주가 지수 조회 성공',
    type: StockIndexResponseDto,
  })
  async getStockIndex() {
    const stockLists = await Promise.all([
      this.stockIndexService.getDomesticStockIndexListByCode('0001'), // 코스피
      this.stockIndexService.getDomesticStockIndexListByCode('1001'), // 코스닥
      this.stockIndexService.getDomesticStockIndexListByCode('2001'), // 코스피200
      this.stockIndexService.getDomesticStockIndexListByCode('3003'), // KSQ150
    ]);

    const stockValues = await Promise.all([
      this.stockIndexService.getDomesticStockIndexValueByCode('0001'), // 코스피
      this.stockIndexService.getDomesticStockIndexValueByCode('1001'), // 코스닥
      this.stockIndexService.getDomesticStockIndexValueByCode('2001'), // 코스피200
      this.stockIndexService.getDomesticStockIndexValueByCode('3003'), // KSQ150
    ]);

    return new StockIndexResponseDto(stockLists, stockValues);
  }
}
