import { ApiProperty } from '@nestjs/swagger';

/**
 * 등락률 API 요청 후 받은 응답값 정제용 DTO
 */
export class StockRankingDataDto {
  @ApiProperty({ description: '주식 종목 코드' })
  stck_shrn_iscd: string;

  @ApiProperty({ description: 'HTS 한글 종목명' })
  hts_kor_isnm: string;

  @ApiProperty({ description: '주식 현재가' })
  stck_prpr: string;

  @ApiProperty({ description: '전일 대비' })
  prdy_vrss: string;

  @ApiProperty({ description: '전일 대비 부호' })
  prdy_vrss_sign: string;

  @ApiProperty({ description: '전일 대비율' })
  prdy_ctrt: string;
}
