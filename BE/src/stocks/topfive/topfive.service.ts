import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StockRankigRequestDto } from './dto/stock-ranking-request.dto';
import { StockRankingResponseDto } from './dto/stock-ranking-response.dto';
import { StockRankingDataDto } from './dto/stock-ranking-data.dto';

export enum MarketType {
  ALL = 'ALL',
  KOSPI = 'KOSPI',
  KOSDAQ = 'KOSDAQ',
  KOSPI200 = 'KOSPI200',
}

interface StockApiOutputData {
  stck_shrn_iscd: string;
  data_rank: string;
  hts_kor_isnm: string;
  stck_prpr: string;
  prdy_vrss: string;
  prdy_vrss_sign: string;
  prdy_ctrt: string;
  acml_vol: string;
  stck_hgpr: string;
  hgpr_hour: string;
  acml_hgpr_data: string;
  stck_lwpr: string;
  lwpr_hour: string;
  acml_lwpr_date: string;
  lwpr_vrss_prpr_rate: string;
  dsgt_date_clpr_vrss_prpr_rate: string;
  cnnt_ascn_dynu: string;
  hgpr_vrss_prpr_rate: string;
  cnnt_down_dynu: string;
  oprc_vrss_prpr_sign: string;
  oprc_vrss_prpr: string;
  oprc_vrss_prpr_rate: string;
  prd_rsfl: string;
  prd_rsfl_rate: string;
}

interface StockApiResponse {
  output: StockApiOutputData[];
  rt_cd: string;
  msg_cd: string;
  msg1: string;
}

@Injectable()
export class TopFiveService {
  private accessToken: string;
  private tokenExpireTime: Date;
  private readonly koreaInvestmentConfig: {
    appKey: string;
    appSecret: string;
    baseUrl: string;
  };

  constructor(private readonly config: ConfigService) {
    this.koreaInvestmentConfig = {
      appKey: this.config.get<string>('KOREA_INVESTMENT_APP_KEY'),
      appSecret: this.config.get<string>('KOREA_INVESTMENT_APP_SECRET'),
      baseUrl: this.config.get<string>('KOREA_INVESTMENT_BASE_URL'),
    };
  }

  private async getAccessToken() {
    // accessToken이 유효한 경우
    if (this.accessToken && this.tokenExpireTime > new Date()) {
      return this.accessToken;
    }

    const response = await axios.post(
      `${this.koreaInvestmentConfig.baseUrl}/oauth2/tokenP`,
      {
        grant_type: 'client_credentials',
        appkey: this.koreaInvestmentConfig.appKey,
        appsecret: this.koreaInvestmentConfig.appSecret,
      },
    );

    this.accessToken = response.data.access_token;
    this.tokenExpireTime = new Date(Date.now() + +response.data.expires_in);

    return this.accessToken;
  }

  private async requestApi(params: StockRankigRequestDto) {
    try {
      const token = await this.getAccessToken();

      const response = await axios.get<StockApiResponse>(
        `${this.koreaInvestmentConfig.baseUrl}/uapi/domestic-stock/v1/ranking/fluctuation`,
        {
          headers: {
            'content-type': 'application/json; charset=utf-8',
            authorization: `Bearer ${token}`,
            appkey: this.koreaInvestmentConfig.appKey,
            appsecret: this.koreaInvestmentConfig.appSecret,
            tr_id: 'FHPST01700000',
            custtype: 'P',
          },
          params: {
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
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error('API Error Details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.config?.headers, // 실제 요청 헤더
        message: error.message,
      });
      throw error;
    }
  }

  async getMarketRanking(marketType: MarketType) {
    try {
      const params = new StockRankigRequestDto();
      params.fid_cond_mrkt_div_code = 'J';

      switch (marketType) {
        case MarketType.ALL:
          params.fid_input_iscd = '0000';
          break;
        case MarketType.KOSPI:
          params.fid_input_iscd = '0001';
          break;
        case MarketType.KOSDAQ:
          params.fid_input_iscd = '1001';
          break;
        case MarketType.KOSPI200:
          params.fid_input_iscd = '2001';
          break;
        default:
          break;
      }

      const highResponse = await this.requestApi({
        ...params,
        fid_rank_sort_cls_code: '0',
      });

      const lowResponse = await this.requestApi({
        ...params,
        fid_rank_sort_cls_code: '1',
      });

      const response = new StockRankingResponseDto();
      response.high = this.formatStockData(highResponse.output);
      response.low = this.formatStockData(lowResponse.output);

      return response;
    } catch (error) {
      console.error('API Error Details:', {
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
}
