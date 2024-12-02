import { Test } from '@nestjs/testing';
import axios from 'axios';
import { InternalServerErrorException } from '@nestjs/common';
import { StockIndexService } from './stock-index.service';
import { STOCK_INDEX_LIST_MOCK } from './mockdata/stock.index.list.mockdata';
import { STOCK_INDEX_VALUE_MOCK } from './mockdata/stock.index.value.mockdata';
import { SocketGateway } from '../../common/websocket/socket.gateway';
import { KoreaInvestmentDomainService } from '../../common/koreaInvestment/korea-investment.domain-service';
import { StockIndexListChartElementDto } from './dto/stock-index-list-chart.element.dto';
import { StockIndexValueElementDto } from './dto/stock-index-value-element.dto';
import { StockIndexResponseElementDto } from './dto/stock-index-response-element.dto';
import { StockIndexResponseDto } from './dto/stock-index-response.dto';

jest.mock('axios');

describe('stock index list test', () => {
  let stockIndexService: StockIndexService;
  let koreaInvestmentDomainService: KoreaInvestmentDomainService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        StockIndexService,
        SocketGateway,
        KoreaInvestmentDomainService,
      ],
    }).compile();

    stockIndexService = module.get(StockIndexService);
    koreaInvestmentDomainService = module.get(KoreaInvestmentDomainService);

    jest
      .spyOn(koreaInvestmentDomainService, 'getAccessToken')
      .mockResolvedValue('accessToken');
  });

  it('주가 지수 차트 조회 API에서 정상적인 데이터를 조회한 경우, 형식에 맞춰 정상적으로 반환한다.', async () => {
    (axios.get as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('inquire-index-timeprice'))
        return STOCK_INDEX_LIST_MOCK.VALID_DATA;
      if (url.includes('inquire-index-price'))
        return STOCK_INDEX_VALUE_MOCK.VALID_DATA;
      return new Error();
    });

    const stockIndexListValueElementDto = new StockIndexValueElementDto(
      STOCK_INDEX_VALUE_MOCK.VALID_DATA.data.output.bstp_nmix_prpr,
      STOCK_INDEX_VALUE_MOCK.VALID_DATA.data.output.bstp_nmix_prdy_vrss,
      STOCK_INDEX_VALUE_MOCK.VALID_DATA.data.output.bstp_nmix_prdy_ctrt,
      STOCK_INDEX_VALUE_MOCK.VALID_DATA.data.output.prdy_vrss_sign,
    );
    const stockIndexListChartElementDto = new StockIndexListChartElementDto(
      STOCK_INDEX_LIST_MOCK.VALID_DATA.data.output[0].bsop_hour,
      STOCK_INDEX_LIST_MOCK.VALID_DATA.data.output[0].bstp_nmix_prpr,
      STOCK_INDEX_LIST_MOCK.VALID_DATA.data.output[0].bstp_nmix_prdy_vrss,
    );

    const stockIndexResponseElementDto = new StockIndexResponseElementDto();
    stockIndexResponseElementDto.value = stockIndexListValueElementDto;
    stockIndexResponseElementDto.chart = [stockIndexListChartElementDto];

    const stockIndexResponseDto = new StockIndexResponseDto();
    stockIndexResponseDto.KOSPI = stockIndexResponseElementDto;
    stockIndexResponseDto.KOSDAQ = stockIndexResponseElementDto;
    stockIndexResponseDto.KOSPI200 = stockIndexResponseElementDto;
    stockIndexResponseDto.KSQ150 = stockIndexResponseElementDto;

    expect(await stockIndexService.getDomesticStockIndexList()).toEqual(
      stockIndexResponseDto,
    );
  });

  it('주가 지수 차트 조회 API에서 데이터를 조회하지 못한 경우, 에러를 발생시킨다.', async () => {
    (axios.get as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('inquire-index-timeprice'))
        return STOCK_INDEX_LIST_MOCK.INVALID_DATA;
      if (url.includes('inquire-index-price'))
        return STOCK_INDEX_VALUE_MOCK.INVALID_DATA;
      return new Error();
    });

    await expect(stockIndexService.getDomesticStockIndexList()).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
