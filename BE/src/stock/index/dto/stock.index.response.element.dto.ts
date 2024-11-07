import { ApiProperty } from '@nestjs/swagger';
import { StockIndexValueElementDto } from './stock.index.value.element.dto';
import { StockIndexListElementDto } from './stock.index.list.element.dto';

export class StockIndexResponseElementDto {
  @ApiProperty({
    description: '코스피: 0001, 코스닥: 1001, 코스피200: 2001, KSQ150: 3003',
  })
  code: string;

  @ApiProperty({ description: '실시간 값', type: StockIndexValueElementDto })
  value: StockIndexValueElementDto;

  @ApiProperty({ description: '실시간 차트', type: StockIndexListElementDto })
  chart: StockIndexListElementDto;
}
