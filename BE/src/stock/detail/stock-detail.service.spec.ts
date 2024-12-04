import { Test } from '@nestjs/testing';
import { KoreaInvestmentDomainService } from '../../common/koreaInvestment/korea-investment.domain-service';
import { StockDetailService } from './stock-detail.service';
import { StockDetailRepository } from './stock-detail.repository';
import { STOCK_DETAIL_MOCK } from './mockdata/stock-detail.mockdata';
import { STOCK_DETAIL_CHART_MOCK } from './mockdata/stock-detail-chart.mockdata';
import { Stocks } from './stock-detail.entity';

describe('stock detail test', () => {
  let stockDetailService: StockDetailService;
  let koreaInvestmentDomainService: KoreaInvestmentDomainService;
  let stockDetailRepository: StockDetailRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        StockDetailService,
        KoreaInvestmentDomainService,
        {
          provide: StockDetailRepository,
          useValue: {
            findOneByCode: jest.fn(),
          },
        },
      ],
    }).compile();

    stockDetailService = module.get(StockDetailService);
    koreaInvestmentDomainService = module.get(KoreaInvestmentDomainService);
    stockDetailRepository = module.get(StockDetailRepository);

    jest
      .spyOn(koreaInvestmentDomainService, 'getAccessToken')
      .mockResolvedValue('accessToken');
  });

  it('특정 주식의 현재가 체결 데이터를 반환한다.', async () => {
    jest
      .spyOn(koreaInvestmentDomainService, 'requestApi')
      .mockResolvedValueOnce(STOCK_DETAIL_MOCK);

    jest
      .spyOn(stockDetailRepository, 'findOneByCode')
      .mockImplementation((code: string) => {
        const stock = new Stocks();
        stock.code = code;
        stock.name = '삼성전자';
        stock.market = 'KOSPI';

        return Promise.resolve(stock);
      });

    const response = await stockDetailService.getInquirePrice('005930');

    const expected = {
      hts_kor_isnm: '삼성전자',
      stck_shrn_iscd: '005930',
      stck_prpr: '53600',
      prdy_vrss: '-600',
      prdy_vrss_sign: '5',
      prdy_ctrt: '-1.11',
      hts_avls: '3199803',
      per: '25.15',
      stck_mxpr: '70400',
      stck_llam: '38000',
      is_bookmarked: false,
    };

    expect(response).toEqual(expected);
  });

  it('특정 주식의 차트 데이터를 반환한다.', async () => {
    jest
      .spyOn(koreaInvestmentDomainService, 'requestApi')
      .mockResolvedValueOnce(STOCK_DETAIL_CHART_MOCK);

    const response = await stockDetailService.getInquirePriceChart(
      '005930',
      'D',
      30,
    );

    const expected = {
      stck_bsop_date: '20241022',
      stck_clpr: '57700',
      stck_oprc: '58800',
      stck_hgpr: '58900',
      stck_lwpr: '57700',
      acml_vol: '27582528',
      prdy_vrss_sign: '5',
      mov_avg_5: '59020.00',
      mov_avg_20: '60985.00',
    };

    expect(response[0]).toEqual(expected);
    expect(response[0].stck_bsop_date).toEqual('20241022');
    expect(response[1].stck_bsop_date).toEqual('20241023');
    expect(response[2].stck_bsop_date).toEqual('20241024');
  });
});
