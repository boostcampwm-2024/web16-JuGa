import { ApiProperty } from '@nestjs/swagger';

export class StockDetailDataDto {
  @ApiProperty({ description: 'HTS 한글 종목명' })
  hts_kor_isnm: string;

  @ApiProperty({ description: '종목코드' })
  stck_shrn_iscd: string;

  @ApiProperty({ description: '주식 현재가' })
  stck_prpr: string;

  @ApiProperty({ description: '전일 대비' })
  prdy_vrss: string;

  @ApiProperty({ description: '전일 대비 부호' })
  prdy_vrss_sign: string;

  @ApiProperty({ description: '전일 대비율' })
  prdy_ctrt: string;

  @ApiProperty({ description: 'HTS 시가총액' })
  hts_avls: string;

  @ApiProperty({ description: 'per' })
  per: string;
}
