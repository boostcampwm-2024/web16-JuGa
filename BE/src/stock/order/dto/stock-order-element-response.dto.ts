import { ApiProperty } from '@nestjs/swagger';
import { TradeType } from '../enum/trade-type';

export class StockOrderElementResponseDto {
  constructor(
    id: number,
    stock_code: string,
    stock_name: string,
    amount: number,
    price: number,
    trade_type: TradeType,
    created_at: Date,
  ) {
    this.id = id;
    this.stock_code = stock_code;
    this.stock_name = stock_name;
    this.amount = amount;
    this.price = price;
    this.trade_type = trade_type;
    this.created_at = created_at;
  }

  @ApiProperty({ description: '주문 id' })
  id: number;

  @ApiProperty({ description: '종목 코드' })
  stock_code: string;

  @ApiProperty({ description: '종목 이름' })
  stock_name: string;

  @ApiProperty({ description: '매도/매수 희망 수량' })
  amount: number;

  @ApiProperty({ description: '매도/매수 희망 가격' })
  price: number;

  @ApiProperty({ description: '매도: SELL, 매수: BUY' })
  trade_type: TradeType;

  @ApiProperty({ description: '주문 시간' })
  created_at: Date;
}
