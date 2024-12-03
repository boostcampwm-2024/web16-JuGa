import { Test } from '@nestjs/testing';
import { KoreaInvestmentDomainService } from '../../common/koreaInvestment/korea-investment.domain-service';
import { StockTopfiveService } from './stock-topfive.service';
import { StockRankingDataDto } from './dto/stock-ranking-data.dto';
import { STOCK_TOP_FIVE_HIGH_MOCK } from './mockdata/stock-topfive-high.mockdata';
import { STOCK_TOP_FIVE_LOW_MOCK } from './mockdata/stock-topfive-low.mockdata';
import { MarketType } from '../enum/market-type';

describe('stock topfive test', () => {
  let stockTopfiveService: StockTopfiveService;
  let koreaInvestmentDomainService: KoreaInvestmentDomainService;
  let highResponse: StockRankingDataDto[];
  let lowResponse: StockRankingDataDto[];

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [StockTopfiveService, KoreaInvestmentDomainService],
    }).compile();

    stockTopfiveService = module.get(StockTopfiveService);
    koreaInvestmentDomainService = module.get(KoreaInvestmentDomainService);

    jest
      .spyOn(koreaInvestmentDomainService, 'getAccessToken')
      .mockResolvedValue('accessToken');

    jest
      .spyOn(koreaInvestmentDomainService, 'requestApi')
      .mockResolvedValueOnce(STOCK_TOP_FIVE_HIGH_MOCK)
      .mockResolvedValueOnce(STOCK_TOP_FIVE_LOW_MOCK);

    const response = await stockTopfiveService.getMarketRanking(MarketType.ALL);
    highResponse = response.high;
    lowResponse = response.low;
  });

  it('전체 종목에 대한 급상승/급하락 순위를 5개까지 받아온다.', () => {
    expect(highResponse.length).toEqual(5);
    expect(lowResponse.length).toEqual(5);
  });

  it('받아오는 순위 배열의 내부 데이터에는 종목명이 포함되어 있다.', () => {
    expect(highResponse[0].hts_kor_isnm).toEqual('효성화학');
    expect(lowResponse[4].hts_kor_isnm).toEqual('한선엔지니어링');
  });
});
