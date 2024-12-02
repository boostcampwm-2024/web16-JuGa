import { Test } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { StockBookmarkRepository } from './stock-bookmark.repository';
import { StockDetailService } from '../detail/stock-detail.service';
import { StockBookmarkService } from './stock-bookmark.service';

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
});
