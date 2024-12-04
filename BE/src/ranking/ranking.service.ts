import { Injectable } from '@nestjs/common';
import { RedisDomainService } from '../common/redis/redis.domain-service';
import { AssetRepository } from '../asset/asset.repository';
import { Cron } from '@nestjs/schedule';
import { SortType } from './enum/sort-type.enum';
import { Ranking } from './interface/ranking.interface';
import { RankingResponseDto } from './dto/ranking-response.dto';
import { RankingResultDto } from './dto/ranking-result.dto';
import { RankingDataDto } from './dto/ranking-data.dto';

@Injectable()
export class RankingService {
  constructor(
    private readonly assetRepository: AssetRepository,
    private readonly redisDomainService: RedisDomainService,
  ) {}

  async getRanking(): Promise<RankingResponseDto> {
    const profitRateRanking = await this.getRankingData(SortType.PROFIT_RATE);
    const assetRanking = await this.getRankingData(SortType.ASSET);

    return { profitRateRanking, assetRanking };
  }

  async getRankingAuthUser(userId: string): Promise<RankingResponseDto> {
    const profitRateRanking = await this.getRankingData(SortType.PROFIT_RATE, {
      userId,
    });
    const assetRanking = await this.getRankingData(SortType.ASSET, {
      userId,
    });
    return { profitRateRanking, assetRanking };
  }

  private async getRankingData(
    sortBy: SortType,
    options: { userId?: string } = { userId: null },
  ): Promise<RankingResultDto> {
    const date = new Date().toISOString().slice(0, 10);
    const key = `ranking:${date}:${sortBy}`;

    if (!(await this.redisDomainService.exists(key))) {
      const ranking = await this.calculateRanking(sortBy);
      await Promise.all(
        ranking.map((rank: Ranking) =>
          this.redisDomainService.zadd(
            key,
            this.getSortScore(rank, sortBy),
            sortBy === SortType.PROFIT_RATE
              ? JSON.stringify({
                  nickname: rank.nickname,
                  userId: rank.userId,
                  value: Math.trunc(rank.profitRate * 100) / 100,
                })
              : JSON.stringify({
                  nickname: rank.nickname,
                  userId: rank.userId,
                  value: rank.totalAsset,
                }),
          ),
        ),
      );
    }

    const findUserRankWithValue = async () => {
      if (!options.userId) return null;

      const members = await this.redisDomainService.zrange(key, 0, -1);
      const userMember = members.find((member) => {
        const parsed = JSON.parse(member);
        return parsed.userId === options.userId;
      });

      const parsedUserMember = JSON.parse(userMember);
      return userMember
        ? {
            nickname: parsedUserMember.nickname,
            rank: (await this.redisDomainService.zrevrank(key, userMember)) + 1,
            userId: parsedUserMember.userId,
            value:
              sortBy === SortType.PROFIT_RATE
                ? parsedUserMember.value
                : parsedUserMember.value,
          }
        : null;
    };

    const userRankWithValue = await findUserRankWithValue();

    const [topRank, userRank] = await Promise.all([
      this.redisDomainService.zrevrange(key, 0, 9),
      userRankWithValue,
    ]);

    const parsedTopRank: RankingDataDto[] = topRank.map((rank) => {
      const { nickname, value, userId } = JSON.parse(rank);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return { userId, nickname, rank: topRank.indexOf(rank) + 1, value };
    });

    return {
      topRank: parsedTopRank,
      userRank,
    };
  }

  @Cron('*/1 8-16 * * 1-5')
  async updateRanking() {
    const [profitRateRanking, assetRanking] = await Promise.all([
      this.calculateRanking(SortType.PROFIT_RATE),
      this.calculateRanking(SortType.ASSET),
    ]);

    const date = new Date().toISOString().slice(0, 10);
    const profitRateKey = `ranking:${date}:${SortType.PROFIT_RATE}`;
    const assetKey = `ranking:${date}:${SortType.ASSET}`;

    await Promise.all([
      this.redisDomainService.del(profitRateKey),
      this.redisDomainService.del(assetKey),
    ]);

    await Promise.all([
      Promise.all(
        profitRateRanking.map((rank: Ranking) =>
          this.redisDomainService.zadd(
            profitRateKey,
            this.getSortScore(rank, SortType.PROFIT_RATE),
            JSON.stringify({
              nickname: rank.nickname,
              userId: rank.userId,
              value: Math.trunc(rank.profitRate * 100) / 100,
            }),
          ),
        ),
      ),
      Promise.all(
        assetRanking.map((rank: Ranking) =>
          this.redisDomainService.zadd(
            assetKey,
            this.getSortScore(rank, SortType.ASSET),
            JSON.stringify({
              nickname: rank.nickname,
              userId: rank.userId,
              value: rank.totalAsset,
            }),
          ),
        ),
      ),
    ]);
  }

  async calculateRanking(sortBy: SortType) {
    const assets = await this.assetRepository.getAssets();
    const ranking = assets
      .map((asset) => ({
        id: asset.id,
        userId: asset.user_id,
        nickname: asset.nickname,
        totalAsset: asset.total_asset,
        profitRate:
          ((asset.total_asset - asset.prev_total_asset) /
            asset.prev_total_asset) *
          100,
      }))
      .sort((a, b) =>
        sortBy === SortType.PROFIT_RATE
          ? b.profitRate - a.profitRate
          : b.totalAsset - a.totalAsset,
      );

    return ranking;
  }

  private getSortScore(rank: Ranking, sortBy: SortType) {
    switch (sortBy) {
      case SortType.PROFIT_RATE:
        return rank.profitRate;
      case SortType.ASSET:
        return rank.totalAsset;
      default:
        return rank.profitRate;
    }
  }
}
