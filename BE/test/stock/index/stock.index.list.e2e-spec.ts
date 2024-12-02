import { Test } from '@nestjs/testing';
import axios from 'axios';
import { StockIndexService } from '../../../src/stock/index/stock-index.service';
import { STOCK_INDEX_LIST_MOCK } from './mockdata/stock.index.list.mockdata';

jest.mock('axios');

describe('stock index list test', () => {
  let stockIndexService: StockIndexService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [StockIndexService],
    }).compile();

    stockIndexService = module.get(StockIndexService);
  });

  it('주가 지수 차트 조회 API에서 정상적인 데이터를 조회한 경우, 형식에 맞춰 정상적으로 반환한다.', async () => {
    (axios.get as jest.Mock).mockResolvedValue(
      STOCK_INDEX_LIST_MOCK.VALID_DATA,
    );

    expect(
      await stockIndexService.getDomesticStockIndexListByCode(
        'code',
        'accessToken',
      ),
    ).toEqual({
      code: 'code',
      chart: [
        {
          time: STOCK_INDEX_LIST_MOCK.VALID_DATA.data.output[0].bsop_hour,
          value: STOCK_INDEX_LIST_MOCK.VALID_DATA.data.output[0].bstp_nmix_prpr,
        },
      ],
    });
  });

  it('주가 지수 차트 조회 API에서 데이터를 조회하지 못한 경우, 에러를 발생시킨다.', async () => {
    (axios.get as jest.Mock).mockResolvedValue(
      STOCK_INDEX_LIST_MOCK.INVALID_DATA,
    );

    await expect(
      stockIndexService.getDomesticStockIndexListByCode('code', 'accessToken'),
    ).rejects.toThrow('데이터를 정상적으로 조회하지 못했습니다.');
  });
});
