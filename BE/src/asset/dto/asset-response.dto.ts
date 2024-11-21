import { ApiProperty } from '@nestjs/swagger';

export class AssetResponseDto {
  constructor(
    cash_balance,
    stock_balance,
    total_asset,
    total_profit,
    total_profit_rate,
  ) {
    this.cash_balance = cash_balance;
    this.stock_balance = stock_balance;
    this.total_asset = total_asset;
    this.total_profit = total_profit;
    this.total_profit_rate = total_profit_rate;
  }

  @ApiProperty({ description: '보유 현금' })
  cash_balance: number;

  @ApiProperty({ description: '주식 평가 금액' })
  stock_balance: number;

  @ApiProperty({ description: '총 자산' })
  total_asset: number;

  @ApiProperty({ description: '총 수익금' })
  total_profit: number;

  @ApiProperty({ description: '총 수익률' })
  total_profit_rate: number;
}
