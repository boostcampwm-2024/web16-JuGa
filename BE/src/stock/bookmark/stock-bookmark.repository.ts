import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Bookmark } from './stock-bookmark.entity';
import { BookmarkInterface } from './interface/bookmark.interface';

@Injectable()
export class StockBookmarkRepository extends Repository<Bookmark> {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    super(Bookmark, dataSource.createEntityManager());
  }

  async findBookmarkWithNameByUserId(userId) {
    return this.createQueryBuilder('b')
      .leftJoinAndSelect('stocks', 's', 's.code = b.stock_code')
      .where('b.user_id = :userId', { userId })
      .getRawMany<BookmarkInterface>();
  }
}
