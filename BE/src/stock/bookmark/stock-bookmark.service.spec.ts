import { Test } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { StockBookmarkRepository } from './stock-bookmark.repository';
import { StockDetailService } from '../detail/stock-detail.service';
import { StockBookmarkService } from './stock-bookmark.service';
import { StockBookmarkResponseDto } from './dto/stock-bookmark-response,dto';

describe('stock bookmark test', () => {
  let stockBookmarkService: StockBookmarkService;
  let stockBookmarkRepository: StockBookmarkRepository;
  let stockDetailService: StockDetailService;

  beforeEach(async () => {
    const mockStockBookmarkRepository = {
      existsBy: jest.fn(),
      create: jest.fn(),
      insert: jest.fn(),
      findOneBy: jest.fn(),
      remove: jest.fn(),
      findBookmarkWithNameByUserId: jest.fn(),
    };
    const mockStockDetailService = { getInquirePrice: jest.fn() };

    const module = await Test.createTestingModule({
      providers: [
        StockBookmarkService,
        {
          provide: StockBookmarkRepository,
          useValue: mockStockBookmarkRepository,
        },
        {
          provide: StockDetailService,
          useValue: mockStockDetailService,
        },
      ],
    }).compile();

    stockBookmarkService = module.get(StockBookmarkService);
    stockBookmarkRepository = module.get(StockBookmarkRepository);
    stockDetailService = module.get(StockDetailService);
  });

  it('즐겨찾기에 등록되지 않은 종목에 대해 즐겨찾기 등록할 경우, DB에 즐겨찾기가 추가된다.', async () => {
    jest.spyOn(stockBookmarkRepository, 'existsBy').mockResolvedValue(false);

    const createMock = jest.fn();
    jest
      .spyOn(stockBookmarkRepository, 'create')
      .mockImplementation(createMock);

    const saveMock = jest.fn();
    jest.spyOn(stockBookmarkRepository, 'insert').mockImplementation(saveMock);

    await stockBookmarkService.registerBookmark(1, '005930');

    expect(createMock).toHaveBeenCalledWith({
      user_id: 1,
      stock_code: '005930',
    });
    expect(saveMock).toHaveBeenCalled();
  });

  it('즐겨찾기에 이미 등록된 종목에 대해 즐겨찾기 등록할 경우, BadRequest 예외가 발생한다.', async () => {
    jest.spyOn(stockBookmarkRepository, 'existsBy').mockResolvedValue(true);

    await expect(
      stockBookmarkService.registerBookmark(1, '005930'),
    ).rejects.toThrow(BadRequestException);
  });

  it('존재하는 즐겨찾기를 취소할 경우, DB에서 해당 즐겨찾기가 삭제된다.', async () => {
    jest.spyOn(stockBookmarkRepository, 'findOneBy').mockResolvedValue({
      id: 1,
      stock_code: '005930',
      user_id: 1,
    });

    const removeMock = jest.fn();
    jest
      .spyOn(stockBookmarkRepository, 'remove')
      .mockImplementation(removeMock);

    await stockBookmarkService.unregisterBookmark(1, '005930');

    expect(removeMock).toHaveBeenCalled();
  });

  it('존재하지 않는 즐겨찾기를 취소할 경우, NotFound 예외가 발생한다.', async () => {
    jest
      .spyOn(stockBookmarkRepository, 'findOneBy')
      .mockResolvedValue(undefined);

    await expect(
      stockBookmarkService.unregisterBookmark(1, '005930'),
    ).rejects.toThrow(NotFoundException);
  });

  it('즐겨찾기를 조회할 경우, 해당 종목들의 현재가를 포함한 데이터가 반환된다.', async () => {
    jest
      .spyOn(stockBookmarkRepository, 'findBookmarkWithNameByUserId')
      .mockResolvedValue([
        {
          b_id: 1,
          b_user_id: 1,
          b_stock_code: '005930',
          s_code: '005930',
          s_name: '삼성전자',
          s_market: 'KOSPI',
        },
      ]);

    jest.spyOn(stockDetailService, 'getInquirePrice').mockResolvedValue({
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
      is_bookmarked: true,
    });

    const stockBookmarkResponse = new StockBookmarkResponseDto(
      '삼성전자',
      '005930',
      '53600',
      '-600',
      '5',
      '-1.11',
    );

    expect(await stockBookmarkService.getBookmarkList(1)).toEqual([
      stockBookmarkResponse,
    ]);
  });
});
