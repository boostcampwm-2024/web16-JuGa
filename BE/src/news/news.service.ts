import axios from 'axios';
import * as cheerio from 'cheerio';
import { Injectable } from '@nestjs/common';
import { NewsValue } from './interface/news-value.interface';

@Injectable()
export class NewsService {
  private readonly URL = 'https://news.naver.com/breakingnews/section/101/258';

  /**
   * 이거 자체를 1시간에 한번 뭐 이렇게 반복하게 해서 DB에 저장하고
   * (중복 데이터도 있을테니 계속 쌓이게말고 싹 다 지우고 업데이트 한다거나.. 그런 식으로?)
   * 클라이언트 측에서는 그냥 db에 있는 값 꺼내오는거로
   */
  async crawlNews() {
    const response = await axios.get(this.URL);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const $ = cheerio.load(response.data);
    const newsArray: NewsValue[] = [];

    $('.sa_item').each((_, element) => {
      const $item = $(element);

      const imageUrl = $item.find('.sa_thumb_inner img').attr('data-src') || '';
      const newsUrl = $item.find('a.sa_text_title').attr('href');
      const title = $item.find('a.sa_text_title').text().trim();
      const description = $item.find('.sa_text_lede').text().trim();
      const press = $item.find('.sa_text_press').text().trim();
      const time = $item.find('.sa_text_datetime').text().trim();

      newsArray.push({
        imageUrl,
        newsUrl,
        title,
        description,
        press,
        time,
      });
    });

    return [newsArray.length, newsArray];
  }
}
