import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Cron } from '@nestjs/schedule';
import { StockIndexService } from './stock-index.service';
import { StockIndexResponseDto } from './dto/stock-index-response.dto';

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
  getStockIndex() {
    return this.stockIndexService.getDomesticStockIndexList();
  }

  @Cron('*/5 9-16 * * 1-5')
  async cronStockIndexLists() {
    await this.stockIndexService.cronDomesticStockIndexList();
  }
}
