import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Ranking } from './ranking.entity';

@Injectable()
export class RankingRepository extends Repository<Ranking> {
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super(Ranking, dataSource.createEntityManager());
  }

  async getRanking(sortBy): Promise<Ranking[]> {
    const ranking = await this.createQueryBuilder('ranking')
      .select([
        'ranking.id',
        'ranking.totalAsset',
        'ranking.profitRate',
        'user.nickname',
      ])
      .leftJoin('ranking.user', 'user')
      .orderBy(`ranking.${sortBy}`, 'DESC')
      .getMany();
    return ranking;
  }

  async clearRanking(): Promise<void> {
    await this.createQueryBuilder().delete().from(Ranking).execute();
  }

  async setRanking(
    rankingData: { userId: number; totalAsset: number; profitRate: number }[],
  ) {
    const rankings = this.create(
      rankingData.map((data) => ({
        user: { id: data.userId },
        totalAsset: data.totalAsset,
        profitRate: data.profitRate,
      })),
    );

    return this.save(rankings);
  }
}
