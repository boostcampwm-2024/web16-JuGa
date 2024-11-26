import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { News } from './news.entity';

@Injectable()
export class NewsRepository extends Repository<News> {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    super(News, dataSource.createEntityManager());
  }
}
