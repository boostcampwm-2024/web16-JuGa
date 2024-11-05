import {ApiProperty} from "@nestjs/swagger";

export class StockIndexValueElementDto {
  @ApiProperty({ description: '코스피: 0001, 코스닥: 1001' })
  code: string;

  @ApiProperty({ description: '주가 지수' })
  value: string;

  @ApiProperty({ description: '전일 대비 등락'})
  diff: string;

  @ApiProperty({ description: '전일 대비 등락률'})
  diffRate: string;

  @ApiProperty({ description: '부호... 인데 추후에 알아봐야 함'})
  sign: 5;
}