import { ApiProperty } from '@nestjs/swagger';
import { StockIndexResponseElementDto } from './stock.index.response.element.dto';

export class StockIndexResponseDto {
  @ApiProperty({
    description: '코스피 지수',
    type: StockIndexResponseElementDto,
  })
  KOSPI: StockIndexResponseElementDto;

  @ApiProperty({
    description: '코스닥 지수',
    type: StockIndexResponseElementDto,
  })
  KOSDAQ: StockIndexResponseElementDto;

  @ApiProperty({
    description: '코스피200 지수',
    type: StockIndexResponseElementDto,
  })
  KOSPI200: StockIndexResponseElementDto;

  @ApiProperty({
    description: 'KSQ150 지수',
    type: StockIndexResponseElementDto,
  })
  KSQ150: StockIndexResponseElementDto;
}
