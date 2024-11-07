import { ApiProperty } from '@nestjs/swagger';

export class StockIndexValueElementDto {
  constructor(
    code: string,
    value: string,
    diff: string,
    diffRate: string,
    sign: string,
  ) {
    this.code = code;
    this.value = value;
    this.diff = diff;
    this.diffRate = diffRate;
    this.sign = sign;
  }

  @ApiProperty({
    description: '코스피: 0001, 코스닥: 1001, 코스피200: 2001, KSQ150: 3003',
  })
  code: string;

  @ApiProperty({ description: '주가 지수' })
  value: string;

  @ApiProperty({ description: '전일 대비 등락' })
  diff: string;

  @ApiProperty({ description: '전일 대비 등락률' })
  diffRate: string;

  @ApiProperty({ description: '부호... 인데 추후에 알아봐야 함' })
  sign: string;
}
