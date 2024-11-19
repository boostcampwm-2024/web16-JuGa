import { Injectable } from '@nestjs/common';
import { RankingRepository } from './ranking.repository';
import { RedisDomainService } from 'src/common/redis/redis.domain-service';
import { AssetRepository } from 'src/asset/asset.repository';

@Injectable()
export class RankingService {
  constructor(
    private readonly rankingRepository: RankingRepository,
    private readonly redisDomainService: RedisDomainService,
  ) {}
  async getRanking() {
    const date = new Date().toISOString().slice(0, 10);

    const key = `ranking:${date}`;
    if (await this.redisDomainService.exists(key)) {
      return this.redisDomainService.zrevrange(key, 0, 99);
    }

    const ranking = await this.rankingRepository.getRanking();

    ranking.forEach((rank) => {
      this.redisDomainService.zadd(key, rank.profit, rank.user.email);
    });

    return this.redisDomainService.zrevrange(key, 0, 99);
  }
}
