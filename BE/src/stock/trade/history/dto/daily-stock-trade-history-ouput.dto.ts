import { ApiProperty } from '@nestjs/swagger';

export class DailyStockTradeHistoryOutputDto {
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

  @ApiProperty({ description: '전일 대비 거래량 비율' })
  prdy_vrss_vol_rate: string;

  @ApiProperty({ description: '전일 대비' })
  prdy_vrss: string;

  @ApiProperty({ description: '전일 대비 부호' })
  prdy_vrss_sign: string;

  @ApiProperty({ description: '전일 대비율' })
  prdy_ctrt: string;

  @ApiProperty({ description: 'HTS 외국인 소진율' })
  hts_frgn_ehrt: string;

  @ApiProperty({ description: '외국인 순매수 수량' })
  frgn_ntby_qty: string;

  @ApiProperty({ description: '락 구분 코드' })
  flng_cls_code: string;

  @ApiProperty({ description: '누적 분할 비율' })
  acml_prtt_rate: string;
}
