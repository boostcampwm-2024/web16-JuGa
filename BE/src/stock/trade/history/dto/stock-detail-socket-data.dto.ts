import { ApiProperty } from '@nestjs/swagger';

export class StockDetailSocketDataDto {
  @ApiProperty({ description: '주식 현재가' })
  stck_prpr: string;

  @ApiProperty({ description: '전일 대비 부호' })
  prdy_vrss_sign: string;

  @ApiProperty({ description: '전일 대비' })
  prdy_vrss: string;

  @ApiProperty({ description: '전일 대비율' })
  prdy_ctrt: string;
}
