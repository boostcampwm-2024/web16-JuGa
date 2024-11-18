import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Cron } from '@nestjs/schedule';
import { StockIndexService } from './stock-index.service';
import { StockIndexResponseDto } from './dto/stock-index-response.dto';
import { KoreaInvestmentService } from '../../koreaInvestment/korea-investment.service';
import { SocketGateway } from '../../websocket/socket.gateway';

@Controller('/api/stocks/index')
@ApiTags('주가 지수 API')
export class StockIndexController {
  constructor(
    private readonly stockIndexService: StockIndexService,
    private readonly koreaInvestmentService: KoreaInvestmentService,
    private readonly socketGateway: SocketGateway,
  ) {}

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
    await this.koreaInvestmentService.getAccessToken();

    const [kospiChart, kosdaqChart, kospi200Chart, ksq150Chart] =
      await Promise.all([
        this.stockIndexService.getDomesticStockIndexListByCode('0001'), // 코스피
        this.stockIndexService.getDomesticStockIndexListByCode('1001'), // 코스닥
        this.stockIndexService.getDomesticStockIndexListByCode('2001'), // 코스피200
        this.stockIndexService.getDomesticStockIndexListByCode('3003'), // KSQ150
      ]);

    const [kospiValue, kosdaqValue, kospi200Value, ksq150Value] =
      await Promise.all([
        this.stockIndexService.getDomesticStockIndexValueByCode('0001'), // 코스피
        this.stockIndexService.getDomesticStockIndexValueByCode('1001'), // 코스닥
        this.stockIndexService.getDomesticStockIndexValueByCode('2001'), // 코스피200
        this.stockIndexService.getDomesticStockIndexValueByCode('3003'), // KSQ150
      ]);

    const stockIndexResponse = new StockIndexResponseDto();
    stockIndexResponse.KOSPI = {
      value: kospiValue,
      chart: kospiChart,
    };
    stockIndexResponse.KOSDAQ = {
      value: kosdaqValue,
      chart: kosdaqChart,
    };
    stockIndexResponse.KOSPI200 = {
      value: kospi200Value,
      chart: kospi200Chart,
    };
    stockIndexResponse.KSQ150 = {
      value: ksq150Value,
      chart: ksq150Chart,
    };
    return stockIndexResponse;
  }

  @Cron('*/5 9-16 * * 1-5')
  async cronStockIndexLists() {
    await this.koreaInvestmentService.getAccessToken();

    const stockLists = await Promise.all([
      this.stockIndexService.getDomesticStockIndexListByCode('0001'), // 코스피
      this.stockIndexService.getDomesticStockIndexListByCode('1001'), // 코스닥
      this.stockIndexService.getDomesticStockIndexListByCode('2001'), // 코스피200
      this.stockIndexService.getDomesticStockIndexListByCode('3003'), // KSQ150
    ]);

    this.socketGateway.sendStockIndexListToClient({
      KOSPI: stockLists[0],
      KOSDAQ: stockLists[1],
      KOSPI200: stockLists[2],
      KSQ150: stockLists[3],
    });
  }
}
