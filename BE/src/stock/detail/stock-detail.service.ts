import axios from 'axios';
import { Injectable, Logger } from '@nestjs/common';
import { KoreaInvestmentService } from '../../koreaInvestment/korea-investment.service';
import { getHeader } from '../../util/get-header';
import { getFullURL } from '../../util/get-full-URL';
import { InquirePriceApiResponse } from './interface/stock-detail.interface';
import { InquirePriceChartDataDto } from './dto/stock-detail-chart-data.dto';

@Injectable()
export class StockDetailService {
  private readonly logger = new Logger();

  constructor(private readonly koreaInvetmentService: KoreaInvestmentService) {}

  /**
   * 특정 주식의 기간별시세 데이터를 반환하는 함수
   * @param {string} stockCode - 종목코드
   * @param {string} date1 - 조회 시작일자
   * @param {string} date2 - 조회 종료일자
   * @param {string} periodDivCode - 기간 분류 코드
   * @returns - 특정 주식의 기간별시세 데이터 객체 반환
   *
   * @author uuuo3o
   */
  async getInquirePriceChart(
    stockCode: string,
    date1: string,
    date2: string,
    periodDivCode: string,
  ) {
    try {
      const queryParams = {
        fid_cond_mrkt_div_code: 'J',
        fid_input_iscd: stockCode,
        fid_input_date_1: date1,
        fid_input_date_2: date2,
        fid_period_div_code: periodDivCode,
        fid_org_adj_prc: '0',
      };

      const response = await this.requestApi<InquirePriceApiResponse>(
        'FHKST03010100',
        '/uapi/domestic-stock/v1/quotations/inquire-daily-itemchartprice',
        queryParams,
      );

      return this.formatStockInquirePriceData(response);
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
      const accessToken = await this.koreaInvetmentService.getAccessToken();
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

  /**
   * @private API에서 받은 국내주식기간별시세(일/주/월/년) 데이터를 필요한 정보로 정제하는 함수
   * @param {InquirePriceApiResponse} response - API 응답에서 받은 원시 데이터
   * @returns - 필요한 정보만 추출한 데이터 배열
   *
   * @author uuuo3o
   */
  private formatStockInquirePriceData(response: InquirePriceApiResponse) {
    const { output2 } = response;

    return output2.map((info) => {
      const stockData = new InquirePriceChartDataDto();
      const {
        stck_bsop_date,
        stck_clpr,
        stck_oprc,
        stck_hgpr,
        stck_lwpr,
        acml_vol,
      } = info;

      stockData.stck_bsop_date = stck_bsop_date;
      stockData.stck_clpr = stck_clpr;
      stockData.stck_oprc = stck_oprc;
      stockData.stck_hgpr = stck_hgpr;
      stockData.stck_lwpr = stck_lwpr;
      stockData.acml_vol = acml_vol;

      return stockData;
    });
  }
}