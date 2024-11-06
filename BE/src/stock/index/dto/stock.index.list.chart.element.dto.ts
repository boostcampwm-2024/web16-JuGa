import { ApiProperty } from '@nestjs/swagger';

export class StockIndexListChartElementDto {
  constructor(time: string, value: string) {
    this.time = time;
    this.value = value;
  }

  @ApiProperty({ description: 'HHMMSS', example: '130500' })
  time: string;

  @ApiProperty({ description: '주가 지수' })
  value: string;
}
