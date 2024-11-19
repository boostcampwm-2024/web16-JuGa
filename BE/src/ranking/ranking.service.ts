import { Injectable } from '@nestjs/common';
import { RedisDomainService } from 'src/common/redis/redis.domain-service';
import { AssetRepository } from 'src/asset/asset.repository';
import { Cron } from '@nestjs/schedule';
import { RankingRepository } from './ranking.repository';

@Injectable()
export class RankingService {
  constructor(
    private readonly rankingRepository: RankingRepository,
    private readonly assetRepository: AssetRepository,
    private readonly redisDomainService: RedisDomainService,
  ) {}

  async getRanking() {
    const date = new Date().toISOString().slice(0, 10);
    const key = `ranking:${date}`;

    if (await this.redisDomainService.exists(key)) {
      return this.redisDomainService.zrevrange(key, 0, 9);
    }

    const ranking = await this.rankingRepository.getRanking();

    await Promise.all(
      ranking.map((rank) =>
        this.redisDomainService.zadd(key, rank.profitRate, rank.user.email),
      ),
    );

    return {
      topRank: await this.redisDomainService.zrevrange(key, 0, 9),
    };
  }

  async getRankingAuthUser(email: string) {
    const date = new Date().toISOString().slice(0, 10);
    const key = `ranking:${date}`;

    if (await this.redisDomainService.exists(key)) {
      const userRank = await this.redisDomainService.zrevrank(key, email);
      return {
        topRank: await this.redisDomainService.zrevrange(key, 0, 9),
        userRank: userRank !== null ? userRank + 1 : null,
      };
    }

    const ranking = await this.rankingRepository.getRanking();

    await Promise.all(
      ranking.map((rank) =>
        this.redisDomainService.zadd(key, rank.profitRate, rank.user.email),
      ),
    );

    const userRank = await this.redisDomainService.zrevrank(key, email);

    return {
      topRank: await this.redisDomainService.zrevrange(key, 0, 9),
      userRank: userRank ? userRank + 1 : null,
    };
  }

  @Cron('0 35 3 * * *')
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
}
