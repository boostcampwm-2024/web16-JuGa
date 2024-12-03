import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { KoreaInvestmentDomainService } from '../../../common/koreaInvestment/korea-investment.domain-service';
import { InquireCCNLApiResponse } from './interface/Inquire-ccnl.interface';
import { TodayStockTradeHistoryOutputDto } from './dto/today-stock-trade-history-output.dto';
import { TodayStockTradeHistoryDataDto } from './dto/today-stock-trade-history-data.dto';
import { InquireDailyPriceApiResponse } from './interface/inquire-daily-price.interface';
import { DailyStockTradeHistoryOutputDto } from './dto/daily-stock-trade-history-ouput.dto';
import { DailyStockTradeHistoryDataDto } from './dto/daily-stock-trade-history-data.dto';
import { StockPriceSocketService } from '../../../stockSocket/stock-price-socket.service';

@Injectable()
export class StockTradeHistoryService {
  constructor(
    private readonly koreaInvestmentDomainService: KoreaInvestmentDomainService,
    private readonly stockPriceSocketService: StockPriceSocketService,
  ) {}

  /**
   * 특정 주식의 현재가 체결 데이터를 반환하는 함수
   * @param {string} stockCode - 종목코드
   * @returns - 특정 주식의 현재가 체결 데이터 객체 반환
   *
   * @author uuuo3o
   */
  async getTodayStockTradeHistory(stockCode: string) {
    const queryParams = {
      fid_cond_mrkt_div_code: 'J',
      fid_input_iscd: stockCode,
    };

    const response =
      await this.koreaInvestmentDomainService.requestApi<InquireCCNLApiResponse>(
        'FHKST01010300',
        '/uapi/domestic-stock/v1/quotations/inquire-ccnl',
        queryParams,
      );

    try {
      this.stockPriceSocketService.subscribeByCode(stockCode);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }

    return this.formatTodayStockTradeHistoryData(response.output);
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
    const queryParams = {
      fid_cond_mrkt_div_code: 'J',
      fid_input_iscd: stockCode,
      fid_period_div_code: 'D',
      fid_org_adj_prc: '0',
    };

    const response =
      await this.koreaInvestmentDomainService.requestApi<InquireDailyPriceApiResponse>(
        'FHKST01010400',
        '/uapi/domestic-stock/v1/quotations/inquire-daily-price',
        queryParams,
      );

    return this.formatDailyStockTradeHistoryData(response.output);
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

  // unsubscribeCode(stockCode: string) {
  //   return this.stockPriceSocketService.unsubscribeByCode(stockCode);
  // }
}
