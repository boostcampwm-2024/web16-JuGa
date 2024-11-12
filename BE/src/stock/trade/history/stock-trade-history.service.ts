import axios from 'axios';
import { Injectable, Logger } from '@nestjs/common';
import { KoreaInvestmentService } from '../../../koreaInvestment/korea-investment.service';
import { getHeader } from '../../../util/get-header';
import { getFullURL } from '../../../util/get-full-URL';
import { StockTradeHistoryQueryParameterDto } from './dto/stock-trade-history-query-parameter.dto';
import { InquireCCNLApiResponse } from './interface/Inquire-ccnl.interface';
import { StockTradeHistoryOutputDto } from './dto/stock-trade-history-output.dto';
import { StockTradeHistoryDataDto } from './dto/stock-trade-history-data.dto';

@Injectable()
export class StockTradeHistoryService {
  private readonly logger = new Logger();

  constructor(private readonly koreaInvetmentService: KoreaInvestmentService) {}

  /**
   * 특정 주식의 현재가 체결 데이터를 반환하는 함수
   * @param {string} stockCode - 종목코드
   * @returns - 특정 주식의 현재가 체결 데이터 객체 반환
   *
   * @author uuuo3o
   */
  async getStockTradeHistory(stockCode: string) {
    try {
      const queryParams = new StockTradeHistoryQueryParameterDto();
      queryParams.fid_cond_mrkt_div_code = 'J';
      queryParams.fid_input_iscd = stockCode;

      const response = await this.requestApi(queryParams);

      return this.formatTradeHistoryData(response.output);
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
   * @private 한국투자 Open API - [국내주식] 기본시세 - 주식현재가 체결 호출 함수
   * @param {StockTradeHistoryQueryParameterDto} queryParams - API 요청 시 필요한 쿼리 파라미터 DTO
   * @returns - 주식현재가 체결 데이터
   *
   * @author uuuo3o
   */
  private async requestApi(queryParams: StockTradeHistoryQueryParameterDto) {
    try {
      const accessToken = await this.koreaInvetmentService.getAccessToken();
      const headers = getHeader(accessToken, 'FHKST01010300');
      const url = getFullURL('/uapi/domestic-stock/v1/quotations/inquire-ccnl');
      const params = this.getTradeHistoryParams(queryParams);

      const response = await axios.get<InquireCCNLApiResponse>(url, {
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
   * @private API에서 받은 주식현재가 체결 데이터를 필요한 정보로 정제하는 함수
   * @param {StockTradeHistoryOutputDto} infos - API 응답에서 받은 원시 데이터
   * @returns - 필요한 정보만 추출한 데이터 배열
   *
   * @author uuuo3o
   */
  private formatTradeHistoryData(infos: StockTradeHistoryOutputDto[]) {
    return infos.map((info) => {
      const infoData = new StockTradeHistoryDataDto();
      infoData.stck_cntg_hour = info.stck_cntg_hour;
      infoData.stck_prpr = info.stck_prpr;
      infoData.prdy_vrss_sign = info.prdy_vrss_sign;
      infoData.cntg_vol = info.cntg_vol;
      infoData.prdy_ctrt = info.prdy_ctrt;

      return infoData;
    });
  }

  /**
   * @private 주식현재가 체결 요청을 위한 쿼리 파라미터 객체 생성 함수
   * @param {StockTradeHistoryQueryParameterDto} params - API 요청에 필요한 쿼리 파라미터 DTO
   * @returns - API 요청에 필요한 쿼리 파라미터 객체
   *
   * @author uuuo3o
   */
  private getTradeHistoryParams(params: StockTradeHistoryQueryParameterDto) {
    return {
      fid_cond_mrkt_div_code: params.fid_cond_mrkt_div_code,
      fid_input_iscd: params.fid_input_iscd,
    };
  }
}
