import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bookmark } from './stock-bookmark.entity';
import { StockBookmarkController } from './stock-bookmark.controller';
import { StockBookmarkRepository } from './stock-bookmark.repository';
import { StockBookmarkService } from './stock-bookmark.service';

@Module({
  imports: [TypeOrmModule.forFeature([Bookmark])],
  controllers: [StockBookmarkController],
  providers: [StockBookmarkRepository, StockBookmarkService],
})
export class StockBookmarkModule {}
