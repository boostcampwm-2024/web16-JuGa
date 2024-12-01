import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { In } from 'typeorm';
import { NaverApiDomianService } from './naver-api-domian.service';
import { NewsApiResponse } from './interface/news-value.interface';
import { NewsDataOutputDto } from './dto/news-data-output.dto';
import { NewsItemDataDto } from './dto/news-item-data.dto';
import { NewsResponseDto } from './dto/news-response.dto';
import { NewsRepository } from './news.repository';
import { News } from './news.entity';

@Injectable()
export class NewsService {
  constructor(
    private readonly naverApiDomainService: NaverApiDomianService,
    private readonly newsRepository: NewsRepository,
  ) {}

  async getNews(): Promise<NewsResponseDto> {
    const dbData: News[] = await this.newsRepository.find({
      select: {
        title: true,
        description: true,
        pubDate: true,
        originallink: true,
        query: true,
        updatedAt: true,
      },
      order: { pubDate: 'DESC' },
    });

    const updateTime = dbData[0].updatedAt;
    const formattedNewsData = dbData.map(
      ({ title, description, pubDate, originallink, query }) => ({
        title,
        description,
        pubDate,
        originallink,
        query,
      }),
    );

    return {
      updatedAt: updateTime,
      news: formattedNewsData,
    };
  }

  @Cron('*/1 8-16 * * 1-5')
  async cronNewsData() {
    await this.newsRepository.delete({ query: In(['증권', '주식']) });
    await this.getNewsDataByQuery('주식');
    await this.getNewsDataByQuery('증권');

    await this.newsRepository.update(
      {},
      {
        updatedAt: new Date(),
      },
    );
  }

  private async getNewsDataByQuery(value: string) {
    const queryParams = {
      query: value,
    };

    const response =
      await this.naverApiDomainService.requestApi<NewsApiResponse>(queryParams);
    const formattedData = this.formatNewsData(value, response.items);

    return this.newsRepository.save(formattedData);
  }

  private formatNewsData(query: string, items: NewsDataOutputDto[]) {
    return items.slice(0, 10).map((item) => {
      const result = new NewsItemDataDto();

      result.title = this.htmlEncode(item.title);
      result.description = this.htmlEncode(item.description);
      result.originallink = item.originallink;
      result.pubDate = item.pubDate;
      result.query = query;

      return result;
    });
  }

  private htmlEncode(value: string) {
    return value
      .replace(/<\/?b>/g, '')
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&');
  }
}
