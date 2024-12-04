import { Test } from '@nestjs/testing';
import { KoreaInvestmentDomainService } from '../../../common/koreaInvestment/korea-investment.domain-service';
import { StockTradeHistoryService } from './stock-trade-history.service';
import { StockPriceSocketService } from '../../../stockSocket/stock-price-socket.service';
import { STOCK_TRADE_HISTORY_TODAY_MOCK } from './mockdata/stock-trade-history-today.mockdata';
import { STOCK_TRADE_HISTORY_DAILY_MOCK } from './mockdata/stock-trade-history-daily.mockdata';

describe('stock trade history test', () => {
  let stockTradeHistoryService: StockTradeHistoryService;
  let koreaInvestmentDomainService: KoreaInvestmentDomainService;
  let stockPriceSocketService: StockPriceSocketService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        StockTradeHistoryService,
        KoreaInvestmentDomainService,
        {
          provide: StockPriceSocketService,
          useValue: {
            subscribeByCode: jest.fn(), // 이 메서드만 모킹합니다.
          },
        },
      ],
    }).compile();

    stockTradeHistoryService = module.get(StockTradeHistoryService);
    koreaInvestmentDomainService = module.get(KoreaInvestmentDomainService);
    stockPriceSocketService = module.get(StockPriceSocketService);

    jest
      .spyOn(koreaInvestmentDomainService, 'getAccessToken')
      .mockResolvedValue('accessToken');
  });

  it('특정 주식의 현재가 체결 데이터를 반환한다.', async () => {
    jest
      .spyOn(koreaInvestmentDomainService, 'requestApi')
      .mockResolvedValueOnce(STOCK_TRADE_HISTORY_TODAY_MOCK);
    jest.spyOn(stockPriceSocketService, 'subscribeByCode').mockResolvedValue();

    const response =
      await stockTradeHistoryService.getTodayStockTradeHistory('005930');

    const expected = {
      stck_cntg_hour: '155958',
      stck_prpr: '53600',
      prdy_vrss_sign: '5',
      cntg_vol: '5',
      prdy_ctrt: '-1.11',
    };

    expect(response[0]).toEqual(expected);
  });

  it('특정 주식의 일자별 체결 데이터를 반환한다.', async () => {
    jest
      .spyOn(koreaInvestmentDomainService, 'requestApi')
      .mockResolvedValueOnce(STOCK_TRADE_HISTORY_DAILY_MOCK);

    const response =
      await stockTradeHistoryService.getDailyStockTradeHistory('005930');

    const expected = {
      stck_bsop_date: '20241202',
      stck_oprc: '54300',
      stck_hgpr: '54400',
      stck_lwpr: '53100',
      stck_clpr: '53600',
      acml_vol: '21924956',
      prdy_vrss_sign: '5',
      prdy_ctrt: '-1.11',
    };

    expect(response[0]).toEqual(expected);
    expect(response[0].stck_bsop_date).toEqual('20241202');
    expect(response[1].stck_bsop_date).toEqual('20241129');
    expect(response[2].stck_bsop_date).toEqual('20241128');
  });
});
