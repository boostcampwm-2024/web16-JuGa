import { ApiProperty } from '@nestjs/swagger';

export class StockIndexListChartElementDto {
  constructor(time: string, value: string, diff: string) {
    this.time = time;
    this.value = value;
    this.diff = diff;
  }

  @ApiProperty({ description: 'HHMMSS', example: '130500' })
  time: string;

  @ApiProperty({ description: '주가 지수' })
  value: string;

  @ApiProperty({ description: '전일 대비 주가 지수' })
  diff: string;
}
