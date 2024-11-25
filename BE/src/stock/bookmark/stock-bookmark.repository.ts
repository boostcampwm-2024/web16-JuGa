import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Bookmark } from './stock-bookmark.entity';

@Injectable()
export class StockBookmarkRepository extends Repository<Bookmark> {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    super(Bookmark, dataSource.createEntityManager());
  }
}
