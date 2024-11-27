import { ApiProperty } from '@nestjs/swagger';
import { NewsItemDataDto } from './news-item-data.dto';

export class NewsResponseDto {
  @ApiProperty({ description: '마지막 업데이트 시간' })
  updatedAt: Date;

  @ApiProperty({ description: '뉴스 목록', type: [NewsItemDataDto] })
  news: NewsItemDataDto[];
}
