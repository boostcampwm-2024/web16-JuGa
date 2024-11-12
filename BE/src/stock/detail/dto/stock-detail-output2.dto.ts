import { ApiProperty } from '@nestjs/swagger';

export class InquirePriceOutput2Dto {
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

  @ApiProperty({ description: '누적 거래 대금' })
  acml_tr_pbmn: string;

  @ApiProperty({ description: '락 구분 코드' })
  flng_cls_code: string;

  @ApiProperty({ description: '분할 비율' })
  prtt_rate: string;

  @ApiProperty({ description: '분할변경여부' })
  mod_yn: string;

  @ApiProperty({ description: '전일 대비 부호' })
  prdy_vrss_sign: string;

  @ApiProperty({ description: '전일 대비' })
  prdy_vrss: string;

  @ApiProperty({ description: '재평가사유코드' })
  revl_issu_reas: string;
}
