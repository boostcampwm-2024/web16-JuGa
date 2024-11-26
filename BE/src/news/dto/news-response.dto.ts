import { ApiProperty } from '@nestjs/swagger';

export class NewsResponseDto {
  @ApiProperty({ description: '뉴스 기사 제목' })
  title: string;

  @ApiProperty({ description: '원문 URL' })
  originallink: string;

  @ApiProperty({ description: '뉴스 기사의 내용을 요약한 패시지 정보' })
  description: string;

  @ApiProperty({ description: '기사 원문이 제공된 시간' })
  pubDate: string;

  @ApiProperty({ description: '검색 키워드' })
  query: string;
}
