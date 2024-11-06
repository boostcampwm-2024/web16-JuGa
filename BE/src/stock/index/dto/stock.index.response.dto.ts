import { ApiProperty } from '@nestjs/swagger';
import { StockIndexListElementDto } from './stock.index.list.element.dto';
import { StockIndexValueElementDto } from './stock.index.value.element.dto';

export class StockIndexResponseDto {
  constructor(
    indexList: StockIndexListElementDto[],
    indexValue: StockIndexValueElementDto[],
  ) {
    this.indexList = indexList;
    this.indexValue = indexValue;
  }

  @ApiProperty({
    description: '주가 지수 차트 정보 (코스피, 코스닥, 코스피200, KSQ150)',
    type: [StockIndexListElementDto],
  })
  indexList: StockIndexListElementDto[];

  @ApiProperty({
    description: '주가 지수 실시간 값 정보 (코스피, 코스닥, 코스피200, KSQ150)',
    type: [StockIndexValueElementDto],
  })
  indexValue: StockIndexValueElementDto[];
}
