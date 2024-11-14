import { ApiProperty } from '@nestjs/swagger';

export class StockIndexValueElementDto {
  constructor(value: string, diff: string, diffRate: string, sign: string) {
    this.curr_value = value;
    this.diff = diff;
    this.diff_rate = diffRate;
    this.sign = sign;
  }

  @ApiProperty({ description: '주가 지수' })
  curr_value: string;

  @ApiProperty({ description: '전일 대비 등락' })
  diff: string;

  @ApiProperty({ description: '전일 대비 등락률' })
  diff_rate: string;

  @ApiProperty({ description: '부호... 인데 추후에 알아봐야 함' })
  sign: string;
}
