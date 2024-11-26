import { Controller, Get, Param } from '@nestjs/common';
import { NewsService } from './news.service';

@Controller('/api/news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get(':query')
  async getNews(@Param('query') query: string) {
    return this.newsService.getNewsDataByQuery(query);
  }
}
