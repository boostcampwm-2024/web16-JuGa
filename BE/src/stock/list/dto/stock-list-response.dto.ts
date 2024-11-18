import { ApiProperty } from '@nestjs/swagger';

export class StockListResponseDto {
  @ApiProperty({ example: '005930', description: '종목 코드', required: false })
  code: string;

  @ApiProperty({
    example: '삼성전자',
    description: '종목 이름',
    required: false,
  })
  name: string;

  @ApiProperty({ example: 'KOSPI', description: '시장', required: false })
  market: string;

  constructor(code: string, name: string, market: string) {
    this.code = code;
    this.name = name;
    this.market = market;
  }
}
