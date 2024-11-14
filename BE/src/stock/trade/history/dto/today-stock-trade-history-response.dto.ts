import { ApiProperty } from '@nestjs/swagger';
import { TodayStockTradeHistoryOutputDto } from './today-stock-trade-history-output.dto';

/**
 * 주식현재가 체결 API 응답값 정제 후 FE에 보낼 DTO
 */
export class TodayStockTradeHistoryResponseDto {
  @ApiProperty({
    type: TodayStockTradeHistoryOutputDto,
    description: '오늘 체결된 거래 내역 배열',
  })
  output: TodayStockTradeHistoryOutputDto[];
}
