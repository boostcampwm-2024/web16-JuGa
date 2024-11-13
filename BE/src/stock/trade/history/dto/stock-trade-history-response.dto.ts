import { ApiProperty } from '@nestjs/swagger';
import { StockTradeHistoryOutputDto } from './stock-trade-history-output.dto';

/**
 * 주식현재가 체결 API 응답값 정제 후 FE에 보낼 DTO
 */
export class StockTradeHistoryResponseDto {
  @ApiProperty({ type: StockTradeHistoryOutputDto, description: '상승률 순위' })
  output: StockTradeHistoryOutputDto[];
}
