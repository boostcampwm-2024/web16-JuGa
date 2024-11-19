import { Injectable } from '@nestjs/common';
import { Ranking } from './ranking.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class RankingRepository extends Repository<Ranking> {
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super(Ranking, dataSource.createEntityManager());
  }

  async getRanking() {
    const ranking = await this.createQueryBuilder('ranking')
      .select([
        'ranking.id',
        'ranking.profit',
        'ranking.profitRate',
        'user.email',
      ])
      .leftJoin('ranking.user', 'user')
      .orderBy('ranking.profit', 'DESC')
      .getMany();
    return ranking;
  }

  async clearRanking() {
    this.createQueryBuilder().delete().from(Ranking).execute;
  }

  async setRanking(userId: number, profit: number, profitRate: number) {
    const ranking = this.create({
      user: { id: userId },
      profit,
      profitRate,
    });

    return await this.save(ranking);
  }
}
