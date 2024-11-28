import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bookmark } from './stock-bookmark.entity';
import { StockBookmarkController } from './stock-bookmark.controller';
import { StockBookmarkRepository } from './stock-bookmark.repository';
import { StockBookmarkService } from './stock-bookmark.service';
import { StockDetailModule } from '../detail/stock-detail.module';

@Module({
  imports: [TypeOrmModule.forFeature([Bookmark]), StockDetailModule],
  controllers: [StockBookmarkController],
  providers: [StockBookmarkRepository, StockBookmarkService],
})
export class StockBookmarkModule {}
