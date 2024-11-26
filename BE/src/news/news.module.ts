import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NaverApiDomianService } from './naver-api-domian.service';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { NewsRepository } from './interface/news.repository';
import { News } from './news.entity';

@Module({
  controllers: [NewsController],
  providers: [NewsService, NaverApiDomianService, NewsRepository],
  imports: [TypeOrmModule.forFeature([News])],
})
export class NewsModule {}
