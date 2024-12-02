import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, In } from 'typeorm';
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
    @InjectDataSource() private dataSource: DataSource,
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

  // @Cron('*/30 8-16 * * 1-5')
  async cronNewsData() {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      if (!queryRunner.isTransactionActive) {
        await queryRunner.startTransaction('SERIALIZABLE');
      }

      await this.newsRepository.delete({ query: In(['증권', '주식']) });
      const stockNews = await this.getNewsDataByQuery('주식');
      const securityNews = await this.getNewsDataByQuery('증권');

      const allNews = [...stockNews, ...securityNews];
      const uniqueNews = allNews.filter(
        (news, index) =>
          allNews.findIndex((i) => i.originallink === news.originallink) ===
          index,
      );

      await this.newsRepository.save(uniqueNews);
      await this.newsRepository.update(
        {},
        {
          updatedAt: new Date(),
        },
      );

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(err);
    } finally {
      await queryRunner.release();
    }
  }

  private async getNewsDataByQuery(value: string) {
    const queryParams = {
      query: value,
    };

    const response =
      await this.naverApiDomainService.requestApi<NewsApiResponse>(queryParams);
    return this.newsRepository.save(this.formatNewsData(value, response.items));
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
