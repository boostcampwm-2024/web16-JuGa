import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { NaverApiDomianService } from './naver-api-domian.service';

@Module({
  controllers: [NewsController],
  providers: [NewsService, NaverApiDomianService],
})
export class NewsModule {}
