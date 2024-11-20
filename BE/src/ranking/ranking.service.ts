import { Injectable } from '@nestjs/common';
import { RedisDomainService } from 'src/common/redis/redis.domain-service';
import { AssetRepository } from 'src/asset/asset.repository';
import { Cron } from '@nestjs/schedule';
import { SortType } from './enum/sort-type.enum';
import { Ranking } from './interface/ranking.interface';

@Injectable()
export class RankingService {
  constructor(
    private readonly assetRepository: AssetRepository,
    private readonly redisDomainService: RedisDomainService,
  ) {}

  async getRanking(sortBy: SortType = SortType.PROFIT_RATE) {
    const date = new Date().toISOString().slice(0, 10);
    const key = `ranking:${date}:${sortBy}`;

    if (await this.redisDomainService.exists(key)) {
      return {
        topRank: await this.redisDomainService.zrevrange(key, 0, 9),
        userRank: null,
      };
    }

    const ranking = await this.calculateRanking(sortBy);

    await Promise.all(
      ranking.map((rank: Ranking) =>
        this.redisDomainService.zadd(
          key,
          this.getSortScore(rank, sortBy),
          rank.nickname,
        ),
      ),
    );

    return {
      topRank: await this.redisDomainService.zrevrange(key, 0, 9),
      userRank: null,
    };
  }

  async getRankingAuthUser(
    nickname: string,
    sortBy: SortType = SortType.PROFIT_RATE,
  ) {
    const date = new Date().toISOString().slice(0, 10);
    const key = `ranking:${date}:${sortBy}`;

    let userRank = null;

    if (await this.redisDomainService.exists(key)) {
      userRank = await this.redisDomainService.zrevrank(key, nickname);

      return {
        topRank: await this.redisDomainService.zrevrange(key, 0, 9),
        userRank: userRank !== null ? userRank + 1 : null,
      };
    }

    const ranking = await this.calculateRanking(sortBy);
    await Promise.all(
      ranking.map((rank: Ranking) =>
        this.redisDomainService.zadd(
          key,
          this.getSortScore(rank, sortBy),
          rank.nickname,
        ),
      ),
    );

    userRank = await this.redisDomainService.zrevrank(key, nickname);

    return {
      topRank: await this.redisDomainService.zrevrange(key, 0, 9),
      userRank: userRank ? userRank + 1 : null,
    };
  }

  @Cron('0 16 * * 1-5')
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
            rank.profitRate,
            rank.nickname,
          ),
        ),
      ),
      Promise.all(
        assetRanking.map((rank: Ranking) =>
          this.redisDomainService.zadd(
            assetKey,
            rank.totalAsset,
            rank.nickname,
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
