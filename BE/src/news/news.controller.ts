import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { NewsService } from './news.service';
import { NewsResponseDto } from './dto/news-response.dto';

@ApiTags('뉴스 API')
@Controller('/api/news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: '뉴스 조회 성공',
    type: [NewsResponseDto],
  })
  async getNews() {
    return this.newsService.getNews();
  }
}
