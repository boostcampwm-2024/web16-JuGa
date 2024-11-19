import { Injectable, Logger } from '@nestjs/common';
import { KoreaInvestmentDomainService } from '../../common/koreaInvestment/korea-investment.domain-service';
import { InquirePriceChartApiResponse } from './interface/stock-detail-chart.interface';
import { InquirePriceChartDataDto } from './dto/stock-detail-chart-data.dto';
import {
  InquirePriceApiResponse,
  InquirePriceOutputData,
} from './interface/stock-detail.interface';
import { InquirePriceResponseDto } from './dto/stock-detail-response.dto';
import { StockDetailRepository } from './stock-detail.repository';

@Injectable()
export class StockDetailService {
  private readonly logger = new Logger();

  constructor(
    private readonly koreaInvestmentDomainService: KoreaInvestmentDomainService,
    private readonly stockDetailRepository: StockDetailRepository,
  ) {}

  /**
   * 주식현재가 시세 데이터를 반환하는 함수
   * @param {string} stockCode - 종목코드
   * @returns - 주식현재가 시세 데이터 객체 반환
   *
   * @author uuuo3o
   */
  async getInquirePrice(stockCode: string) {
    const queryParams = {
      fid_cond_mrkt_div_code: 'J',
      fid_input_iscd: stockCode,
    };

    const response =
      await this.koreaInvestmentDomainService.requestApi<InquirePriceApiResponse>(
        'FHKST01010100',
        '/uapi/domestic-stock/v1/quotations/inquire-price',
        queryParams,
      );
    return this.formatStockData(response.output);
  }

  /**
   * @private API에서 받은 주식현재가 시세 데이터를 필요한 정보로 정제하는 함수
   * @param {InquirePriceOutputData} stock - API 응답에서 받은 원시 데이터
   * @returns - 필요한 정보만 추출한 데이터 배열
   *
   * @author uuuo3o
   */
  private async formatStockData(
    stock: InquirePriceOutputData,
  ): Promise<InquirePriceResponseDto> {
    const { name } = await this.stockDetailRepository.findOneByCode(
      stock.stck_shrn_iscd,
    );

    return {
      hts_kor_isnm: name,
      stck_shrn_iscd: stock.stck_shrn_iscd,
      stck_prpr: stock.stck_prpr,
      prdy_vrss: stock.prdy_vrss,
      prdy_vrss_sign: stock.prdy_vrss_sign,
      prdy_ctrt: stock.prdy_ctrt,
      hts_avls: stock.hts_avls,
      per: stock.per,
    };
  }

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
    const queryParams = {
      fid_cond_mrkt_div_code: 'J',
      fid_input_iscd: stockCode,
      fid_input_date_1: date1,
      fid_input_date_2: date2,
      fid_period_div_code: periodDivCode,
      fid_org_adj_prc: '0',
    };

    const response =
      await this.koreaInvestmentDomainService.requestApi<InquirePriceChartApiResponse>(
        'FHKST03010100',
        '/uapi/domestic-stock/v1/quotations/inquire-daily-itemchartprice',
        queryParams,
      );

    return this.formatStockInquirePriceData(response).slice().reverse();
  }

  /**
   * @private API에서 받은 국내주식기간별시세(일/주/월/년) 데이터를 필요한 정보로 정제하는 함수
   * @param {InquirePriceApiResponse} response - API 응답에서 받은 원시 데이터
   * @returns - 필요한 정보만 추출한 데이터 배열
   *
   * @author uuuo3o
   */
  private formatStockInquirePriceData(response: InquirePriceChartApiResponse) {
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
        prdy_vrss_sign,
      } = info;

      stockData.stck_bsop_date = stck_bsop_date;
      stockData.stck_clpr = stck_clpr;
      stockData.stck_oprc = stck_oprc;
      stockData.stck_hgpr = stck_hgpr;
      stockData.stck_lwpr = stck_lwpr;
      stockData.acml_vol = acml_vol;
      stockData.prdy_vrss_sign = prdy_vrss_sign;

      return stockData;
    });
  }
}
