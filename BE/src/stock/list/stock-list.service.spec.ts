import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { RedisDomainService } from '../../common/redis/redis.domain-service';
import { StockListRepository } from './stock-list.repostiory';
import { StockListService } from './stock-list.service';
import { Stocks } from './stock-list.entity';

describe('주식 목록 조회 테스트', () => {
  let stockListService: StockListService;
  let stockListRepository: StockListRepository;
  let redisDomainService: RedisDomainService;

  const mockStocks: Stocks[] = [
    {
      code: '005930',
      name: '삼성전자',
      market: 'KOSPI',
      hasId: () => true,
      save: jest.fn(),
      remove: jest.fn(),
      softRemove: jest.fn(),
      recover: jest.fn(),
      reload: () => Promise.resolve(),
    },
    {
      code: '373220',
      name: 'LG에너지솔루션',
      market: 'KOSPI',
      hasId: () => true,
      save: jest.fn(),
      remove: jest.fn(),
      softRemove: jest.fn(),
      recover: jest.fn(),
      reload: () => Promise.resolve(),
    },
  ];

  beforeAll(async () => {
    const mockStockListRepository = {
      findAllStocks: jest.fn(),
      findOneStock: jest.fn(),
      search: jest.fn(),
    };

    const mockRedisDomainService = {
      zadd: jest.fn(),
      zcard: jest.fn(),
      zremrangebyrank: jest.fn(),
      zrevrange: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        StockListService,
        { provide: StockListRepository, useValue: mockStockListRepository },
        { provide: RedisDomainService, useValue: mockRedisDomainService },
      ],
    }).compile();

    stockListService = module.get<StockListService>(StockListService);
    stockListRepository = module.get<StockListRepository>(StockListRepository);
    redisDomainService = module.get<RedisDomainService>(RedisDomainService);
  });

  describe('주식 목록 조회 테스트', () => {
    it('주식 목록을 조회하면, 주식 목록이 반환된다.', async () => {
      jest
        .spyOn(stockListRepository, 'findAllStocks')
        .mockResolvedValue(mockStocks);

      const result = await stockListService.findAll();
      expect(result[0].code).toBe('005930');
      expect(result[0].name).toBe('삼성전자');
      expect(result[0].market).toBe('KOSPI');
    });

    it('주식 코드로 조회 시, 해당 주식 정보가 반환된다.', async () => {
      jest
        .spyOn(stockListRepository, 'findOneStock')
        .mockResolvedValue(mockStocks[0]);

      const result = await stockListService.findOne('005930');

      expect(result.code).toBe('005930');
      expect(result.name).toBe('삼성전자');
      expect(result.market).toBe('KOSPI');
    });

    it('존재하지 않는 주식 코드로 조회 시, NotFoundException이 발생한다.', async () => {
      jest.spyOn(stockListRepository, 'findOneStock').mockResolvedValue(null);
      await expect(stockListService.findOne('000000')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('주식 검색 테스트', () => {
    it('검색 조건으로 조회 시, 조건에 맞는 주식 목록이 반환된다', async () => {
      const searchParams = { name: '삼성' };
      jest
        .spyOn(stockListRepository, 'search')
        .mockResolvedValue([mockStocks[0]]);

      const result = await stockListService.search(searchParams);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('삼성전자');
    });
  });

  describe('검색 기록 관리 테스트', () => {
    it('로그인 된 유저가 검색 시, Redis에 검색 기록이 저장된다.', async () => {
      const searchInfo = { userId: 1, searchTerm: '삼성' };

      const zaddSpy = jest
        .spyOn(redisDomainService, 'zadd')
        .mockResolvedValue(1);

      const zrevrangeSpy = jest.spyOn(redisDomainService, 'zrevrange');

      await stockListService.addSearchTermToRedis(searchInfo);
      expect(zaddSpy).toHaveBeenCalled();
      expect(zrevrangeSpy).not.toHaveBeenCalled();
    });

    it('검색 기록이 제한을 초과하면, 가장 오래된 기록이 삭제된다', async () => {
      const searchInfo = {
        userId: 1,
        searchTerm: '삼성',
      };

      const zaddSpy = jest
        .spyOn(redisDomainService, 'zadd')
        .mockResolvedValue(1);
      const zcardSpy = jest
        .spyOn(redisDomainService, 'zcard')
        .mockResolvedValue(11);

      await stockListService.addSearchTermToRedis(searchInfo);

      expect(zaddSpy).toHaveBeenCalled();
      expect(zcardSpy).toHaveBeenCalled();
    });

    it('검색 기록 조회 시, 최근 검색어 목록이 반환된다', async () => {
      const userId = '1';
      const mockSearchHistory = ['삼성', 'LG', 'SK'];

      jest
        .spyOn(redisDomainService, 'zrevrange')
        .mockResolvedValue(mockSearchHistory);

      const result = await stockListService.getSearchTermFromRedis(userId);

      expect(result).toEqual(mockSearchHistory);
      expect(result).toHaveLength(3);
    });
  });
});
