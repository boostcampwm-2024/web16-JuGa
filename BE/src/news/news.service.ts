import { Injectable } from '@nestjs/common';
import { NaverApiDomianService } from './naver-api-domian.service';
import { NewsApiResponse } from './interface/news-value.interface';
import { NewsDataOutputDto } from './dto/news-data-output.dto';
import { NewsResponseDto } from './dto/news-response.dto';

@Injectable()
export class NewsService {
  constructor(private readonly naverApiDomainService: NaverApiDomianService) {}

  async getNewsDataByQuery(value: string) {
    const queryParams = {
      query: value,
    };

    const response =
      await this.naverApiDomainService.requestApi<NewsApiResponse>(queryParams);
    return this.formatNewsData(value, response.items);
  }

  private formatNewsData(query: string, items: NewsDataOutputDto[]) {
    return items.slice(0, 5).map((item) => {
      const result = new NewsResponseDto();

      result.title = item.title.replace(/<\/?b>/g, '');
      result.description = item.description.replace(/<\/?b>/g, '');
      result.originallink = item.originallink;
      result.pubDate = item.pubDate;
      result.query = query;

      return result;
    });
  }
}
