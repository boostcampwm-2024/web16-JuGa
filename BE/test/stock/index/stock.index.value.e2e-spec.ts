import { Test } from '@nestjs/testing';
import axios from 'axios';
import { StockIndexService } from '../../../src/stock/index/stock.index.service';
import { STOCK_INDEX_VALUE_MOCK } from './mockdata/stock.index.value.mockdata';

jest.mock('axios');

describe('stock index list test', () => {
  let stockIndexService: StockIndexService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [StockIndexService],
    }).compile();

    stockIndexService = module.get(StockIndexService);
  });

  it('주가 지수 값 조회 API에서 정상적인 데이터를 조회한 경우, 형식에 맞춰 정상적으로 반환한다.', async () => {
    (axios.get as jest.Mock).mockResolvedValue(
      STOCK_INDEX_VALUE_MOCK.VALID_DATA,
    );

    expect(
      await stockIndexService.getDomesticStockIndexValueByCode(
        'code',
        'accessToken',
      ),
    ).toEqual({
      code: 'code',
      value: STOCK_INDEX_VALUE_MOCK.VALID_DATA.data.output.bstp_nmix_prpr,
      diff: STOCK_INDEX_VALUE_MOCK.VALID_DATA.data.output.bstp_nmix_prdy_vrss,
      diffRate:
        STOCK_INDEX_VALUE_MOCK.VALID_DATA.data.output.bstp_nmix_prdy_ctrt,
      sign: STOCK_INDEX_VALUE_MOCK.VALID_DATA.data.output.prdy_vrss_sign,
    });
  });

  it('주가 지수 값 조회 API에서 데이터를 조회하지 못한 경우, 에러를 발생시킨다.', async () => {
    (axios.get as jest.Mock).mockResolvedValue(
      STOCK_INDEX_VALUE_MOCK.INVALID_DATA,
    );

    await expect(
      stockIndexService.getDomesticStockIndexValueByCode('code', 'accessToken'),
    ).rejects.toThrow('데이터를 정상적으로 조회하지 못했습니다.');
  });
});
