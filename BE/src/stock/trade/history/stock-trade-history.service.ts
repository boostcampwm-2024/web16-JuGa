import axios from 'axios';
import { Injectable, Logger } from '@nestjs/common';
import { KoreaInvestmentService } from '../../../koreaInvestment/korea-investment.service';
import { getHeader } from '../../../util/get-header';
import { getFullURL } from '../../../util/get-full-URL';
import { InquireCCNLApiResponse } from './interface/Inquire-ccnl.interface';
import { TodayStockTradeHistoryOutputDto } from './dto/today-stock-trade-history-output.dto';
import { TodayStockTradeHistoryDataDto } from './dto/today-stock-trade-history-data.dto';
import { InquireDailyPriceApiResponse } from './interface/inquire-daily-price.interface';
import { DailyStockTradeHistoryOutputDto } from './dto/daily-stock-trade-history-ouput.dto';
import { DailyStockTradeHistoryDataDto } from './dto/daily-stock-trade-history-data.dto';

@Injectable()
export class StockTradeHistoryService {
  private readonly logger = new Logger();

  constructor(
    private readonly koreaInvestmentService: KoreaInvestmentService,
  ) {}

  /**
   * 특정 주식의 현재가 체결 데이터를 반환하는 함수
   * @param {string} stockCode - 종목코드
   * @returns - 특정 주식의 현재가 체결 데이터 객체 반환
   *
   * @author uuuo3o
   */
  async getTodayStockTradeHistory(stockCode: string) {
    try {
      const queryParams = {
        fid_cond_mrkt_div_code: 'J',
        fid_input_iscd: stockCode,
      };

      const response = await this.requestApi<InquireCCNLApiResponse>(
        'FHKST01010300',
        '/uapi/domestic-stock/v1/quotations/inquire-ccnl',
        queryParams,
      );

      return this.formatTodayStockTradeHistoryData(response.output);
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

  /**
   * @private API에서 받은 주식현재가 체결 데이터를 필요한 정보로 정제하는 함수
   * @param {TodayStockTradeHistoryOutputDto} infos - API 응답에서 받은 원시 데이터
   * @returns - 필요한 정보만 추출한 데이터 배열
   *
   * @author uuuo3o
   */
  private formatTodayStockTradeHistoryData(
    infos: TodayStockTradeHistoryOutputDto[],
  ) {
    return infos.map((info) => {
      const infoData = new TodayStockTradeHistoryDataDto();
      infoData.stck_cntg_hour = info.stck_cntg_hour;
      infoData.stck_prpr = info.stck_prpr;
      infoData.prdy_vrss_sign = info.prdy_vrss_sign;
      infoData.cntg_vol = info.cntg_vol;
      infoData.prdy_ctrt = info.prdy_ctrt;

      return infoData;
    });
  }

  /**
   * 특정 주식의 일자별 체결 데이터를 반환하는 함수
   * @param {string} stockCode - 종목코드
   * @returns - 특정 주식의 현재가 체결 데이터 객체 반환
   *
   * @author uuuo3o
   */
  async getDailyStockTradeHistory(stockCode: string) {
    try {
      const queryParams = {
        fid_cond_mrkt_div_code: 'J',
        fid_input_iscd: stockCode,
        fid_period_div_code: 'D',
        fid_org_adj_prc: '0',
      };

      const response = await this.requestApi<InquireDailyPriceApiResponse>(
        'FHKST01010400',
        '/uapi/domestic-stock/v1/quotations/inquire-daily-price',
        queryParams,
      );

      return this.formatDailyStockTradeHistoryData(response.output);
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

  /**
   * @private API에서 받은 주식현재가 일자별 데이터를 필요한 정보로 정제하는 함수
   * @param {DailyStockTradeHistoryOutputDto} datas - API 응답에서 받은 원시 데이터
   * @returns - 필요한 정보만 추출한 데이터 배열
   *
   * @author uuuo3o
   */
  private formatDailyStockTradeHistoryData(
    datas: DailyStockTradeHistoryOutputDto[],
  ) {
    return datas.map((data) => {
      const historyData = new DailyStockTradeHistoryDataDto();
      historyData.stck_bsop_date = data.stck_bsop_date;
      historyData.stck_oprc = data.stck_oprc;
      historyData.stck_hgpr = data.stck_hgpr;
      historyData.stck_lwpr = data.stck_lwpr;
      historyData.stck_clpr = data.stck_clpr;
      historyData.acml_vol = data.acml_vol;
      historyData.prdy_vrss_sign = data.prdy_vrss_sign;
      historyData.prdy_ctrt = data.prdy_ctrt;

      return historyData;
    });
  }

  /**
   * @private 한국투자 Open API - API 호출용 공통 함수
   * @param {string} trId - API 호출에 사용할 tr_id
   * @param {string} apiURL - API 호출에 사용할 URL
   * @param {Record<string, string>} params - API 요청 시 필요한 쿼리 파라미터 DTO
   * @returns - API 호출에 대한 응답 데이터
   *
   * @author uuuo3o
   */
  private async requestApi<T>(
    trId: string,
    apiURL: string,
    params: Record<string, string>,
  ): Promise<T> {
    try {
      const accessToken = await this.koreaInvestmentService.getAccessToken();
      const headers = getHeader(accessToken, trId);
      const url = getFullURL(apiURL);

      const response = await axios.get<T>(url, {
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
}
