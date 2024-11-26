import { NewsDataOutputDto } from '../dto/news-data-output.dto';

export interface NewsApiResponse {
  lastBuildDate: string;
  total: number;
  start: number;
  display: number;
  item: NewsDataOutputDto[];
}
