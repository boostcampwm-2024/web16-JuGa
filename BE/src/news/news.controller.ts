import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { NewsService } from './news.service';
import { NewsDatabaseResponseDto } from './dto/news-database-response.dto';

@ApiTags('뉴스 API')
@Controller('/api/news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: '뉴스 조회 성공',
    type: [NewsDatabaseResponseDto],
  })
  async getNews() {
    return this.newsService.getNews();
  }
}
