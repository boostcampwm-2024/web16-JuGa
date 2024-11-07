import axios from 'axios';
import { Injectable, Logger } from '@nestjs/common';
import { StockRankingQueryParameterDto } from './dto/stock-ranking-request.dto';
import { StockRankingResponseDto } from './dto/stock-ranking-response.dto';
import { StockRankingDataDto } from './dto/stock-ranking-data.dto';
import { MarketType } from '../enum/MarketType';
import {
  StockApiOutputData,
  StockApiResponse,
} from './interface/stock.topfive.interface';
import { getHeader } from '../../util/getHeader';
import { getFullURL } from '../../util/getFullURL';
import { KoreaInvestmentService } from '../../koreaInvestment/korea.investment.service';

@Injectable()
export class StockTopfiveService {
  private readonly logger = new Logger();

  constructor(
    private readonly koreaInvestmentService: KoreaInvestmentService,
  ) {}

  private async requestApi(queryParams: StockRankingQueryParameterDto) {
    try {
      const accessToken = await this.koreaInvestmentService.getAccessToken();
      const headers = getHeader(accessToken, 'FHPST01700000');
      const url = getFullURL('/uapi/domestic-stock/v1/ranking/fluctuation');
      const params = this.getStockRankingParams(queryParams);

      const response = await axios.get<StockApiResponse>(url, {
        headers,
        params,
      });

      return response.data;
    } catch (error) {
      this.logger.error('API Error Details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.config?.headers,
        message: error.message,
      });
      throw error;
    }
  }

  async getMarketRanking(marketType: MarketType) {
    try {
      const queryParams = new StockRankingQueryParameterDto();
      queryParams.fid_cond_mrkt_div_code = 'J';

      switch (marketType) {
        case MarketType.ALL:
          queryParams.fid_input_iscd = '0000';
          break;
        case MarketType.KOSPI:
          queryParams.fid_input_iscd = '0001';
          break;
        case MarketType.KOSDAQ:
          queryParams.fid_input_iscd = '1001';
          break;
        case MarketType.KOSPI200:
          queryParams.fid_input_iscd = '2001';
          break;
        default:
          break;
      }

      const highResponse = await this.requestApi({
        ...queryParams,
        fid_rank_sort_cls_code: '0',
      });

      const lowResponse = await this.requestApi({
        ...queryParams,
        fid_rank_sort_cls_code: '1',
      });

      const response = new StockRankingResponseDto();
      response.high = this.formatStockData(highResponse.output);
      response.low = this.formatStockData(lowResponse.output);

      return response;
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

  private formatStockData(stocks: StockApiOutputData[]) {
    return stocks.slice(0, 5).map((stock) => {
      const stockData = new StockRankingDataDto();
      stockData.hts_kor_isnm = stock.hts_kor_isnm;
      stockData.stck_prpr = stock.stck_prpr;
      stockData.prdy_vrss = stock.prdy_vrss;
      stockData.prdy_vrss_sign = stock.prdy_vrss_sign;
      stockData.prdy_ctrt = stock.prdy_ctrt;

      return stockData;
    });
  }

  private getStockRankingParams(params: StockRankingQueryParameterDto) {
    return {
      fid_rsfl_rate2: '',
      fid_cond_mrkt_div_code: params.fid_cond_mrkt_div_code,
      fid_cond_scr_div_code: '20170',
      fid_input_iscd: params.fid_input_iscd,
      fid_rank_sort_cls_code: params.fid_rank_sort_cls_code,
      fid_input_cnt_1: '0',
      fid_prc_cls_code: '1',
      fid_input_price_1: '',
      fid_input_price_2: '',
      fid_vol_cnt: '',
      fid_trgt_cls_code: '0',
      fid_trgt_exls_cls_code: '0',
      fid_div_cls_code: '0',
      fid_rsfl_rate1: '',
    };
  }
}
