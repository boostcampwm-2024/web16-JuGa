import axios from 'axios';
import { Injectable, Logger } from '@nestjs/common';
import { KoreaInvestmentService } from '../../koreaInvestment/korea-investment.service';
import { getHeader } from '../../util/get-header';
import { getFullURL } from '../../util/get-full-URL';
import { InquirePriceApiResponse } from './interface/stock-detail.interface';
import { StockDetailQueryParameterDto } from './dto/stock-detail-query-parameter.dto';
import { InquirePriceResponseDto } from './dto/stock-detail-response.dto';

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
  async getInquirePrice(
    stockCode: string,
    date1: string,
    date2: string,
    periodDivCode: string,
  ) {
    try {
      const queryParams = new StockDetailQueryParameterDto();
      queryParams.fid_cond_mrkt_div_code = 'J';
      queryParams.fid_input_iscd = stockCode;
      queryParams.fid_input_date_1 = date1;
      queryParams.fid_input_date_2 = date2;
      queryParams.fid_period_div_code = periodDivCode;

      const response = await this.requestApi(queryParams);

      return this.formatStockData(response);
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
   * @private 한국투자 Open API - [국내주식] 기본시세 - 국내주식기간별시세(일/주/월/년) 호출 함수
   * @param {StockDetailQueryParameterDto} queryParams - API 요청 시 필요한 쿼리 파라미터 DTO
   * @returns - 국내주식기간별시세(일/주/월/년) 데이터
   *
   * @author uuuo3o
   */
  private async requestApi(queryParams: StockDetailQueryParameterDto) {
    try {
      const accessToken = await this.koreaInvetmentService.getAccessToken();
      const headers = getHeader(accessToken, 'FHKST03010100');
      const url = getFullURL(
        '/uapi/domestic-stock/v1/quotations/inquire-daily-itemchartprice',
      );
      const params = this.getInquirePriceParams(queryParams);

      const response = await axios.get<InquirePriceApiResponse>(url, {
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
  private formatStockData(response: InquirePriceApiResponse) {
    const stockData = new InquirePriceResponseDto();
    const { output1, output2 } = response;

    const {
      hts_kor_isnm,
      stck_shrn_iscd,
      stck_prpr,
      prdy_vrss,
      prdy_vrss_sign,
      prdy_ctrt,
      hts_avls,
      per,
    } = output1;

    stockData.output1 = {
      hts_kor_isnm,
      stck_shrn_iscd,
      stck_prpr,
      prdy_vrss,
      prdy_vrss_sign,
      prdy_ctrt,
      hts_avls,
      per,
    };

    stockData.output2 = output2;

    return stockData;
  }

  /**
   * @private 국내주식기간별시세(일/주/월/년) 요청을 위한 쿼리 파라미터 객체 생성 함수
   * @param {StockDetailQueryParameterDto} params - API 요청에 필요한 쿼리 파라미터 DTO
   * @returns - API 요청에 필요한 쿼리 파라미터 객체
   *
   * @author uuuo3o
   */
  private getInquirePriceParams(params: StockDetailQueryParameterDto) {
    return {
      fid_cond_mrkt_div_code: params.fid_cond_mrkt_div_code,
      fid_input_iscd: params.fid_input_iscd,
      fid_input_date_1: params.fid_input_date_1,
      fid_input_date_2: params.fid_input_date_2,
      fid_period_div_code: params.fid_period_div_code,
      fid_org_adj_prc: 0,
    };
  }
}
