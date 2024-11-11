import axios from 'axios';
import { Injectable, Logger } from '@nestjs/common';
import { KoreaInvestmentService } from '../../koreaInvestment/korea-investment.service';
import { getHeader } from '../../util/get-header';
import { getFullURL } from '../../util/get-full-URL';
import { StockDetailQueryParameterDto } from './dto/stock-detail-request.dto';
import { InquirePriceApiResponse } from './interface/stock-detail.interface';

@Injectable()
export class StockDetailService {
  private readonly logger = new Logger();

  constructor(private readonly koreaInvetmentService: KoreaInvestmentService) {}

  /**
   * @private 한국투자 Open API - [국내주식] 기본시세 - 주식현재가 시세 호출 함수
   * @param {StockDetailQueryParameterDto} queryParams - API 요청 시 필요한 쿼리 파라미터 DTO
   * @returns - 주식현재가 시세 데이터
   *
   * @author uuuo3o
   */
  private async requestApi(queryParams: StockDetailQueryParameterDto) {
    try {
      const accessToken = await this.koreaInvetmentService.getAccessToken();
      const headers = getHeader(accessToken, 'FHKST01010100');
      const url = getFullURL(
        '/uapi/domestic-stock/v1/quotations/inquire-price',
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
   * @private 주식현재가 시세 요청을 위한 쿼리 파라미터 객체 생성 함수
   * @param {StockDetailQueryParameterDto} params - API 요청에 필요한 쿼리 파라미터 DTO
   * @returns - API 요청에 필요한 쿼리 파라미터 객체
   *
   * @author uuuo3o
   */
  private getInquirePriceParams(params: StockDetailQueryParameterDto) {
    return {
      fid_cond_mrkt_div_code: params.fid_cond_mrkt_div_code,
      fid_input_iscd: params.fid_input_iscd,
    };
  }
}
