import { ApiProperty } from '@nestjs/swagger';

export class DailyStockTradeHistoryDataDto {
  @ApiProperty({ description: '주식 영업 일자' })
  stck_bsop_date: string;

  @ApiProperty({ description: '주식 시가' })
  stck_oprc: string;

  @ApiProperty({ description: '주식 최고가' })
  stck_hgpr: string;

  @ApiProperty({ description: '주식 최저가' })
  stck_lwpr: string;

  @ApiProperty({ description: '주식 종가' })
  stck_clpr: string;

  @ApiProperty({ description: '누적 거래량' })
  acml_vol: string;

  @ApiProperty({ description: '전일 대비 부호' })
  prdy_vrss_sign: string;

  @ApiProperty({ description: '전일 대비율' })
  prdy_ctrt: string;
}
