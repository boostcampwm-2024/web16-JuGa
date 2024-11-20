import { Injectable } from '@nestjs/common';
import { RedisDomainService } from 'src/common/redis/redis.domain-service';
import { AssetRepository } from 'src/asset/asset.repository';
import { Cron } from '@nestjs/schedule';
import { RankingRepository } from './ranking.repository';
import { SortType } from './enum/sort-type.enum';
import { Ranking } from './ranking.entity';

@Injectable()
export class RankingService {
  constructor(
    private readonly rankingRepository: RankingRepository,
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

    const ranking = await this.rankingRepository.getRanking(sortBy);

    await Promise.all(
      ranking.map((rank) =>
        this.redisDomainService.zadd(
          key,
          this.getSortScore(rank, sortBy),
          rank.user.email,
        ),
      ),
    );

    return {
      topRank: await this.redisDomainService.zrevrange(key, 0, 9),
      userRank: null,
    };
  }

  async getRankingAuthUser(
    email: string,
    sortBy: SortType = SortType.PROFIT_RATE,
  ) {
    const date = new Date().toISOString().slice(0, 10);
    const key = `ranking:${date}:${sortBy}`;

    let userRank = null;

    if (await this.redisDomainService.exists(key)) {
      userRank = this.redisDomainService.zrevrank(key, email);

      return {
        topRank: await this.redisDomainService.zrevrange(key, 0, 9),
        userRank: userRank ? userRank + 1 : null,
      };
    }

    const ranking = await this.rankingRepository.getRanking(sortBy);

    await Promise.all(
      ranking.map((rank) =>
        this.redisDomainService.zadd(
          key,
          this.getSortScore(rank, sortBy),
          rank.user.email,
        ),
      ),
    );

    userRank = await this.redisDomainService.zrevrank(key, email);

    return {
      topRank: await this.redisDomainService.zrevrange(key, 0, 9),
      userRank: userRank ? userRank + 1 : null,
    };
  }

  @Cron('0 16 * * 1-5')
  async updateRanking() {
    const assets = await this.assetRepository.getAssets();
    const ranking = assets
      .map((asset) => ({
        userId: asset.user_id,
        profit: asset.total_profit,
        profitRate: asset.total_profit_rate,
      }))
      .sort((a, b) => b.profitRate - a.profitRate);

    await this.rankingRepository.clearRanking();
    await this.rankingRepository.setRanking(ranking);
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
