import { ApiProperty } from '@nestjs/swagger';

export class StockElementResponseDto {
  constructor(name, code, quantity, avg_price) {
    this.name = name;
    this.code = code;
    this.quantity = quantity;
    this.avg_price = avg_price;
  }

  @ApiProperty({ description: '종목 이름' })
  name: string;

  @ApiProperty({ description: '종목 코드' })
  code: string;

  @ApiProperty({ description: '보유량' })
  quantity: number;

  @ApiProperty({ description: '평균 매수가' })
  avg_price: number;
}
