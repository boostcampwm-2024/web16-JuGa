import { Injectable, Logger } from '@nestjs/common';
import { StockIndexListChartElementDto } from './dto/stock-index-list-chart.element.dto';
import { StockIndexValueElementDto } from './dto/stock-index-value-element.dto';
import {
  StockIndexChartInterface,
  StockIndexValueInterface,
} from './interface/stock-index.interface';
import { KoreaInvestmentService } from '../../koreaInvestment/korea-investment.service';

@Injectable()
export class StockIndexService {
  private readonly logger = new Logger();

  constructor(
    private readonly koreaInvestmentService: KoreaInvestmentService,
  ) {}

  async getDomesticStockIndexListByCode(code: string) {
    try {
      const queryParams = {
        fid_input_hour_1: '300',
        fid_cond_mrkt_div_code: 'U',
        fid_input_iscd: code,
      };

      const result =
        await this.koreaInvestmentService.requestApi<StockIndexChartInterface>(
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

  async getDomesticStockIndexValueByCode(code: string) {
    try {
      const queryParams = {
        fid_cond_mrkt_div_code: 'U',
        fid_input_iscd: code,
      };

      const result =
        await this.koreaInvestmentService.requestApi<StockIndexValueInterface>(
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
