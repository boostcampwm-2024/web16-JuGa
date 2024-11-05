import {ApiProperty} from "@nestjs/swagger";

class StockIndexListChartElementDto {
  @ApiProperty({ description: 'HHMMSS', example: '130500' })
  time: string;

  @ApiProperty({ description: '주가 지수' })
  value: string;
}

export class StockIndexListElementDto {
  @ApiProperty({description: '코스피: 0001, 코스닥: 1001'})
  code: string;

  @ApiProperty({type: [StockIndexListChartElementDto]})
  chart: StockIndexListChartElementDto[];
}