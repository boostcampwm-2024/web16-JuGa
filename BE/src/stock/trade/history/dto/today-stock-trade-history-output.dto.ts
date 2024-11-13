import { ApiProperty } from '@nestjs/swagger';

export class TodayStockTradeHistoryOutputDto {
  @ApiProperty({ description: '주식 체결 시간' })
  stck_cntg_hour: string;

  @ApiProperty({ description: '주식 현재가' })
  stck_prpr: string;

  @ApiProperty({ description: '전일 대비' })
  prdy_vrss: string;

  @ApiProperty({ description: '전일 대비 부호' })
  prdy_vrss_sign: string;

  @ApiProperty({ description: '체결 거래량' })
  cntg_vol: string;

  @ApiProperty({ description: '당일 체결강도' })
  tday_rltv: string;

  @ApiProperty({ description: '전일 대비율' })
  prdy_ctrt: string;
}
