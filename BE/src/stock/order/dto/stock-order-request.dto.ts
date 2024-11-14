import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsPositive } from 'class-validator';

export class StockOrderRequestDto {
  @ApiProperty({ description: '주식 id', example: '005930' })
  stock_code: string;

  @ApiProperty({ description: '매수/매도 희망 가격' })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ description: '매수/매도 희망 수량' })
  @IsInt()
  @IsPositive()
  amount: number;
}
