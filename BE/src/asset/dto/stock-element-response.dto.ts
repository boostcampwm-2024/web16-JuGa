import { ApiProperty } from '@nestjs/swagger';

export class StockElementResponseDto {
  constructor(
    name: string,
    code: string,
    quantity: number,
    avg_price: number,
    stck_prpr: string,
    prdy_vrss: string,
    prdy_vrss_sign: string,
    prdy_ctrt: string,
  ) {
    this.name = name;
    this.code = code;
    this.quantity = quantity;
    this.avg_price = avg_price;
    this.stck_prpr = stck_prpr;
    this.prdy_vrss = prdy_vrss;
    this.prdy_vrss_sign = prdy_vrss_sign;
    this.prdy_ctrt = prdy_ctrt;
  }

  @ApiProperty({ description: '종목 이름' })
  name: string;

  @ApiProperty({ description: '종목 코드' })
  code: string;

  @ApiProperty({ description: '보유량' })
  quantity: number;

  @ApiProperty({ description: '평균 매수가' })
  avg_price: number;

  @ApiProperty({ description: '주식 현재가' })
  stck_prpr: string;

  @ApiProperty({ description: '전일 대비' })
  prdy_vrss: string;

  @ApiProperty({ description: '전일 대비 부호' })
  prdy_vrss_sign: string;

  @ApiProperty({ description: '전일 대비율' })
  prdy_ctrt: string;
}
