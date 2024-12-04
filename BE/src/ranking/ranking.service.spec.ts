import { RankingService } from './ranking.service';
import { RedisDomainService } from '../common/redis/redis.domain-service';
import { Test } from '@nestjs/testing';
import { AssetRepository } from '../asset/asset.repository';
import { SortType } from './enum/sort-type.enum';

describe('Ranking Service 테스트', () => {
  let rankingService: RankingService;
  let assetRepository: AssetRepository;
  let redisDomainService: RedisDomainService;

  const mockAssets = [
    {
      id: 1,
      user_id: '1',
      nickname: 'user1',
      total_asset: 15000000,
      prev_total_asset: 10000000,
    },
    {
      id: 2,
      user_id: '2',
      nickname: 'user2',
      total_asset: 12000000,
      prev_total_asset: 10000000,
    },
    {
      id: 3,
      user_id: '3',
      nickname: 'user3',
      total_asset: 8000000,
      prev_total_asset: 10000000,
    },
  ];

  beforeEach(async () => {
    const mockAssetRepository = {
      getAssets: jest.fn(),
    };

    const mockRedisDomainService = {
      exists: jest.fn(),
      zadd: jest.fn(),
      zrange: jest.fn(),
      zrevrange: jest.fn(),
      zrevrank: jest.fn(),
      del: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        RankingService,
        { provide: AssetRepository, useValue: mockAssetRepository },
        { provide: RedisDomainService, useValue: mockRedisDomainService },
      ],
    }).compile();

    rankingService = module.get<RankingService>(RankingService);
    assetRepository = module.get<AssetRepository>(AssetRepository);
    redisDomainService = module.get<RedisDomainService>(RedisDomainService);
  });

  describe('로그인 되지 않은 유저 전체 랭킹 조회 테스트', () => {
    it('랭킹 조회시, 수익률과 총자산 랭킹이 모두 반환된다.', async () => {
      jest
        .spyOn(redisDomainService, 'exists')
        .mockResolvedValue(Promise.resolve(1));

      jest.spyOn(redisDomainService, 'zrevrange').mockResolvedValue([
        JSON.stringify({
          userId: '1',
          nickname: 'user1',
          value: 50,
        }),
        JSON.stringify({
          userId: '2',
          nickname: 'user2',
          value: 20,
        }),
        JSON.stringify({
          userId: '3',
          nickname: 'user3',
          value: -20,
        }),
      ]);

      const result = await rankingService.getRanking();

      expect(result).toHaveProperty('profitRateRanking');
      expect(result).toHaveProperty('assetRanking');
      expect(result.profitRateRanking.topRank).toHaveLength(3);
      expect(result.assetRanking.topRank).toHaveLength(3);
    });

    it('Redis에 랭킹 데이터가 없을 경우, 새로 계산하여 저장한다.', async () => {
      jest
        .spyOn(redisDomainService, 'exists')
        .mockResolvedValue(Promise.resolve(0));

      jest.spyOn(assetRepository, 'getAssets').mockResolvedValue(mockAssets);
      const zaddSpy = jest
        .spyOn(redisDomainService, 'zadd')
        .mockResolvedValue(1);

      jest.spyOn(redisDomainService, 'zrevrange').mockResolvedValue([
        JSON.stringify({
          userId: '1',
          nickname: 'user1',
          value: 50,
        }),
        JSON.stringify({
          userId: '2',
          nickname: 'user2',
          value: 20,
        }),
        JSON.stringify({
          userId: '3',
          nickname: 'user3',
          value: -20,
        }),
      ]);

      await rankingService.getRanking();
      expect(zaddSpy).toHaveBeenCalled();
    });

    describe('로그인 된 사용자 랭킹 조회 테스트', () => {
      it('인증된 사용자의 랭킹 조회 시, 본인의 랭킹 정보도 함께 반환된다.', async () => {
        const userId = '1';
        const mockProfitRateData = [
          JSON.stringify({
            userId: '1',
            nickname: 'user1',
            value: 50,
          }),
          JSON.stringify({
            userId: '2',
            nickname: 'user2',
            value: 20,
          }),
          JSON.stringify({
            userId: '3',
            nickname: 'user3',
            value: -20,
          }),
        ];

        const mockAssetData = [
          JSON.stringify({
            userId: '1',
            nickname: 'user1',
            value: 15000000,
          }),
          JSON.stringify({
            userId: '2',
            nickname: 'user2',
            value: 12000000,
          }),
          JSON.stringify({
            userId: '3',
            nickname: 'user3',
            value: 8000000,
          }),
        ];

        jest.spyOn(redisDomainService, 'exists').mockResolvedValue(1);
        jest.spyOn(redisDomainService, 'zrevrange').mockResolvedValue([
          JSON.stringify({
            userId: '1',
            nickname: 'user1',
            value: 50,
          }),
          JSON.stringify({
            userId: '2',
            nickname: 'user2',
            value: 20,
          }),
          JSON.stringify({
            userId: '3',
            nickname: 'user3',
            value: -20,
          }),
        ]);

        const zrangeSpy = jest.spyOn(redisDomainService, 'zrange');
        zrangeSpy.mockImplementation((key) => {
          if (key.includes('profitRate')) {
            return Promise.resolve(mockProfitRateData);
          } else {
            return Promise.resolve(mockAssetData);
          }
        });
        jest.spyOn(redisDomainService, 'zrevrank').mockResolvedValue(0);
        jest.spyOn(redisDomainService, 'zrevrange').mockResolvedValue([
          JSON.stringify({
            userId: '1',
            nickname: 'user1',
            value: 50,
          }),
        ]);

        const result = await rankingService.getRankingAuthUser(userId);

        expect(result).toHaveProperty('profitRateRanking');
        expect(result).toHaveProperty('assetRanking');
        expect(result.profitRateRanking.userRank.userId).toBe(userId);
        expect(result.profitRateRanking.userRank.value).toBe(50);
        expect(result.profitRateRanking.userRank.rank).toBe(1);
        expect(result.assetRanking.userRank.userId).toBe(userId);
        expect(result.assetRanking.userRank.rank).toBe(1);
        expect(result.assetRanking.userRank.value).toBe(15000000);
      });
    });

    describe('랭킹 계산 테스트', () => {
      it('수익률 기준으로 랭킹이 정렬된다.', async () => {
        jest.spyOn(assetRepository, 'getAssets').mockResolvedValue(mockAssets);

        const result = await rankingService.calculateRanking(
          SortType.PROFIT_RATE,
        );

        expect(result).toHaveLength(3);
        expect(result[0].userId).toBe('1');
        expect(result[1].userId).toBe('2');
        expect(result[2].userId).toBe('3');
      });

      it('총자산 기준으로 랭킹이 정렬된다', async () => {
        jest.spyOn(assetRepository, 'getAssets').mockResolvedValue(mockAssets);

        const result = await rankingService.calculateRanking(SortType.ASSET);

        expect(result).toHaveLength(3);
        expect(result[0].userId).toBe('1');
        expect(result[1].userId).toBe('2');
        expect(result[2].userId).toBe('3');
      });
    });

    describe('랭킹 업데이트 테스트', () => {
      it('랭킹 업데이트 시, Redis의 기존 데이터를 삭제하고 새로운 데이터를 저장한다.', async () => {
        jest.spyOn(assetRepository, 'getAssets').mockResolvedValue(mockAssets);

        const delSpy = jest
          .spyOn(redisDomainService, 'del')
          .mockResolvedValue(1);
        const zaddSpy = jest
          .spyOn(redisDomainService, 'zadd')
          .mockResolvedValue(1);

        await rankingService.updateRanking();

        expect(delSpy).toHaveBeenCalledTimes(2);
        expect(zaddSpy).toHaveBeenCalledTimes(6);
      });
    });
  });
});
