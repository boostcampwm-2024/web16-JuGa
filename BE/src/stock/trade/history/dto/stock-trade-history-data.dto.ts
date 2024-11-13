import { ApiProperty } from '@nestjs/swagger';

export class StockTradeHistoryDataDto {
  @ApiProperty({ description: '주식 체결 시간' })
  stck_cntg_hour: string;

  @ApiProperty({ description: '주식 현재가' })
  stck_prpr: string;

  @ApiProperty({ description: '전일 대비 부호' })
  prdy_vrss_sign: string;

  @ApiProperty({ description: '체결 거래량' })
  cntg_vol: string;

  @ApiProperty({ description: '전일 대비율' })
  prdy_ctrt: string;
}
