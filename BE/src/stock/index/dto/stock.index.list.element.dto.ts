import { ApiProperty } from '@nestjs/swagger';
import { StockIndexListChartElementDto } from './stock.index.list.chart.element.dto';

export class StockIndexListElementDto {
  constructor(code: string, chart: StockIndexListChartElementDto[]) {
    this.code = code;
    this.chart = chart;
  }

  @ApiProperty({ description: '코스피: 0001, 코스닥: 1001' })
  code: string;

  @ApiProperty({ type: [StockIndexListChartElementDto] })
  chart: StockIndexListChartElementDto[];
}
