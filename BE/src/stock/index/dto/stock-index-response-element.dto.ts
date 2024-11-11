import { ApiProperty } from '@nestjs/swagger';
import { StockIndexValueElementDto } from './stock-index-value-element.dto';
import { StockIndexListChartElementDto } from './stock-index-list-chart.element.dto';

export class StockIndexResponseElementDto {
  @ApiProperty({ description: '실시간 값', type: StockIndexValueElementDto })
  value: StockIndexValueElementDto;

  @ApiProperty({
    description: '실시간 차트',
    type: [StockIndexListChartElementDto],
  })
  chart: StockIndexListChartElementDto[];
}
