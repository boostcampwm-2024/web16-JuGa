import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Ranking } from './ranking.entity';

@Injectable()
export class RankingRepository extends Repository<Ranking> {
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super(Ranking, dataSource.createEntityManager());
  }

  async getRanking(): Promise<Ranking[]> {
    const ranking = await this.createQueryBuilder('ranking')
      .select([
        'ranking.id',
        'ranking.profit',
        'ranking.profitRate',
        'user.email',
      ])
      .leftJoin('ranking.user', 'user')
      .orderBy('ranking.profitRate', 'DESC')
      .getMany();
    return ranking;
  }

  async clearRanking(): Promise<void> {
    await this.createQueryBuilder().delete().from(Ranking).execute();
  }

  async setRanking(
    rankingData: { userId: number; profit: number; profitRate: number }[],
  ) {
    const rankings = this.create(
      rankingData.map((data) => ({
        user: { id: data.userId },
        profit: data.profit,
        profitRate: data.profitRate,
      })),
    );

    return this.save(rankings);
  }
}
