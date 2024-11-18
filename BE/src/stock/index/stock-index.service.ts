import { Injectable, Logger } from '@nestjs/common';
import { StockIndexListChartElementDto } from './dto/stock-index-list-chart.element.dto';
import { StockIndexValueElementDto } from './dto/stock-index-value-element.dto';
import {
  StockIndexChartInterface,
  StockIndexValueInterface,
} from './interface/stock-index.interface';
import { KoreaInvestmentDomainService } from '../../common/koreaInvestment/korea-investment.domain-service';
import { StockIndexResponseDto } from './dto/stock-index-response.dto';
import { SocketGateway } from '../../common/websocket/socket.gateway';

@Injectable()
export class StockIndexService {
  private readonly logger = new Logger();

  constructor(
    private readonly koreaInvestmentDomainService: KoreaInvestmentDomainService,
    private readonly socketGateway: SocketGateway,
  ) {}

  async getDomesticStockIndexList() {
    await this.koreaInvestmentDomainService.getAccessToken();

    const [kospiChart, kosdaqChart, kospi200Chart, ksq150Chart] =
      await Promise.all([
        this.getDomesticStockIndexListByCode('0001'), // 코스피
        this.getDomesticStockIndexListByCode('1001'), // 코스닥
        this.getDomesticStockIndexListByCode('2001'), // 코스피200
        this.getDomesticStockIndexListByCode('3003'), // KSQ150
      ]);

    const [kospiValue, kosdaqValue, kospi200Value, ksq150Value] =
      await Promise.all([
        this.getDomesticStockIndexValueByCode('0001'), // 코스피
        this.getDomesticStockIndexValueByCode('1001'), // 코스닥
        this.getDomesticStockIndexValueByCode('2001'), // 코스피200
        this.getDomesticStockIndexValueByCode('3003'), // KSQ150
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

  async cronDomesticStockIndexList() {
    await this.koreaInvestmentDomainService.getAccessToken();

    const stockLists = await Promise.all([
      this.getDomesticStockIndexListByCode('0001'), // 코스피
      this.getDomesticStockIndexListByCode('1001'), // 코스닥
      this.getDomesticStockIndexListByCode('2001'), // 코스피200
      this.getDomesticStockIndexListByCode('3003'), // KSQ150
    ]);

    this.socketGateway.sendStockIndexListToClient({
      KOSPI: stockLists[0],
      KOSDAQ: stockLists[1],
      KOSPI200: stockLists[2],
      KSQ150: stockLists[3],
    });
  }

  private async getDomesticStockIndexListByCode(code: string) {
    try {
      const queryParams = {
        fid_input_hour_1: '300',
        fid_cond_mrkt_div_code: 'U',
        fid_input_iscd: code,
      };

      const result =
        await this.koreaInvestmentDomainService.requestApi<StockIndexChartInterface>(
          'FHPUP02110200',
          '/uapi/domestic-stock/v1/quotations/inquire-index-timeprice',
          queryParams,
        );

      return result.output.map((element) => {
        return new StockIndexListChartElementDto(
          element.bsop_hour,
          element.bstp_nmix_prpr,
          element.bstp_nmix_prdy_vrss,
        );
      });
    } catch (error) {
      this.logger.error('API Error Details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.config?.headers, // 실제 요청 헤더
        message: error.message,
      });
      throw error;
    }
  }

  private async getDomesticStockIndexValueByCode(code: string) {
    try {
      const queryParams = {
        fid_cond_mrkt_div_code: 'U',
        fid_input_iscd: code,
      };

      const result =
        await this.koreaInvestmentDomainService.requestApi<StockIndexValueInterface>(
          'FHPUP02100000',
          '/uapi/domestic-stock/v1/quotations/inquire-index-price',
          queryParams,
        );

      const data = result.output;

      return new StockIndexValueElementDto(
        data.bstp_nmix_prpr,
        data.bstp_nmix_prdy_vrss,
        data.bstp_nmix_prdy_ctrt,
        data.prdy_vrss_sign,
      );
    } catch (error) {
      this.logger.error('API Error Details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.config?.headers, // 실제 요청 헤더
        message: error.message,
      });
      throw error;
    }
  }
}
