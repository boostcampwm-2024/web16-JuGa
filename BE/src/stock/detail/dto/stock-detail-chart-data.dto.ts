import { ApiProperty } from '@nestjs/swagger';

export class InquirePriceChartDataDto {
  @ApiProperty({ description: '주식 영업 일자' })
  stck_bsop_date: string;

  @ApiProperty({ description: '주식 종가' })
  stck_clpr: string;

  @ApiProperty({ description: '주식 시가' })
  stck_oprc: string;

  @ApiProperty({ description: '주식 최고가' })
  stck_hgpr: string;

  @ApiProperty({ description: '주식 최저가' })
  stck_lwpr: string;

  @ApiProperty({ description: '누적 거래량' })
  acml_vol: string;
}
